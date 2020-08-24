import { Component, OnInit } from '@angular/core';
import { Tag } from '@angular/compiler/src/i18n/serializers/xml_helper';
import { OffersFilterServiceService } from '../offers-filter-service.service';
import { ProjectService } from '../../projects/project-service';

@Component({
    selector: 'app-offer-filter',
    templateUrl: './offer-filter.component.html',
    styleUrls: ['./offer-filter.component.css']
})
export class OfferFilterComponent implements OnInit {
    selectable = true;
    removable = true;
    addOnBlur = true;

    tagsList: Tag[] = [];

    constructor(private offersFilterService: OffersFilterServiceService,
                private projectService: ProjectService) {
    }

    remove(tag: Tag): void {
        const index = this.tagsList.indexOf(tag);
        if (index >= 0) {
            this.tagsList.splice(index, 1);
        }
    }

    ngOnInit(): void {
        this.offersFilterService.tagSelected
            .subscribe(tag => {
                if (this.tagsList.some((item) => item.name === tag.name)) {
                    return;
                }
                this.tagsList.push(tag);
                this.projectService.getProjectByTags(this.tagsList)
                    .subscribe(data => {
                        console.log(data);
                    });
            });
    }
}
