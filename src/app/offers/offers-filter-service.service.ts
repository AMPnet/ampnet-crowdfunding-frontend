import { Tag } from './offer-filter/office-filter-model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class OffersFilterServiceService {
    tagsList: Tag[] = [];
    tagsListEmitter = new Subject<Tag[]>();

    removeTag(tag: Tag): void {
        const index = this.tagsList.indexOf(tag);
        if (index >= 0) {
            this.tagsList.splice(index, 1);
        }
        this.activateEmitter();
    }

    addTag(tag: Tag): void {
        // Check if tag already on the list
        if (this.tagsList.some((item) => item.name === tag.name)) {
            return;
        }
        this.tagsList.push(tag);
        this.activateEmitter();
    }

    activateEmitter() {
        this.tagsListEmitter.next(this.tagsList);
    }
}
