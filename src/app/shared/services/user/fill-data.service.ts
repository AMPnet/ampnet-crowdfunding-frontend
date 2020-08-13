import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/utilities/endpoint-manager';

@Injectable({
    providedIn: 'root'
})
export class FillDataService {

    private endpoint = '/me';

    constructor(private http: HttpClient) {
    }

    updateUserData(
        email: string,
        firstName: string,
        lastName: string,
        countryID: number,
        phoneNumber: string
    ) {
        return this.http.post(API.generateRoute(this.endpoint), {
            'email': email,
            'first_name': firstName,
            'last_name': lastName,
            'country_id': countryID,
            'phone_number': phoneNumber
        }, API.tokenHeaders());
    }
}
