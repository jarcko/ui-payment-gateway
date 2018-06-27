import { Component, Input, OnInit } from '@angular/core';
import { KeyValueObject } from '../main.interfaces';

@Component({
  selector: 'app-response-block',
  templateUrl: './response-block.component.html',
  styleUrls: ['./response-block.component.scss']
})
export class ResponseBlockComponent implements OnInit {

  @Input() response?: KeyValueObject;
  @Input() rawResponse?: Object;

  humanReadableRS: string;

  constructor() { }

  ngOnInit() {
    this.humanReadableRS = JSON.stringify(this.rawResponse, null, 2);
  }

}
