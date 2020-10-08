import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-manage-withdrawals',
    templateUrl: './manage-withdrawals.component.html',
    styleUrls: ['./manage-withdrawals.component.css']
})
export class ManageWithdrawalsComponent implements OnInit {

    withdrawalType = 'users';

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.withdrawalType = params.type;
        });
    }
}
