import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Providers } from './main.interfaces';
import { HttpParamsOptions } from '@angular/common/http/src/params';

@Injectable()
export class CommunicationService {
  basePath = 'http://payment-gateway-1-qa.thomascook.io:8080';
  testPath = 'https://awesome-backend-1.firebaseio.com/data.json';

  constructor(private httpClient: HttpClient) {
  }

  get(path: string, opts?: Object, key?: string) {

    const headers = key ? new HttpHeaders().set('Authorization', key) : null;
    let params = opts ? new HttpParams() : null;

    // if (params) {
    //   Object.keys(opts).forEach((propertyName: string) => {
    //     params = params.append(propertyName, opts[key]);
    //   });
    // }
    if (params) {
      params = params.set('orderId', opts.orderId).append('successUrl', opts.successUrl).append('failureUrl', opts.failureUrl);
    }

    return this.httpClient.get<Providers>(this.basePath + path, {
      headers: headers,
      params: params
    })
      .pipe(
        map((providers) => providers)
      );
  }

  post(path: string, body: any[]) {
    return this.httpClient.post(this.basePath + path, body);
  }
}
