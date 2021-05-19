import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AppConfigService } from './app-config.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@Injectable({
    providedIn: 'root'
})
export class GoogleAnalyticsService {
    constructor(@Inject(DOCUMENT) private doc: any,
                private googleAnalytics: Angulartics2GoogleAnalytics,
                private config: AppConfigService) {
    }

    setTag() {
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
}
