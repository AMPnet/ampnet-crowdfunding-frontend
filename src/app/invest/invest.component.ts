import { Component, OnInit } from '@angular/core';
import { WalletDetailsWithState, WalletService } from '../shared/services/wallet/wallet.service';
import { displayBackendError } from '../utilities/error-handler';
import { Project, ProjectService } from '../shared/services/project/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { combineLatest, EMPTY, Observable, pipe } from 'rxjs';
import { catchError, map, reduce, shareReplay, take, tap } from 'rxjs/operators';
import { Portfolio, PortfolioService, ProjectTransactions } from '../shared/services/wallet/portfolio.service';

declare var $: any;

@Component({
    selector: 'app-invest',
    templateUrl: './invest.component.html',
    styleUrls: ['./invest.component.scss'],
})
export class InvestComponent implements OnInit {
    wallet$: Observable<WalletDetailsWithState>;
    project$: Observable<Project>;
    projectUserInvestments$: Observable<ProjectTransactions>;
    projectTotalInvestments$: Observable<Portfolio[]>;

    userInvestments = 0;

    investForm: FormGroup;

    constructor(private walletService: WalletService,
                private projectService: ProjectService,
                private portfolioService: PortfolioService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private router: Router) {
        const projectID = this.route.snapshot.params.id;
        this.project$ = this.projectService.getProject(projectID).pipe(this.handleError, shareReplay(1));
        this.wallet$ = this.walletService.wallet$.pipe(this.handleError, take(1));
        this.projectTotalInvestments$ = this.portfolioService.getProjectInvestments(projectID).pipe(this.handleError);
        this.projectUserInvestments$ = this.portfolioService.getInvestmentsInProject(projectID).pipe(
            this.handleError,
            tap(data => {
                for (const transaction of data.transactions) {
                    this.userInvestments = this.userInvestments + transaction.amount;
                }
            })
        );
    }

    ngOnInit() {
        this.investForm = this.fb.group({
            amount: ['', [Validators.required], this.validAmount.bind(this)]
        });
    }

    private validAmount(control: AbstractControl): Observable<ValidationErrors> {
        return combineLatest([this.wallet$, this.project$, this.projectUserInvestments$]).pipe(
            map(([wallet, project, investment]) => {
                    const amount = control.value;
                    const totalProjInvest = amount + this.userInvestments;

                    if (amount < project.min_per_user) {
                        return {amountBelowMin: true};
                    } else if (amount > project.max_per_user) {
                        return {amountAboveMax: true};
                    } else if (amount > project.expected_funding) {
                        return {amountAboveExpFunding: true};
                    } else if (amount > wallet.wallet.balance) {
                        return {amountAboveBalance: true};

                    } else if (!investment.transactions === undefined || investment.transactions.length > 0) {
                        if (this.userInvestments === project.max_per_user) {
                            return {projInvestEqualMaxInvest: true};
                        }
                        if (totalProjInvest > project.max_per_user) {
                            return {totalProjInvestAboveMax: true};
                        }
                    } else {
                        return null;
                    }
                }
            )
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

    backToSingleOfferScreen(uuid: string) {
        this.router.navigate([`/dash/offers/${uuid}`]);
    }
}
