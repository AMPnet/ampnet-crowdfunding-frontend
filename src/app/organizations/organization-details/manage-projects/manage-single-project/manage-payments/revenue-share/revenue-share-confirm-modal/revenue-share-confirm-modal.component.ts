import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SpinnerUtil } from '../../../../../../../utilities/spinner-utilities';
import { displayBackendErrorRx } from '../../../../../../../utilities/error-handler';
import { RevenueShareService } from '../../../../../../../shared/services/wallet/revenue-share.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../../../../../../shared/services/arkane.service';
import { PopupService } from '../../../../../../../shared/services/popup.service';
import { RouterService } from '../../../../../../../shared/services/router.service';

@Component({
    selector: 'app-revenue-share-confirm-modal',
    templateUrl: './revenue-share-confirm-modal.component.html',
    styleUrls: ['./revenue-share-confirm-modal.component.css']
})

export class RevenueShareConfirmModalComponent implements OnInit {
    orgID: string;
    projectID: string;
    amountInvestedConfirm: string;

    confirmForm: FormGroup;

    constructor(private router: RouterService,
                private bsModalRef: BsModalRef,
                private formBuilder: FormBuilder,
                private revenueShareService: RevenueShareService,
                private arkaneService: ArkaneService,
                private route: ActivatedRoute,
                private popupService: PopupService) {
    }

    ngOnInit(): void {
        this.confirmForm = this.formBuilder.group({
            amount: ['', [Validators.required, Validators.pattern(this.amountInvestedConfirm)]]
        });
    }

    generateTransaction(amountInvested: number) {
        SpinnerUtil.showSpinner();
        return this.revenueShareService.generateRevenueShareTx(this.projectID, amountInvested).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...',
                customClass: 'popup-success',
                position: 'top',
                confirmButtonText: 'Continue <i class="fas fa-arrow-right ml-3"></i>'
            })),
            tap(() => this.router.navigate([`/dash/manage_groups/${this.orgID}/manage_project/${this.projectID}/manage_payments`])),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    onConfirm(): void {
        this.bsModalRef.hide();
        this.generateTransaction(this.confirmForm.controls['amount'].value).subscribe();
    }

    onCancel(): void {
        this.bsModalRef.hide();
    }
}
