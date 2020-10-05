import { Component, OnInit } from '@angular/core';
import { PaymentService, UserBankAccount } from '../../shared/services/payment.service';
import { Withdraw, WithdrawService } from '../../shared/services/wallet/withdraw.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService } from '../../shared/services/broadcast.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../../utilities/error-handler';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { MiddlewareService } from '../../shared/services/middleware/middleware.service';

@Component({
    selector: 'app-project-withdraw',
    templateUrl: './project-withdraw.component.html',
    styleUrls: ['./project-withdraw.component.css']
})
export class ProjectWithdrawComponent implements OnInit {
    projectWallet: WalletDetails;
    activeBankAccount = 0;
    banks: UserBankAccount[];
    isProjectFullyFunded = false;

    pendingWithdrawal: Withdraw;
    withdrawAmount = 0;
    bankAccountForm: FormGroup;

    constructor(private paymentService: PaymentService,
                private withdrawService: WithdrawService,
                private walletService: WalletService,
                private router: Router,
                private route: ActivatedRoute,
                private broadService: BroadcastService,
                private fb: FormBuilder,
                private middlewareService: MiddlewareService) {

        this.bankAccountForm = this.fb.group({
            iban: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        const projID = this.route.snapshot.params.projectID;
        this.getProjectWallet(projID);
        this.getBankAccounts();
        this.getMyPendingWithdraw();
    }

    getProjectWallet(projectID: number) {
        SpinnerUtil.showSpinner();
        this.walletService.getProjectWallet(projectID)
            .subscribe(wallet => {
                this.projectWallet = wallet;
                this.middlewareService.getProjectWalletInfoCached(wallet.hash)
                    .subscribe(res => {
                        this.isProjectFullyFunded = res.balance === res.investmentCap;
                    }, hideSpinnerAndDisplayError);
            }, hideSpinnerAndDisplayError);
    }

    getBankAccounts() {
        SpinnerUtil.showSpinner();
        this.paymentService.getMyBankAccounts().subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.banks = res.bank_accounts;
        }, hideSpinnerAndDisplayError);
    }

    getMyPendingWithdraw() {
        SpinnerUtil.showSpinner();
        this.withdrawService.getMyPendingWithdraw().subscribe(res => {
            this.pendingWithdrawal = res;
        }, hideSpinnerAndDisplayError);
    }

    async generateWithdrawClicked() {
        if (this.pendingWithdrawal !== undefined) {
            this.burnWithdraw();
            return;
        }

        SpinnerUtil.showSpinner();
        const controls = this.bankAccountForm.controls;
        const iban = controls['iban'].value.replace(/\s/g, '');
        const projID = this.route.snapshot.params.projectID;

        this.withdrawService.createProjectWithdrawRequest(this.withdrawAmount, iban, projID).subscribe(res => {
            this.pendingWithdrawal = res;
            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    burnWithdraw() {
        SpinnerUtil.showSpinner();
        this.withdrawService.generateApproveWithdrawTx(this.pendingWithdrawal.id).subscribe(async res => {

            const arkaneConnect = new ArkaneConnect('AMPnet', {
                environment: 'staging'
            });

            const account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);

            const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                walletId: account.wallets[0].id,
                data: res.tx,
                type: SignatureRequestType.AETERNITY_RAW
            });
            this.broadService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                .subscribe(_ => {
                    SpinnerUtil.hideSpinner();
                    swal('', 'Success', 'success').then(() => {
                        this.walletService.clearAndRefreshWallet();
                        this.router.navigate(['/dash/wallet']);
                    });
                }, hideSpinnerAndDisplayError);

            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    deleteWithdrawal() {
        this.withdrawService.deleteWithdrawal(this.pendingWithdrawal.id).subscribe(_ => {
            swal('', 'Success!', 'success');
        }, hideSpinnerAndDisplayError);
    }
}
