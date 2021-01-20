import { Component, OnInit } from '@angular/core';
import { WalletDetailsWithState, WalletService } from '../shared/services/wallet/wallet.service';
import { Project, ProjectService } from '../shared/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { DetailsResult, PortfolioService } from '../shared/services/wallet/portfolio.service';
import { ErrorService } from '../shared/services/error.service';

@Component({
    selector: 'app-invest',
    templateUrl: './invest.component.html',
    styleUrls: ['./invest.component.scss'],
})
export class InvestComponent implements OnInit {
    project$: Observable<Project>;
    investmentData$: Observable<InvestmentData>;

    private projectionSubject = new BehaviorSubject<ProjectionData>(null);
    projection$ = this.projectionSubject.asObservable();

    investForm: FormGroup;

    constructor(private walletService: WalletService,
                private projectService: ProjectService,
                private portfolioService: PortfolioService,
                private route: ActivatedRoute,
                private errorService: ErrorService,
                private fb: FormBuilder) {
        const projectID = this.route.snapshot.params.id;

        this.project$ = this.projectService.getProject(projectID).pipe(
            this.errorService.handleError,
            shareReplay(1)
        );

        this.investmentData$ = combineLatest([this.project$, this.walletService.wallet$]).pipe(take(1),
            switchMap(([project, wallet]) =>
                this.portfolioService.investmentDetails(project.wallet.hash, wallet.wallet.hash).pipe(
                    this.errorService.handleError,
                    map(invDetails => this.computeInvestmentData(project, wallet, invDetails))
                )
            ),
            shareReplay(1)
        );
    }

    ngOnInit() {
        this.investForm = this.fb.group({
            amount: ['', [Validators.required], this.validAmount.bind(this)]
        });
    }

    private computeInvestmentData(project: Project,
                                  wallet: WalletDetailsWithState,
                                  invDetails: DetailsResult): InvestmentData {
        const expected = project.expected_funding;
        const min = project.min_per_user;
        const max = project.max_per_user;
        const funded = invDetails.totalFundsRaised;
        const userBalance = wallet.wallet.balance;
        const userInvested = invDetails.amountInvested;

        const projectInvestGap = expected - funded;
        const userInvestGap = max - userInvested;

        const userMaxInvest = Math.min(projectInvestGap, userInvestGap);
        const userMinInvest = min > userInvested ? Math.min(min, userMaxInvest) : 1_00;

        const maximumReached = max === userInvested;

        return <InvestmentData>{
            roi: project.roi,

            projectExpected: expected,
            projectMinPerTx: min,
            projectMaxPerUser: max,
            projectFunded: funded,
            userBalance: userBalance,
            userInvested: userInvested,

            projectInvestGap: projectInvestGap,
            userInvestGap: userInvestGap,

            userMinInvest: userMinInvest,
            userMaxInvest: userMaxInvest,

            investDisabled: userMinInvest > userBalance || maximumReached,
            notEnoughFunds: userMinInvest > userBalance,
            maximumReached: maximumReached
        };
    }

    private validAmount(control: AbstractControl): Observable<ValidationErrors | null> {
        return combineLatest([this.investmentData$]).pipe(take(1),
            map(([investmentData]) => {
                    this.projectionSubject.next(null);
                    const amount = control.value;

                    if (amount < investmentData.userMinInvest) {
                        return {amountBelowMin: true};
                    } else if (amount > investmentData.userMaxInvest) {
                        return {amountAboveMax: true};
                    } else if (amount > investmentData.userBalance) {
                        return {amountAboveBalance: true};
                    } else {
                        this.calculatePredictions(amount, investmentData);
                        return null;
                    }
                }
            )
        );
    }

    calculatePredictions(amount: number, data: InvestmentData) {
        const total = data.userInvested + amount;
        const prediction = (investment: number, roiRange: ProjectionRange, year: number): ProjectionRange => {
            const predictionFunc = (i: number, roi: number, y: number) =>
                i * (roi / 100) * y;

            return {
                from: predictionFunc(investment, roiRange.from, year),
                to: predictionFunc(investment, roiRange.to, year),
            };
        };

        this.projectionSubject.next({
            totalInvestment: total,
            oneYearReturn: prediction(total, data.roi, 1),
            fiveYearsReturn: prediction(total, data.roi, 5),
            tenYearsReturn: prediction(total, data.roi, 10),
        });
    }
}

interface ProjectionData {
    totalInvestment: number;
    oneYearReturn: ProjectionRange;
    fiveYearsReturn: ProjectionRange;
    tenYearsReturn: ProjectionRange;
}

interface ProjectionRange {
    from: number;
    to: number;
}

interface InvestmentData {
    roi: ProjectionRange;

    projectExpected: number;
    projectMinPerTx: number;
    projectMaxPerUser: number;
    projectFunded: number;
    userBalance: number;
    userInvested: number;

    projectInvestGap: number;
    userInvestGap: number;

    userMinInvest: number;
    userMaxInvest: number;

    notEnoughFunds: boolean;
    maximumReached: boolean;
    investDisabled: boolean;
}
