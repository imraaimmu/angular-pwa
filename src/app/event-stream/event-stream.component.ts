import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage } from "ngx-mqtt";
import { EventMqttService } from '../services/event.mqtt.service';

@Component({
    selector: 'app-event-stream',
    templateUrl: './event-stream.component.html',
    styleUrls: ['./event-stream.component.scss'],
})
export class EventStreamComponent implements OnInit {
    events = [] ;
    private deviceId: string;
    subscription: Subscription;

    constructor(
        private readonly eventMqtt: EventMqttService,
    ) {
    }

    ngOnInit() {
        this.subscribeToTopic();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private subscribeToTopic() {
        this.subscription = this.eventMqtt.topic('my/topic')
            .subscribe((data: IMqttMessage) => {
              console.log('received msg from publisher : '+ data.payload.toString());
							this.events.push(data.payload.toString());
            });
    }
}