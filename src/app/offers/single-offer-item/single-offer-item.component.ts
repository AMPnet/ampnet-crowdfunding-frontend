import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectWallet } from 'src/app/shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { MiddlewareService, ProjectWalletInfo } from '../../shared/services/middleware/middleware.service';
import { RouterService } from '../../shared/services/router.service';

@Component({
    selector: 'app-single-offer-item',
    templateUrl: './single-offer-item.component.html',
    styleUrls: ['./single-offer-item.component.scss']
})
export class SingleOfferItemComponent implements OnInit {
    @Input() projectWallet: ProjectWallet;
    projectWallet$: Observable<ProjectWalletInfo>;

    constructor(private router: RouterService,
                private walletService: WalletService,
                private middlewareService: MiddlewareService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.projectWallet.project.main_image = this.projectWallet.project.main_image ?? '../../../assets/noimage.png';
        this.projectWallet$ = this.middlewareService.getProjectWalletInfoCached(this.projectWallet.wallet.hash);
    }

    onClickedItem() {
        if (this.route.snapshot.params.isOverview) {
            this.router.navigate(['/overview', this.projectWallet.project.uuid, 'discover']);
        } else {
            this.router.navigate(['/dash', 'offers', this.projectWallet.project.uuid]);
        }
    }

    onPublishedClicked() {
        if (this.route.snapshot.params.isOverview) {
            this.router.navigate([`/overview/orgs/${this.projectWallet.organization.uuid}/discover`]);
        } else {
            this.router.navigate([`/dash/orgs/${this.projectWallet.organization.uuid}`]);
        }
    }
}
