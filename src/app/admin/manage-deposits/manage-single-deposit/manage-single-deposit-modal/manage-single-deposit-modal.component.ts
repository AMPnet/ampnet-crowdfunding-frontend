import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SpinnerUtil } from '../../../../utilities/spinner-utilities';
import { RouterService } from '../../../../shared/services/router.service';

@Component({
    selector: 'app-manage-single-deposit-modal',
    templateUrl: './manage-single-deposit-modal.component.html',
    styleUrls: ['./manage-single-deposit-modal.component.css']
})
export class ManageSingleDepositModalComponent implements OnInit {
    @Output() successfulConfirmation = new EventEmitter<void>();
    depositAmount: number;

    confirmForm: FormGroup;

    constructor(private router: RouterService,
                private formBuilder: FormBuilder,
                private bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        this.confirmForm = this.formBuilder.group({
            amountToConfirm: ['', [Validators.required, this.amountEqual(this.depositAmount)]]
        });
    }

    onConfirm(): void {
        this.bsModalRef.hide();
        this.successfulConfirmation.emit();
    }

    onCancel(): void {
        this.bsModalRef.hide();
        SpinnerUtil.hideSpinner();
    }

    private amountEqual(equalTo: number) {
        return function (control: AbstractControl): ValidationErrors | null {
            const inputAmount = control.value;
            if (inputAmount !== equalTo) {
                return {inputAmountInvalid: true};
            }
            return null;
        };
    }
}
