import { Component, Input, OnInit } from '@angular/core';
import { OfferDetailDocModel, OfferDetailDocType } from '../../models/OfferDetailDocModel';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { prettyDate } from 'src/app/utilities/date-format-util';
import swal from 'sweetalert2';
import { NewsPreviewService } from 'src/app/shared/services/news-preview.service';
import numeral from 'numeral';
import { centsToBaseCurrencyUnit, prettyCurrency } from 'src/app/utilities/currency-util';
import { Meta } from '@angular/platform-browser';
import { UserService } from 'src/app/shared/services/user/user.service';
import { NewsLink } from '../../manage-projects/manage-single-project/news-link-model';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { Project, ProjectService } from '../../shared/services/project/project.service';

@Component({
    selector: 'app-offer-details',
    templateUrl: './offer-details.component.html',
    styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {
    docs: OfferDetailDocModel[];
    offerModel: Project;
    newsPreviews: NewsLink[];
    fundedPercentage = 0;

    isOverview = false;
    isPortfolio = false;
    userConfirmed = true;
    projectBalance = 0;

    constructor(private projectService: ProjectService,
                private newsPreviewService: NewsPreviewService,
                private walletService: WalletService,
                private route: ActivatedRoute,
                private userService: UserService,
                private meta: Meta) {
    }

    ngOnInit() {
        this.docs = _.fill(Array(5), {
            docType: OfferDetailDocType.PDF,
            title: 'Hello World',
            src: new URL('http://google.com')
        });
        this.getOfferDetails();
        this.newsPreviews = [];

        if (this.route.snapshot.params.isOverview) {
            this.isOverview = true;
        }
        if (this.route.snapshot.params.inPortfolio) {
            this.isPortfolio = true;
        }

        if (!this.isOverview && !this.isPortfolio) {
            SpinnerUtil.showSpinner();
            this.userService.getOwnProfile().subscribe(res => {
                this.userConfirmed = res.verified;
            }, hideSpinnerAndDisplayError);
        }
    }

    setUpNewsPreviews(newsLinks: string[]) {
        newsLinks.forEach(link => {
            this.newsPreviewService.getLinkPreview(link).subscribe(res => {
                this.newsPreviews.push({
                    title: res.title,
                    description: res.description,
                    image: res.image.url,
                    url: link
                });
            });
        });
    }

    prettifyModel(res: Project) {
        this.offerModel = res;
        this.offerModel.start_date = prettyDate(res.start_date);
        this.offerModel.end_date = prettyDate(res.end_date);
        this.offerModel.expected_funding = numeral(centsToBaseCurrencyUnit(res.expected_funding)).format('0,0');
        this.offerModel.currency = prettyCurrency(res.currency);
        this.offerModel.min_per_user = numeral(centsToBaseCurrencyUnit(res.min_per_user)).format('0,0');
        this.offerModel.max_per_user = numeral(centsToBaseCurrencyUnit(res.max_per_user)).format('0,0');
    }

    setMetaTags() {
        this.meta.addTag({
            name: 'og:title',
            content: this.offerModel.name
        });
        this.meta.addTag({
            name: 'og:description',
            content: this.offerModel.description
        });
        this.meta.addTag({
            name: 'og:image:secure_url',
            content: this.offerModel.main_image
        });
        this.meta.addTag({
            name: 'og:url',
            content: window.location.href
        });
    }

    getOfferDetails() {
        SpinnerUtil.showSpinner();
        const offerID = this.route.snapshot.params.id;
        this.projectService.getProject(offerID).subscribe(project => {
            SpinnerUtil.hideSpinner();

            this.prettifyModel(project);
            this.setUpNewsPreviews(this.offerModel.news);
            this.setMetaTags();
            SpinnerUtil.showSpinner();
            this.walletService.getProjectWallet(offerID).subscribe(wallet => {
                // this.offerModel.current_funding = centsToBaseCurrencyUnit(wallet.balance);
                // this.fundedPercentage = 100 * (this.offerModel.current_funding) / (this.offerModel.expected_funding);
                SpinnerUtil.hideSpinner();
            }, hideSpinnerAndDisplayError);
        }, err => {
            SpinnerUtil.hideSpinner();
            if (err.error.err_code === '0851') {
                swal('Pending confirmation',
                    'The project is being verified - this should take up to 5 minutes. Please check later',
                    'info').then(() => {
                    window.history.back();
                });
            } else {
                displayBackendError(err);
            }
        });
    }
}
