import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from '../shared/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../shared/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
    projects$: Observable<Project[]>;

    isOverview = false;

    constructor(private projectService: ProjectService,
                private walletService: WalletService,
                private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        if (this.route.snapshot.params.isOverview) {
            this.isOverview = true;
        }

        this.projects$ = this.projectService.getAllActiveProjects().pipe(
            map(res => res.projects_with_wallet.map(pww => pww.project)));
    }
}
