import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { RouterService } from '../services/router.service';


@Directive({
    selector: '[appBackNavigation]',
})
export class BackNavigationDirective {
    constructor(private location: Location,
                private router: RouterService) {
    }

    @HostListener('click')
    onClick(): void {
        this.isFirstNavigation ? this.router.navigate(['/']) : this.location.back();
    }

    get isFirstNavigation(): boolean {
        return !(this.location.getState()?.['navigationId'] > 1);
    }
}
