import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    subject: WebSocketSubject<unknown>;

    constructor() {
        const protocol = window.location.protocol.replace('http', 'ws');
        const host = window.location.host;
        const wsURL = `${protocol}//${host}/api/middleware/ws`;
        this.subject = webSocket({
            url: wsURL
        });
    }

    walletNotifier(walletAddress: string) {
        return this.subject.multiplex(
            () => <WalletNotifierInput>({wallet: walletAddress}), null,
            (data: WalletNotifierOutput) => data?.wallet === walletAddress)
            .pipe(retry());
    }
}

interface WalletNotifierInput {
    wallet: string;
}

interface WalletNotifierOutput {
    wallet: string;
}
