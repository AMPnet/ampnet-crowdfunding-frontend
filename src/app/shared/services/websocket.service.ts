import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    subject = webSocket({
        url: 'wss://staging.ampnet.io/api/middleware/ws'
    });

    constructor() {
    }

    walletNotifier(walletAddress: string) {
        return this.subject.multiplex(
            () => <WalletNotifierInput>({wallet: walletAddress}), null,
            (data: WalletNotifierOutput) => data.wallet === walletAddress)
            .pipe(retry());
    }
}

interface WalletNotifierInput {
    wallet: string;
}

interface WalletNotifierOutput {
    wallet: string;
}
