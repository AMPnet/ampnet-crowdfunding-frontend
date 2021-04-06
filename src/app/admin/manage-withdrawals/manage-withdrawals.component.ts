import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
    CoopWithdraw,
    WalletCooperativeWithdrawService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-withdraw.service';
import { map } from 'rxjs/operators';
import { ErrorService } from '../../shared/services/error.service';

@Component({
    selector: 'app-manage-withdrawals',
    templateUrl: './manage-withdrawals.component.html',
    styleUrls: ['./manage-withdrawals.component.scss']
})
export class ManageWithdrawalsComponent {
    userWithdrawals$: Observable<CoopWithdraw[]>;
    projectWithdrawals$: Observable<CoopWithdraw[]>;

    constructor(private withdrawCoopService: WalletCooperativeWithdrawService,
                private errorService: ErrorService) {
        this.userWithdrawals$ = withdrawCoopService.getApprovedWithdrawals().pipe(
            this.errorService.handleError,
            map((res => res.withdraws))
        );

        this.projectWithdrawals$ = withdrawCoopService.getApprovedProjectWithdrawals().pipe(
            this.errorService.handleError,
            map((res => res.withdraws))
        );
    }
}
