import { EventEmitter } from '@angular/core';
import { Tag } from './offer-filter/office-filter-model';

export class OffersFilterServiceService {
    tagSelected = new EventEmitter<Tag>();
}
