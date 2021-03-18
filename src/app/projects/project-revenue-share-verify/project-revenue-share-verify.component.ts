import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterService } from '../../shared/services/router.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RevenueShareService } from '../../shared/services/wallet/revenue-share.service';
import { ArkaneService } from '../../shared/services/arkane.service';
import { ErrorService } from '../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { finalize, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-project-revenue-share-verify',
    templateUrl: './project-revenue-share-verify.component.html',
    styleUrls: ['./project-revenue-share-verify.component.scss']
})
export class ProjectRevenueShareVerifyComponent implements OnInit {
    projectUUID: string;
    amountInvestedConfirm: string;

    confirmForm: FormGroup;

    constructor(private router: RouterService,
                private bsModalRef: BsModalRef,
                private formBuilder: FormBuilder,
                private revenueShareService: RevenueShareService,
                private arkaneService: ArkaneService,
                private errorService: ErrorService,
                private translate: TranslateService,
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
        return this.revenueShareService.generateRevenueShareTx(this.projectUUID, amountInvested).pipe(
            this.errorService.handleError,
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
            })),
            tap(() => this.router.navigate([`/dash/projects/${this.projectUUID}/edit`])),
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
