import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../shared/services/project/project.service';
import { displayBackendError } from '../../../../utilities/error-handler';

@Component({
    selector: 'app-create-new-project',
    templateUrl: './create-new-project.component.html',
    styleUrls: ['./create-new-project.component.css'],
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
                private router: Router) {

        this.createForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            expectedFunding: ['', Validators.required],
            minPerUser: ['', Validators.required],
            maxPerUser: ['', Validators.required]
        }, {
            validator: Validators.compose([
                DateValidator.startDateLessThanEndDate('startDate', 'endDate', {invalidStartEndDate: true}),
                MinInvestUserValidator.investGreaterThanZero('minPerUser', {invalidMinInvest: true}),
                MaxInvestUserValidator.minPerUserGreaterThatMaxPerUser('minPerUser', 'maxPerUser', {invalidMaxInvest: true}),
                MaxInvestProjectValidator.expFundingGreaterThatMaxPerUser('maxPerUser', 'expectedFunding', {invalidExpectedFunding: true})
            ])
        });
    }

    submitForm() {
        const formValue = this.createForm.value;
        formValue.startDate = moment(formValue.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.endDate = moment(formValue.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        const orgID = this.activatedRoute.snapshot.params.orgId;

        return this.projectService.createProject({
            organization_uuid: orgID,
            name: formValue.name,
            description: formValue.description,
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
            tap(project => {
                this.router.navigate([`/dash/manage_groups/${orgID}/manage_project/${project.uuid}`]);
            }),
            catchError(err => {
                displayBackendError(err);
                return throwError(err);
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
}

class MaxInvestUserValidator {
    // tslint:disable-next-line:max-line-length
    static minPerUserGreaterThatMaxPerUser(minPerUserField: string, maxPerUserField: string, validatorError: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const minPerUser = c.get(minPerUserField).value;
            const maxPerUser = c.get(maxPerUserField).value;
            if (minPerUser > maxPerUser) {
                return validatorError;
            }

            return null;
        };
    }
}

class MinInvestUserValidator {
    static investGreaterThanZero(minPerUserField: string, validatorError: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const minPerUser = c.get(minPerUserField).value;
            if (minPerUser <= 0) {
                return validatorError;
            }

            return null;
        };
    }
}

class MaxInvestProjectValidator {
    // tslint:disable-next-line:max-line-length
    static expFundingGreaterThatMaxPerUser(maxPerUserField: string, expFundingField: string, validatorError: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const maxPerUser = c.get(maxPerUserField).value;
            const expFunding = c.get(expFundingField).value;
            if (expFunding <= maxPerUser) {
                return validatorError;
            }

            return null;
        };
    }
}

class DateValidator {
    static startDateLessThanEndDate(dateStartField: string, dateEndField: string, validatorError: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const startDate = c.get(dateStartField).value;
            const endDate = c.get(dateEndField).value;
            if ((startDate !== null && endDate !== null) && startDate > endDate) {
                return validatorError;
            }

            return null;
        };
    }
}
