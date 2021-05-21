import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AppConfigService } from './app-config.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { User } from './user/signup.service';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    constructor(@Inject(DOCUMENT) private doc: any,
                private googleAnalytics: Angulartics2GoogleAnalytics,
                private config: AppConfigService) {
    }

    setGATag() {
        const s = this.doc.createElement('script');
        s.type = 'text/javascript';
        s.innerHTML = `(function(i,s,o,g,r,a,m){i['GoogleoogleAnaltyicsAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', '${this.config.config.config.googleAnalyticsID}', '${environment.production ? 'auto' : 'none'}');`;
        const head = this.doc.getElementsByTagName('head')[0];
        head.appendChild(s);

        this.googleAnalytics.startTracking();
    }

    eventTrack(event: GAEvents, payload = {}): void {
        this.googleAnalytics.eventTrack(event, payload);
    }

    setUser(user: User): void {
        this.googleAnalytics.setUsername(user.uuid);
        this.googleAnalytics.setUserProperties({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            verified: user.verified,
            role: user.role
        });
    }

    clearUser(): void {
        this.googleAnalytics.setUsername('');
        this.googleAnalytics.setUserProperties({});
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
