import { Component, OnInit } from '@angular/core';
import { SummaryService } from './summary.service';
import { displayBackendError, hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { BlockchainSummary } from './blockchain-summary';
import { SpinnerUtil } from '../utilities/spinner-utilities';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  numberOfUsers: number = 0;
  numberOfActiveProjects: number = 0;
  blockchainSummary: BlockchainSummary = {
    average_funded_project_size: 0,
    average_project_size: 0,
    average_user_investment: 0,
    number_of_funded_projects: 0,
    total_money_raised: 0
  };
  completedRequests = 0;

  constructor(private summaryService: SummaryService) {
  }

  ngOnInit() {
    this.getActiveProjects();
    this.getUsers();
    this.getBlockchainMiddlewareSummary();
  }

  private getUsers() {
    SpinnerUtil.showSpinner();
    this.summaryService.getUsers().subscribe((res: any) => {
      console.log(res);
      this.numberOfUsers = res.registered;
      this.completedRequests += 1;
      SpinnerUtil.hideSpinner();
    }, hideSpinnerAndDisplayError);
  }

  private getActiveProjects() {
    SpinnerUtil.showSpinner();
    this.summaryService.getNumberOfActiveProjects().subscribe((res: any) => {
      this.numberOfActiveProjects = res.active_projects;
      this.completedRequests += 1;
      SpinnerUtil.hideSpinner();
    }, hideSpinnerAndDisplayError);
  }

  private getBlockchainMiddlewareSummary() {
    SpinnerUtil.showSpinner();
    this.summaryService.getBlockchainMiddlewareData().subscribe((res: any) => {
      SpinnerUtil.hideSpinner();
      this.completedRequests += 1;
      this.blockchainSummary = res;
      // this.numberOfFundedProjects = res.numberOfFundedProjects;
      // this.averageProjectSize = res.averageProjectSize;
      // this.averageFundedProjectSize = res.averageFundedProjectSize;
      // this.averageUserInvestment = res.averageUserInvestment;
      // this.totalMoneyRaised = res.totalMoneyRaised;
    }, hideSpinnerAndDisplayError);
  }
}
