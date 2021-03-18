import { Component } from '@angular/core';
import {
    AbstractControl,
    AbstractControlOptions,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ProjectService } from '../../shared/services/project/project.service';
import { ErrorService } from '../../shared/services/error.service';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../shared/services/router.service';
import * as moment from 'moment';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { Organization, OrganizationService } from '../../shared/services/project/organization.service';
import { UserService } from '../../shared/services/user/user.service';
import { PopupService } from '../../shared/services/popup.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-project-new',
    templateUrl: './project-new.component.html',
    styleUrls: ['./project-new.component.scss']
})
export class ProjectNewComponent {
    mapLat: number;
    mapLong: number;
    bsConfig: Partial<BsDatepickerConfig>;

    createForm$: Observable<FormGroup>;
    ownOrgs$: Observable<Organization[]> = combineLatest(
        [this.userService.user$, this.organizationService.getPersonal()]
    ).pipe(
        this.errorService.handleError,
        map(([user, orgs]) => orgs.organizations.filter(org => org.owner_uuid === user.uuid)),
        switchMap(ownOrgs => ownOrgs.length > 0 ? of(ownOrgs) :
            this.popupService.info(this.translate.instant('projects.new.no_orgs')).pipe(
                tap(() => this.router.navigate(['/dash/groups/new'])),
                switchMap(() => EMPTY)
            )
        ),
        shareReplay(1)
    );

    constructor(private projectService: ProjectService,
                private fb: FormBuilder,
                private errorService: ErrorService,
                private activatedRoute: ActivatedRoute,
                private userService: UserService,
                private popupService: PopupService,
                private translate: TranslateService,
                private organizationService: OrganizationService,
                private router: RouterService) {
        this.createForm$ = this.ownOrgs$.pipe(
            map(orgs => {
                return this.fb.group({
                    name: ['', Validators.required],
                    org: [orgs[0], Validators.required],
                    startDate: ['', Validators.required],
                    endDate: ['', Validators.required],
                    expectedFunding: ['', [ProjectValidators.greaterThan(0)]],
                    minPerUser: ['', [ProjectValidators.greaterThan(0)]],
                    maxPerUser: ['', [ProjectValidators.greaterThan(0)]]
                }, <AbstractControlOptions>{
                    validator: Validators.compose([
                        ProjectValidators.fundingLimits,
                        ProjectValidators.fundingPeriodLimits
                    ])
                });
            })
        );
    }

    submitForm(form: FormGroup) {
        return () => {
            const formValue = form.value;
            formValue.startDate = moment(formValue.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            formValue.endDate = moment(formValue.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

            return this.projectService.createProject({
                organization_uuid: formValue.org.uuid,
                name: formValue.name,
                description: '',
                location: {lat: this.mapLat, long: this.mapLong},
                roi: {from: 0, to: 0},
                start_date: formValue.startDate,
                end_date: formValue.endDate,
                expected_funding: formValue.expectedFunding,
                currency: 'EUR',
                min_per_user: formValue.minPerUser,
                max_per_user: formValue.maxPerUser,
                active: false
            }).pipe(
                this.errorService.handleError,
                tap(project => {
                    this.router.navigate([`/dash/projects/${project.uuid}/edit`]);
                })
            );
        };
    }

    setDatepickerOptions() {
        this.bsConfig = Object.assign({}, {
            showTodayButton: true,
            todayPosition: 'right',
            containerClass: 'theme-default',
            isAnimated: true,
            dateInputFormat: 'DD-MM-YYYY'
        });
    }
}

class ProjectValidators {
    static greaterThan(value: number): ValidatorFn {
        return (c: FormControl) => c.value > value ? null : {invalid: true};
    }

    static fundingLimits(c: AbstractControl): ValidationErrors | null {
        const minPerUser = Number(c.get('minPerUser').value);
        const maxPerUser = Number(c.get('maxPerUser').value);
        const expectedFunding = Number(c.get('expectedFunding').value);

        if (minPerUser > maxPerUser) {
            return {invalidMinMax: true};
        }

        if (maxPerUser > expectedFunding) {
            return {invalidMaxExpectedFunding: true};
        }

        return null;
    }

    static fundingPeriodLimits(c: AbstractControl): ValidationErrors | null {
        const startDate = c.get('startDate').value;
        const endDate = c.get('endDate').value;

        return Date.parse(endDate) >= Date.parse(startDate) ?
            null : {invalidStartEndDate: true};
    }
}
