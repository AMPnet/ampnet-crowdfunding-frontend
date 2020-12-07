import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { OnboardingService } from '../../../../shared/services/user/onboarding.service';
import { UserAuthService } from '../../../../shared/services/user/user-auth.service';
import { DOCUMENT } from '@angular/common';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { PopupService } from '../../../../shared/services/popup.service';
import { AppConfigService } from '../../../../shared/services/app-config.service';
import { RouterService } from '../../../../shared/services/router.service';
import { UserService } from '../../../../shared/services/user/user.service';
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { User } from '../../../../shared/services/user/signup.service';
import Veriff from '@veriff/js-sdk';


@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent {
    @ViewChild('identyumContainer') identyumContainer: ElementRef;

    loaded$: Observable<void>;
    finished$: Observable<void>;
    finishedSubject = new Subject<VeriffFormResponse>();

    constructor(private renderer2: Renderer2,
                @Inject(DOCUMENT) private document: Document,
                private appConfig: AppConfigService,
                private router: RouterService,
                private popupService: PopupService,
                private userService: UserService,
                private onboardingService: OnboardingService,
                private loginService: UserAuthService) {
        this.loaded$ = combineLatest([this.userService.user$]).pipe(take(1),
            switchMap(([user]) => this.createVeriffForm(user))
        );

        this.finishedSubject = new Subject();

        this.finished$ = this.finishedSubject.asObservable().pipe(
            switchMap(formResponse => this.createVeriffFrame(formResponse)),
            switchMap(() => EMPTY)
        );

        // this.finished$ = this.finishedSubject.asObservable().pipe(
        //     switchMap(clientToken => onboardingService.verifyUser(clientToken.session_state)
        //         .pipe(displayBackendErrorRx())),
        //     switchMap(() => this.popupService.success('Successfully verified user data.')),
        //     switchMap(() => this.loginService.refreshUserToken()
        //         .pipe(displayBackendErrorRx())),
        //     catchError(() => {
        //         this.router.navigate(['/dash/settings/user']);
        //         return EMPTY;
        //     }),
        //     switchMap(() => {
        //         this.router.navigate(['/dash/wallet']);
        //         return EMPTY;
        //     })
        // );
    }

    private createVeriffForm(user: User): Observable<void> {
        return new Observable(subscriber => {
            const veriff = Veriff({
                host: 'https://stationapi.veriff.com',
                apiKey: 'a2b3005f-e324-4e7e-a328-4aecd11a091b',
                parentId: 'veriff-root',
                onSession: (err, response: VeriffFormResponse) => {
                    if (err) {
                        subscriber.error(err);
                        subscriber.complete();
                    } else {
                        console.log(response);
                        this.finishedSubject.next(response);
                        subscriber.next();
                        subscriber.complete();
                    }
                },
            });

            veriff.setParams({
                // TODO: uncomment this if not need user's name in the beginning of the flow
                // person: {
                //     givenName: ' ',
                //     lastName: ' '
                // },
                vendorData: user.uuid
            });

            veriff.mount();
        });
    }

    private createVeriffFrame(formResponse: VeriffFormResponse): Observable<MESSAGES> {
        return new Observable(subscriber => {
            const veriffFrame = createVeriffFrame({
                url: formResponse.verification.url,
                onEvent: function (msg) {
                    switch (msg) {
                        case MESSAGES.STARTED:
                            console.log('started');
                            break;
                        case MESSAGES.FINISHED:
                            console.log('finished');
                            break;
                        case MESSAGES.CANCELED:
                            console.log('canceled');
                            veriffFrame.close();
                            break;
                    }

                    subscriber.next(msg);
                    subscriber.complete();
                }
            });
        });
    }
}

interface VeriffFormResponse {
    status: string;
    verification: {
        id: string;
        url: string;
        host: string;
        status: string;
        sessionToken: string;
    };
}
