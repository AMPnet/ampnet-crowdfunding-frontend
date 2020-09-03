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

    projectTags: string[] = [];
    tagsListSubject = new ReplaySubject<string[]>(1);

    removeTag(tag: string): void {
        this.projectTags = this.projectTags.filter(currentTag => currentTag !== tag);
        this.activateEmitter();
    }

    addTags(...tags: string[]): void {
        const newTagList = this.projectTags.slice();

        if (newTagList.findIndex((item) => item === tags[0]) < 0) {
            newTagList.push(...tags);
        }

        if (!_.isEqual(newTagList, this.projectTags)) {
            this.projectTags = newTagList;
            this.activateEmitter();
        }
    }

    activateEmitter() {
        console.log('activateEmitter()');
        this.tagsListSubject.next(this.projectTags);
    }

    getAllProjectTags() {
        return this.http.get<ProjectTagsResponse>('/api/project/public/project/tags');
    }

    clearAllTags() {
        console.log('clearAllTags()');
        this.projectTags = [];
        this.activateEmitter();
    }
}

interface ProjectTagsResponse {
    tags: string[];
}
