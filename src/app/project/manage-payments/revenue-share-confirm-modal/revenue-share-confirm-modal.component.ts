import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { autonumericCurrency } from '../../../utilities/currency-util';

@Component({
    selector: 'app-revenue-share-confirm-modal',
    templateUrl: './revenue-share-confirm-modal.component.html',
    styleUrls: ['./revenue-share-confirm-modal.component.css']
})

export class RevenueShareConfirmModalComponent implements OnInit {
    title = 'Confirm revenue share amount';
    onConfirmClicked: Subject<number>;
    amountInvestedConfirm: number;

    constructor(private _bsModalRef: BsModalRef) {
    }

    public ngOnInit(): void {
        this.onConfirmClicked = new Subject();
        autonumericCurrency('#revenue-confirm-amount');
    }

    public onConfirm(): void {
        this.onConfirmClicked.next(this.amountInvestedConfirm);
        this._bsModalRef.hide();
    }

    public onCancel(): void {
        this._bsModalRef.hide();
    }
}
