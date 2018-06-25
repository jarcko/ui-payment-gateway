import { Component, OnInit } from '@angular/core';
import { CommunicationService } from './communication.service';
import { ProviderConfig, Providers, ProviderValidationDetails } from './main.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from './notification/notification.service';
import { MatSnackBar } from '@angular/material';
import { EventManager } from '@angular/platform-browser';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  baseUrl: string;
  gatewayUrl = 'http://payment-gateway-1-qa.thomascook.io:8080';
  isDevMode = /localhost/i.test(window.location.href);
  jwtEnabled = false;
  key = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJib29raW5ncyByZXF1ZXN0In0.' +
    'OqtiU5v7iDO47tq8oeWu6rBaf0R25YDR1m9ouwsZV-ApHYQhD5FdZ8xqJ6dlibbUoM98_4MDO3feVcdytOnm7Q';

  orderId = 'test-page-' + new Date().toJSON().slice(0, 19);
  paymentProviders: string[];
  selectedProviderName: string;

  providerConfigFrom: FormGroup;
  providerConfig: ProviderConfig;
  spinner1: boolean;
  spinner2: boolean;

  providerValidationDetails: ProviderValidationDetails;



  constructor(private communicationService: CommunicationService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private eventManager: EventManager,
              public snackbar: MatSnackBar) {
  }


  ngOnInit() {
    this.paymentProviders = this.paymentProviders || [];
    this.providerConfigFrom = this.fb.group({
      orderId: [this.orderId],
      acceptUrl: ['http://localhost:4200/validate-card', Validators.pattern('^http.*')],
      exceptionUrl: ['http://localhost:4200', Validators.pattern('^http.*')]
    });
    this._listenPostMessage();
  }

  onGetProvidersClick() {
    this._defineBaseUrl();
    this.notificationService.resetNotification();
    this.spinner1 = true;
    this.communicationService.get(this.baseUrl + '/api/paymentProviders/', null, this.jwtEnabled ? this.key : null)
      .subscribe(
        (data: Providers) => this._savePaymentProviders(data.enabledPaymentProviders),
        (err) => this.notificationService.pushNotification(err.error)
      );
  }

  getConfig() {
    this._defineBaseUrl();
    this.notificationService.resetNotification();
    if (!this.selectedProviderName) {
      this.snackbar.open('Please select Payment Provider', 'Something missed');
    } else {
      this.spinner2 = true;
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
  }

  private _defineBaseUrl() {
    this.baseUrl = this.isDevMode ? this.gatewayUrl : window.location.href;
  }

  private _savePaymentProviders(providers: string[]): void {
    this.spinner1 = false;
    providers.forEach((el: string) => {
      const isAlreadyAdded = this.paymentProviders.indexOf(el) !== -1;
      if (!isAlreadyAdded) {
        this.paymentProviders.push(el);
      }
    });
  }

  private _listenPostMessage() {
    return this.eventManager.addGlobalEventListener('window', 'message', (e: MessageEvent) => {
      if (e.data.responseType === 'cardValidation') {
        this.providerValidationDetails = e.data;
      }
    });
  }

  setSpinner(spinnerNumber: number, value: boolean) {
    this[`spinner${spinnerNumber}`] = value;
  }

}
