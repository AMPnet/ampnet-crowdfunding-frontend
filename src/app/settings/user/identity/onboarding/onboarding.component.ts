import { Component, Renderer2 } from '@angular/core';
import { DecisionStatus, OnboardingService, State, VeriffSession } from '../../../../shared/services/user/onboarding.service';
import { UserAuthService } from '../../../../shared/services/user/user-auth.service';
import { BehaviorSubject, EMPTY, Observable, of, Subject, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PopupService } from '../../../../shared/services/popup.service';
import { AppConfigService } from '../../../../shared/services/app-config.service';
import { RouterService } from '../../../../shared/services/router.service';
import { UserService } from '../../../../shared/services/user/user.service';
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { displayBackendErrorRx } from '../../../../utilities/error-handler';


@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent {
    decisionStatus = DecisionStatus;

    session$: Observable<VeriffSession>;
    private sessionSubject = new BehaviorSubject<VeriffSession>(null);

    approved$: Observable<void>;
    private approvedSubject = new Subject<void>();

    constructor(private renderer2: Renderer2,
                private appConfig: AppConfigService,
                private router: RouterService,
                private popupService: PopupService,
                private userService: UserService,
                private onboardingService: OnboardingService,
                private loginService: UserAuthService) {
        this.session$ = this.sessionSubject.asObservable().pipe(
            switchMap(session => session !== null ? of(session) : this.onboardingService.getVeriffSession()),
            tap(session => {
                if (this.decisionPending(session)) {
                    timer(5000).pipe(tap(() => this.sessionSubject.next(null))).subscribe();
                }
            }),
            tap(session => {
                if (session.decision?.status === DecisionStatus.APPROVED) {
                    this.approvedSubject.next();
                }
            })
        );

        this.approved$ = this.approvedSubject.asObservable().pipe(
            switchMap(() => this.popupService.success('Successfully verified user data.')),
            switchMap(() => this.loginService.refreshUserToken()
                .pipe(displayBackendErrorRx())),
            catchError(() => {
                this.router.navigate(['/dash/settings/user']);
                return EMPTY;
            }),
            switchMap(() => {
                this.router.navigate(['/dash/wallet']);
                return EMPTY;
            })
        );
    }

    createVeriffFrame(verification_url: string): () => Observable<MESSAGES> {
        return () => {
            return new Observable(subscriber => {
                const veriffFrame = createVeriffFrame({
                    url: verification_url,
                    onEvent: (msg) => {
                        switch (msg) {
                            case MESSAGES.STARTED:
                                break;
                            case MESSAGES.FINISHED:
                                this.sessionSubject.next(null);
                                break;
                            case MESSAGES.CANCELED:
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

    decisionPending(session: VeriffSession) {
        return session.state === State.SUBMITTED && session.decision === null;
    }

    showDecision(session: VeriffSession) {
        return !!session.decision?.status;
    }
}
