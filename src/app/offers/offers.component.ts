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

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  components: OfferModel[];
  featuredComponents: OfferModel[];
  promotedOffer: OfferModel;

  constructor(private offersService: OffersService,
    private projectService: ProjectService) { }

  ngOnInit() {
    this.getAllOffers();
  }

  getAllOffers() {
    SpinnerUtil.showSpinner();

    this.offersService.getAllOffers().subscribe((res: any) => {
      let projects: [ProjectModel] = res.projects;
      console.log(projects)
      this.components = projects.map((proj) => {
        return {
          title: proj.name,
          description: proj.description,
          offeredBy: proj.name,
          fundingRequired: numeral(proj.expected_funding).format("0,0"),
          currentFunding: 0,
          headerImageUrl: proj.main_image,
          status: "Active",
          endDate: moment(proj.end_date).format("MMM Do, YYYY"),
          offerID: proj.id,
          owner: "Cooperative for Ethical Financing",
          currency: proj.currency
        }
      });
      this.getProjectBalances(0)
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
      this.components[index].currentFunding = res.balance
      this.getProjectBalances(index + 1)
    }, err => {
      displayBackendError(err)
    })
  }

}
