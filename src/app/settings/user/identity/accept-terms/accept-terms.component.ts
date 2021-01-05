import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from '../../../../shared/services/app-config.service';
import { RouterService } from '../../../../shared/services/router.service';

@Component({
    selector: 'app-accept-terms',
    templateUrl: './accept-terms.component.html',
    styleUrls: ['./accept-terms.component.css']
})
export class AcceptTermsComponent {
    acceptTermsForm: FormGroup;

    constructor(private fb: FormBuilder,
                public appConfig: AppConfigService,
                private router: RouterService) {
        this.acceptTermsForm = this.fb.group({
            statute_confirmation: [!this.appConfig.config.config?.coop_statute_url, Validators.requiredTrue]
        });
    }

    goToKYCProvider() {
        this.router.navigate(['/dash/settings/user/identity/veriff'], {state: {termsAccepted: 'accepted'}});
    }
}
