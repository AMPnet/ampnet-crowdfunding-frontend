import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
                private fb: FormBuilder) {

        this.frmRevenueAmountConfirm = fb.group({
            amount: ['', [Validators.required]],
        }, {validator: this.amountInvestedConfirm});

        const controls = this.frmRevenueAmountConfirm.controls;
        controls['amount'].valueChanges.subscribe(any => {
            console.log('frmRevenueAmountConfirm: ' + this.amountInvestedConfirm + '|' + any);
        });
    }

    ngOnInit(): void {
        // autonumericCurrency('#revenue-confirm-amount');
        console.log(this.amountInvestedConfirm);
    }

    onConfirm(): void {
        this.bsModalRef.hide();
    }

    onCancel(): void {
        this.bsModalRef.hide();
    }
}
