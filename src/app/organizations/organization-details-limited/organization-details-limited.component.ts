import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Organization, OrganizationMember, OrganizationService } from '../../shared/services/project/organization.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';

@Component({
    selector: 'app-organization-details',
    templateUrl: './organization-details-limited.component.html',
    styleUrls: ['./organization-details-limited.component.scss']
})
export class OrganizationDetailsLimitedComponent implements OnInit {
    refreshOrganizationSubject = new BehaviorSubject<void>(null);
    refreshOrgMembersSubject = new BehaviorSubject<void>(null);

    organization$: Observable<Organization>;
    orgMembers$: Observable<OrganizationMember[]>;

    isOverview = false;

    constructor(private activatedRoute: ActivatedRoute,
                private router: RouterService,
                private errorService: ErrorService,
                private organizationService: OrganizationService) {
    }

    ngOnInit() {
        const orgID = this.activatedRoute.snapshot.params.id;
        if (this.activatedRoute.snapshot.params.isOverview) {
            this.isOverview = true;
        }
        this.organization$ = this.refreshOrganizationSubject.asObservable().pipe(
            switchMap(() => this.organizationService.getSingleOrganization(orgID)
                .pipe(this.errorService.handleError))
        );

        this.orgMembers$ = this.refreshOrgMembersSubject.pipe(
            switchMap(_ => this.organizationService.getMembersForOrganization(orgID)
                .pipe(this.errorService.handleError)),
            map(res => res.members));
    }

    backToGroupsScreen() {
        if (this.isOverview) {
            this.router.navigate(['/overview/discover']);
        } else {
            this.router.navigate(['/dash/offers']);
        }
    }
}
