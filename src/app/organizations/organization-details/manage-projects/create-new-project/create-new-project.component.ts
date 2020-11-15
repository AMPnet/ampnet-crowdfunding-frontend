import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../shared/services/project/project.service';
import { displayBackendErrorRx } from '../../../../utilities/error-handler';
import { RouterService } from '../../../../shared/services/router.service';

@Component({
    selector: 'app-create-new-project',
    templateUrl: './create-new-project.component.html',
    styleUrls: ['./create-new-project.component.scss']
})
export class CreateNewProjectComponent {
    createForm: FormGroup;
    mapLat: number;
    mapLong: number;
    projectCoords = [];
    bsConfig: Partial<BsDatepickerConfig>;

    constructor(private projectService: ProjectService,
                private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: RouterService) {

        this.createForm = this.fb.group({
            name: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            expectedFunding: ['', [ProjectValidators.greaterThan(0)]],
            minPerUser: ['', [ProjectValidators.greaterThan(0)]],
            maxPerUser: ['', [ProjectValidators.greaterThan(0)]]
        }, {
            validator: Validators.compose([
                ProjectValidators.fundingLimits,
                ProjectValidators.fundingPeriodLimits
            ])
        });
    }

    submitForm() {
        const orgID = this.activatedRoute.snapshot.params.orgId;
        const formValue = this.createForm.value;
        formValue.startDate = moment(formValue.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.endDate = moment(formValue.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

        return this.projectService.createProject({
            organization_uuid: orgID,
            name: formValue.name,
            description: '',
            location: {lat: this.mapLat, long: this.mapLong},
            roi: {from: 2.1, to: 5.3},
            start_date: formValue.startDate,
            end_date: formValue.endDate,
            expected_funding: formValue.expectedFunding,
            currency: 'EUR',
            min_per_user: formValue.minPerUser,
            max_per_user: formValue.maxPerUser,
            active: false
        }).pipe(
            displayBackendErrorRx(),
            tap(project => {
                this.router.navigate([`/dash/manage_groups/${orgID}/manage_project/${project.uuid}`]);
            })
        );
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

    backToOrganizationDetailsScreen() {
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
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
