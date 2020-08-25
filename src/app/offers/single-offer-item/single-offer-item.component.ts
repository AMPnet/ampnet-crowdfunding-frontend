import { Component, Input, OnInit } from '@angular/core';
import { OfferModel } from '../OfferModel';
import { ActivatedRoute, Router } from '@angular/router';
import { autonumericCurrency, prettyCurrency } from 'src/app/utilities/currency-util';
import { OffersFilterServiceService } from '../offers-filter-service.service';
import { Tag } from '../offer-filter/office-filter-model';
import { ProjectService } from 'src/app/shared/services/project/project.service';

@Component({
    selector: 'app-single-offer-item',
    templateUrl: './single-offer-item.component.html',
    styleUrls: ['./single-offer-item.component.css'],
})
export class SingleOfferItemComponent implements OnInit {
    @Input() public component: OfferModel;

    constructor(private router: Router,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private offersFilterService: OffersFilterServiceService) {
    }

    ngOnInit() {
        this.component.currency = prettyCurrency(this.component.currency);
        if (this.component.headerImageUrl === null) {
            this.component.headerImageUrl = '../../../assets/noimage.png';
        }
        setTimeout(() => {
            autonumericCurrency('.req-funding-' + this.component.offerID);
        }, 300);
    }

    onClickedItem() {
        if (this.route.snapshot.params.isOverview) {
            this.router.navigate(['overview', this.component.offerID, 'discover']);
        } else {
            this.router.navigate(['dash', 'offers', this.component.offerID]);
        }
    }

    onOfferTagClicked(tagName: string) {
        const selectedTag: Tag = {name: tagName};
        this.offersFilterService.addTag(selectedTag);
    }
}
