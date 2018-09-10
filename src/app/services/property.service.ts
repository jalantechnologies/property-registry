import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Http} from '@angular/http';
import CONFIG from '@config';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {
  constructor(private httpClient: HttpClient) {
  }

  public getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  }

  public storePropertyAddress(data): Observable<any> {
    return this.httpClient.post<any>(`${CONFIG.apiEndpoint}property`, data, this.getAuthHeaders());
  }

}
