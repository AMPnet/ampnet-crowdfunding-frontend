import { Component, Input, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LinkPreview, NewsPreviewService } from 'src/app/shared/services/news-preview.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MapModalComponent } from 'src/app/location-map/map-modal/map-modal.component';
import { combineLatest, EMPTY, forkJoin, Observable, of, timer } from 'rxjs';
import { find, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { User } from '../../shared/services/user/signup.service';
import { MiddlewareService, ProjectWalletInfo } from '../../shared/services/middleware/middleware.service';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { PortfolioService, ProjectTransactions } from '../../shared/services/wallet/portfolio.service';
import { PopupService } from '../../shared/services/popup.service';
import { ArkaneService } from '../../shared/services/arkane.service';
import { RouterService } from '../../shared/services/router.service';

@Component({
    selector: 'app-offer-details',
    templateUrl: './offer-details.component.html',
    styleUrls: ['./offer-details.component.scss'],
})
export class OfferDetailsComponent implements OnInit {
    isOverview = false;

    @Input() isPortfolioView = false;

    project$: Observable<Project>;
    news$: Observable<LinkPreview[]>;
    user$: Observable<User>;
    projectWalletMW$: Observable<ProjectWalletInfo>;
    investmentTotal$: Observable<number>;
    transactions$: Observable<ProjectTransactions>;
    isProjectCancelable$: Observable<boolean>;

    bsModalRef: BsModalRef;

    constructor(private projectService: ProjectService,
                private newsPreviewService: NewsPreviewService,
                private walletService: WalletService,
                private middlewareService: MiddlewareService,
                private route: ActivatedRoute,
                private userService: UserService,
                private meta: Meta,
                private router: RouterService,
                private modalService: BsModalService,
                private portfolioService: PortfolioService,
                private popupService: PopupService,
                private arkaneService: ArkaneService) {
        const projectID = this.route.snapshot.params.id;
        this.project$ = this.projectService.getProject(projectID).pipe(
            displayBackendErrorRx(),
            tap(project => this.setMetaTags(project)),
            shareReplay(1)
        );

        this.news$ = this.project$.pipe(
            switchMap(project => forkJoin(
                project.news.map(singleNews => {
                    return this.newsPreviewService.getLinkPreview(singleNews).pipe(
                        displayBackendErrorRx(),
                    );
                }))
            ),
        );

        this.projectWalletMW$ = this.walletService.getProjectWallet(projectID).pipe(
            displayBackendErrorRx(),
            shareReplay(),
            switchMap(projectWallet => {
                return this.middlewareService.getProjectWalletInfoCached(projectWallet.hash).pipe(
                    displayBackendErrorRx(),
                );
            }),
        );

        this.user$ = of(!this.isOverview).pipe(
            switchMap(shouldLoadUser => shouldLoadUser ? this.userService.user$ : EMPTY),
            take(1)
        );

        this.investmentTotal$ = this.portfolioService.getPortfolio().pipe(
            switchMap(res => res.portfolio),
            find(item => item.project.uuid === this.route.snapshot.params.id),
            map(portfolio => portfolio?.investment)
        );

        this.transactions$ = this.portfolioService.getInvestmentsInProject(projectID).pipe(
            displayBackendErrorRx(),
            shareReplay(1)
        );

        this.isProjectCancelable$ = combineLatest([this.projectWalletMW$, this.walletService.wallet$]).pipe(
            take(1),
            switchMap(([projectWallet, wallet]) => {
                return this.portfolioService.investmentDetails(projectWallet.projectHash, wallet.wallet.hash).pipe(
                    displayBackendErrorRx(),
                    map(res => res.investmentCancelable)
                );
            })
        );
    }

    ngOnInit() {
        if (this.route.snapshot.params.isOverview) {
            this.isOverview = true;
        }
    }

    setMetaTags(project: Project) {
        this.meta.addTag({
            name: 'og:title',
            content: project.name
        });
        this.meta.addTag({
            name: 'og:description',
            content: project.description
        });
        this.meta.addTag({
            name: 'og:image:secure_url',
            content: project.main_image
        });
        this.meta.addTag({
            name: 'og:url',
            content: window.location.href
        });
    }

    copyProjectDetailsUrl(el: TooltipDirective, projectUUID: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.getProjectURL(projectUUID, false);
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);

        el.show();
        timer(2000).subscribe(() => el.hide());
    }

    backToPreviousScreen() {
        if (!this.isPortfolioView) {
            if (this.isOverview) {
                this.router.navigate(['/overview/discover']);
            } else {
                this.router.navigate(['/dash/offers']);
            }
        } else {
            this.router.navigate(['/dash/my_portfolio']);
        }
    }

    openModal(project: Project) {
        this.bsModalRef = this.modalService.show(MapModalComponent, {
            initialState: {
                lat: project.location.lat,
                lng: project.location.long
            },
            class: 'modal-lg modal-dialog-centered'
        });
    }

    disableInvestButton(project: Project, walletMW: ProjectWalletInfo): boolean {
        return !project.active || (!walletMW || walletMW.investmentCap === walletMW.totalFundsRaised);
    }

    getProjectURL(projectUUID: string, uriComponent = true) {
        const url = `${window.location.host}/overview/${projectUUID}/discover`;

        return uriComponent ? encodeURIComponent(url) : encodeURI(url);
    }

    goToInvest(projectUUID: string) {
        this.router.navigate([`/dash/offers/${projectUUID}/invest`]);
    }

    cancelInvestment(projectUUID: string) {
        return () => {
            return this.portfolioService.generateCancelInvestmentTransaction(projectUUID).pipe(
                displayBackendErrorRx(),
                switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
                switchMap(() => this.popupService.new({
                    type: 'success',
                    title: 'Transaction signed',
                    text: 'Transaction is being processed...',
                    customClass: 'popup-success',
                    position: 'top'
                })),
                switchMap(() => this.router.navigate(['/dash/wallet']))
            );
        };
    }
}
