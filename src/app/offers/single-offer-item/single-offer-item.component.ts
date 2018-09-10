import { Component, OnInit, Input } from '@angular/core';
import { OfferModel } from "../OfferModel"


@Component({
  selector: 'app-single-offer-item',
  templateUrl: './single-offer-item.component.html',
  styleUrls: ['./single-offer-item.component.css']
})
export class SingleOfferItemComponent implements OnInit {

	@Input() component: OfferModel;

  constructor() { }

  ngOnInit() {
  
  }

}
