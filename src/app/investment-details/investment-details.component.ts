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

  public proposals: ProposalModel[];

  public headerImages: string[];

  ngOnInit() {
    this.proposals = _.fill(Array(5), {
      name: 'New management position',
      description: 'Open proposal for a new management position with an assigned yealy salary of $45,000',
      positiveVotes: 150,
      negativeVotes: 70,
      allVotesCount: 1200
    });

    this.headerImages = [
    'https://bit.ly/2IdFJCR',
    'https://bit.ly/2NFtlS8',
    'https://bit.ly/2Q6vDGN'
    ];
  }

}
