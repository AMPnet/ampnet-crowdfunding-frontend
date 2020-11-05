import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
    user$ = this.userService.user$;

    constructor(private userService: UserService) {
    }
}
