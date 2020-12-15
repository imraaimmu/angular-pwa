
#Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

#Printer settings variables
$PrinterName ="DYMO LabelWriter 450"
$printerMediaSizeLabel = '30856 Badge Card Label'
$printerMediaSizeWidth = 61800;
$printerMediaSizeHeight = 102800;
$printerMediaSizeVendorId = '172';
$dymoPrinterDeatils = '';

$localAppData = [Environment]::GetFolderPath( [Environment+SpecialFolder]::LocalApplicationData )
$chromeDefaults = Join-Path $localAppData "Google\Chrome\User Data\"
$chromeProfileFile = Join-Path $chromeDefaults "Profile 1\Preferences"
$PreferenceFile = ''

#Chrome startup variables ChromePath Start Mode and Application URL
$pathToChrome = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"

if(Test-Path $pathToChrome) {
    $pathToChrome = $pathToChrome
} else {
   $pathToChrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}

#$startmode = '-start-fullscreen --kiosk --kiosk-printing'
$startmode = '--disable-pinch --overscroll-history-navigation=0 --'
$startPage = 'https://newkiosk-dev.awsdsi.ghx.com/'

$uniqueId = get-wmiobject Win32_ComputerSystemProduct  | Select-Object -ExpandProperty UUID

$startPage = $startPage + '?kioskId=' + $uniqueId

write $chromeProfileFile

$PrintConfiguration = Get-PrintConfiguration -PrinterName $PrinterName
Set-PrintConfiguration -PrinterName $PrinterName

if(Test-Path $chromeProfileFile) {
    $PreferenceFile = $chromeProfileFile
} else {
   $PreferenceFile = Join-Path $chromeDefaults "Default\Preferences"
}

$prefs = Get-Content -Path $PreferenceFile | ConvertFrom-Json -ErrorAction Stop

$appState = $prefs.printing.print_preview_sticky_settings.appState



# Convert to an object we can manipulate
$appState = $appState | ConvertFrom-Json -ErrorAction Stop

if ($appState.recentDestinations.Count -gt 0) {
    $appState.recentDestinations | ForEach-Object {
        $printerOPtions = $_
        if ($printerOPtions.displayName -eq $PrinterName ) {
           $dymoPrinterDeatils = $printerOPtions;
           $appState.recentDestinations = $appState.recentDestinations | Where-Object {
		        $_.Id -notlike $printerOPtions.id
	        }
        }
    }
}
$appState.recentDestinations = @($dymoPrinterDeatils) + $appState.recentDestinations
#write $appState.recentDestinations

$appState.mediaSize.custom_display_name = $printerMediaSizeLabel
$appState.mediaSize.height_microns = $printerMediaSizeHeight
$appState.mediaSize.width_microns = $printerMediaSizeWidth
$appState.mediaSize.vendor_id = $printerMediaSizeVendorId
	
# Convert the Object Back to JSON
$appStateJSON = $appState | ConvertTo-Json -Compress -ErrorAction Stop
	
# Change the AppState from the preferences object
$prefs.printing.print_preview_sticky_settings.appState = $appStateJSON
	
# Conver The Preferences Back to JSON and write it back out to the preferences file.
$prefs | ConvertTo-Json -Depth 99 -Compress | Out-File $PreferenceFile -Encoding default

Start-Process -FilePath $pathToChrome -ArgumentList $startmode, $startPage