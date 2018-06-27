import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification } from '../main.interfaces';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: Notification;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.notificationSubject.subscribe(
      (data: Notification) => {
        this.notification = data;
        window.scrollTo(0, 0);
      }
    );
  }

  ngOnDestroy() {
    this.notificationService.notificationSubject.unsubscribe();
  }

}
