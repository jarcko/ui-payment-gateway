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

export interface CardInfo {
  brand: string;
  number: string;
  holderName: string;
}

export interface ProviderValidationDetails {
  responseType: string;
  key: string;
  value: string;
}
