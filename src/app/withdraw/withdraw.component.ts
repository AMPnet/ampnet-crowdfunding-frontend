import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../payment-options/payment.service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { BankAccountModel } from '../payment-options/bank-account-model';
import { WithdrawService } from './withdraw.service';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from '../broadcast/broadcast-service';
import swal from 'sweetalert2';
import { baseCurrencyUnitToCents, centsToBaseCurrencyUnit } from '../utilities/currency-util';
import numeral from 'numeral';

declare var $: any;

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  activeBankAccount: number = 0;
  banks: BankAccountModel[];

  pendingWithdrawal: WithdrawalModel;

  withdrawAmount: string = '';

  constructor(private paymentService: PaymentService,
              private withdrawService: WithdrawService,
              private broadService: BroadcastService) {
  }

  ngOnInit() {
    this.getBankAccounts();
    this.getMyPendingWithdraw();
  }

  getBankAccounts() {
    SpinnerUtil.showSpinner();
    this.paymentService.getMyBankAccounts().subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      this.banks = res.bank_accounts;
    }, hideSpinnerAndDisplayError);
  }

  getMyPendingWithdraw() {
    SpinnerUtil.showSpinner();
    this.withdrawService.getMyPendingWithdraw().subscribe((res: any) => {
      this.pendingWithdrawal = res;
      this.withdrawAmount = numeral(
        centsToBaseCurrencyUnit(this.pendingWithdrawal.amount)
      ).format('0,0');
    }, hideSpinnerAndDisplayError);
  }

  changeActiveAccount(index: number) {
    this.activeBankAccount = index;
  }

  async generateWithdrawClicked() {

    if (this.pendingWithdrawal != undefined) {
      this.burnWithdraw();
      return;
    }
    SpinnerUtil.showSpinner();
    let amount: any = $('#withdraw-amount').val();
    let iban = this.banks[this.activeBankAccount].iban;
    let centAmount = baseCurrencyUnitToCents(amount);
    this.withdrawService.createWithdrawRequest(centAmount, iban).subscribe((res: any) => {
      this.pendingWithdrawal = res;
      SpinnerUtil.hideSpinner();
    }, hideSpinnerAndDisplayError);

  }

  burnWithdraw() {
    SpinnerUtil.showSpinner();
    this.withdrawService.generateApproveWithdrawTx(this.pendingWithdrawal.id).subscribe(async (res: any) => {

      let arkaneConnect = new ArkaneConnect('AMPnet', {
        environment: 'staging'
      });

      let account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);

      let sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
        walletId: account.wallets[0].id,
        data: res.tx,
        type: SignatureRequestType.AETERNITY_RAW
      });
      this.broadService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
        .subscribe(res => {
          SpinnerUtil.hideSpinner();
          swal('', 'Success', 'success');
        }, hideSpinnerAndDisplayError);

      SpinnerUtil.hideSpinner();
    }, hideSpinnerAndDisplayError);
  }

  deleteWithdrawal() {
    this.withdrawService.deleteWithdrawal(this.pendingWithdrawal.id).subscribe(res => {
      swal('', 'Success!', 'success');
    }, hideSpinnerAndDisplayError);
  }

}
