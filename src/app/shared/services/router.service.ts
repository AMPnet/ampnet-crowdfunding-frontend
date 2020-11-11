import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CoopPathPipe } from '../pipes/coop-path.pipe';

@Injectable({
    providedIn: 'root'
})
export class RouterService {
    constructor(public router: Router,
                private coopPathPipe: CoopPathPipe) {
    }

    navigateCoop(commands: any[], extras?: NavigationExtras): Promise<boolean> {
        return this.router.navigate([this.coopPathPipe.transform(commands)], extras);
    }
}
