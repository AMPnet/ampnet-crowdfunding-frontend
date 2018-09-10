import { Component, OnInit } from '@angular/core';
import { OfferModel } from './OfferModel';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

	components: OfferModel[];

  constructor() { }

  ngOnInit() {
  	this.components = [
  		{
  			title: "GreenEnergy Co",
				description: "Invest in the coolest green energy solution world can offer",
				offeredBy: "Greenpeace",
				status: "In funding",
				fundingRequired: 25763456,
				currentFunding: 12332567,
				headerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/GreenMountainWindFarm_Fluvanna_2004.jpg/1280px-GreenMountainWindFarm_Fluvanna_2004.jpg"
			},
			{
  			title: "New Falls Solar Plant",
				description: "Invest in the coolest green energy solution world can offer",
				offeredBy: "ZEF",
				status: "In funding",
				fundingRequired: 25763456,
				currentFunding: 12332567,
				headerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/GreenMountainWindFarm_Fluvanna_2004.jpg/1280px-GreenMountainWindFarm_Fluvanna_2004.jpg"
			},
			{
  			title: "Frankenstein Biomass",
				description: "Invest in the coolest green energy solution world can offer",
				offeredBy: "Greenpeace",
				status: "In funding",
				fundingRequired: 25763456,
				currentFunding: 12332567,
				headerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/GreenMountainWindFarm_Fluvanna_2004.jpg/1280px-GreenMountainWindFarm_Fluvanna_2004.jpg"
			},
			{
  			title: "GreenEnergy Co",
				description: "Invest in the coolest green energy solution world can offer",
				offeredBy: "Greenpeace",
				status: "In funding",
				fundingRequired: 25763456,
				currentFunding: 12332567,
				headerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/GreenMountainWindFarm_Fluvanna_2004.jpg/1280px-GreenMountainWindFarm_Fluvanna_2004.jpg"
			}
  	]
  }

}
