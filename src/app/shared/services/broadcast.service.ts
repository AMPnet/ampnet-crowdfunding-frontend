import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class BroadcastService {
    constructor(private http: BackendApiService) {
    }

    broadcastSignedTx(signed: string, id: number) {
        return this.http.post<BroadcastTxResponse>('/api/wallet/tx_broadcast', {
            tx_sig: signed,
            tx_id: id.toString()
        });
    }
}

interface BroadcastTxResponse {
    tx_hash: string;
}
