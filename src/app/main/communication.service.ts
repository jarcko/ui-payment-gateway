import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { catchError, map } from 'rxjs/internal/operators';
import { throwError } from 'rxjs';

@Injectable()
export class CommunicationService {
  basePath = 'http://payment-gateway-1-integration.thomascook.io:8080';
  testPath = 'https://awesome-backend-1.firebaseio.com/data.json';

  constructor(private http: Http) {
  }

  get(path: string, options?: RequestOptions) {
    return this.http.get(this.basePath + path, options)
      .pipe(
        map((response: Response) => {
            return response.json();
          }
        ),
        catchError((error) => {
            return throwError(error);
          }
        ));
  }

  post(path: string, body: any[]) {
    return this.http.post(this.basePath + path, body);
  }
}
