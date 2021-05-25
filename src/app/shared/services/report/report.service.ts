import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserTransaction } from '../wallet/wallet.service';
import { ErrorService } from '../error.service';

@Injectable({
    providedIn: 'root',
})
export class ReportService {
    constructor(private http: BackendHttpClient,
                private errorService: ErrorService,
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
            this.errorService.handleError,
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
            this.errorService.handleError,
            map(data => {
                const fileName = [
                    'UserTransaction',
                    this.datePipe.transform(transaction.date, 'yMdhhmmss'),
                ].filter(text => !!text).join('_') + '.pdf';

                this.downloadFile(data, fileName);
            })
        );
    }

    usersSummary(from?: Date, to?: Date): Observable<void> {
        const params = {};
        if (!!from) {
            params['from'] = this.datePipe.transform(from, 'yyyy-MM-dd');
        }
        if (!!to) {
            params['to'] = this.datePipe.transform(to, 'yyyy-MM-dd');
        }

        return this.http.http.get('/api/report/admin/report/user', {
            params: params,
            headers: this.http.authHttpOptions().headers,
            responseType: 'arraybuffer'
        }).pipe(
            this.errorService.handleError,
            map(data => {
                const fileName = [
                    'usersSummary',
                    this.datePipe.transform(new Date(), 'yMdhhmmss'),
                    `${!!from ? 'from' + params['from'] : ''}`,
                    `${!!to ? 'to' + params['to'] : ''}`
                ].filter(text => !!text).join('_') + '.pdf';

                this.downloadFile(data, fileName);
            })
        );
    }

    report(type: ReportXlsxType): Observable<void> {
        const fullFileName = [
            this.reportFilename(type),
            this.datePipe.transform(new Date(), 'yMdhhmmss'),
        ].filter(text => !!text).join('_') + '.xlsx';

        return this.http.http.get('/api/report/admin/report/xlsx', {
            params: {type},
            headers: this.http.authHttpOptions().headers,
            responseType: 'arraybuffer'
        }).pipe(
            this.errorService.handleError,
            map(data => this.downloadFile(data, fullFileName))
        );
    }

    private reportFilename(type: ReportXlsxType): string {
        switch (type) {
            case ReportXlsxType.REGISTERED:
                return 'registeredUsers';
            case ReportXlsxType.VERIFIED:
                return 'verifiedUsers';
            case ReportXlsxType.WALLET:
                return 'initializedWallets';
            case ReportXlsxType.DEPOSIT:
                return 'firstDeposits';
            case ReportXlsxType.INVESTMENT:
                return 'firstInvestments';
            default:
                return 'unknownReport';
        }
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

export enum ReportXlsxType {
    REGISTERED = 'REGISTERED',
    VERIFIED = 'VERIFIED',
    WALLET = 'WALLET',
    DEPOSIT = 'DEPOSIT',
    INVESTMENT = 'INVESTMENT',
}
