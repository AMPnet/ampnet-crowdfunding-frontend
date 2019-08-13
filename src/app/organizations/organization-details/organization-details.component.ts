import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../organization-service';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import * as QRCode from 'qrcode';
import swal from 'sweetalert2';
import { OrganizationModel } from './organization-model';
import { WalletModel } from './organization-model';
import { MemberModel } from '../member-model';
import { API } from 'src/app/utilities/endpoint-manager';

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
  organization: OrganizationModel;
  orgWallet: WalletModel;
  emailInviteInput: any;
  orgMembers: MemberModel[];

  constructor(
    private activeRoute: ActivatedRoute,
    private organizationService: OrganizationService,
    private broadcastService: BroadcastService) { }

  ngOnInit() {
    SpinnerUtil.showSpinner()
    this.fetchDetails(() => {
      this.getOrganizationWallet(() => {
        SpinnerUtil.hideSpinner()
      });
      this.getOrgMembers();
    });

  }

  fetchDetails(onComplete: () => void) {
    let routeParams = this.activeRoute.snapshot.params;
    this.organizationService.getSingleOrganization(routeParams.id).subscribe((res: OrganizationModel) => {
      this.organization = res;
      onComplete();
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

  getOrganizationWallet(onComplete: () => void) {
    let routeParams = this.activeRoute.snapshot.params;
    this.organizationService.getOrganizationWallet(routeParams.id).subscribe((res: WalletModel) => {
      this.orgWallet = res
      onComplete();
    }, err => {
      if(err.status == "404") { // Organization wallet doesn't exist
        this.initializeWalletClicked();
      } else if(err.error.err_code == "0851") {
        swal("", "The organization is being created. This can take up to a minute. Please check again later.", "info").then(() => {
          window.history.back()
        })
      } else {
        displayBackendError(err);
      }
      onComplete();
    });
  }

  initializeWalletClicked() {
    let orgID = this.activeRoute.snapshot.params.id;
    this.organizationService.getTransactionForCreationOfOrgWallet(orgID).subscribe((res: any) => {

      this.orgWalletInitialized = false;
      this.txData = JSON.stringify(res.tx);
      this.txID = res.tx_id;

      var qrCodeData = {
        "tx_data" : res,
        "base_url": API.APIURL
      }

      console.log(res)
      
      QRCode.toCanvas(document.getElementById("pairing-code"), JSON.stringify(qrCodeData), (err) => {
        if(err) { alert(err) }
      });

    }, err => {
      displayBackendError(err);
    });
  }


  inviteClicked() {
    SpinnerUtil.showSpinner();
    let email = $("#email-invite-input").val();
    this.organizationService.inviteUser(this.organization.id, email).subscribe(res => {
      SpinnerUtil.hideSpinner();
      swal("Success", "Successfully invited user to organization", "success");
    }, err => {
      console.log(err);
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
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

  getOrgMembers() {
    SpinnerUtil.showSpinner();
    this.organizationService.getMembersForOrganization(this.organization.id).subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      let members: MemberModel[] = res.members;
      this.orgMembers = members;
    }, err => {
      displayBackendError(err);
    })
  }
}
