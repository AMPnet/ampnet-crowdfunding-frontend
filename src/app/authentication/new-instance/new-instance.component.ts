import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { CoopService, CreateCoopData } from '../../shared/services/user/coop.service';
import { RouterService } from '../../shared/services/router.service';
import { PopupService } from '../../shared/services/popup.service';
import { FileValidator } from '../../shared/validators/file.validator';
import { ErrorService } from '../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-new-instance',
    templateUrl: './new-instance.component.html',
    styleUrls: [
        '../auth-layout/auth-layout.component.scss',
        './new-instance.component.css'
    ],
    providers: [
        {provide: 'WINDOW', useValue: window}
    ]
})
export class NewInstanceComponent implements OnInit {
    createCoopForm: FormGroup;

    constructor(private coopService: CoopService,
                private router: RouterService,
                private popupService: PopupService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private fb: FormBuilder,
                @Inject('WINDOW') public window: Window) {
        this.createCoopForm = this.fb.group({
            name: ['', [Validators.required]],
            identifier: ['', [Validators.required, Validators.pattern(/^[a-z0-9\-_]{3,}$/)]],
            webTitle: ['', [Validators.required]],
            logo: [null, FileValidator.validate],
            banner: [null, FileValidator.validate]
        });
    }

    ngOnInit(): void {
    }

    onFormSubmit() {
        const coop = this.createCoopForm.value;
        const createCoopData: CreateCoopData = {
            name: coop.name,
            identifier: coop.identifier,
            config: {
                title: coop.webTitle
            }
        };

        return this.coopService.createCoop(createCoopData, coop.logo, coop.banner).pipe(
            this.errorService.handleError,
            switchMap(() => this.popupService.success('Cooperative has been created!')),
            tap(() => this.router.router.navigate([`/${coop.identifier}`])),
        );
    }

    generateURL() {
        const name = this.createCoopForm.get('identifier').valid ?
            this.createCoopForm.get('identifier').value
            : this.translate.instant('auth.new_instance.identifier_input.placeholder');
        return `${window.location.protocol}//${window.location.host}/${name}`;
    }
}
