import { Component, OnInit } from '@angular/core';
import { OfferModel } from './OfferModel';
import { OffersService } from '../shared/services/project/offers.service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import * as moment from 'moment';
import { ProjectService } from '../shared/services/project/project-service';
import { ActivatedRoute } from '@angular/router';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';
import { WalletService } from '../shared/services/wallet/wallet.service';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

    components: OfferModel[];
    featuredComponents: OfferModel[];
    promotedOffer: OfferModel;

    isOverview = false;

    constructor(private offersService: OffersService,
                private walletService: WalletService,
                private route: ActivatedRoute
    ) {

    }

    ngOnInit() {
        this.getAllOffers();

        if (this.route.snapshot.params.isOverview) {
            this.isOverview = true;
        }
    }

    getAllOffers() {
        SpinnerUtil.showSpinner();

        this.offersService.getAllOffers().subscribe((res: any) => {
            const projects: [any] = res.projects;
            this.components = projects.map((proj) => {
                return {
                    title: proj.name,
                    description: proj.description,
                    offeredBy: proj.name,
                    fundingRequired: centsToBaseCurrencyUnit(proj.expected_funding),
                    currentFunding: 0,
                    headerImageUrl: proj.main_image,
                    status: 'Active',
                    endDate: moment(proj.end_date).format('MMM Do, YYYY'),
                    offerID: proj.uuid,
                    owner: proj.return_on_investment,
                    currency: ''
                };
            });
            if (projects.length > 0) {
                this.getProjectBalances(0);

            }
            SpinnerUtil.hideSpinner();
        }, err => {
            displayBackendError(err);
            SpinnerUtil.hideSpinner();
        });
    }

    getProjectBalances(index: number) {
        if (index >= this.components.length) {
            return;
        }
        const component = this.components[index];
        this.walletService.getProjectWallet(component.offerID).subscribe((res: any) => {
            this.components[index].currentFunding = centsToBaseCurrencyUnit(res.balance);
            this.components[index].currency = res.currency;
            this.getProjectBalances(index + 1);
        }, err => {
            displayBackendError(err);
        });
    }

}
