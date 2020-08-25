import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { Tag } from './offer-filter/office-filter-model';

@Injectable({
    providedIn: 'root'
})
export class OffersService {

    projectEndpoint = '/public/project';
    investEndpoint = '/wallet/invest/project';
    projectPublicEnd = '/public/project';

    constructor(private http: HttpClient) {
    }

    getAllOffers(tags?: Tag[]) {
        return this.http.get(API.generateComplexRoute(this.projectEndpoint, [
            'active'
        ]));
    }

    getOfferByID(offerID: string) {
        return this.http.get(API.generateComplexRoute(this.projectPublicEnd, [
            offerID.toString()
        ]));
    }

    generateTransactionToGreenvest(projectID: string, investAmount: number) {

        return this.http.post(API.generateComplexRoute(this.investEndpoint, [
            projectID
        ]), {
            'amount': investAmount.toString()
        }, API.tokenHeaders());

    }
}

