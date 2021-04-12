import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectService } from 'src/app/shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { ArkaneService } from '../../shared/services/arkane.service';
import { shareReplay, switchMap } from 'rxjs/operators';
import { PopupService } from '../../shared/services/popup.service';
import { RouterService } from '../../shared/services/router.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { enterTrigger } from '../../shared/animations';

@Component({
    selector: 'app-offer-invest-verify',
    templateUrl: './offer-invest-verify.component.html',
    styleUrls: ['./offer-invest-verify.component.scss'],
    animations: [enterTrigger]
})
export class OfferInvestVerifyComponent implements OnInit {
    projectID: string;
    investAmount: number;
    project$: Observable<Project>;

    constructor(private route: ActivatedRoute,
                private router: RouterService,
                private projectService: ProjectService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private translate: TranslateService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.projectID = this.route.snapshot.params.id;
        this.investAmount = this.route.snapshot.params.amount;

        this.project$ = this.projectService.getProject(this.projectID).pipe(
            shareReplay(1)
        );
    }

    sign() {
        return this.walletService.investToProject(this.projectID, this.investAmount).pipe(
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            switchMap(() => this.router.navigate(['/dash/wallet']))
        );
    }
}
