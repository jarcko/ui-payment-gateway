import { Component, OnInit } from '@angular/core';
import { CommunicationService } from './communication.service';
import { CardDetailsRS, CardTypeEnum, KeyValueObject, ProviderConfig, Providers, ProviderValidationDetails } from './main.interfaces';
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
  gatewayUrl = 'http://payment-gateway-1-integration.thomascook.io:8080';
  isDevMode = /localhost/i.test(window.location.href);
  jwtEnabled = true;
  key = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJib29raW5ncyByZXF1ZXN0In0.' +
    'OqtiU5v7iDO47tq8oeWu6rBaf0R25YDR1m9ouwsZV-ApHYQhD5FdZ8xqJ6dlibbUoM98_4MDO3feVcdytOnm7Q';

  orderId = 'test-page-' + new Date().toJSON().slice(0, 19);
  spinners: boolean[] = [];

  selectState = 'orderId';
  enteredQueryValue: string;
  selectedProviderName: string;
  selectedCardType: CardTypeEnum;
  enteredMoneyAmount: number;

  paymentProviders: string[];
  providerConfigFrom: FormGroup;
  providerConfig: ProviderConfig;
  providerValidationDetails: ProviderValidationDetails;
  queryTxRS: Object;
  cardDetailsRS: CardDetailsRS;
  authorizeRS: Object;
  cancelRS: Object;
  captureRS: Object;

  FRAUD_PARAMS = {
    OWNERADDRESS: '100 WARDOUR STREET',
    AIFLDATE2: '20191022',
    AIFLDATE1: '20191015',
    AIDESTCITYL2: 'London Gatwick',
    REMOTE_ADDR: '127.0.0.1',
    OWNERZIP: 'W1F0TN',
    AIDESTCITYL1: 'Paphos',
    OWNERTELNO: '12333333333',
    EMAIL: 'igor.jarko@thomascookonline.com',
    AIPASNAME: 'Mr Igor Jarko',
    AIORCITY1: 'LGW',
    AIORCITY2: 'PFO',
    AICARRIER1: 'MT',
    AICARRIER2: 'MT',
    AIDESTCITY1: 'PFO',
    AIDESTCITY2: 'LGW',
    AIORCITYL2: 'Paphos',
    AIORCITYL1: 'London Gatwick'
  };

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
    this._preSetup(6);
    this.queryTxRS = null;
    if (this.enteredQueryValue) {
      const options = {};
      options[this.selectState] = this.enteredQueryValue;
      this.communicationService.get(
        `${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/tx/query`, options, this.jwtEnabled ? this.key : null
      )
        .subscribe(
          (data: Object) => {
            this.removeSpinners();
            this.queryTxRS = data;
            console.log('queryTxRS:', data);
          },
          (err) => {
            this.removeSpinners();
            this.notificationService.pushNotification(err.error);
            console.log('queryTxER:', err);
          }
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
          this.removeSpinners();
          this.notificationService.pushNotification(err.error);
        }
      );
  }

  getConfig() {
    this._preSetup(1);
    this.providerConfig = null;

    if (this.selectedProviderName) {
      const options = this.providerConfigFrom.getRawValue();
      this.communicationService.get(
        `${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/config/`, options, this.jwtEnabled ? this.key : null
      )
        .subscribe(
          (data: ProviderConfig) => this.providerConfig = data,
          (err) => {
            this.removeSpinners();
            this.notificationService.pushNotification(err.error);
          }
        );
    } else {
      this.removeSpinners();
      this.snackbar.open('Please select Payment Provider', 'Something missed');
    }
  }

  postCardDetails() {
    this._preSetup(2);
    this.cardDetailsRS = null;

    const body = {
      tokenizationParams: this.convertIngenicoResponse(this.providerValidationDetails),
      paymentProvider: this.selectedProviderName,
      cardType: this.selectedCardType
    };

    this.communicationService.post(`${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/cardDetails/`, body)
      .subscribe(
        (data: CardDetailsRS) => {
          this.removeSpinners();
          this.cardDetailsRS = data;
          console.log('cardDetailsRS:', data);
        },
        (err) => {
          this.removeSpinners();
          this.notificationService.pushNotification(err.error);
          console.log('cardDetailsER:', err);
        }
      );
  }

  onChangeCard() {
    this.providerValidationDetails = null;
  }

  authorize() {
    this._preSetup(3);
    this.authorizeRS = null;

    const form = this.providerConfigFrom.getRawValue();
    const body = {
      paymentProvider: this.selectedProviderName,
      orderId: this.cardDetailsRS ?
        (this.cardDetailsRS.cardAliasInfo ? this.cardDetailsRS.cardAliasInfo.orderId : null) :
        null,
      acceptUrl: form.acceptUrl,
      declineUrl: form.exceptionUrl,
      exceptionUrl: form.exceptionUrl,
      amountCops: this.enteredMoneyAmount * 100,
      currency: 'GBP',
      language: 'en_US',
      templateName: 'newuser.html',
      cardType: this.selectedCardType,
      fraudParams: this.dataConversionService.objectToKeyValueArray(this.FRAUD_PARAMS)
    };

    this.communicationService.post(`${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/tx/authorize`, body)
      .subscribe(
        (data: Object) => {
          this.removeSpinners();
          this.authorizeRS = data;
          console.log('authorizeRS:', data);
        },
        (err) => {
          this.removeSpinners();
          this.notificationService.pushNotification(err.error);
          console.log('authorizeER:', err);
        }
      );
  }
  // TODO implement method
  authorize3ds() {
    console.log('not implemented method');
    this.snackbar.open('This feature will be implemented a bit later', 'Not yet implemented');
  }

  cancelAuthorization() {
    this._preSetup(4);
    this.cancelRS = null;

    const body = {
      paymentProvider: this.selectedProviderName,
      orderId: this.cardDetailsRS ?
        (this.cardDetailsRS.cardAliasInfo ? this.cardDetailsRS.cardAliasInfo.orderId : null) :
        null,
      currency: 'GBP',
      amountCops: this.enteredMoneyAmount * 100
    };

    this.communicationService.put(`${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/tx/cancel`, body)
      .subscribe(
        (data: Object) => {
          this.removeSpinners();
          this.cancelRS = data;
          console.log('cancelRS:', data);
        },
        (err) => {
          this.removeSpinners();
          this.notificationService.pushNotification(err.error);
          console.log('cancelER:', err);
        }
      );
  }

  capture() {
    this._preSetup(5);
    this.captureRS = null;

    const body = {
      paymentProvider: this.selectedProviderName,
      orderId: this.cardDetailsRS ?
        (this.cardDetailsRS.cardAliasInfo ? this.cardDetailsRS.cardAliasInfo.orderId : null) :
        null,
      currency: 'GBP',
      amountCops: this.enteredMoneyAmount * 100
      // amountCops: this.authorizeRS ?
      //   (this.authorizeRS.amountCops >= 0 ? this.authorizeRS.amountCops : null) :
      //   null
    };

    this.communicationService.put(`${this.baseUrl}/api/paymentProviders/${this.selectedProviderName}/tx/capture`, body)
      .subscribe(
        (data: Object) => {
          this.removeSpinners();
          this.captureRS = data;
          console.log('captureRS:', data);
        },
        (err) => {
          this.removeSpinners();
          this.notificationService.pushNotification(err.error);
          console.log('captureER:', err);
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

  isResponsePresent(obj): boolean {
    return !!Object.keys(obj).length;
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
