import { Component, OnInit } from '@angular/core';
import { ProjectService, ProjectWallet } from '../shared/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorService } from '../shared/services/error.service';
import { CacheService } from '../shared/services/cache.service';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
    projectsWallets$: Observable<ProjectWallet[]>;

    isOverview: boolean;

    constructor(private projectService: ProjectService,
                private walletService: WalletService,
                private errorService: ErrorService,
                private cacheService: CacheService,
                private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.isOverview = this.route.snapshot.data.isOverview;
        this.projectsWallets$ = this.cacheService.setAndGet('projects/active',
            this.projectService.getAllActiveProjects().pipe(
                this.errorService.handleError,
                map(res => res.projects_wallets)
            ), 30_000);
    }
}
