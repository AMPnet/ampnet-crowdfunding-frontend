import { Component, OnInit } from '@angular/core';
import { OfferModel } from './OfferModel';
import { OffersService } from './offers.service';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { displayBackendError } from '../utilities/error-handler';
import * as moment from 'moment';
import { ProjectService } from '../projects/project-service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { centsToBaseCurrencyUnit } from '../utilities/currency-util';
import { OffersFilterServiceService } from './offers-filter-service.service';
import { Tag } from './offer-filter/office-filter-model';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.css'],
    providers: [OffersFilterServiceService]
})
export class OffersComponent implements OnInit {
    isOverview = false;
    components: OfferModel[];
    tags = ['Chip1', 'Chip2', 'Chip3'];
    routeParamsSubscription;

    constructor(private offersService: OffersService,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private router: Router,
                private offersFilterService: OffersFilterServiceService) {
    }

    ngOnInit() {
        this.getAllOffers();

        this.routeParamsSubscription = this.route.queryParams.subscribe(data => {
            console.log(data.tags);
            console.log(data.tags.split(','));

            if (data.tags) {
                const tags = data.tags.split(',').map(tagName => <Tag>{name: tagName});
                this.offersFilterService.addTag(...tags);
            }
        });

        this.offersFilterService.tagsListSubject
            .subscribe(tags => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: {
                        tags: tags.map(tag => tag.name).join(',')
                    },
                    queryParamsHandling: 'merge',
                });
            });

        if (this.route.snapshot.params.isOverview) {
            this.isOverview = true;
        }
        // this.getTagFilteredProjects();
    }

    getAllOffers(tags?: Tag[]) {
        SpinnerUtil.showSpinner();

        this.offersService.getAllOffers(tags).subscribe((res: any) => {
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
                    currency: proj.currency,
                    tags: this.tags // TODO Remove hardcoded
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

    getTagFilteredProjects() {
        this.offersFilterService.tagsListSubject.subscribe(tags => {
            for (let i = 0; i < tags.length; i++) {
                // console.log(tags[i].name);
            }
        });
    }

    getProjectBalances(index: number) {
        if (index >= this.components.length) {
            return;
        }
        const component = this.components[index];
        this.projectService.getProjectWallet(component.offerID).subscribe((res: any) => {
            this.components[index].currentFunding = centsToBaseCurrencyUnit(res.balance);
            this.components[index].currency = res.currency;
            this.getProjectBalances(index + 1);
        }, err => {
            displayBackendError(err);
        });
    }
}
