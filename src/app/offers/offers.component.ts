import { Component, OnInit } from '@angular/core';
import { ProjectService, ProjectWallet } from '../shared/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
                private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.isOverview = this.route.snapshot.data.isOverview;
        this.projectsWallets$ = this.projectService.getAllActiveProjectsCached().pipe(
            map(res => res.projects_wallets)
        );
    }
}
