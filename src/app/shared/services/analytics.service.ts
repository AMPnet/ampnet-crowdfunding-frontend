import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppConfigService } from './app-config.service';
import { User } from './user/signup.service';
import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2/gst';
import { EMPTY, Observable } from 'rxjs';
import { catchError, last, map, takeWhile, tap, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    constructor(@Inject(DOCUMENT) private doc: any,
                private googleGlobalSiteTag: Angulartics2GoogleGlobalSiteTag,
                private config: AppConfigService) {
    }

    setGTM(): Observable<unknown> {
        return this.config.config$.pipe(
            takeWhile(config => !config.config.googleTagID, true),
            last(),
            timeout(4000),
            map(config => config.config.googleTagID),
            tap(gTagID => {
                // Global site tag (gtag.js) - Google Analytics
                // Dev page: https://developers.google.com/analytics/devguides/collection/gtagjs/
                const s = this.doc.createElement('script');
                s.async = true;
                s.src = `https://www.googletagmanager.com/gtag/js?id=${gTagID}`;
                const head = this.doc.getElementsByTagName('head')[0];
                head.appendChild(s);

                const s2 = this.doc.createElement('script');
                s2.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${gTagID}');
                `;
                head.appendChild(s2);

                this.googleGlobalSiteTag.startTracking();
            }),
            catchError(() => EMPTY),
        );
    }

    eventTrack(event: GAEvents, payload = {}): void {
        this.googleGlobalSiteTag.eventTrack(event, {gstCustom: payload});
    }

    setUser(user: User): void {
        this.googleGlobalSiteTag.setUsername(user.uuid);
        this.googleGlobalSiteTag.setUserProperties({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            verified: user.verified,
            role: user.role
        });
    }

    clearUser(): void {
        this.googleGlobalSiteTag.setUsername('');
        this.googleGlobalSiteTag.setUserProperties({});
    }
}

export enum GAEvents {
    SIGN_UP = 'signup',
    INIT_WALLET = 'initWallet',
    KYC_STARTED = 'kycStarted',
    KYC_COMPLETED = 'kycCompleted',
    DEPOSIT_ENTERED_AMOUNT = 'depositEnteredAmount',
    DEPOSIT_CONFIRMED_PAYOUT = 'depositConfirmedPayment',
    WITHDRAW_TX_SIGNED = 'withdrawTxSigned',
    WITHDRAW_TX_CANCELED = 'withdrawTxCanceled',
    INVEST_TX_SIGNED = 'investTxSigned',
}
