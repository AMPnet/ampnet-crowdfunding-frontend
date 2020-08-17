import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { displayErrorMessage } from '../utilities/error-handler';

@Component({
  selector: 'app-revenue-share',
  templateUrl: './revenue-share.component.html',
  styleUrls: ['./revenue-share.component.css']
})
export class RevenueShareComponent implements OnInit {

  projectID: string;
  amount: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchDataFromRoute()
  }

  fetchDataFromRoute() {
    this.projectID = this.route.snapshot.params.projectID;
    this.amount = this.route.snapshot.params.amount;
  }

}
