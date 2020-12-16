import { Component } from '@angular/core';
import { RouterService } from '../shared/services/router.service';
import { UserService } from '../shared/services/user/user.service';

@Component({
    selector: 'app-public-layout',
    templateUrl: './public-layout.component.html',
    styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent {
    constructor(private router: RouterService,
                private userService: UserService) {
        if (this.userService.isLoggedIn()) {
            router.navigate(['/dash']);
        }
    }
}
