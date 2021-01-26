import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'button[app-action-button]',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent implements OnInit, OnDestroy {
    @Input() text: string;
    @Input() loadingText: string;
    @Input() faIcon: IconProp;
    @Input() textShort: string;
    @Input() spinnerColor = 'white';

    @Input() onClick: () => Observable<unknown>;

    @Input() class: string;
    @Input() disabled: boolean;

    loading = false;
    sub: Subscription;

    @HostBinding('class') get buttonClass() {
        return this.class || 'btn btn-primary';
    }

    @HostBinding('disabled') get buttonDisabled() {
        return this.disabled || this.loading;
    }

    @HostListener('click')
    click() {
        if (this.buttonDisabled) {
            return;
        }

        this.loading = true;
        this.sub = this.onClick()
            .pipe(finalize(() => this.loading = false))
            .subscribe();
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
