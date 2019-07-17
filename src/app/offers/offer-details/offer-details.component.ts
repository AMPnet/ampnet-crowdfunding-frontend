import { Component, OnInit } from '@angular/core';
import { OfferDetailDocModel, OfferDetailDocType } from '../../models/OfferDetailDocModel';
import * as _ from 'lodash';
import { OffersService } from '../offers.service';
import { ActivatedRoute } from '@angular/router';
import { OfferModel } from '../OfferModel';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';



@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  docs: OfferDetailDocModel[];

  offerModel: SingleOfferModel;

  constructor(private offerService: OffersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.docs = _.fill(Array(5), {
      docType: OfferDetailDocType.PDF,
      title: 'Hello World',
      src: new URL('http://google.com')
    });
    this.getOfferDetails();
  }

  getOfferDetails() {
    SpinnerUtil.showSpinner();
    let offerID = this.route.snapshot.params.id;
    this.offerService.getOfferByID(offerID).subscribe((res: SingleOfferModel) => {
      SpinnerUtil.hideSpinner();
      if(res.current_funding == undefined) { res.current_funding = 0 }
      this.offerModel = res;
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

}
