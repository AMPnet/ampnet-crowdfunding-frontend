import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { AppConfigService } from '../../../../shared/services/app-config.service';
import { catchError, find, last, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, interval, Observable, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PopupService } from '../../../../shared/services/popup.service';
import { UserService } from '../../../../shared/services/user/user.service';
import { IdentyumCredentials, IdentyumService } from '../../../../shared/services/user/identyum.service';
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
    finishedSubject: Subject<void>;

    constructor(private renderer2: Renderer2,
                @Inject(DOCUMENT) private document: Document,
                private appConfig: AppConfigService,
                private router: RouterService,
                private popupService: PopupService,
                private identyumService: IdentyumService,
                private translate: TranslateService,
                private userService: UserService) {
        this.loaded$ = this.identyumService.getSession().pipe(
            switchMap(session =>
                this.loadIdentyumScript(session.web_component_url).pipe(
                    switchMap(() => this.setFlowManager(session.credentials,
                        this.appConfig.config.config.identyum.startLanguage))
                ))
        );

        this.finishedSubject = new Subject();

        this.finished$ = this.finishedSubject.asObservable().pipe(
            switchMap(() =>
                interval(1000).pipe(
                    tap(() => this.userService.refreshUser()),
                    takeUntil(this.userService.user$.pipe(find(user => user.verified))),
                    last()
                )
            ),
            switchMap(() => this.popupService.success(
                this.translate.instant('settings.user.identity.identyum.approved'))),
            switchMap(() => this.userService.refreshUserToken()),
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

    private loadIdentyumScript(webComponentURL: string): Observable<void> {
        return new Observable(subscriber => {
            const script: HTMLScriptElement = this.renderer2.createElement('script');
            script.type = 'text/javascript';
            script.src = webComponentURL;
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

    private setFlowManager(credentials: IdentyumCredentials, startLanguage: string): Observable<void> {
        return new Observable(subscriber => {
            const flowManager: any = document.createElement('idy-flow-manager');
            flowManager.clientToken = credentials;
            flowManager.startLanguage = startLanguage;

            flowManager.addEventListener('ready', _event => {
                subscriber.next();
                subscriber.complete();
            });
            flowManager.addEventListener('finished', _event => {
                this.finishedSubject.next();
            });

            this.identyumContainer.nativeElement.appendChild(flowManager);
        });
    }
}
