import { Component, OnInit } from '@angular/core';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import {
    UserWithdraw,
    WalletCooperativeWithdrawService
} from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';

@Component({
    selector: 'app-manage-withdrawals',
    templateUrl: './manage-withdrawals.component.html',
    styleUrls: ['./manage-withdrawals.component.css']
})
export class ManageWithdrawalsComponent implements OnInit {
    withdrawals: UserWithdraw[];

    constructor(private withdrawService: WalletCooperativeWithdrawService) {
    }

    ngOnInit() {
        this.getApprovedWithdrawals();
    }

    getApprovedWithdrawals() {
        SpinnerUtil.showSpinner();
        return this.withdrawService.getApprovedWithdrawals().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.withdrawals = res.withdraws.map(x => {
                x.amount = centsToBaseCurrencyUnit(x.amount);
                return x;
            });
        }, hideSpinnerAndDisplayError);
    }
}
