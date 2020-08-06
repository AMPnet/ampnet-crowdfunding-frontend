import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountriesModel } from '../models/countries/CountryModel';
import { Observable } from 'rxjs';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private endpoint = '/countries';

  constructor(
    private http: HttpClient) {
  }

  getCountries(): Observable<CountriesModel> {
    return this.http.get<CountriesModel>(API.generateRoute(this.endpoint));
  }
}
