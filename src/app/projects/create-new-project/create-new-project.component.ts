import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../shared/services/project/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { autonumericCurrency, baseCurrencyUnitToCents, stripCurrencyData } from 'src/app/utilities/currency-util';
import * as L from 'leaflet';

declare var $: any;

@Component({
    selector: 'app-create-new-project',
    templateUrl: './create-new-project.component.html',
    styleUrls: ['./create-new-project.component.css']
})
export class CreateNewProjectComponent implements OnInit, AfterViewInit {
    createProjectForm: FormGroup;
    private map;
    mapMarker;
    mapLat : number;
    mapLong : number;

    constructor(private projectService: ProjectService,
                private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.createProjectForm = this.fb.group({
            'name': [' ', Validators.required],
            'description': [' ', Validators.required],
            'colloqual': [' ', Validators.required],
            'startDate': [' ', Validators.required],
            'endDate': [' ', Validators.required],
            'expectedFunding': [' ', Validators.required],
            'minPerUser': [' ', Validators.required],
            'maxPerUser': [' ', Validators.required]
        });
    }

    submitForm() {
        if (!this.createProjectForm.valid) {
            return;
        }
        const formValue = this.createProjectForm.value;
        const date = moment(formValue.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.startDate = date;
        formValue.endDate = moment(formValue.endDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        formValue.location = 'abc';
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
            console.log(location);
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    private initMap(): void {
        this.map = L.map("map").setView([37.97404469468311, 23.71933726268805], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.map.on("click", e => {
        if (this.mapMarker) {
            this.map.removeLayer(this.mapMarker);
        }
        this.mapMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
        
        this.mapLat = e.latlng.lat;
        this.mapLong = e.latlng.lng;
        });   
      }

    ngOnInit() {
        $(document).ready(() => {
            autonumericCurrency('#min-per-user-input');
            autonumericCurrency('#max-per-user-input');
            autonumericCurrency('#expected-funding-input');
        });
    }

    ngAfterViewInit() {
        this.initMap();
    }

    submitButtonClicked() {
    }
}
