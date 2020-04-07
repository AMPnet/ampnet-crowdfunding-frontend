import { Component, OnInit } from '@angular/core';
import { OfferModel } from './OfferModel';
import * as _ from 'lodash';
import { OffersService } from './offers.service';
import { ProjectModel } from '../projects/create-new-project/project-model';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { ProjectService } from '../projects/project-service';
import { WalletModel } from '../models/WalletModel';
import { ActivatedRoute } from '@angular/router';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  components: OfferModel[];
  featuredComponents: OfferModel[];
  promotedOffer: OfferModel;

  isOverview = false

  constructor(private offersService: OffersService,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) { 

  }

  ngOnInit() {
    this.getAllOffers();
 
    if(this.route.snapshot.params.isOverview) {
      this.isOverview = true
    }

  }

  getAllOffers() {
    SpinnerUtil.showSpinner();

    this.offersService.getAllOffers().subscribe((res: any) => {
      console.log(res)
      let projects: [any] = res.projects;
      console.log(projects)
      this.components = projects.map((proj) => {
        return {
          title: proj.name,
          description: proj.description,
          offeredBy: proj.name,
          fundingRequired: centsToBaseCurrencyUnit(proj.expected_funding),
          currentFunding: 0,
          headerImageUrl: proj.main_image,
          status: "Active",
          endDate: moment(proj.end_date).format("MMM Do, YYYY"),
          offerID: proj.uuid,
          owner: proj.return_on_investment,
          currency: ""
        }
      });
      if(projects.length > 0) {
        this.getProjectBalances(0)

      }
      SpinnerUtil.hideSpinner();
    }, err => {
      console.log(err);
      displayBackendError(err);
      SpinnerUtil.hideSpinner();
    });
  }

  getProjectBalances(index: number) {
    if(index >= this.components.length) { return }
    let component = this.components[index]
    this.projectService.getProjectWallet(component.offerID).subscribe((res: any) =>{
      this.components[index].currentFunding = centsToBaseCurrencyUnit(res.balance)
      this.components[index].currency = res.currency
      this.getProjectBalances(index + 1)
    }, err => {
      displayBackendError(err)
    })
  }

}
