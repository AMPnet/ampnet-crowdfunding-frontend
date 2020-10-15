import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    ProjectWithdraw,
    UserWithdraw,
    WalletCooperativeWithdrawService
} from 'src/app/shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { PopupService } from '../../shared/services/popup.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';

@Component({
    selector: 'app-single-withdrawal',
    templateUrl: './single-withdrawal.component.html',
    styleUrls: ['./single-withdrawal.component.css']
})
export class SingleWithdrawalComponent implements OnInit {
    withdrawalId: number;
    withdrawalType = 'users';
    userWithdrawal: UserWithdraw;
    projectWithdrawal: ProjectWithdraw;

    constructor(private route: ActivatedRoute,
                private withdrawCooperativeService: WalletCooperativeWithdrawService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private router: Router) {
    }

    ngOnInit() {
        this.withdrawalId = Number(this.route.snapshot.params.ID);
        this.withdrawalType = this.route.snapshot.params.type;

        switch (this.withdrawalType) {
            case 'users': {
                this.getWithdrawal(this.withdrawalId);
                break;
            }
            case 'projects': {
                this.getProjectWithdrawal(this.withdrawalId);
                break;
            }
        }
    }

    getWithdrawal(id: number) {
        SpinnerUtil.showSpinner();
        this.withdrawCooperativeService.getApprovedWithdrawals().pipe(displayBackendErrorRx(),
            tap(res => this.userWithdrawal = res.withdraws.find(item => item.id === id)),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    getProjectWithdrawal(id: number) {
        SpinnerUtil.showSpinner();
        this.withdrawCooperativeService.getApprovedProjectWithdraws().pipe(displayBackendErrorRx(),
            tap(res => this.projectWithdrawal = res.withdraws.find(item => item.id === id)),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }

    approveAndGenerateCodeClicked() {
        return this.withdrawCooperativeService.generateBurnWithdrawTx(this.withdrawalId).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.router.navigate([`/dash/manage_withdrawals/${this.withdrawalType}`]))
        );
    }

    isUserWithdrawApproved() {
        return this.withdrawalType === 'users' && this.userWithdrawal !== undefined && this.userWithdrawal.burned_tx_hash === null;
    }

    isProjectWithdrawApproved() {
        return this.withdrawalType === 'projects' && this.projectWithdrawal !== undefined && this.projectWithdrawal.burned_tx_hash === null;
    }
}
