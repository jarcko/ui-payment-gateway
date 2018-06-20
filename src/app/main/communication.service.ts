import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { catchError, map } from 'rxjs/internal/operators';
import { empty, throwError } from 'rxjs';

@Injectable()
export class CommunicationService {
  basePath = 'http://payment-gateway-1-qa.thomascook.io:8080';
  testPath = 'https://awesome-backend-1.firebaseio.com/data.json';

  constructor(private http: Http) {
  }

  get(path: string, options?: RequestOptions, key?: string) {
    const headers = new Headers({'authorization': key});
    return this.http.get(this.basePath + path, {headers: headers})
      .pipe(
        map((response: Response) => response.json())
        // catchError((err) => {
        //   // console.log(err);
        //   return empty();
        // })
      );
  }

  post(path: string, body: any[]) {
    return this.http.post(this.basePath + path, body);
  }
}
