import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';

// TODO: see if this component is even used.
@Component({
    selector: 'app-complete-onboarding',
    templateUrl: './complete-onboarding.component.html',
    styleUrls: ['./complete-onboarding.component.css']
})
export class CompleteOnboardingComponent implements OnInit {
    isVerified: boolean;
    hasWallet: boolean;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.user$.subscribe(user => {
            this.isVerified = user.verified;
        });
    }
}
