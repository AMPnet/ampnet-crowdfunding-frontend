import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProjectService } from '../../shared/services/project/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { autonumericCurrency, baseCurrencyUnitToCents, stripCurrencyData } from 'src/app/utilities/currency-util';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

declare var $: any;

@Component({
    selector: 'app-create-new-project',
    templateUrl: './create-new-project.component.html',
    styleUrls: ['./create-new-project.component.css'],
})
export class CreateNewProjectComponent implements OnInit {
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
        });
    }

    submitForm() {
        const formValue = this.createForm.value;
        formValue.startDate = moment(formValue.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.endDate = moment(formValue.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        const orgID = this.activatedRoute.snapshot.params.orgId;

        SpinnerUtil.showSpinner();

        this.projectService.createProject({
            organization_uuid: orgID,
            name: formValue.name,
            description: formValue.description,
            location: {lat: this.mapLat, long: this.mapLong},
            roi: {from: 2.1, to: 5.3},
            start_date: formValue.startDate,
            end_date: formValue.endDate,
            expected_funding: baseCurrencyUnitToCents(parseInt(stripCurrencyData(formValue.expectedFunding), 10)),
            currency: 'EUR',
            min_per_user: baseCurrencyUnitToCents(parseInt(stripCurrencyData(formValue.minPerUser), 10)),
            max_per_user: baseCurrencyUnitToCents(parseInt(stripCurrencyData(formValue.maxPerUser), 10)),
            active: false
        }).subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.router.navigate(['/dash', 'manage_groups', orgID.toString(), 'manage_project', res.uuid]);
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
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

    ngOnInit() {
        $(document).ready(() => {
            autonumericCurrency('#min-per-user-input');
            autonumericCurrency('#max-per-user-input');
            autonumericCurrency('#expected-funding-input');
        });
    }
}
