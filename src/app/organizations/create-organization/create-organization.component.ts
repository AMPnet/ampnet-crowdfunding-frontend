import { Component } from '@angular/core';
import { OrganizationService } from '../../shared/services/project/organization.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileValidator } from '../../shared/validators/file.validator';
import { switchMap, tap } from 'rxjs/operators';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { PopupService } from '../../shared/services/popup.service';
import { RouterService } from '../../shared/services/router.service';

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
            displayBackendErrorRx(),
            switchMap(organization => {
                return this.popupService.new({
                    type: 'success',
                    title: 'Investment group created!'
                }).pipe(
                    tap(() => this.router.navigateCoop([`/dash/manage_groups/${organization.uuid}`]))
                );
            })
        );
    }

    backToGroupsScreen() {
        this.router.navigateCoop([`/dash/manage_groups`]);
    }
}
