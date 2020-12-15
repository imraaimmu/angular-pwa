import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import domtoimage from 'dom-to-image';
import EventStreamComponent from "./event-stream/event-stream.component"



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// Default export is a4 paper, portrait, using millimeters for units
export class AppComponent implements OnInit {
  // {
  //   orientation: "landscape",
  //   unit: "in",
  //   format: [4, 2]
  // }
  title = 'angular-pwa-app';
  webcam: any;
  constructor(private swUpdate: SwUpdate) {
    
  }



  posts = [

    {

      id: 1,

      title: 'Angular Http Post Request Example'

    },

    {

      id: 2,

      title: 'Angular 10 Routing and Nested Routing Tutorial With Example'

    },

    {

      id: 3,

      title: 'How to Create Custom Validators in Angular 10?'

    },

    {

      id: 4,

      title: 'How to Create New Component in Angular 10?'

    }

  ];

  takeSnap(){
    var video :HTMLVideoElement   = document.querySelector("#videoElement");
    var canvas = document.createElement('canvas');
canvas.width = 234;
canvas.height = 200;
var ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
var dataURI = canvas.toDataURL('image/png');
    // let picture = this.webcam.snap();
    var img :HTMLImageElement = document.querySelector("#userimage");
    img.src = dataURI;
  }
  startWebCam(){
    var video :HTMLVideoElement   = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}
  }
  callFunction(event: any, post: any) {

    console.log(post);

  }


  reader: ReadableStreamDefaultReader;
  writer: WritableStreamDefaultWriter;
  encoder = new TextEncoder();
  decoder = new TextDecoder();
  showError = true;
  errorMessage = "";
  async  connect() {
    this.showError = false;
    if ('serial' in navigator) {
      try {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudrate: 9600 });
        this.reader = port.readable.getReader();
        this.writer = port.writable.getWriter();
        let signals = await port.getSignals();
        console.log(signals)
      } catch (err) {
        this.errorMessage = 'There was an error opening the serial port:' + err;
        this.showError = true;
      }
    } else {
      this.errorMessage = "check console log";
      this.showError = true;
      console.error('Web serial doesn\'t seem to be enabled in your browser. Try enabling it by visiting:')
      console.error('chrome://flags/#enable-experimental-web-platform-features');
      console.error('opera://flags/#enable-experimental-web-platform-features');
      console.error('edge://flags/#enable-experimental-web-platform-features');
    }

  }
  async sendData(data: string) {
    this.showError = false;
    console.log("sending : " + data);
    if (this.writer) {
      const dataArrayBuffer = this.encoder.encode(data);
      return await this.writer.write(dataArrayBuffer);
    } else {
      this.errorMessage = "Connect to device via serial port to send data";
      this.showError = true;
    }
  }

  async getData(): Promise<string> {
    try {
      this.showError = false;
      if (this.reader) {
        const readerData = await this.reader.read();
        return this.decoder.decode(readerData.value);
      } else {
        this.errorMessage = "Connect to device via serial port to receive data";
        this.showError = true;
      }
    } catch (err) {
      this.errorMessage = `error reading data: ${err}`;
      this.showError = true;
      console.error(this.errorMessage);
      return this.errorMessage;
    }
  }
  private b64toBlob(b64Data: string, contentType: string = '', sliceSize: number = 512): Blob {
    const byteCharacters: string = atob(b64Data);
    const byteArrays: Uint8Array[] = [];
    for (let offset: number = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice: string = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers: number[] = new Array(slice.length);
        for (let i: number = 0; i < slice.length; i += 1)
            byteNumbers[i] = slice.charCodeAt(i);
        const byteArray: Uint8Array = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob: Blob = new Blob(byteArrays, { type: contentType });

    return blob;
}
  savePDF() {
    var data :HTMLElement = document.querySelector('#badge');
    
    domtoimage.toPng(data)
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
    // html2canvas(data)
    domtoimage.toPng(data)

    .then((canvas) => {
      domtoimage.toPng(data)

    .then((canvas) => {

    
      var canvastemp = canvas as string;
      // console.log(canvastemp);
      var img = new Image();
      img.src = canvas;
      
      // Few necessary setting options
      // var imgWidth = 208;
      // var pageHeight = 295;
      // var imgHeight = canvas.height * imgWidth / canvas.width;
      // var heightLeft = imgHeight;

      // var contentDataURL = canvas.toDataURL('image/png');
      var position = 0;
      console.log(img.width + "," + img.height)
      var doc = new jsPDF('p', 'px', [img.width, img.height]);
      doc.setProperties({
        title: "Badge"
      });
      
      doc.addImage(canvastemp, 'PNG', 0, 0, img.width/2, img.height/2);
      
      // doc.save('Badge.pdf'); // Generated PDF
      //working in same window
      var oHiddFrame = document.createElement("iframe");
      oHiddFrame.style.position = "fixed";
      oHiddFrame.style.visibility = "hidden";
      oHiddFrame.src = doc.output("bloburi") as unknown as string;
      document.body.appendChild(oHiddFrame);
      oHiddFrame.contentWindow.print();//working in sam window
      //     const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
      // if (isSafari) {
        //   // fallback in safari
        //   oHiddFrame.onload = () => {
          //     try {
            //       oHiddFrame.contentWindow.document.execCommand('print', false, null);
            //     } catch (e) {
              //       oHiddFrame.contentWindow.print();
              //     }
              //   };
              // }
              
              //This is a key for printing
              doc.autoPrint();
              // window.open(doc.output('datauristring'),'_blank');
              // var a  = doc.output('bloburl') as string;
              
              // window.open(URL.createObjectURL(doc.output('pdfobjectnewwindow')));
              // window.open(URL.createObjectURL(doc.output('pdfobjectnewwindow')));
              // window.open(a, '_blank');
              // window.open(doc.output('dataurl'),'_blank');
      // doc.output('dataurlstring','_blank');
      // window.open(doc.output('bloburl'), '_blank');
      // window.open(doc.output("pdfjsnewwindow"),'_blank');
      // window.open(doc.output("datauristring"),'_blank');
      // var mywindow = window.open(
      //   URL.createObjectURL(doc.output("blob")),
      //   "_blank"
      // );
      // mywindow.document.close();
    });
    });
  }
  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {

        if (confirm("New version available. Load New Version?")) {
          console.log("Enabled 1")
          window.location.reload();
        }
      });
    }
    this.startWebCam();
  }
  k() {
    var user = prompt("U name:");
    var people = document.getElementById("name");
    people.innerHTML = user;

    var mob = prompt("mobile no.");
    var phone = document.getElementById("phn");
    phone.innerHTML = mob;

    var mail1 = prompt("Email");
    var mail = document.getElementById("mailadd");
    mail.innerHTML = mail1;
  }
  
}
