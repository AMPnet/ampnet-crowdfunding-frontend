import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../organization-service';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';

declare var $: any;

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {

  orgWalletInitialized: boolean;
  txData: string;

  txID: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private organizationService: OrganizationService,
    private broadcastService: BroadcastService) { }

  ngOnInit() {
    SpinnerUtil.showSpinner()
    this.fetchDetails(() => {
      this.getOrganizationWallet(() => {
        SpinnerUtil.hideSpinner()
      })
    });
  }

  fetchDetails(onComplete: () => void) {
    let routeParams = this.activeRoute.snapshot.params;
    this.organizationService.getSingleOrganization(routeParams.id).subscribe(res => {
      onComplete();
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

  getOrganizationWallet(onComplete: () => void) {
    let routeParams = this.activeRoute.snapshot.params;
    this.organizationService.getOrganizationWallet(routeParams.id).subscribe(res => {
      this.orgWalletInitialized = true;
      onComplete();
    }, err => {
      if(err.error.err_code == "0501") { // 0501 meaning - "Missing wallet for org"
        this.initializeWalletClicked();
      } else {
        displayBackendError(err);
      }
      onComplete();
    })

  }

  initializeWalletClicked() {
    
    let orgID = this.activeRoute.snapshot.params.id;
    this.organizationService.getTransactionForCreationOfOrgWallet(orgID).subscribe((res: any) => {
      this.orgWalletInitialized = false;
      this.txData = JSON.stringify(res.tx);
      this.txID = res.tx_id;
    }, err => {
      console.log(err);
    })

  }

  signTxClicked() {

    const signed = $("#signedTxData").val();

    this.broadcastService.broadcastSignedTx(signed, this.txID).subscribe(res => {
      alert(JSON.stringify(res));
    }, err => {
      console.log(err);
    })
  }
}
