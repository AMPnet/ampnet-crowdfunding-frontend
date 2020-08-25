import { Tag } from './offer-filter/office-filter-model';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as _ from 'underscore';

@Injectable({providedIn: 'root'})
export class OffersFilterServiceService {
    tagsList: Tag[] = [];
    tagsListSubject = new ReplaySubject<Tag[]>();

    removeTag(tag: Tag): void {
        const index = this.tagsList.indexOf(tag);
        if (index >= 0) {
            this.tagsList.splice(index, 1);
        }
        this.activateEmitter();
    }

    addTag(...tags: Tag[]): void {
        const newTagList = this.tagsList.slice();

        if (newTagList.findIndex((item) =>
            item.name === tags[0].name) < 0) {
            newTagList.push(...tags);
        }

        if (!_.isEqual(newTagList, this.tagsList)) {
            this.tagsList = newTagList;
            this.activateEmitter();
        }
    }

    activateEmitter() {
        this.tagsListSubject.next(this.tagsList);
    }
}
