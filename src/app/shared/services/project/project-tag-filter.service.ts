import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import _ from 'lodash';
import { BackendHttpClient } from '../backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectTagFilterService {

    constructor(private http: BackendHttpClient) {
    }

    tagsList: string[] = [];
    tagsListSubject = new ReplaySubject<string[]>();

    removeTag(tag: string): void {
        const index = this.tagsList.indexOf(tag);
        if (index >= 0) {
            this.tagsList.splice(index, 1);
        }
        this.activateEmitter();
    }

    addTag(...tags: string[]): void {
        const newTagList = this.tagsList.slice();

        if (newTagList.findIndex((item) => item === tags[0]) < 0) {
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
        return this.http.get<ProjectTagsResponse>('/api/project/public/project/tags');
    }

    clearAllTags() {
        this.tagsList = [];
        this.activateEmitter();
    }
}

interface ProjectTagsResponse {
    tags: string[];
}
