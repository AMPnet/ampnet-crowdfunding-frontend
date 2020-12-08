import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DecisionStatus, OnboardingService, State, VeriffSession } from '../../../../shared/services/user/onboarding.service';
import { UserAuthService } from '../../../../shared/services/user/user-auth.service';
import { BehaviorSubject, EMPTY, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PopupService } from '../../../../shared/services/popup.service';
import { AppConfigService } from '../../../../shared/services/app-config.service';
import { RouterService } from '../../../../shared/services/router.service';
import { UserService } from '../../../../shared/services/user/user.service';
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';


@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent {
    @ViewChild('identyumContainer') identyumContainer: ElementRef;

    session$: Observable<VeriffSession>;
    private sessionSubject = new BehaviorSubject<VeriffSession>(null);
    finished$: Observable<void>;
    finishedSubject = new Subject<VeriffFormResponse>();

    constructor(private renderer2: Renderer2,
                private appConfig: AppConfigService,
                private router: RouterService,
                private popupService: PopupService,
                private userService: UserService,
                private onboardingService: OnboardingService,
                private loginService: UserAuthService) {
        this.session$ = this.sessionSubject.asObservable().pipe(
            switchMap(session => session !== null ? of(session) : this.onboardingService.getVeriffSession())
        );

        this.finishedSubject = new Subject();

        this.finished$ = this.finishedSubject.asObservable().pipe(
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

    createVeriffFrame(verification_url: string): () => Observable<MESSAGES> {
        return () => {
            return new Observable(subscriber => {
                const veriffFrame = createVeriffFrame({
                    url: verification_url,
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
        };
    }

    showVerificationButton(session: VeriffSession) {
        return session.state !== State.SUBMITTED || session.decision === null;
    }

    showDecision(session: VeriffSession) {
        return !!session.decision.status;
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
