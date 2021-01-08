import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { AppConfigService } from '../../../../shared/services/app-config.service';
import { catchError, switchMap, take } from 'rxjs/operators';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PopupService } from '../../../../shared/services/popup.service';
import { ErrorService } from '../../../../shared/services/error.service';
import { UserService } from '../../../../shared/services/user/user.service';
import { IdentyumClientToken, IdentyumService } from '../../../../shared/services/user/identyum.service';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from '../../../../shared/services/router.service';

@Component({
    selector: 'app-identyum',
    templateUrl: './identyum.component.html',
    styleUrls: ['./identyum.component.css']
})
export class IdentyumComponent {
    @ViewChild('identyumContainer') identyumContainer: ElementRef;

    loaded$: Observable<void>;
    finished$: Observable<void>;
    finishedSubject: Subject<IdentyumClientToken>;

    constructor(private renderer2: Renderer2,
                @Inject(DOCUMENT) private document: Document,
                private appConfig: AppConfigService,
                private router: RouterService,
                private popupService: PopupService,
                private identyumService: IdentyumService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private userService: UserService) {
        this.loaded$ = combineLatest([this.identyumService.getSessionID(), this.loadIdentyumScript()]).pipe(
            take(1),
            switchMap(([clientToken, _]) => this.setFlowManager(clientToken,
                this.appConfig.config.config.identyum.startLanguage))
        );

        this.finishedSubject = new Subject();

        this.finished$ = this.finishedSubject.asObservable().pipe(
            switchMap(clientToken => identyumService.verifyUser(clientToken.session_state)
                .pipe(this.errorService.displayError)),
            switchMap(() => this.popupService.success(
                this.translate.instant('settings.user.identity.identyum.approved'))),
            switchMap(() => this.userService.refreshUserToken()
                .pipe(this.errorService.displayError)),
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
            script.src = this.appConfig.config.config.identyum.envURL;
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
