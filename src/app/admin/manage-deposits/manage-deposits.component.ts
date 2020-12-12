import { Component } from '@angular/core';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import {
    DepositSearchResponse,
    WalletCooperativeDepositService
} from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-deposit.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from '../../shared/services/popup.service';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';

@Component({
    selector: 'app-manage-deposits',
    templateUrl: './manage-deposits.component.html',
    styleUrls: ['./manage-deposits.component.css']
})
export class ManageDepositsComponent {
    unapprovedDeposits$: Observable<DepositSearchResponse[]>;
    refreshDepositsSubject = new BehaviorSubject<void>(null);

    referenceForm: FormGroup;

    constructor(private router: RouterService,
                private fb: FormBuilder,
                private popupService: PopupService,
                private errorService: ErrorService,
                private depositCooperativeService: WalletCooperativeDepositService) {
        this.unapprovedDeposits$ = this.refreshDepositsSubject.pipe(
            switchMap(() => this.depositCooperativeService.getUnapprovedDeposits()),
            this.errorService.handleError,
            map(res => res.deposits),
        );

        this.referenceForm = fb.group({
            reference: ['', Validators.required]
        });
    }

    getDepositInfoClicked(reference: string) {
        this.router.navigate(['/dash', 'manage_deposits', reference]);
    }

    // TODO: Implement adding a comment to decline deposit
    declineDeposit(id: number) {
        SpinnerUtil.showSpinner();
        return this.depositCooperativeService.declineDeposit(id, '').pipe(
            this.errorService.handleError,
            tap(() => this.refreshDepositsSubject.next()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    contactPhoneClicked() {
        return this.popupService.new({
            type: 'info',
            title: 'Contact phone',
            text: '+385 95 354 6106'
        });
    }
}
