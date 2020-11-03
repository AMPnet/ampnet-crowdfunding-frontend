import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../../shared/services/user/onboarding.service';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { UserAuthService } from '../../../../shared/services/user/user-auth.service';
import { DOCUMENT } from '@angular/common';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, finalize, switchMap, take } from 'rxjs/operators';
import { PopupService } from '../../../../shared/services/popup.service';

@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent {
    @ViewChild('identyumContainer') identyumContainer: ElementRef;

    loaded$: Observable<void>;
    finished$: Observable<void>;
    finishedSubject: Subject<IdentyumClientToken>;

    constructor(private renderer2: Renderer2,
                @Inject(DOCUMENT) private document: Document,
                private router: Router,
                private popupService: PopupService,
                private onboardingService: OnboardingService,
                private loginService: UserAuthService) {
        this.loaded$ = combineLatest([this.onboardingService.getSessionID(), this.loadIdentyumScript()]).pipe(
            take(1),
            switchMap(([clientToken, _]) => this.setFlowManager(clientToken, 'en'))
        );

        this.finishedSubject = new Subject();

        this.finished$ = this.finishedSubject.asObservable().pipe(
            switchMap(clientToken => onboardingService.verifyUser(clientToken.session_state)
                .pipe(displayBackendErrorRx())),
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

    private loadIdentyumScript(): Observable<void> {
        return new Observable(subscriber => {
            const script: HTMLScriptElement = this.renderer2.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://web-components.stage.identyum.com/flow-manager/component';
            script.onload = () => {
                subscriber.next();
                subscriber.complete();
            };
            script.onerror = () => {
                subscriber.error();
                subscriber.complete();
            };

            this.renderer2.appendChild(this.document.head, script);
        });
    }

    private setFlowManager(clientToken: IdentyumClientToken, startLanguage: string): Observable<void> {
        return new Observable(subscriber => {
            const flowManager: any = document.createElement('idy-flow-manager');
            flowManager.clientToken = clientToken;
            flowManager.startLanguage = startLanguage;

            flowManager.addEventListener('ready', _event => {
                subscriber.next();
                subscriber.complete();
            });
            flowManager.addEventListener('finished', _event => {
                this.finishedSubject.next(clientToken);
            });

            this.identyumContainer.nativeElement.appendChild(flowManager);
        });
    }
}

interface IdentyumClientToken {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    session_state: string;
}
