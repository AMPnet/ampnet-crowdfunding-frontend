import { Component, OnInit } from '@angular/core';
import { OfferDetailDocModel, OfferDetailDocType } from '../../models/OfferDetailDocModel';
import * as _ from 'lodash';
import { OffersService } from '../offers.service';
import { ActivatedRoute } from '@angular/router';
import { OfferModel } from '../OfferModel';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { ProjectService } from 'src/app/projects/project-service';
import * as moment from 'moment';
import { prettyDate } from 'src/app/utilities/date-format-util';
import swal from 'sweetalert2';
import { NewsPreviewService } from 'src/app/news-preview/news-preview.service';
import * as numeral from 'numeral';
import { prettyCurrency } from 'src/app/utilities/currency-util';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  docs: OfferDetailDocModel[];

  offerModel: SingleOfferModel;

  newsPreviews: NewsLink[];

  constructor(private offerService: OffersService, private newsPreviewService: NewsPreviewService, private projectService: ProjectService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.docs = _.fill(Array(5), {
      docType: OfferDetailDocType.PDF,
      title: 'Hello World',
      src: new URL('http://google.com')
    });
    this.getOfferDetails();
    this.newsPreviews = [];
  }

  setUpNewsPreviews(newsLinks: string[]) {

    console.log(newsLinks);

    newsLinks.forEach(link => {
      this.newsPreviewService.getLinkPreview(link).subscribe((res: any) => {
        console.log(res);
        this.newsPreviews.push({
          title: res.title,
          description: res.description,
          image: res.image.url,
          url: link
        });
      }, console.log )
    });
  }

  linkClicked(url: string) {
    window.location.href = url;
  }

  prettifyModel(res: SingleOfferModel) {
    this.offerModel = res;
    this.offerModel.start_date = prettyDate(res.start_date);
    this.offerModel.end_date = prettyDate(res.end_date);
    this.offerModel.expected_funding = numeral(res.expected_funding).format("0,0");
    this.offerModel.currency = prettyCurrency(res.currency);
    this.offerModel.investor_count = numeral(1270).format("0,0");
  }

  getOfferDetails() {
    SpinnerUtil.showSpinner();
    let offerID = this.route.snapshot.params.id;
    this.offerService.getOfferByID(offerID).subscribe((res: SingleOfferModel) => {
      SpinnerUtil.hideSpinner();

      if(res.current_funding == undefined) { res.current_funding = 0 }
      this.prettifyModel(res);
      this.setUpNewsPreviews(this.offerModel.news);

    }, err => {
      SpinnerUtil.hideSpinner();
      console.log(err);
      if(err.error.err_code == "0851") {
        swal("Pending confirmation", "The project is being verified - this should take up to 5 minutes. Please check later", "info").then(() => {
          window.history.back();
        });
      } else {
        displayBackendError(err);
      }
    });
  }

}
