import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;


@Component({
    selector: 'app-deposit-modal',
    templateUrl: './deposit-modal.component.html',
    styleUrls: ['./deposit-modal.component.css']
})
export class DepositModalComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    addPaymentOptionClicked() {
        $('#deposit-modal').modal('toggle');
        this.router.navigate(['dash', 'payment_options', 'new']);
    }


}
