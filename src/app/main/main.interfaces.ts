export interface Notification {
  timestamp: number;
  status: number;
  error: string;
  exception: string;
  message: string;
  path: string;
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
