import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfigService, KYCProvider } from '../../../../shared/services/app-config.service';
import { RouterService } from '../../../../shared/services/router.service';

@Component({
    selector: 'app-accept-terms',
    templateUrl: './accept-terms.component.html',
    styleUrls: ['./accept-terms.component.css']
})
export class AcceptTermsComponent {
    acceptTermsForm: FormGroup;

    constructor(private fb: FormBuilder,
                private router: RouterService,
                public appConfig: AppConfigService) {
        this.acceptTermsForm = this.fb.group({
            statute_confirmation: [!this.appConfig.config.config?.coop_statute_url, Validators.requiredTrue]
        });
    }

    goToKYCProvider() {
        let relRelativePath: string;
        switch (this.appConfig.config.kyc_provider) {
            case KYCProvider.VERIFF:
                relRelativePath = 'veriff';
                break;
            case KYCProvider.IDENTYUM:
                relRelativePath = 'identyum';
                break;
            default:
                relRelativePath = 'veriff';
        }

        this.router.navigate([`/dash/settings/user/identity/${relRelativePath}`],
            {state: {termsAccepted: 'accepted'}});
    }
}
