import { ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-action-button',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonComponent implements OnInit, OnDestroy {
    @Input() text: string;
    @Input() loadingText: string;
    @Input() faIcon: string;
    @Input() disabled = false;
    @Input() buttonClass = 'btn btn-primary';
    @Input() textShort: string;
    @Input() spinnerColor = 'white';

    loading = false;
    sub: Subscription;

    @Input() onClick: () => Observable<any>;

    @HostListener('click')
    click() {
        if (this.disabled || this.loading) {
            return;
        }

        this.loading = true;
        this.sub = this.onClick().subscribe(
            () => this.loading = false,
            () => this.loading = false,
            () => this.loading = false,
        );
    }

    constructor() {
    }

    ngOnInit() {
        this.loadingText = this.loadingText !== undefined ? this.loadingText : this.text;
        this.textShort = this.textShort !== undefined ? this.textShort : this.text;
    }

    ngOnDestroy() {
        if (this.sub !== undefined && !this.sub.closed) {
            this.sub.unsubscribe();
        }
    }
}
