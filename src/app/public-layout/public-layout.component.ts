import { Component } from '@angular/core';
import { RouterService } from '../shared/services/router.service';
import { UserAuthService } from '../shared/services/user/user-auth.service';

@Component({
    selector: 'app-public-layout',
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent {
    constructor(private router: RouterService,
                private userAuthService: UserAuthService) {
        if (this.userAuthService.isLoggedIn()) {
            router.navigate(['/dash']);
        }
    }
}
