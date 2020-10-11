import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {
    ProjectWithdraw,
    UserWithdraw,
    WalletCooperativeWithdrawService
} from 'src/app/shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-single-withdrawal',
    templateUrl: './single-withdrawal.component.html',
    styleUrls: ['./single-withdrawal.component.css']
})
export class SingleWithdrawalComponent implements OnInit {
    withdrawalId;
    withdrawalType = 'users';
    userWithdrawal: UserWithdraw;
    projectWithdrawal: ProjectWithdraw;

    constructor(private route: ActivatedRoute,
                private withdrawCooperativeService: WalletCooperativeWithdrawService,
                private broadcastService: BroadcastService) {
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
        this.withdrawCooperativeService.getApprovedWithdrawals().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.userWithdrawal = res.withdraws.filter(item => item.id === id)[0];
        }, hideSpinnerAndDisplayError);
    }

    getProjectWithdrawal(id: number) {
        SpinnerUtil.showSpinner();
        this.withdrawCooperativeService.getApprovedProjectWithdraws().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.projectWithdrawal = res.withdraws.filter(item => item.id === id)[0];
        }, hideSpinnerAndDisplayError);
    }

    approveAndGenerateCodeClicked() {
        SpinnerUtil.showSpinner();
        this.withdrawCooperativeService.generateBurnWithdrawTx(this.withdrawalId).subscribe(async res => {

            const arkaneConnect = new ArkaneConnect('AMPnet', {
                environment: 'staging'
            });
            const account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);

            const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                walletId: account.wallets[0].id,
                data: res.tx,
                type: SignatureRequestType.AETERNITY_RAW
            });
            this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                .subscribe(_ => {
                    SpinnerUtil.hideSpinner();
                    swal('', 'Success', 'success');
                }, hideSpinnerAndDisplayError);

        }, hideSpinnerAndDisplayError);
    }
}
