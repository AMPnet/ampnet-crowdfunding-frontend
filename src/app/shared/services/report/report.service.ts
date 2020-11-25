import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserTransaction } from '../wallet/wallet.service';

@Injectable({
    providedIn: 'root',
})
export class ReportService {
    constructor(private http: BackendHttpClient,
                private datePipe: DatePipe) {
    }

    userTransactions(from?: Date, to?: Date): Observable<void> {
        const params = {};
        if (!!from) {
            params['from'] = this.datePipe.transform(from, 'yyyy-MM-dd');
        }
        if (!!to) {
            params['to'] = this.datePipe.transform(to, 'yyyy-MM-dd');
        }

        return this.http.http.get('/api/report/report/user/transactions', {
            params: params,
            headers: this.http.authHttpOptions().headers,
            responseType: 'arraybuffer'
        }).pipe(
            map(data => {
                const fileName = [
                    'UserTransactions',
                    this.datePipe.transform(new Date(), 'yMdhhmmss'),
                    `${!!from ? 'from' + params['from'] : ''}`,
                    `${!!to ? 'to' + params['to'] : ''}`
                ].filter(text => !!text).join('_') + '.pdf';

                this.downloadFile(data, fileName);
            })
        );
    }

    singleUserTransaction(transaction: UserTransaction): Observable<void> {
        return this.http.http.get(`/api/report/report/user/transaction`, {
            headers: this.http.authHttpOptions().headers,
            params: {
                txHash: transaction.tx_hash,
                fromTxHash: transaction.from_tx_hash,
                toTxHash: transaction.to_tx_hash
            },
            responseType: 'arraybuffer'
        }).pipe(
            map(data => {
                const fileName = [
                    'UserTransaction',
                    this.datePipe.transform(transaction.date, 'yMdhhmmss'),
                ].filter(text => !!text).join('_') + '.pdf';

                this.downloadFile(data, fileName);
            })
        );
    }

    downloadFile(data: ArrayBuffer, fileName: string): void {
        const file = new Blob([data], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = fileName;
        link.click();
    }
}
