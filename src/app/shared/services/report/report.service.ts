import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
                const file = new Blob([data], {type: 'application/pdf'});
                const fileName = [
                    'UserTransactions',
                    this.datePipe.transform(new Date(), 'yMdhhmmss'),
                    `${!!from ? 'from' + params['from'] : ''}`,
                    `${!!to ? 'to' + params['to'] : ''}`
                ].filter(text => !!text).join('_') + '.pdf';

                const fileURL = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = fileName;
                link.click();
            })
        );
    }

    singleUserTransaction(txHash: string, fromTxHash: string, toTxHash: string, date: Date): Observable<void> {
        return this.http.http.get(`/api/report/report/user/transaction?txHash=${txHash}&fromTxHash=${fromTxHash}&toTxHash=${toTxHash}`, {
            headers: this.http.authHttpOptions().headers,
            responseType: 'arraybuffer'
        }).pipe(
            map(data => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileName = [
                    'UserTransaction',
                    this.datePipe.transform(`${!!date ? date : ''}`, 'yMdhhmmss'),
                ].filter(text => !!text).join('_') + '.pdf';

                const fileURL = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = fileName;
                link.click();
            })
        );
    }
}
