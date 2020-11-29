import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
    CoopWithdraw,
    WalletCooperativeWithdrawService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-manage-withdrawals',
    templateUrl: './manage-withdrawals.component.html',
    styleUrls: ['./manage-withdrawals.component.css']
})
export class ManageWithdrawalsComponent {
    userWithdrawals$: Observable<CoopWithdraw[]>;
    projectWithdrawals$: Observable<CoopWithdraw[]>;

    constructor(private withdrawCoopService: WalletCooperativeWithdrawService) {
        this.userWithdrawals$ = withdrawCoopService.getApprovedWithdrawals()
            .pipe(map((res => res.withdraws)));

        this.projectWithdrawals$ = withdrawCoopService.getApprovedProjectWithdrawals()
            .pipe(map((res => res.withdraws)));
    }
}
