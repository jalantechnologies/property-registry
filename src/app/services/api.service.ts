import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';
import {map} from 'rxjs/operators';
import CONFIG from '@config';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  static Methods = {
    GET: 'get',
    POST: 'post'
  };
  // default headers
  headers = new HttpHeaders({});

  constructor(private httpClient: HttpClient) {
  }

  request(method: string, url: string, data?: JSON) {
    return this.httpClient.request(method, CONFIG.apiEndpoint + url, {
      headers: this.headers,
      body: data
    });
  }
}
