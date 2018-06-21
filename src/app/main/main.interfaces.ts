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
