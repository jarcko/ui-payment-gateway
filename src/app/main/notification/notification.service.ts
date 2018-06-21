import { Injectable } from '@angular/core';
import { Notification } from '../main.interfaces';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationService {
  notificationSubject = new Subject();

  constructor() {
  }

  resetNotification() {
    this.notificationSubject.next({});
  }

  pushNotification(data: Notification) {
    this.notificationSubject.next(data);
  }

}
