import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
    CoopWithdraw, CoopWithdrawListResponse,
    WalletCooperativeWithdrawService
} from '../shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { delay, map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-manage-withdrawals',
    templateUrl: './manage-withdrawals.component.html',
    styleUrls: ['./manage-withdrawals.component.css']
})
export class ManageWithdrawalsComponent {
    userWithdrawals$: Observable<CoopWithdraw[]>;
    projectWithdrawals$: Observable<CoopWithdraw[]>;

    constructor(private withdrawCoopService: WalletCooperativeWithdrawService) {
        // TODO: uncomment when available
        // this.userWithdrawals$ = withdrawCoopService.getApprovedWithdrawals()
        //     .pipe(map((res => res.withdraws)));

        this.userWithdrawals$ = of(<CoopWithdrawListResponse>{
            withdraws: [{
                withdraw: {
                    id: 23,
                    amount: 15000,
                },
                user: {
                    uuid: 'asdfad',
                    first_name: 'Matija',
                    last_name: 'Pevec',
                    email: 'matija@ampnet.io'
                },
                project: null,
            }],
            page: 1,
            total_pages: 1
        }).pipe(delay(1000), map((res => res.withdraws)));


        // TODO: uncomment when available
        // this.projectWithdrawals$ = withdrawCoopService.getApprovedProjectWithdrawals()
        //     .pipe(map((res => res.withdraws)));

        this.projectWithdrawals$ = of(<CoopWithdrawListResponse>{
            withdraws: [{
                withdraw: {
                    id: 23,
                    amount: 15000,
                },
                user: {
                    uuid: 'asdfad',
                    first_name: 'Matija',
                    last_name: 'Pevec',
                    email: 'matija@ampnet.io'
                },
                project: {
                    name: 'Proyecto bueno'
                },
            }],
            page: 1,
            total_pages: 1
        }).pipe(delay(1500), map(res => res.withdraws));
    }
}
