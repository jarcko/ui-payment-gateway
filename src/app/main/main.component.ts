import { Component, OnChanges, OnInit } from '@angular/core';
import { CommunicationService } from './communication.service';
import { Notification, Providers } from './main.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  jwtEnabled = false;
  key = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJib29raW5ncyByZXF1ZXN0In0.' +
    'OqtiU5v7iDO47tq8oeWu6rBaf0R25YDR1m9ouwsZV-ApHYQhD5FdZ8xqJ6dlibbUoM98_4MDO3feVcdytOnm7Q';

  orderId = 'test-page-' + new Date().toJSON().slice(0, 19);
  defaultUrl = 'http://localhost:4200';
  paymentProviders: string[];
  selectedProviderName: string;
  notification: Notification;

  providerConfigFrom: FormGroup;

  constructor(private communication: CommunicationService,
              private fb: FormBuilder) {
  }


  ngOnInit() {
    this.paymentProviders = this.paymentProviders || [];
    this.providerConfigFrom = this.fb.group({
      orderId: [this.orderId],
      successUrl: [this.defaultUrl, Validators.pattern('^http.*')],
      failureUrl: [this.defaultUrl, Validators.pattern('^http.*')]
    });
  }

  onGetProvidersClick() {
    this._resetNotification();
    this.communication.get('/api/paymentProviders/', null, this.jwtEnabled ? this.key : null)
      .subscribe(
        (data: Providers) => {
          this._savePaymentProviders(data.enabledPaymentProviders);
        },
        (err) => {
          this.notification = {
            notificationType: 'error',
            header: `${err.error}`,
            text: `${err.status}: ${err.error}. ${err.message}`
          };
        }
      );
  }

  getConfig() {
    this._resetNotification();
    console.log(this.providerConfigFrom.getRawValue());
    this.communication.get(
      `paymentProviders/${this.selectedProviderName}/config/`,
      this.providerConfigFrom.getRawValue(),
      this.jwtEnabled ? this.key : null)
      .subscribe(
        (data) => console.log(data),
        (err) => console.log(err)
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

  private _resetNotification() {
    this.notification = null;
  }
}
