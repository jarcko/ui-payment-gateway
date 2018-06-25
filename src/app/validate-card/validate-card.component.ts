import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validate-card',
  templateUrl: './validate-card.component.html',
  styleUrls: ['./validate-card.component.css']
})
export class ValidateCardComponent implements OnInit {
  message: Object;

  constructor() {
  }

  ngOnInit() {
    const params = decodeURI(window.location.search.substr(1))
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/\+/g, ' ')
      .replace(/=/g, '":"');
    console.log(decodeURIComponent(params));
    this.message = JSON.parse('{"' + 'responseType":"cardValidation","' + decodeURIComponent(params) + '"}');
    window.parent.postMessage(this.message, window.parent.location.href);
  }

}
