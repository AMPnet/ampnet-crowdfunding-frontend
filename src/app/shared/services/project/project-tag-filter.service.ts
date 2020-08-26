import { Injectable } from '@angular/core';
import { Tag } from '../../components/project-tag-filter/project-tag-filter.component';
import { ReplaySubject } from 'rxjs';
import _ from 'lodash';
import { BackendHttpClient } from '../backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectTagFilterService {

    constructor(private http: BackendHttpClient) {
    }

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

    getAllProjectTags() {
        return this.http.get<ProjectTagsResponse>('/api/project/public/project/tags')
            .subscribe(data => {
                for (let i = 0; i < data.tags.length; i++) {
                    const tag = data[i].name;
                    this.addTag(tag);
                }
            });
    }
}

interface ProjectTagsResponse {
    tags: string[];
}
