import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { Observable } from 'rxjs';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';

@Component({
    selector: 'app-single-offer-item',
    templateUrl: './single-offer-item.component.html',
    styleUrls: ['./single-offer-item.component.css']
})
export class SingleOfferItemComponent implements OnInit {
    @Input() project: Project;
    projectWallet$: Observable<WalletDetails>;

    constructor(private router: Router,
                private walletService: WalletService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.project.main_image = this.project.main_image ?? '../../../assets/noimage.png';
        this.projectWallet$ = this.walletService.getProjectWallet(this.project.uuid);
    }

    onClickedItem() {
        if (this.route.snapshot.params.isOverview) {
            this.router.navigate(['overview', this.project.uuid, 'discover']);
        } else {
            this.router.navigate(['dash', 'offers', this.project.uuid]);
        }
    }
}
