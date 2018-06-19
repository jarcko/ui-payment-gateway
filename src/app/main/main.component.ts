import { Component, OnInit } from '@angular/core';
import { CommunicationService } from './communication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  enabled = false;
  name = 'jwt.signing.user';
  key = 'jwt.signing.key';
  orderId = 'test-page-' + new Date().toJSON().slice(0, 19);
  defaultUrl = 'http://localhost:4200';
  paymentProviders: Array<{name: string, info: string}>;
  selectedProviderName: string;

  providers = [{name: 'Ogone', info: 'some info about Ogone'}, {name: 'Ingenico', info: 'some info about Ingenico'}];

  constructor(private communication: CommunicationService) {
  }


  ngOnInit() {
    this.paymentProviders = this.paymentProviders || [];
  }

  // ngDoCheck() {
  //   console.log(this.selectedProviderName);
  // }

  onPost() {
    this.communication.post('', this.providers)
      .subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
  }

  onGetProvidersClick() {
    // this.communication.get('/api/paymentProviders')
    this.communication.get('')
      .subscribe(
        (data: any[]) => {
          const key = Object.keys(data)[0];
          this._savePaymentProviders(data[key]);
          // console.log(data[key]);

        },
        (error) => console.log(error),
        () => console.log('completed')
      );

    // }

  }

  private _savePaymentProviders(providers: {name: string, info: string}[]): void {
    providers.forEach((el) => {
      const filtered = this.paymentProviders.filter((existingEl: {name: string, info: string}) => {
        return existingEl.name === el.name;
      });
      if (filtered.length === 0) {
        this.paymentProviders.push(el);
      }
    });
    console.log(this.paymentProviders);
  }
}
