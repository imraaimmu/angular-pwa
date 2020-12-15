import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from "ngx-mqtt";
import EventMqttService from '../services/event.mqtt.service';

@Component({
  selector: 'app-event-stream',
  templateUrl: './event-stream.component.html',
  styleUrls: ['./event-stream.component.css']
})
export default class EventStreamComponent implements OnDestroy {
    private subscription: Subscription;
    public message: string;
  
    constructor(private _mqttService: MqttService) {
      this.subscription = this._mqttService.observe('my/topic').subscribe((message: IMqttMessage) => {
        this.message = message.payload.toString();
      });
    }
  
    public unsafePublish(topic: string, message: string): void {
      this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
    }
  
    public ngOnDestroy() {
      this.subscription.unsubscribe();
    }
}
