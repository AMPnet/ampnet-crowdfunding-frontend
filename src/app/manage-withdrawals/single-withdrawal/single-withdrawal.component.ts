import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendErrorRx, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    UserWithdraw,
    WalletCooperativeWithdrawService
} from 'src/app/shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import swal from 'sweetalert2';
import { switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';

@Component({
    selector: 'app-single-withdrawal',
    templateUrl: './single-withdrawal.component.html',
    styleUrls: ['./single-withdrawal.component.css']
})
export class SingleWithdrawalComponent implements OnInit {
    withdrawal: UserWithdraw;

    constructor(private route: ActivatedRoute,
                private withdrawCooperativeService: WalletCooperativeWithdrawService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private router: Router) {
    }

    ngOnInit() {
        const id = Number(this.route.snapshot.params.ID);
        this.getWithdrawal(id);
    }

    getWithdrawal(id: number) {
        SpinnerUtil.showSpinner();
        this.withdrawCooperativeService.getApprovedWithdrawals().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.withdrawal = res.withdraws.filter(item => item.id === id)[0];
        }, hideSpinnerAndDisplayError);
    }

    approveAndGenerateCodeClicked() {
        SpinnerUtil.showSpinner();

        return this.withdrawCooperativeService.generateBurnWithdrawTx(this.withdrawal.id).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            tap(() => SpinnerUtil.hideSpinner()),
            switchMap(() => this.router.navigate(['/dash/manage_withdrawals']))
        );
    }
}
