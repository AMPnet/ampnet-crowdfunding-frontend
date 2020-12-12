import { Component, Renderer2 } from '@angular/core';
import { DecisionStatus, OnboardingService, State, VeriffSession } from '../../../../shared/services/user/onboarding.service';
import { UserAuthService } from '../../../../shared/services/user/user-auth.service';
import { BehaviorSubject, EMPTY, Observable, Subject, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PopupService } from '../../../../shared/services/popup.service';
import { AppConfigService } from '../../../../shared/services/app-config.service';
import { RouterService } from '../../../../shared/services/router.service';
import { UserService } from '../../../../shared/services/user/user.service';
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { ErrorService } from '../../../../shared/services/error.service';


@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent {
    decisionStatus = DecisionStatus;

    session$: Observable<VeriffSession>;
    private sessionSubject = new BehaviorSubject<void>(null);

    approved$: Observable<void>;
    private approvedSubject = new Subject<void>();

    constructor(private renderer2: Renderer2,
                private appConfig: AppConfigService,
                private router: RouterService,
                private popupService: PopupService,
                private userService: UserService,
                private errorService: ErrorService,
                private onboardingService: OnboardingService,
                private loginService: UserAuthService) {
        this.session$ = this.sessionSubject.asObservable().pipe(
            switchMap(_ => this.onboardingService.getVeriffSession()),
            tap(session => {
                if (this.decisionPending(session)) {
                    timer(5000).pipe(tap(() => this.sessionSubject.next())).subscribe();
                }
            }),
            tap(session => {
                if (session.decision?.status === DecisionStatus.APPROVED) {
                    this.approvedSubject.next();
                }
            })
        );

        this.approved$ = this.approvedSubject.asObservable().pipe(
            switchMap(() => this.popupService.success('User data has been successfully verified.')),
            switchMap(() => this.loginService.refreshUserToken()
                .pipe(this.errorService.handleError)),
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
                        subscriber.next(msg);

                        switch (msg) {
                            case MESSAGES.STARTED:
                                break;
                            case MESSAGES.FINISHED:
                                this.sessionSubject.next();
                                subscriber.complete();
                                break;
                            case MESSAGES.CANCELED:
                                veriffFrame.close();
                                subscriber.complete();
                                break;
                        }
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
