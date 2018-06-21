import { Component, OnInit } from '@angular/core';
import { CommunicationService } from './communication.service';
import { ProviderConfig, Providers } from './main.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from './notification/notification.service';
import { MatSnackBar } from '@angular/material';


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
  paymentProviders: string[];
  selectedProviderName: string;

  providerConfigFrom: FormGroup;
  providerConfig: ProviderConfig;

  constructor(private communicationService: CommunicationService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              public snackbar: MatSnackBar) {
  }


  ngOnInit() {
    this.paymentProviders = this.paymentProviders || [];
    this.providerConfigFrom = this.fb.group({
      orderId: [this.orderId],
      acceptUrl: ['http://localhost:4200', Validators.pattern('^http.*')],
      exceptionUrl: ['http://localhost:4200', Validators.pattern('^http.*')]
    });
  }

  onGetProvidersClick() {
    this.notificationService.resetNotification();
    this.communicationService.get('/api/paymentProviders/', null, this.jwtEnabled ? this.key : null)
      .subscribe(
        (data: Providers) => this._savePaymentProviders(data.enabledPaymentProviders),
        (err) => this.notificationService.pushNotification(err.error)
      );
  }

  getConfig() {
    this.notificationService.resetNotification();
    if (!this.selectedProviderName) {
      this.snackbar.open('Please select Payment Provider', 'Something missed');
    }
    const options = this.providerConfigFrom.getRawValue();
    this.communicationService.get(
      `/api/paymentProviders/${this.selectedProviderName}/config/`, options, this.jwtEnabled ? this.key : null)
      .subscribe(
        (data: ProviderConfig) => {
          this.providerConfig = data;
          console.log(this.providerConfig);
        },
        (err) => this.notificationService.pushNotification(err.error)
      );
  }

  private _savePaymentProviders(providers: string[]): void {
    providers.forEach((el: string) => {
      const isAlreadyAdded = this.paymentProviders.indexOf(el) !== -1;
      if (!isAlreadyAdded) {
        this.paymentProviders.push(el);
      }
    });
  }

}
