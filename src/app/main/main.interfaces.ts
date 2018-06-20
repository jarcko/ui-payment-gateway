export enum NotificationType {
  Warn = 'error',
  Success = 'success'
}

export interface Notification {
  notificationType: string;
  header: string;
  text: string;
}
