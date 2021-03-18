import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from '../../shared/services/project/organization.service';
import { PopupService } from '../../shared/services/popup.service';
import { ErrorService } from '../../shared/services/error.service';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from '../../shared/services/router.service';
import { FileValidator } from '../../shared/validators/file.validator';
import { switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-group-new',
    templateUrl: './group-new.component.html',
    styleUrls: ['./group-new.component.scss']
})
export class GroupNewComponent {
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
                    this.translate.instant('groups.new.created')
                ).pipe(
                    tap(() => this.router.navigate([`/dash/groups/${organization.uuid}`])),
                    // tap(() => this.router.navigate([`/dash/projects/new`])) TODO: set this when org wallet is removed
                );
            })
        );
    }

}
