export interface Notification {
  timestamp: number;
  status: number;
  code?: number;
  error?: string;
  exception?: string;
  message?: string;
  messages: string[];
  path?: string;
}

export interface Providers {
  apiClient: string;
  enabledPaymentProviders: string[];
}

export interface ProviderConfig {
  formParams: FormParameter[];
  paymentProvider: string;
  iframeUrl: string;
}

export interface FormParameter {
  key: string;
  value: string;
}

export interface Alias {
  AliasId: string;
  NCError: string;
  NCErrorCardNo: string;
  NCErrorCN: string;
  NCErrorCVC: string;
  NCErrorED: string;
  OrderId: string;
  Status: string;
  StorePermanently: string;
}

export interface Card {
  Bin: string;
  Brand: string;
  CardNumber: string;
  CardHolderName: string;
  Cvc: string;
  ExpiryDate: string;
}

export interface ProviderValidationDetails {
  Alias: Alias;
  Card: Card;
  SHASign: string;
}

export interface KeyValueObject {
  key: string;
  value: string | number | boolean;
}

export interface CardDetailsRS {
  cardAliasInfo: {
    aliasId: string;
    orderId: string;
    cardBin: string;
    cardBrand: string;
    cardNumber: string;
    cardHolderName: string;
    cardCvc: string;
    cardExpiryDate: string;
    aliasNCError: string;
    aliasNCErrorCardNo: string;
    aliasNCErrorCardNumber: string;
    aliasNCErrorCardCvc: string;
    aliasNCErrorCardExpiryDate: string;
    aliasStatus: string;
    aliasStorePermanently: string;
  };
  paymentProvider: string;
  paymentProviderResponseValid: boolean;
  cardType: CardTypeEnum;
}

export enum CardTypeEnum {
  VI = 'VI',
  VD = 'VD',
  VE = 'VE',
  MA = 'MA',
  MC = 'MC',
  MD = 'MD',
  AX = 'AX'
}
