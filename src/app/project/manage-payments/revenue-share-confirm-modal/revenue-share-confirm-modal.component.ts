import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { autonumericCurrency } from '../../../utilities/currency-util';

@Component({
    selector: 'app-revenue-share-confirm-modal',
    templateUrl: './revenue-share-confirm-modal.component.html',
    styleUrls: ['./revenue-share-confirm-modal.component.css']
})

export class RevenueShareConfirmModalComponent implements OnInit {
    title = 'Confirm revenue share amount';
    amountInvestedConfirm: string;
    frmRevenueAmountConfirm: FormGroup;

    constructor(private bsModalRef: BsModalRef,
                private formBuilder: FormBuilder) {

        this.frmRevenueAmountConfirm = formBuilder.group({
            amount: ['', Validators.required, Validators.]
        });

        const controls = this.frmRevenueAmountConfirm.controls;
        const amountField = controls['amount'];

        amountField.valueChanges.subscribe(any => {
            if (any === this.amountInvestedConfirm) {
                console.log('True');
            } else {
                console.log('False');
            }
        });
    }

    ngOnInit(): void {
        autonumericCurrency('#revenue-confirm-amount');
        console.log(this.amountInvestedConfirm);
    }

    onConfirm(): void {
        this.bsModalRef.hide();
    }

    onCancel(): void {
        this.bsModalRef.hide();
    }
}
