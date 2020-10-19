import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import {
    CoopWithdraw,
    WalletCooperativeWithdrawService
} from 'src/app/shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { PopupService } from '../../shared/services/popup.service';
import { delay, switchMap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-single-withdrawal',
    templateUrl: './single-withdrawal.component.html',
    styleUrls: ['./single-withdrawal.component.css']
})
export class SingleWithdrawalComponent implements OnInit {
    withdrawalID: number;
    withdrawal$: Observable<CoopWithdraw>;

    constructor(private route: ActivatedRoute,
                private withdrawCoopService: WalletCooperativeWithdrawService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private router: Router) {
    }

    ngOnInit() {
        this.withdrawalID = Number(this.route.snapshot.params.ID);

        // TODO: uncomment when available
        // this.withdrawal$ = this.withdrawCoopService.getApprovedWithdrawal(this.withdrawalID);

        this.withdrawal$ = of(<CoopWithdraw>{
            withdraw: {
                id: 23,
                amount: 15000,
            },
            user: {
                uuid: 'asdfad',
                first_name: 'Matija',
                last_name: 'Pevec',
                email: 'matija@ampnet.io'
            },
            project: {
                name: 'Proyecto bueno'
            },
        }).pipe(delay(1000));
    }

    approveAndGenerateCodeClicked() {
        return this.withdrawCoopService.generateBurnWithdrawTx(this.withdrawalID).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.router.navigate(['/dash/manage_withdrawals']))
        );
    }
}
