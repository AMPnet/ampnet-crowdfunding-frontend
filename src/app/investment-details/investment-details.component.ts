import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { PortfolioService } from '../my-portfolio/portfolio.service';
import { ActivatedRoute } from '@angular/router';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { InvestmentsInProject } from '../my-portfolio/portfolio.models';
import { prettyDate } from '../utilities/date-format-util';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';
import { ArkaneConnect, SecretType, WindowMode, SignatureRequestType } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-investment-details',
  templateUrl: './investment-details.component.html',
  styleUrls: ['./investment-details.component.css']
})
export class InvestmentDetailsComponent implements OnInit {

  constructor(private portfolioService: PortfolioService,
    private activatedRoute: ActivatedRoute,
    private broadcastService: BroadcastService) { }


  public investment: InvestmentsInProject
  public isCancelable: Boolean

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params.id;

    SpinnerUtil.showSpinner()
    this.portfolioService.getInvestmentsInProject(id).subscribe((res: any) => {
      this.investment = res;
      this.investment.transactions.map((v,i,a) => {
        var newV = v;
        newV.amount = centsToBaseCurrencyUnit(v.amount)
        newV.date = prettyDate(v.date)
        return newV
      })
      this.canCancelInvestment()
      SpinnerUtil.hideSpinner()
    }, hideSpinnerAndDisplayError)
  }

  cancelInvestment() {
    SpinnerUtil.showSpinner()
    this.portfolioService.generateCancelInvestmentTransaction(this.investment.project.uuid)
      .subscribe(async (res: any) => {
        SpinnerUtil.hideSpinner();

        let arkaneConnect = new ArkaneConnect("AMPnet", { environment: "staging"} )
        let acc = await arkaneConnect.flows.getAccount(SecretType.AETERNITY)
        let sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
          walletId: acc.wallets[0].id,
          data: res.tx,
          type: SignatureRequestType.AETERNITY_RAW
        })
        this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
          .subscribe(res => {
            swal("", "Successful investment. Allow up to 5 min for investment to become visible", "success")
            SpinnerUtil.hideSpinner()
          }, err => {
            hideSpinnerAndDisplayError(err)
          });
      }, err => {
        hideSpinnerAndDisplayError(err)
      });
  }

  private canCancelInvestment() {
    if (this.investment.transactions.length > 0) {
      let transaction = this.investment.transactions[0]
      this.portfolioService.isInvestmentCancelable(transaction.to_tx_hash, transaction.from_tx_hash)
        .subscribe((res: any) => {
          this.isCancelable = res.can_cancel
      })
    }
  }
}
