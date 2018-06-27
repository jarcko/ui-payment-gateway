import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class CommunicationService {

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

    return this.httpClient.get(path, {
      headers: headers,
      params: params
    })
      .pipe(
        map((data) => data)
      );
  }

  post(path: string, body: Object) {
    return this.httpClient.post(path, body);
  }

  put(path: string, body: Object) {
    return this.httpClient.put(path, body);
  }
}
