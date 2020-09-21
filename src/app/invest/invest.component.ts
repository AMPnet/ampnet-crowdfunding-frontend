import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WalletDetailsWithState, WalletService } from '../shared/services/wallet/wallet.service';
import { displayBackendError } from '../utilities/error-handler';
import { Project, ProjectService } from '../shared/services/project/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'app-invest',
    templateUrl: './invest.component.html',
    styleUrls: ['./invest.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class InvestComponent implements OnInit {
    wallet$: Observable<WalletDetailsWithState>;
    project$: Observable<Project>;

    investForm: FormGroup;

    constructor(private walletService: WalletService,
                private projectService: ProjectService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private router: Router) {
        const projectID = this.route.snapshot.params.id;
        this.project$ = this.projectService.getProject(projectID).pipe(this.handleError, shareReplay(1));
        this.wallet$ = this.walletService.wallet$.pipe(this.handleError, take(1));
    }


    ngOnInit() {
        this.investForm = this.fb.group({
            amount: ['', [Validators.required], this.validAmount.bind(this)]
        });
    }

    private validAmount(control: AbstractControl): Observable<ValidationErrors> {
        return combineLatest([this.wallet$, this.project$]).pipe(
            map(([wallet, project]) => {
                const amount = control.value;

                if (amount < project.min_per_user) {
                    return {amountBelowMin: true};
                } else if (amount > project.max_per_user) {
                    return {amountAboveMax: true};
                } else if (amount > project.expected_funding) {
                    return {amountAboveExpFunding: true};
                } else if (amount > wallet.wallet.balance) {
                    return {amountAboveBalance: true};
                } else {
                    return null;
                }
            })
        );
    }

    investButtonClicked() {
        this.router.navigate(['./',
                this.investForm.controls['amount'].value,
                'verify_sign'],
            {relativeTo: this.route});
    }

    private handleError<T>(source: Observable<T>) {
        return source.pipe(
            catchError(err => {
                displayBackendError(err);
                return EMPTY;
            })
        );
    }
}
