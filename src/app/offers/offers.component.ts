import { Component, OnInit } from '@angular/core';
import { OfferModel } from './OfferModel';
import * as _ from 'lodash';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  components: OfferModel[];
  featuredComponents: OfferModel[];
  promotedOffer: OfferModel;

  constructor() { }

  ngOnInit() {
    this.featuredComponents = _.fill(Array(3),
    {
      title: 'GreenEnergy Co',
      description: 'Invest in the coolest green energy solution world can offer',
      offeredBy: 'Greenpeace',
      status: 'In funding',
      fundingRequired: 25763456,
      currentFunding: 12332567,
      headerImageUrl: 'https://bit.ly/2QmyQ5E'
    }
    );
    this.components = _.fill(Array(20),
    {
      title: 'GreenEnergy Co',
      description: 'Invest in the coolest green energy solution world can offer',
      offeredBy: 'Greenpeace',
      status: 'In funding',
      fundingRequired: 25763456,
      currentFunding: 12332567,
      headerImageUrl: 'https://bit.ly/2QmyQ5E'
    }
    );
    this.promotedOffer = {
      title: 'ORB Wind Power',
      description: 'Cutting edge wind farm on the shores of Netherlands',
      offeredBy: 'Greenpeace',
      status: 'In funding',
      fundingRequired: 23492349,
      currentFunding: 11334578,
      headerImageUrl: '../../assets/wind-farm.png'
    };
  }

}
