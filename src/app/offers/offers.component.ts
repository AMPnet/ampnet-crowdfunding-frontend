import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferModel } from './OfferModel';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { ProjectService } from '../shared/services/project/project.service';
import { SubSink } from 'subsink';
import { ProjectTagFilterService } from '../shared/services/project/project-tag-filter.service';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.css'],
})
export class OffersComponent implements OnInit, OnDestroy {
    private subs: SubSink;
    components: OfferModel[];
    featuredComponents: OfferModel[];
    promotedOffer: OfferModel;
    isOverview = false;
    hasTags = false;

    constructor(private projectService: ProjectService,
                private walletService: WalletService,
                private route: ActivatedRoute,
                private router: Router,
                private projectTagFilterService: ProjectTagFilterService) {
    }

    ngOnInit() {
        this.projectTagFilterService.activateEmitter();
        this.subs = new SubSink();
        this.subs.sink = this.route.queryParams.subscribe(data => {
            console.log('ngOnInit() data: ', data);
            if (data.tags) {
                const tags = data.tags.split(',');
                console.log('tagsInQueryParams: ', tags);
                this.projectTagFilterService.addTags(...tags);
                console.log('projectTagFilterService.tagsList: ', this.projectTagFilterService.tagsList);
            }
        });

        this.subs.sink = this.projectTagFilterService.tagsListSubject
            .subscribe(tags => {
                console.log('tagsListSubject.subscribe tags: ', tags);
                const queryParams: { [key: string]: string } = {};
                if (tags.length !== 0) {
                    queryParams.tags = tags.join(',');
                    this.hasTags = true;
                } else {
                    this.hasTags = false;
                }
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: queryParams
                });
                this.getAllOffers(tags);
            });

        if (this.route.snapshot.params.isOverview) {
            this.isOverview = true;
        }
    }

    getAllOffers(tags?: string[]) {
        console.log('getAllOffers() tags: ', tags);
        SpinnerUtil.showSpinner();

        if (tags === undefined) {
            tags = [];
        }

        this.projectService.getAllActiveProjects(tags).subscribe(res => {
            const projects = res.projects;
            this.components = projects.map((proj) => {
                return {
                    offerID: proj.uuid,
                    title: proj.name,
                    description: proj.description,
                    offeredBy: proj.name,
                    status: 'Active',
                    fundingRequired: centsToBaseCurrencyUnit(proj.expected_funding),
                    currentFunding: 0,
                    headerImageUrl: proj.main_image,
                    endDate: moment(proj.end_date).format('MMM Do, YYYY'),
                    owner: '',
                    currency: '',
                    tags: proj.tags
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
        this.walletService.getProjectWallet(component.offerID).subscribe(res => {
            this.components[index].currentFunding = centsToBaseCurrencyUnit(res.balance);
            this.components[index].currency = res.currency;
            this.getProjectBalances(index + 1);
        }, err => {
            displayBackendError(err);
        });
    }

    ngOnDestroy(): void {
        this.projectTagFilterService.clearAllTags();
        this.subs.unsubscribe();
        console.log('unsubscribe');
    }
}
