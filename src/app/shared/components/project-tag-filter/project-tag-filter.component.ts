import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProjectTagFilterService } from '../../services/project/project-tag-filter.service';

@Component({
    selector: 'app-chips-filter',
    templateUrl: './project-tag-filter.component.html',
    styleUrls: ['./project-tag-filter.component.css']
})


export class ProjectTagFilterComponent implements OnInit, OnDestroy {
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    tagsCtrl = new FormControl();
    filteredTags: Observable<string[]>;
    projectTags: string[] = [];
    allTags: string[] = [];

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor(private projectTagFilterService: ProjectTagFilterService) {
        this.filteredTags = this.tagsCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
    }

    remove(tag: string): void {
        this.projectTagFilterService.removeTag(tag);
    }

    ngOnInit(): void {
        this.getAllTags();
        this.getSelectedProjectTags();
    }

    getAllTags(): void {
        this.projectTagFilterService.getAllProjectTags()
            .subscribe(data => {
                this.allTags.push(...data.tags);
            });
    }

    getSelectedProjectTags(): void {
        this.projectTagFilterService.tagsListSubject.subscribe(tags => {
            this.projectTags = [];
            this.projectTags.push(...tags);
        });
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add tag
        if ((value || '').trim()) {
            this.projectTagFilterService.addTag(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.tagsCtrl.setValue(null);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.projectTagFilterService.addTag(event.option.viewValue);
        this.tagInput.nativeElement.value = '';
        this.tagsCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
    }

    ngOnDestroy(): void {
        this.projectTagFilterService.clearAllTags();
    }
}
