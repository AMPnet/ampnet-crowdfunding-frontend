import { Component, OnInit } from '@angular/core';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { displayBackendError } from '../utilities/error-handler';
import { InvestmentDetails, Project, ProjectInfo, ProjectService } from '../shared/services/project/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { PortfolioService } from '../shared/services/wallet/portfolio.service';
import { CurrencyDefaultPipe } from '../pipes/currency-default.pipe';
import { logger } from 'codelyzer/util/logger';

@Component({
    selector: 'app-invest',
    templateUrl: './invest.component.html',
    styleUrls: ['./invest.component.scss'],
})
export class InvestComponent implements OnInit {
    project$: Observable<Project>;
    investment$: Observable<InvestmentDetails>;

    projectInfo$: Observable<ProjectInfo>;
    investmentDetails$: Observable<InvestmentDetails>;

    maxInvestReached = false;
    minUserInvest: number;
    maxUserInvest: number;
    totalInvestment: number;

    oneYearReturn: string;
    fiveYearsReturn: string;
    tenYearsReturn: string;

    investForm: FormGroup;

    constructor(private walletService: WalletService,
                private projectService: ProjectService,
                private portfolioService: PortfolioService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private router: Router,
                private currencyPipe: CurrencyDefaultPipe) {
        const projectID = this.route.snapshot.params.id;
        this.project$ = this.projectService.getProject(projectID).pipe(this.handleError, shareReplay(1));
        this.investment$ = this.projectService.getInvestmentDetails().pipe(this.handleError);

        // this.projectService.getProjectInfo(projectID).pipe(this.handleError).subscribe(res => console.log('Export: ', res));
        this.projectService.getInvestmenDetails2().subscribe(data => console.log(data));
    }

    ngOnInit() {
        this.investForm = this.fb.group({
            amount: ['', [Validators.required], this.validAmount.bind(this)]
        });

        combineLatest(this.project$, this.investment$, (project, investment) => ({project, investment}))
            .subscribe(pair => {
                const maxInvest = pair.project.max_per_user;
                const minInvest = pair.project.min_per_user;
                const amountInvested = pair.investment.amountInvested;

                if (amountInvested > minInvest && amountInvested < maxInvest) {
                    this.minUserInvest = 0;
                    this.maxUserInvest = maxInvest - amountInvested;
                } else {
                    this.minUserInvest = minInvest;
                    this.maxUserInvest = maxInvest;
                }

                if (amountInvested === maxInvest) {
                    this.maxInvestReached = true;
                }
            });
    }

    private validAmount(control: AbstractControl): Observable<ValidationErrors> {
        return combineLatest([this.project$, this.investment$]).pipe(
            map(([project, investment]) => {
                    const amount = control.value;
                    const amountInvested = investment.amountInvested;

                    if (amount < this.minUserInvest) {
                        return {amountBelowMin: true};
                    } else if (amount > this.maxUserInvest) {
                        return {amountAboveMax: true};
                    } else if (amount > project.expected_funding) {
                        return {amountAboveExpFunding: true};
                    } else if (amount > investment.walletBalance) {
                        return {amountAboveBalance: true};
                    } else {
                        this.totalInvestment = amountInvested + amount;
                        this.oneYearReturn = this.calculateReturn(this.totalInvestment, 1, project.roi.from, project.roi.to);
                        this.fiveYearsReturn = this.calculateReturn(this.totalInvestment, 5, project.roi.from, project.roi.to);
                        this.tenYearsReturn = this.calculateReturn(this.totalInvestment, 10, project.roi.from, project.roi.to);
                        return null;
                    }
                }
            )
        );
    }

    calculateReturn(totalInvestment: number, year: number, roiFrom: number, roiTo: number) {
        return (this.currencyPipe.transform(Math.floor(totalInvestment * (roiFrom * year)))) + ' - '
            + (this.currencyPipe.transform(Math.trunc(totalInvestment * (roiTo * year))));
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
                console.log('Error: ', err);
                displayBackendError(err);
                return EMPTY;
            })
        );
    }

    backToSingleOfferScreen(uuid: string) {
        this.router.navigate([`/dash/offers/${uuid}`]);
    }
}
