import { Component, OnInit } from '@angular/core';
import { SummaryService } from './summary.service';
import { displayBackendError } from '../utilities/error-handler';
import { BlockchainSummary } from './blockchain-summary';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  numberOfUsers: number
  numberOfActiveProjects: number
  blockchainSummary: BlockchainSummary

  constructor(private summaryService: SummaryService) { }

  ngOnInit() {
    this.getActiveProjects()
    this.getUsers()
    this.getBlockchainMiddlewareSummary()
  }

  private getUsers() {
    this.summaryService.getUsers().subscribe((res: any) => {
      console.log(res);
      this.numberOfUsers = res.registered;
    }, err => {
      console.log(err);
      displayBackendError(err);
    });
  }

  private getActiveProjects() {
    this.summaryService.getNumberOfActiveProjects().subscribe((res: any) => {
      console.log(res);
      this.numberOfActiveProjects = res.active_projects;
    }, err => {
      console.log(err);
      displayBackendError(err);
    });
  }

  private getBlockchainMiddlewareSummary() {
    this.summaryService.getBlockchainMiddlewareData().subscribe((res: any) => {
      console.log(res);
      this.blockchainSummary = res
      // this.numberOfFundedProjects = res.numberOfFundedProjects;
      // this.averageProjectSize = res.averageProjectSize;
      // this.averageFundedProjectSize = res.averageFundedProjectSize;
      // this.averageUserInvestment = res.averageUserInvestment;
      // this.totalMoneyRaised = res.totalMoneyRaised;
    }, err => {
      console.log(err);
      displayBackendError(err);
    });
  }
}
