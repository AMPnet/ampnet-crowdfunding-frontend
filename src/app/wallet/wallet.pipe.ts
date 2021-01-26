import { Pipe, PipeTransform } from '@angular/core';
import { TransactionState, TransactionType } from '../shared/services/wallet/wallet.service';

@Pipe({name: 'txAmountSign'})
export class TxAmountSign implements PipeTransform {
    transform(type: TransactionType): '+' | '-' | '' {
        switch (type) {
            case TransactionType.DEPOSIT: {
                return '+';
            }
            case TransactionType.WITHDRAW: {
                return '-';
            }
            case TransactionType.INVEST: {
                return '-';
            }
            case TransactionType.SHARE_PAYOUT: {
                return '+';
            }
            case TransactionType.CANCEL_INVESTMENT: {
                return '+';
            }
            case TransactionType.APPROVE_INVESTMENT: {
                return '-';
            }
            default: {
                return '';
            }
        }
    }
}
