import { Component, OnInit } from '@angular/core';
import { OfferModel } from './OfferModel';
import * as _ from 'lodash';
import { OffersService } from './offers.service';
import { ProjectModel } from '../projects/create-new-project/project-model';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  components: OfferModel[];
  featuredComponents: OfferModel[];
  promotedOffer: OfferModel;

  constructor(private offersService: OffersService) { }

  ngOnInit() {
    // this.featuredComponents = _.fill(Array(3),
    // {
    //   title: 'GreenEnergy Co',
    //   description: 'Invest in the coolest green energy solution world can offerAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga',
    //   offeredBy: 'Greenpeace',
    //   status: 'In funding',
    //   fundingRequired: 25763456,
    //   currentFunding: 12332567,
    //   headerImageUrl: 'https://bit.ly/2QmyQ5E'
    // }
    // );
    // this.components = _.fill(Array(20),
    // {
    //   title: 'GreenEnergy Co',
    //   description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    //   offeredBy: 'Greenpeace',
    //   status: 'In funding',
    //   fundingRequired: 25763456,
    //   currentFunding: 12332567,
    //   headerImageUrl: 'https://bit.ly/2QmyQ5E'
    // }
    // );
    // this.promotedOffer = {
    //   title: 'ORB Wind Power',
    //   description: 'Cutting edge wind farm on the shores of Netherlands',
    //   offeredBy: 'Greenpeace',
    //   status: 'In funding',
    //   fundingRequired: 23492349,
    //   currentFunding: 11334578,
    //   headerImageUrl: '../../assets/wind-farm.png'
    // };
    this.getAllOffers();
  }

  // title: string;
  // description: string;
  // offeredBy: string;
  // status: string;
  // fundingRequired: number;
  // currentFunding: number;
  // headerImageUrl: string;

  getAllOffers() {
    SpinnerUtil.showSpinner();

    this.offersService.getAllOffers().subscribe((res: any) => {
      let projects: [ProjectModel] = res.projects;
      this.components = projects.map((proj) => {
        return {
          title: proj.name,
          description: proj.description,
          offeredBy: proj.name,
          fundingRequired: proj.expected_funding,
          currentFunding: 1000,
          headerImageUrl: proj.main_image,
          status: "Active",
          endDate: proj.end_date,
          offerID: proj.id
        }
      });
      SpinnerUtil.hideSpinner();
    }, err => {
      console.log(err);
      displayBackendError(err);
      SpinnerUtil.hideSpinner();
    });
  }

}
