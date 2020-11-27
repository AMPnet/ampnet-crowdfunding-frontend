import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { switchMap, tap } from 'rxjs/operators';
import { CoopService, CreateCoopData } from '../../shared/services/user/coop.service';
import { RouterService } from '../../shared/services/router.service';
import { PopupService } from '../../shared/services/popup.service';

@Component({
    selector: 'app-new-coop',
    templateUrl: './new-coop.component.html',
    styleUrls: ['./new-coop.component.css'],
    providers: [
        {provide: 'WINDOW', useValue: window}
    ]
})
export class NewCoopComponent implements OnInit {
    createCoopForm: FormGroup;

    constructor(private coopService: CoopService,
                private router: RouterService,
                private popupService: PopupService,
                private fb: FormBuilder,
                @Inject('WINDOW') public window: Window) {
        this.createCoopForm = this.fb.group({
            name: new FormControl('', [Validators.required]),
            identifier: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9\-_]{3,}$/)]),
            webTitle: new FormControl('', [Validators.required]),
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

        return this.coopService.createCoop(createCoopData).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.success('Cooperative has been created!')),
            tap(() => this.router.router.navigate([`/${coop.identifier}`])),
        );
    }
}
