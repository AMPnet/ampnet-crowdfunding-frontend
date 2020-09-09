import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../shared/services/project/organization.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { Router } from '@angular/router';
import { validateEmail } from 'src/app/utilities/email-util';
import * as Uppy from 'uppy';
import { FileValidator } from '../../shared/validators/file.validator';

declare var $: any;

@Component({
    selector: 'app-create-organization',
    templateUrl: './create-organization.component.html',
    styleUrls: ['./create-organization.component.css']
})
export class CreateOrganizationComponent implements OnInit {
    newOrganizationForm: FormGroup;
    uppyOrgPhoto: Uppy.Core.Uppy;

    constructor(private changeDetectionRef: ChangeDetectorRef,
                private organizationService: OrganizationService,
                private fb: FormBuilder,
                private router: Router) {

        this.newOrganizationForm = fb.group({
            name: ['', Validators.minLength(3)],
            description: ['', Validators.required],
            photo: [null, [FileValidator.validate]]
        });
    }

    ngOnInit() {
        this.uppyOrgPhoto = Uppy.Core({
            restrictions: {
                allowedFileTypes: ['.png', '.jpeg', '.jpg'],
                maxFileSize: 16 * 1024 * 1024,
                maxNumberOfFiles: 1
            }
        });

        this.uppyOrgPhoto.on('file-added', file => {
            this.newOrganizationForm.get('photo').setValue(file.data);
        });

        this.uppyOrgPhoto.on('file-removed', () => {
            this.newOrganizationForm.get('photo').setValue('');
        });

        this.uppyOrgPhoto.use(Uppy.Dashboard, {
            id: 'organization-image',
            target: document.getElementById('uppy-attach-document'),
            inline: true,
            height: 300,
            note: 'Upload organization image',
            hideUploadButton: true,
        });
    }

    submitButtonClicked() {
        SpinnerUtil.showSpinner();
        const controls = this.newOrganizationForm.controls;
        this.organizationService.createOrganization(
            controls['name'].value,
            controls['description'].value,
            controls['photo'].value
        ).subscribe(organization => {
            SpinnerUtil.hideSpinner();
            swal('', 'Successfully created a new organization', 'success')
                .then(function () {
                    this.router.navigate(['/dash', 'manage_groups', organization.uuid]);
                }.bind(this));
        }, err => {
            SpinnerUtil.hideSpinner();
            swal('', err.error.message, 'warning').then(() => {
                this.router.navigate(['/dash', 'manage_groups']);
            }, () => {
                this.router.navigate(['/dash', 'manage_groups']);
            });
        });
    }

    fetchAndCheckInvites(): string[] {
        return (<string>$('#invite-users-email').val()).split(',')
            .map((invite) => {
                return invite.trim();
            }).filter((trimmed) => {
                return validateEmail(trimmed);
            });
    }

}
