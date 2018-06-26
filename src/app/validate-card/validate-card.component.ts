import { Component, OnInit } from '@angular/core';
import { ProviderValidationDetails } from '../main/main.interfaces';

@Component({
  selector: 'app-validate-card',
  templateUrl: './validate-card.component.html',
  styleUrls: ['./validate-card.component.css']
})
export class ValidateCardComponent implements OnInit {
  message: ProviderValidationDetails;

  constructor() {
  }

  ngOnInit() {
    const params = decodeURI(window.location.search.substr(1))
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/\+/g, ' ')
      .replace(/=/g, '":"');

    const parsedByDefault = JSON.parse('{"' + params + '"}');
    this.message = this.parse(parsedByDefault);
    window.parent.postMessage(this.message, window.parent.location.href);
  }

  /** Parser if object has properties wih '.' to  have nested properties instead
   * @param: input Object
   * @return Object with 1 level of nested properties */
  parse(input: Object): ProviderValidationDetails {
    const parsed = {};
    Object.keys(input).forEach((key) => {
      if (key.indexOf('.') === -1) {
        parsed[key] = input[key];
      } else {

        const path = key.split('.');
        if (!parsed[path[0]]) {
          parsed[path[0]] = {};
        }

        const existingProp = parsed[path[0]];
        existingProp[path[1]] = input[key];
      }
    });
    return <ProviderValidationDetails>parsed;
  }

}
