import { Component, OnInit } from '@angular/core';
import {
    ProjectWithdraw,
    WalletCooperativeWithdrawService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { finalize, tap } from 'rxjs/operators';

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
        this.withdrawService.getApprovedProjectWithdraws().pipe(displayBackendErrorRx(),
            tap(res => this.withdrawals = res.withdraws),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }
}
