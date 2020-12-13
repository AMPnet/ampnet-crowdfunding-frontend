import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectService } from 'src/app/shared/services/project/project.service';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { WalletService } from '../../../shared/services/wallet/wallet.service';
import { ArkaneService } from '../../../shared/services/arkane.service';
import { finalize, switchMap } from 'rxjs/operators';
import { PopupService } from '../../../shared/services/popup.service';
import { RouterService } from '../../../shared/services/router.service';
import { ErrorService } from '../../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-verify-sign-offer',
    templateUrl: './verify-sign-offer.component.html',
    styleUrls: ['./verify-sign-offer.component.scss']
})
export class VerifySignOfferComponent implements OnInit {
    projectID: string;
    investAmount: number;
    project: Project;

    constructor(private route: ActivatedRoute,
                private router: RouterService,
                private projectService: ProjectService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private popupService: PopupService) {
    }

    ngOnInit() {
        this.projectID = this.route.snapshot.params.offerID;
        this.investAmount = this.route.snapshot.params.investAmount;
        this.getProject();
    }

    getProject() {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(this.projectID).pipe(
            this.errorService.handleError,
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe(res => {
            this.project = res;
        });
    }

    verifyAndSign() {
        return this.walletService.investToProject(this.project.uuid, this.investAmount).pipe(
            this.errorService.handleError,
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
