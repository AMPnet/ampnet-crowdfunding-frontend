import { Component, OnInit, Input } from '@angular/core';
import { OfferModel } from '../OfferModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-offer-item',
  templateUrl: './single-offer-item.component.html',
  styleUrls: ['./single-offer-item.component.css']
})
export class SingleOfferItemComponent implements OnInit {

  @Input() component: OfferModel;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  onClickedItem() {
    this.router.navigate(['dash', 'offer_details']);
  }

}
