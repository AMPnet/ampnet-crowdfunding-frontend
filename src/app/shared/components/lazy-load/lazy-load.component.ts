import { AfterViewInit, Component, ContentChild, ElementRef, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { enterTrigger } from '../../../animations';

@Component({
    selector: 'app-lazy-load',
    templateUrl: './lazy-load.component.html',
    styleUrls: ['./lazy-load.component.css'],
    animations: [enterTrigger]
})
export class LazyLoadComponent implements AfterViewInit, OnDestroy {
    observer: IntersectionObserver;

    showContent = false;
    @Input() minHeight = 500;
    @ViewChild('wrapper') wrapperEl: ElementRef;
    @ContentChild(TemplateRef) innerTemplate;

    constructor() {
    }

    ngAfterViewInit() {
        this.observer = new IntersectionObserver(this.callback.bind(this));
        this.observer.observe(this.wrapperEl.nativeElement);
    }

    callback(entries, _observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.showContent = true;
                this.observer.disconnect();
                return;
            }
        });
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
