import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProjectTagFilterService } from '../../services/project/project-tag-filter.service';

export interface Tag {
    name: string;
}

@Component({
    selector: 'app-chips-filter',
    templateUrl: './project-tag-filter.component.html',
    styleUrls: ['./project-tag-filter.component.css']
})


export class ProjectTagFilterComponent implements OnInit {
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    tagsCtrl = new FormControl();
    filteredTags: Observable<string[]>;
    tags: string[] = ['Lemon'];
    allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
    projectTags: string[];

    tagsList: Tag[] = [];

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor(private projectTagFilterService: ProjectTagFilterService) {
        this.filteredTags = this.tagsCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
    }

    remove(tag: Tag): void {
        this.projectTagFilterService.removeTag(tag);
    }

    ngOnInit(): void {
        this.getFilterTags();
    }

    getFilterTags(): void {
        this.projectTagFilterService.tagsListSubject.subscribe(tags => {
            this.tagsList = [];
            // @ts-ignore
            this.tagsList.push(...tags);
        });
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.tags.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.tagsCtrl.setValue(null);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.tags.push(event.option.viewValue);
        this.tagInput.nativeElement.value = '';
        this.tagsCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allTags.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
    }
}

