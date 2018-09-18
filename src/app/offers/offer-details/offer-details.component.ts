import { Component, OnInit } from '@angular/core';
import { OfferDetailDocModel, OfferDetailDocType } from '../../models/OfferDetailDocModel'
import * as _ from 'lodash';

declare var feather: any;

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

	docs: OfferDetailDocModel[];

  constructor() { }

  ngOnInit() {
  	feather.replace()
  	this.docs = _.fill(Array(5), {
  		docType: OfferDetailDocType.PDF,
  		title: "Hello World",
  		src: new URL("http://google.com")
  	});
  }

}
