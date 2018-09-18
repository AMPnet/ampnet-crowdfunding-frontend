import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-single-proposal-item',
  templateUrl: './single-proposal-item.component.html',
  styleUrls: ['./single-proposal-item.component.css']
})
export class SingleProposalItemComponent implements OnInit {

	@Input() proposal;

  constructor() { }

  ngOnInit() {
  }

}
