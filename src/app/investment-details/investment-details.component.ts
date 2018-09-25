import { Component, OnInit } from '@angular/core';
import { ProposalModel } from '../models/ProposalModel';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'app-investment-details',
  templateUrl: './investment-details.component.html',
  styleUrls: ['./investment-details.component.css']
})
export class InvestmentDetailsComponent implements OnInit {

  constructor() { }

  proposals: ProposalModel[];

  headerImages: string[];

  ngOnInit() {
  	this.proposals = _.fill(Array(5), {
  		name: 'New management position',
			description: 'Open proposal for a new management position with an assigned yealy salary of $45,000',
			positiveVotes: 150,
			negativeVotes: 70,
			allVotesCount: 1200
  	});

    this.headerImages = [
      'https://e2k9ube.cloudimg.io/s/cdn/x/https://edienet.s3.amazonaws.com/news/images/full_36735.jpg?v=14/06/2018%2011:57:00',
      'https://cdn.vox-cdn.com/thumbor/UnmSsVqPjpppVAZd85N1gcDKCSk=/0x0:2600x1875/1200x800/filters:focal(1092x730:1508x1146)/cdn.vox-cdn.com/uploads/chorus_image/image/51570027/wind-solar.0.jpg',
      'https://thumbs-prod.si-cdn.com/Sy5u0b45_ARn9TMaMZ9M9dL2yxg=/800x600/filters:no_upscale()/https://public-media.smithsonianmag.com/filer/f3/8a/f38a1d1a-aaae-4a3c-abed-827596905ef9/istock_000047735718_large.jpg'
    ];
  }

}
