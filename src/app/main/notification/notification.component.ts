import { Component, Input, OnInit } from '@angular/core';
import { NotificationType } from '../main.interfaces';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() type: NotificationType;
  @Input() header: string;
  @Input() text: string;


  constructor() { }

  ngOnInit() {
  }

}
