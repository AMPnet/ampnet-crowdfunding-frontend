import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../shared/services/router.service';

declare var $: any;

@Component({
    selector: 'app-withdraw-modal',
    templateUrl: './withdraw-modal.component.html',
    styleUrls: ['./withdraw-modal.component.css']
})
export class WithdrawModalComponent implements OnInit {

    constructor(private router: RouterService) {
    }

    addPaymentOptionClicked() {
        $('#withdraw-modal').modal('toggle');
        this.router.navigateCoop(['dash', 'payment_options', 'new']);
    }

    ngOnInit() {
    }

}
