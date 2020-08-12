import { Injectable } from '@angular/core';
import { BackendApiService } from '../shared/services/backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class CountryService {
    constructor(private http: BackendApiService) {
    }

    getCountries() {
        return this.http.get<Country[]>('/api/countries');
    }
}

export class Country {
    id: number;
    iso: string;
    name: string;
    nicename: string;
    iso3: string;
    numcode: number;
    phonecode: number;
}
