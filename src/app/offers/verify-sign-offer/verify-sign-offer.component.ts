import { Component, OnInit, Input } from '@angular/core';
import { ProjectModel } from 'src/app/projects/create-new-project/project-model';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/projects/project-service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import * as QRCode from 'qrcode';
import { OffersService } from '../offers.service';
import { prettyCurrency, baseCurrencyUnitToCents } from 'src/app/utilities/currency-util';
import { API } from 'src/app/utilities/endpoint-manager';
import { ArkaneConnect, SecretType, WindowMode, SignatureRequestType } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-verify-sign-offer',
  templateUrl: './verify-sign-offer.component.html',
  styleUrls: ['./verify-sign-offer.component.css']
})
export class VerifySignOfferComponent implements OnInit {

  constructor(private route: ActivatedRoute, private projectService: ProjectService,
    private offerService: OffersService, private broadcastService: BroadcastService) { }

  projectID: string;
  investAmount: number;


  project: ProjectModel;

  ngOnInit() {
    this.projectID = this.route.snapshot.params.offerID;
    this.investAmount = this.route.snapshot.params.investAmount;
    this.getProject();
  }

  getProject() {
    SpinnerUtil.showSpinner(); 
    this.projectService.getProject(this.projectID).subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      this.project = res;
      this.project.currency = prettyCurrency(res.currency)
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
  }

  verifyAndSign() {
    SpinnerUtil.showSpinner();
    this.offerService.generateTransactionToGreenvest(this.project.uuid, baseCurrencyUnitToCents(this.investAmount))
      .subscribe(async (res: any) => {
        SpinnerUtil.hideSpinner();
        
        let arkaneConnect = new ArkaneConnect("AMPnet", { environment: "production"} )
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
          }, hideSpinnerAndDisplayError)

      }, err => {
        displayBackendError(err);
        SpinnerUtil.hideSpinner();
      });   
  }
}

