import { ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-action-button',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonComponent implements OnDestroy {
    @Input() text: string;
    @Input() loadingText: string;
    @Input() faIcon: string;
    @Input() disabled = false;
    @Input() buttonClass = 'btn btn-primary';

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

    ngOnDestroy() {
        if (this.sub !== undefined && !this.sub.closed) {
            this.sub.unsubscribe();
        }
    }
}
