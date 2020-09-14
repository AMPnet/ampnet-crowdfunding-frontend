import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { log } from 'util';

@Component({
    selector: 'app-action-button',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnDestroy {
    @Input() text: string;
    @Input() loadingText: string;
    @Input() faIcon: string;
    loading = false;
    sub: Subscription;

    @Input() onClick: Observable<any>;

    @HostListener('click')
    click() {
        this.loading = true;
        this.sub = this.onClick.subscribe(() => {}, () => {},
            () => {
                this.loading = false;
                this.ref.detectChanges();
            }
        );
    }

    constructor(private ref: ChangeDetectorRef) {
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
