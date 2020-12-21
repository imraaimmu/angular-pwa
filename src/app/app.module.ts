import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import {EventMqttService} from "./services/event.mqtt.service";
import  {EventStreamComponent}  from './event-stream/event-stream.component'

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: environment.mqtt.server,
  port: environment.mqtt.port,
  path: '',
  protocol:environment.mqtt.protocol == "ws" ? "ws" : "wss"
};

@NgModule({
  declarations: [
    AppComponent,
    EventStreamComponent
  ],
  imports: [
    BrowserModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [EventMqttService],
  bootstrap: [AppComponent]
})
export class AppModule { }
