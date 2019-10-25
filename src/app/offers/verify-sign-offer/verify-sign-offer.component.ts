import { Component, OnInit, Input } from '@angular/core';
import { ProjectModel } from 'src/app/projects/create-new-project/project-model';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/projects/project-service';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import * as QRCode from 'qrcode';
import { OffersService } from '../offers.service';
import { prettyCurrency } from 'src/app/utilities/currency-util';
import { API } from 'src/app/utilities/endpoint-manager';

@Component({
  selector: 'app-verify-sign-offer',
  templateUrl: './verify-sign-offer.component.html',
  styleUrls: ['./verify-sign-offer.component.css']
})
export class VerifySignOfferComponent implements OnInit {

  constructor(private route: ActivatedRoute, private projectService: ProjectService,
    private offerService: OffersService) { }

  projectID: number;
  investAmount: number;

  approveQRData = ""
  confirmQRData = ""

  clicked: boolean;

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

  generateInvestmentCode() {
    this.clicked = true
    SpinnerUtil.showSpinner();
    this.offerService.generateTransactionToGreenvest(this.project.id, this.investAmount)
      .subscribe((res: any) => {
        SpinnerUtil.hideSpinner();
        
        var txData = {
          "base_url": API.APIURL,
          "tx_data" : res
        }

        this.approveQRData = JSON.stringify(txData)

      }, err => {
        displayBackendError(err);
        SpinnerUtil.hideSpinner();
      });    
  }

  approveBroadcasted(id: String) {
    
  }
}

// this.offerService.generateTransactionToConfirmGreenvest(this.project.id).subscribe(res => {
//   SpinnerUtil.hideSpinner();
  
//   var txData = {
//     "base_url": API.APIURL,
//     "tx_data": res
//   }
//   this.confirmQRData = JSON.stringify(txData)

// }, displayBackendError)