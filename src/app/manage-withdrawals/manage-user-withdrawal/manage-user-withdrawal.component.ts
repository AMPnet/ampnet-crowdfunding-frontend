import { Component, OnInit } from '@angular/core';
import {
    UserWithdraw,
    WalletCooperativeWithdrawService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../../utilities/error-handler';

@Component({
    selector: 'app-manage-user-withdrawal',
    templateUrl: './manage-user-withdrawal.component.html',
    styleUrls: ['./manage-user-withdrawal.component.scss']
})
export class ManageUserWithdrawalComponent implements OnInit {
    withdrawals: UserWithdraw[];

    constructor(private withdrawService: WalletCooperativeWithdrawService) {
    }

    ngOnInit() {
        this.getApprovedUsersWithdrawals();
    }

    getApprovedUsersWithdrawals() {
        SpinnerUtil.showSpinner();
        return this.withdrawService.getApprovedWithdrawals().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.withdrawals = res.withdraws;
        }, hideSpinnerAndDisplayError);
    }
}
