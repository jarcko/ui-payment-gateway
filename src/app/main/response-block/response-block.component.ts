import { Component, Input, OnInit } from '@angular/core';
import { KeyValueObject } from '../main.interfaces';

@Component({
  selector: 'app-response-block',
  templateUrl: './response-block.component.html',
  styleUrls: ['./response-block.component.scss']
})
export class ResponseBlockComponent implements OnInit {

  @Input() response: KeyValueObject;
  constructor() { }

  ngOnInit() {
  }

}
