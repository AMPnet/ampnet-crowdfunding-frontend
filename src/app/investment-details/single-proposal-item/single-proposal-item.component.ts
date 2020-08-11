import { Component, Input, OnInit } from '@angular/core';
import { ProposalModel } from '../../models/ProposalModel';

@Component({
    selector: 'app-single-proposal-item',
    templateUrl: './single-proposal-item.component.html',
    styleUrls: ['./single-proposal-item.component.css']
})
export class SingleProposalItemComponent implements OnInit {

    @Input() public proposal: ProposalModel;

    constructor() {
    }

    ngOnInit() {
    }

}
