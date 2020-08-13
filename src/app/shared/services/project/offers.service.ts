import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class OffersService {
    constructor(private http: BackendApiService) {
    }

    getAllOffers() {
        return this.http.get('/api/public/project/active');
    }

    getOfferByID(offerID: string) {
        return this.http.get(`/api/public/project/${offerID}`);
    }

    generateTransactionToGreenvest(projectID: string, investAmount: number) {
        return this.http.post(`/api/wallet/invest/project/${projectID}`, {
            amount: investAmount.toString(10)
        });
    }
}
