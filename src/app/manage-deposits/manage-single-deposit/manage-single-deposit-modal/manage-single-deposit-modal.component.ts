import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autonumericCurrency } from '../../../utilities/currency-util';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-manage-single-deposit-modal',
    templateUrl: './manage-single-deposit-modal.component.html',
    styleUrls: ['./manage-single-deposit-modal.component.css']
})
export class ManageSingleDepositModalComponent implements OnInit {
    @Output() onSuccessfulConfirmation = new EventEmitter<void>();
    origin: string;
    depositId: string;
    depositAmount: string;

    confirmForm: FormGroup;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        autonumericCurrency('#deposit-confirm-amount');
        this.confirmForm = this.formBuilder.group({
            depositConfirmAmount: ['', [Validators.required, Validators.pattern(this.depositAmount)]]
        });
    }

    onConfirm(): void {
        this.bsModalRef.hide();
        this.onSuccessfulConfirmation.emit();
    }

    onCancel(): void {
        this.bsModalRef.hide();
    }
}
