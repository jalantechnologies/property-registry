import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Http} from '@angular/http';
import CONFIG from '@config';
import {ApiService} from '@services/api.service';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {
  constructor(private apiService: ApiService) {
  }

  public getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  }

  public storePropertyAddress(data): Observable<any> {
    return this.apiService.request(ApiService.Methods.POST, 'property', data);
  }

  public getPropertyAddress(propertyAddress): Observable<any> {
    return this.apiService.request(ApiService.Methods.GET, `property/search?q=${propertyAddress}`);
  }

  public downloadSignedDeed(deedURL): Observable<any> {
    return this.apiService.request(ApiService.Methods.GET, `property/download_signed_deed/${deedURL}`);
  }

  public verifyAddress(data): Observable<any> {
    return this.apiService.request(ApiService.Methods.POST, 'property/verify_address', data);
  }

}
