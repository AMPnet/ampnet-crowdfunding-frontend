import { Component } from '@angular/core';
import { ProjectService } from '../../shared/services/project/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
        });
    }

    submitForm() {
        const formValue = this.createForm.value;
        formValue.startDate = moment(formValue.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.endDate = moment(formValue.endDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
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
}
