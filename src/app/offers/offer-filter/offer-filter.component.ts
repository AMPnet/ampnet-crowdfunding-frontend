import { Component, OnInit } from '@angular/core';
import { Tag } from '@angular/compiler/src/i18n/serializers/xml_helper';
import { OffersFilterServiceService } from '../offers-filter-service.service';

@Component({
    selector: 'app-offer-filter',
    templateUrl: './offer-filter.component.html',
    styleUrls: ['./offer-filter.component.css']
})
export class OfferFilterComponent implements OnInit {
    selectable = true;
    removable = true;
    tagsList: Tag[] = [];

    constructor(private offersFilterService: OffersFilterServiceService) {
    }

    remove(tag: Tag): void {
        this.offersFilterService.removeTag(tag);
    }

    ngOnInit(): void {
        this.getFilterTags();
    }

    getFilterTags(): void {
        this.offersFilterService.tagsListSubject.subscribe(tags => {
            this.tagsList = [];
            // @ts-ignore
            this.tagsList.push(...tags);
        });
    }
}
