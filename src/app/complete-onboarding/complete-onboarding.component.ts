import { Component, OnInit } from '@angular/core';
import { UserStatusStorage } from '../user-status-storage';
import { UserService } from '../shared/services/user/user.service';

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
        this.hasWallet = UserStatusStorage.walletData !== undefined;
    }
}
