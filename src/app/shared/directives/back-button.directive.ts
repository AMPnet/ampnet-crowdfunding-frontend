import { Directive, HostListener } from '@angular/core';
import { BackNavigationService } from '../services/back-navigation.service';

@Directive({
    selector: '[appBackButton]',
})
export class BackButtonDirective {
    constructor(private navigation: BackNavigationService) {
    }

    @HostListener('click')
    onClick(): void {
        this.navigation.back();
    }
}
