import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'txIconType' })
export class TxIconType implements PipeTransform {

    transform(type: string): string {
        switch (type) {
            case 'DEPOSIT': {
                return 'fa-arrow-down';
            }
            case 'WITHDRAW': {
                return 'fa-arrow-up';
            }
            case 'INVEST': {
                return 'fa-coins';
            }
            case 'SHARE_PAYOUT': {
                return 'fa-hand-holding-usd';
            }
            default: {
                return 'fa-question-circle';
            }
        }
    }
}

@Pipe({ name: 'txIconStatus' })
export class TxIconStatus implements PipeTransform {

    transform(type: string): string {
        switch (type) {
            case 'MINED': {
                return 'fa-check-circle';
            }
            case 'PENDING': {
                return 'fa-spinner fa-spin';
            }
            case 'FAILED': {
                return 'fa-cross';
            }
            default: {
                return 'fa-question-circle';
            }
        }
    }

}
