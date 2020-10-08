import { Component, OnInit } from '@angular/core';
import {
    ProjectWithdraw,
    WalletCooperativeWithdrawService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../../utilities/error-handler';

@Component({
    selector: 'app-manage-project-withdrawal',
    templateUrl: './manage-project-withdrawal.component.html',
    styleUrls: ['./manage-project-withdrawal.component.scss']
})
export class ManageProjectWithdrawalComponent implements OnInit {
    withdrawals: ProjectWithdraw[];

    constructor(private withdrawService: WalletCooperativeWithdrawService) {
    }

    ngOnInit() {
        this.getApprovedProjectWithdrawals();
    }

    getApprovedProjectWithdrawals() {
        SpinnerUtil.showSpinner();
        return this.withdrawService.getApprovedProjectWithdraws().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.withdrawals = res.withdraws;
        }, hideSpinnerAndDisplayError);
    }
}
