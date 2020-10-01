import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectService } from 'src/app/shared/services/project/project.service';
import { displayBackendError, displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import swal from 'sweetalert2';
import { WalletService } from '../../../shared/services/wallet/wallet.service';
import { ArkaneService } from '../../../shared/services/arkane.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PopupService } from '../../../shared/services/popup.service';

@Component({
    selector: 'app-verify-sign-offer',
    templateUrl: './verify-sign-offer.component.html',
    styleUrls: ['./verify-sign-offer.component.css']
})
export class VerifySignOfferComponent implements OnInit {
    projectID: string;
    investAmount: number;
    project: Project;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private projectService: ProjectService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private broadcastService: BroadcastService) {
    }

    ngOnInit() {
        this.projectID = this.route.snapshot.params.offerID;
        this.investAmount = this.route.snapshot.params.investAmount;
        this.getProject();
    }

    getProject() {
        SpinnerUtil.showSpinner();
        this.projectService.getProject(this.projectID).subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.project = res;
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    verifyAndSign() {
        return this.walletService.investToProject(this.project.uuid, this.investAmount).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.router.navigate(['/dash/wallet']))
        );
    }
}
