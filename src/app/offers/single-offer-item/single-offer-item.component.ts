import { Component, Input, OnInit } from '@angular/core';
import { OfferModel } from '../OfferModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/projects/project-service';
import { autonumericCurrency, prettyCurrency } from 'src/app/utilities/currency-util';

@Component({
    selector: 'app-single-offer-item',
    templateUrl: './single-offer-item.component.html',
    styleUrls: ['./single-offer-item.component.css']
})
export class SingleOfferItemComponent implements OnInit {

    @Input() public component: OfferModel;

    constructor(private router: Router,
                private projectService: ProjectService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.component.currency = prettyCurrency(this.component.currency);
        if (this.component.headerImageUrl === null) {
            this.component.headerImageUrl = '../../../assets/noimage.png';
        }
        //Kod koji se koristi u kombinaciji s ispravnim formatom prikaza valute
        /* setTimeout(() => {
            autonumericCurrency('.req-funding-' + this.component.offerID);
        }, 300); */

    }


    onClickedItem() {
        if (this.route.snapshot.params.isOverview) {

            this.router.navigate(['overview', this.component.offerID, 'discover']);
        } else {
            this.router.navigate(['dash', 'offers', this.component.offerID]);
        }
    }

}
