import { Component } from '@angular/core';
import { OrganizationService } from '../../shared/services/project/organization.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileValidator } from '../../shared/validators/file.validator';
import { switchMap, tap } from 'rxjs/operators';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { PopupService } from '../../shared/services/popup.service';

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
                private router: Router) {

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
            displayBackendErrorRx(),
            switchMap(organization => {
                return this.popupService.new({
                    type: 'success',
                    title: 'Investment group created!',
                    text: `Successfully created new investment group. 
                           Verify group creation with your blockchain wallet. You will be prompted now.`,
                    confirmButtonText: 'Verify group'
                }).pipe(
                    tap(() => this.router.navigate([`/dash/manage_groups/${organization.uuid}`]))
                );
            })
        );
    }

    backToGroupsScreen() {
        this.router.navigate([`/dash/manage_groups`]);
    }
}
