import { Component, OnInit } from '@angular/core';
import { CardInfo } from '../main.interfaces';

@Component({
  selector: 'app-card-confirmed',
  templateUrl: './card-confirmed.component.html',
  styleUrls: ['./card-confirmed.component.scss']
})
export class CardConfirmedComponent implements OnInit {
  cardInfo: CardInfo;

  CARD_MOCK = {
    brand: 'AMERICAN_EXPRESS',
    number: '**** **** **** 0144',
    holderName: 'Ben Carson',
  };

  constructor() {
  }

  ngOnInit() {
    this.cardInfo = this.CARD_MOCK;
  }

}
