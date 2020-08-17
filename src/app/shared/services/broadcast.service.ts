import { Injectable } from '@angular/core';
import { BackendHttpClient } from './backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class BroadcastService {
    constructor(private http: BackendHttpClient) {
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
