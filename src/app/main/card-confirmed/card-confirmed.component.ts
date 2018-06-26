import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../main.interfaces';

@Component({
  selector: 'app-card-confirmed',
  templateUrl: './card-confirmed.component.html',
  styleUrls: ['./card-confirmed.component.scss']
})
export class CardConfirmedComponent implements OnInit {
  @Input() cardInfo: Card;

  constructor() {
  }

  ngOnInit() {
  }

}
