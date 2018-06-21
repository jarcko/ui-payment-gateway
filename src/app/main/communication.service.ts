import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CommunicationService {
  basePath = 'http://payment-gateway-1-qa.thomascook.io:8080';
  testPath = 'https://awesome-backend-1.firebaseio.com/data.json';

  constructor(private httpClient: HttpClient) {
  }

  get(path: string, opts: Object, key?: string) {

    const headers = key ? new HttpHeaders().set('Authorization', key) : null;
    let params = opts ? new HttpParams() : null;
    if (params) {
      Object.keys(opts).forEach((prop: string) => {
        params = params.append(prop, opts[prop]);
      });
    }

    return this.httpClient.get(this.basePath + path, {
      headers: headers,
      params: params
    })
      .pipe(
        map((data) => data)
      );
  }

  post(path: string, body: any[]) {
    return this.httpClient.post(this.basePath + path, body);
  }
}
