import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsPreviewService } from 'src/app/shared/services/news-preview.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { centsToBaseCurrencyUnit } from 'src/app/utilities/currency-util';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import swal from 'sweetalert2';
import { NewsLink } from '../../manage-projects/manage-single-project/news-link-model';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { Wallet } from 'src/app/shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Component({
    selector: 'app-offer-details',
    templateUrl: './offer-details.component.html',
    styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {
    project: Project;
    wallet: Wallet;
    newsPreviews: NewsLink[];

    isOverview = false;
    isPortfolio = false;
    userConfirmed = true;

    constructor(private projectService: ProjectService,
                private newsPreviewService: NewsPreviewService,
                private walletService: WalletService,
                private route: ActivatedRoute,
                private userService: UserService,
                private meta: Meta,
                private router: Router,
                private fb: FacebookService) {

        const initParams: InitParams = {
            // Todo we need to create FacebookApp to get AppID
            appId: '241902920447787',
            xfbml: true,
            version: 'v2.8'
        };

        fb.init(initParams);
    }

    ngOnInit() {
        this.generateProjectView();

        if (this.route.snapshot.params.isOverview) {
            this.isOverview = true;
        }
        if (this.route.snapshot.params.inPortfolio) {
            this.isPortfolio = true;
        }

        if (!this.isOverview && !this.isPortfolio) {
            SpinnerUtil.showSpinner();
            this.userService.getOwnProfile().subscribe(res => {
                this.userConfirmed = res.verified;
                SpinnerUtil.hideSpinner();
            }, hideSpinnerAndDisplayError);
        }
    }

    setUpNewsPreviews(newsLinks: string[]) {
        newsLinks.forEach(link => {
            this.newsPreviewService.getLinkPreview(link).subscribe(res => {
                this.newsPreviews.push({
                    title: res.title,
                    description: res.description,
                    image: res.image.url,
                    url: link
                });
            });
        });
    }

    setMetaTags() {
        this.meta.addTag({
            name: 'og:title',
            content: this.project.name
        });
        this.meta.addTag({
            name: 'og:description',
            content: this.project.description
        });
        this.meta.addTag({
            name: 'og:image:secure_url',
            content: this.project.main_image
        });
        this.meta.addTag({
            name: 'og:url',
            content: window.location.href
        });
    }


    generateProjectView() {
        const projectID = this.route.snapshot.params.id;

        this.projectService.getProject(projectID).subscribe(project => {
            this.project = project;

            this.project.expected_funding = centsToBaseCurrencyUnit(project.expected_funding);
            this.project.min_per_user = centsToBaseCurrencyUnit(project.min_per_user);
            this.project.max_per_user = centsToBaseCurrencyUnit(project.max_per_user);

            this.setUpNewsPreviews(this.project.news);
            this.setMetaTags();
        });

        this.walletService.getProjectWallet(projectID).subscribe(wallet => {
            wallet.balance = centsToBaseCurrencyUnit(wallet.balance || 0);
            this.wallet = wallet;
        }, err => {
            if (err.error.err_code === '0851') {
                swal('Pending confirmation',
                    'The project is being verified - this should take up to 5 minutes. Please check later',
                    'info').then(() => {
                    window.history.back();
                });
            } else {
                displayBackendError(err);
            }
        });
    }

    copyProjectDetailsUrl() {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = window.location.href;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    backToOffersScreen() {
        this.router.navigate(['dash/offers']);
    }

    shareUrlOnFacebook() {
        const params: UIParams = {
            // tslint:disable-next-line:max-line-length
            // TODO change hardcoded href, also we need to add this Site URL to a newly created FacebookApp (Settings - Basic - WebSite) in order to work
            href: 'https://demo.ampnet.io/' + this.router.url,
            method: 'share',
        };

        this.fb.ui(params)
            .then((res: UIResponse) => console.log(res))
            .catch((e: any) => console.error(e));
    }
}
