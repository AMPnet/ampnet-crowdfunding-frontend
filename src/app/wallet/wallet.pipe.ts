import { Pipe, PipeTransform } from '@angular/core';
import { TransactionState, TransactionType } from '../shared/services/wallet/wallet.service';

@Pipe({name: 'txIconType'})
export class TxIconType implements PipeTransform {
    transform(type: TransactionType): string {
        switch (type) {
            case TransactionType.DEPOSIT: {
                return 'fa-arrow-down';
            }
            case TransactionType.WITHDRAW: {
                return 'fa-arrow-up';
            }
            case TransactionType.INVEST: {
                return 'fa-coins';
            }
            case TransactionType.SHARE_PAYOUT: {
                return 'fa-hand-holding-usd';
            }
            default: {
                return 'fa-question-circle';
            }
        }
    }
}

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
            default: {
                return '';
            }
        }
    }
}

@Pipe({name: 'txIconStatus'})
export class TxIconStatus implements PipeTransform {

    transform(type: TransactionState): string {
        switch (type) {
            case TransactionState.MINED: {
                return 'fa-check-circle';
            }
            case TransactionState.PENDING: {
                return 'fa-spinner fa-spin';
            }
            case TransactionState.FAILED: {
                return 'fa-cross';
            }
            default: {
                return 'fa-question-circle';
            }
        }
    }
}
