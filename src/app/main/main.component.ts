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
  paymentProviders: string[];
  selectedProviderName: string;

  constructor(private communication: CommunicationService) {
  }


  ngOnInit() {
    this.paymentProviders = this.paymentProviders || [];
  }

  // ngDoCheck() {
  //   console.log(this.selectedProviderName);
  // }

  onGetProvidersClick() {
    this.communication.get('/api/paymentProviders')
      .subscribe(
        (data: {apiClient: string, enabledPaymentProviders: string[]}) => {
          this._savePaymentProviders(data.enabledPaymentProviders);
        },
        (error) => console.log(error)
      );

  }

  private _savePaymentProviders(providers: string[]): void {
    providers.forEach((el: string) => {
      const isAlreadyAdded = this.paymentProviders.indexOf(el) !== -1;
      if (!isAlreadyAdded) {
        this.paymentProviders.push(el);
      }
    });
    console.log(this.paymentProviders);
  }
}
