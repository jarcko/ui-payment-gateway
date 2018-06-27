import { Component, OnInit } from '@angular/core';
import { CommunicationService } from './communication.service';
import { KeyValueObject, ProviderConfig, Providers, ProviderValidationDetails } from './main.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from './notification/notification.service';
import { MatSnackBar } from '@angular/material';
import { EventManager } from '@angular/platform-browser';
import { DataConversionService } from './data-conversion.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  baseUrl: string;
  gatewayUrl = 'http://payment-gateway-1-qa.thomascook.io:8080';
  isDevMode = /localhost/i.test(window.location.href);
  jwtEnabled = true;
  key = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJib29raW5ncyByZXF1ZXN0In0.' +
    'OqtiU5v7iDO47tq8oeWu6rBaf0R25YDR1m9ouwsZV-ApHYQhD5FdZ8xqJ6dlibbUoM98_4MDO3feVcdytOnm7Q';

  orderId = 'test-page-' + new Date().toJSON().slice(0, 19);
  paymentProviders: string[];
  selectedProviderName: string;

  providerConfigFrom: FormGroup;
  providerConfig: ProviderConfig;
  spinners: boolean[] = [];

  providerValidationDetails: ProviderValidationDetails;
  cardDetailsRS: KeyValueObject[];

  selectState = 'orderId';
  queryTxValue: string;
  queryTxResponse: Object;

  constructor(private communicationService: CommunicationService,
              private notificationService: NotificationService,
              private dataConversionService: DataConversionService,
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

  queryTx() {
    this._preSetup(10);
    if (this.queryTxValue) {
      const options = {};
      options[this.selectState] = this.queryTxValue;
      this.communicationService.get(
        `${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/tx/query`, options, this.jwtEnabled ? this.key : null
      )
        .subscribe(
          (data: Object) => this.queryTxResponse = data,
          (err) => this.notificationService.pushNotification(err.error)
        );
    } else {
      this.snackbar.open('Please specify transaction ID', 'Something missed');
    }
  }

  onGetProvidersClick() {
    this._preSetup(0);
    this.communicationService.get(this.baseUrl + '/api/paymentProviders/', null, this.jwtEnabled ? this.key : null)
      .subscribe(
        (data: Providers) => this._savePaymentProviders(data.enabledPaymentProviders),
        (err) => {
          this.notificationService.pushNotification(err.error);
          this.spinners[0] = false;
        }
      );
  }

  getConfig() {
    this._preSetup(1);
    if (this.selectedProviderName) {
      const options = this.providerConfigFrom.getRawValue();
      this.communicationService.get(
        `${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/config/`, options, this.jwtEnabled ? this.key : null
      )
        .subscribe(
          (data: ProviderConfig) => this.providerConfig = data,
          (err) => {
            this.notificationService.pushNotification(err.error);
            this.removeSpinners();
          }
        );
    } else {
      this.removeSpinners();
      this.snackbar.open('Please select Payment Provider', 'Something missed');
    }
  }

  postCardDetails() {
    this._preSetup(2);
    const body = {
      tokenizationParams: this.convertIngenicoResponse(this.providerValidationDetails),
      paymentProvider: this.selectedProviderName,
      cardType: this.providerValidationDetails && this.providerValidationDetails.Card.Brand
    };

    this.communicationService.post(`${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/cardDetails/`, body)
      .subscribe(
        (data) => {
          console.log(data);
          this.cardDetailsRS = <KeyValueObject[]>data;
        },
        (err) => {
          this.notificationService.pushNotification(err.error);
          this.removeSpinners();
          console.log(err);
        }
      );

  }

  authorize() {
    this._preSetup(3);
    const body = {

    };

    this.communicationService.post(`${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/cardDetails/`, body)
      .subscribe(
        (data) => {
          console.log(data);
          this.cardDetailsRS = <KeyValueObject[]>data;
        },
        (err) => {
          this.notificationService.pushNotification(err.error);
          this.removeSpinners();
          console.log(err);
        }
      );

  }

  capture() {
    this._preSetup(4);
    const body = {

    };

    this.communicationService.post(`${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/cardDetails/`, body)
      .subscribe(
        (data) => {
          console.log(data);
          this.cardDetailsRS = <KeyValueObject[]>data;
        },
        (err) => {
          this.notificationService.pushNotification(err.error);
          this.removeSpinners();
          console.log(err);
        }
      );

  }

  cancelAuthorization() {
    this._preSetup(5);
    const body = {

    };

    this.communicationService.post(`${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/cardDetails/`, body)
      .subscribe(
        (data) => {
          console.log(data);
          this.cardDetailsRS = <KeyValueObject[]>data;
        },
        (err) => {
          this.notificationService.pushNotification(err.error);
          this.removeSpinners();
          console.log(err);
        }
      );

  }

  convertIngenicoResponse(response): KeyValueObject[] {
    return response ? this.dataConversionService.objectToKeyValueArray(response) : null;
  }

  setSpinner(spinnerNumber: number, value: boolean) {
    this.spinners[spinnerNumber] = value;
  }

  removeSpinners() {
    this.spinners.forEach((el, index: number) => {
      this.spinners[index] = false;
    });
  }

  private _defineBaseUrl() {
    this.baseUrl = this.isDevMode ? this.gatewayUrl : window.location.href;
  }

  private _preSetup(num: number) {
    this._defineBaseUrl();
    this.notificationService.resetNotification();
    this.spinners[num] = true;
  }

  private _savePaymentProviders(providers: string[]): void {
    this.spinners[0] = false;
    providers.forEach((el: string) => {
      const isAlreadyAdded = this.paymentProviders.indexOf(el) !== -1;
      if (!isAlreadyAdded) {
        this.paymentProviders.push(el);
      }
    });
  }

  private _listenPostMessage() {
    return this.eventManager.addGlobalEventListener('window', 'message', (e: MessageEvent) => {
      if (e.data.Alias) {
        this.providerValidationDetails = e.data;
        console.log(e.data);
      }
    });
  }

}
