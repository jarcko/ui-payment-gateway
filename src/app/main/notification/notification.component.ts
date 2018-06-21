import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../main.interfaces';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notification: Notification;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.notificationSubject.subscribe(
      (data: Notification) => {
        this.notification = data;
      }
    );
  }

}
