import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-response-block',
  templateUrl: './response-block.component.html',
  styleUrls: ['./response-block.component.scss']
})
export class ResponseBlockComponent implements OnInit {

  @Input() validationDetails: Object;
  constructor() { }

  ngOnInit() {
  }

}
