import { Component } from '@angular/core';
import { OrganizationService } from '../../shared/services/project/organization.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileValidator } from '../../shared/validators/file.validator';
import { switchMap, tap } from 'rxjs/operators';
import { PopupService } from '../../shared/services/popup.service';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-create-organization',
    templateUrl: './create-organization.component.html',
    styleUrls: ['./create-organization.component.scss']
})
export class CreateOrganizationComponent {
    newOrganizationForm: FormGroup;

    constructor(private organizationService: OrganizationService,
                private fb: FormBuilder,
                private popupService: PopupService,
                private errorService: ErrorService,
                private translate: TranslateService,
                private router: RouterService) {

        this.newOrganizationForm = fb.group({
            name: ['', Validators.minLength(3)],
            description: ['', Validators.required],
            photo: [null, [FileValidator.validate]]
        });
    }

    createOrganization() {
        return this.organizationService.createOrganization(
            this.newOrganizationForm.get('name').value,
            this.newOrganizationForm.get('description').value,
            this.newOrganizationForm.get('photo').value
        ).pipe(
            this.errorService.handleError,
            switchMap(organization => {
                return this.popupService.success(
                    this.translate.instant('organizations.new.created')
                ).pipe(
                    tap(() => this.router.navigate([`/dash/manage_groups/${organization.uuid}`]))
                );
            })
        );
    }
}
