import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';
import swal from 'sweetalert2';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';

@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
    hasClientToken = false;

    constructor(
        private router: Router,
        private onboardingService: OnboardingService) {
    }

    ngOnInit() {
        SpinnerUtil.showSpinner();
        this.onboardingService.getSessionID().subscribe((res: IdentyumUserResponse) => {

            const script: any = document.createElement('idy-flow-manager');
            script.clientToken = res;
            script.startLanguage = 'en';
            document.querySelector('#identyum-target').appendChild(script);

            const loader = document.createElement('script');
            loader.type = 'text/javascript';
            loader.src = 'https://web-components.stage.identyum.com/flow-manager/component';
            loader.onload = () => {
            };
            document.getElementsByTagName('head')[0].appendChild(loader);
            SpinnerUtil.hideSpinner();
            script.addEventListener('finished', (event) => {
                SpinnerUtil.showSpinner();
                this.onboardingService.verifyUser(res.session_state).subscribe(_ => {
                    swal({
                        title: '',
                        text: 'Success!',
                        type: 'success'
                    }).then(function () {
                       this.reloadPage('/dash/general_settings');
                    }.bind(this));
                    SpinnerUtil.hideSpinner();
                }, hideSpinnerAndDisplayError);
            });
        }, hideSpinnerAndDisplayError);
    }

    reloadPage(uri: string) {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
            this.router.navigate([uri]));
    }
}

interface IdentyumUserResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    session_state: string;
}
