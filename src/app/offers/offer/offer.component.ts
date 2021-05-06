import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LinkPreview, NewsPreviewService } from 'src/app/shared/services/news-preview.service';
import { UserService } from 'src/app/shared/services/user/user.service';
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
import { TranslateService } from '@ngx-translate/core';
import { enterTrigger } from '../../shared/animations';

@Component({
    selector: 'app-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.scss'],
    animations: [enterTrigger]
})
export class OfferComponent {
    isOverview: boolean;
    isPortfolioView: boolean;

    project$: Observable<Project>;
    news$: Observable<{ newsList: LinkPreview[] }>;
    user$: Observable<User>;
    projectWalletMW$: Observable<ProjectWalletInfo>;
    investmentTotal$: Observable<number>;
    transactions$: Observable<ProjectTransactions>;
    isProjectCancelable$: Observable<boolean>;
    isProjectWalletCreated$: Observable<boolean>;
    isProjectEditable$: Observable<boolean>;

    bsModalRef: BsModalRef;

    constructor(private projectService: ProjectService,
                private newsPreviewService: NewsPreviewService,
                private walletService: WalletService,
                private middlewareService: MiddlewareService,
                private route: ActivatedRoute,
                private userService: UserService,
                private meta: Meta,
                private router: RouterService,
                private translate: TranslateService,
                private modalService: BsModalService,
                private portfolioService: PortfolioService,
                private popupService: PopupService,
                private arkaneService: ArkaneService) {
        this.isOverview = this.route.snapshot.data.isOverview;
        this.isPortfolioView = this.route.snapshot.data.isPortfolioView;
        const projectUUID = this.route.snapshot.params.id;

        this.project$ = this.projectService.getProject(projectUUID).pipe(
            tap(project => this.setMetaTags(project)),
            shareReplay(1)
        );

        this.news$ = this.project$.pipe(
            switchMap(project => project.news.length ? forkJoin(
                project.news.map(singleNews => this.newsPreviewService.getLinkPreview(singleNews))) : of([])
            ),
            map(news => ({newsList: news})),
        );

        this.isProjectWalletCreated$ = this.project$.pipe(
            map(project => Boolean(project.wallet.hash))
        );

        this.projectWalletMW$ = this.isProjectWalletCreated$.pipe(
            switchMap(isCreated => isCreated ? this.walletService.getProjectWallet(projectUUID) : EMPTY),
            switchMap(wallet => this.middlewareService.getProjectWalletInfoCached(wallet.hash)),
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

        this.transactions$ = this.portfolioService.getInvestmentsInProject(projectUUID).pipe(
            shareReplay(1)
        );

        this.isProjectCancelable$ = combineLatest([this.projectWalletMW$, this.walletService.wallet$]).pipe(
            take(1),
            switchMap(([projectWallet, wallet]) => {
                return this.portfolioService.investmentDetails(projectWallet.projectHash, wallet.wallet.hash).pipe(
                    map(res => res.investmentCancelable)
                );
            })
        );

        this.isProjectEditable$ = this.projectService.getPersonal().pipe(
            map(projects => Boolean(projects.projects.find(p => p.uuid === projectUUID)))
        );
    }

    setMetaTags(project: Project) {
        this.meta.addTag({property: 'og:title', content: project.name});
        this.meta.addTag({property: 'og:description', content: project.short_description});
        this.meta.addTag({property: 'og:image', content: project.main_image});
        this.meta.addTag({property: 'og:url', content: window.location.href});
        this.meta.addTag({name: 'twitter:card', content: 'summary_large_image'});
    }

    copyProjectDetailsUrl(el: TooltipDirective, project: Project) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.getProjectURL(project, false);
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);

        el.show();
        timer(2000).subscribe(() => el.hide());
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

    getProjectURL(project: Project, uriComponent = true) {
        const url = `${window.location.host}/${project.coop}/offers/${project.uuid}`;

        return uriComponent ? encodeURIComponent(url) : encodeURI(url);
    }

    goToInvest(projectUUID: string) {
        this.router.navigate([`/dash/offers/${projectUUID}/invest`]);
    }

    cancelInvestment(projectUUID: string) {
        return () => {
            return this.portfolioService.generateCancelInvestmentTransaction(projectUUID).pipe(
                switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
                switchMap(() => this.popupService.new({
                    type: 'success',
                    title: this.translate.instant('general.transaction_signed.title'),
                    text: this.translate.instant('general.transaction_signed.description')
                })),
                switchMap(() => this.router.navigate(['/dash/wallet']))
            );
        };
    }

    onPublishedByClicked(organizationUUID: string) {
        if (this.route.snapshot.data.isOverview) {
            this.router.navigate([`/groups/${organizationUUID}`]);
        } else {
            this.router.navigate([`/dash/groups/${organizationUUID}`]);
        }
    }
}
