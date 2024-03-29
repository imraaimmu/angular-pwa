import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { Observable } from "rxjs";

@Injectable()
export class EventMqttService {

  private endpoint: string;

  constructor(
    private _mqttService: MqttService,
  ) {
    this.endpoint = '';
  }

  topic(deviceId: string): Observable<IMqttMessage> {
    let topicName = `${deviceId}`;     
    console.log('topic ' + topicName)
    return this._mqttService.observe(topicName);
  }
}