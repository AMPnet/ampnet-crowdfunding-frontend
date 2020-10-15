import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError, displayBackendErrorRx, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import swal from 'sweetalert2';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { Organization, OrganizationMember, OrganizationService } from '../../shared/services/project/organization.service';
import { switchMap, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
    selector: 'app-organization-details',
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {

    constructor(private activeRoute: ActivatedRoute,
                private organizationService: OrganizationService,
                private walletService: WalletService,
                private arkaneService: ArkaneService,
                private fb: FormBuilder,
                private popupService: PopupService) {
    }
    organization: Organization;
    orgWallet?: WalletDetails;
    orgMembers: OrganizationMember[];

    inviteForm: FormGroup;

    private static extractEmails(emails: string): string[] {
        return emails
            .split(',').flatMap(comma => comma.trim()
                .split(';')).flatMap(semicolon => semicolon.trim()
                .split(' ')).filter(space => space !== '');
    }

    private static emailsValidator(control: AbstractControl): ValidationErrors | null {
        const emails = OrganizationDetailsComponent.extractEmails(control.value);

        if (emails.length === 0) {
            return { noEmails: true };
        }

        for (let i = 0; i < emails.length; i++) {
            if ((new FormControl(emails[i], Validators.email)).errors) {
                return { incorrectEmail: true };
            }
        }

        return null;
    }

    ngOnInit() {
        const orgID = this.activeRoute.snapshot.params.id;
        this.organizationService.getSingleOrganization(orgID).subscribe(org => {
            this.organization = org;
        }, err => {
            displayBackendError(err);
        });

        this.walletService.getOrganizationWallet(orgID).subscribe(res => {
            this.orgWallet = res;
        }, err => {
            if (err.status === 404) {
                this.orgWallet = null;
            } else if (err.error.err_code === '0851') {
                swal('', 'The organization is being created. This can take up to a minute. Please check again later.', 'info')
                    .then(() => {
                        window.history.back();
                    });
            } else {
                displayBackendError(err);
            }
        });

        this.organizationService.getMembersForOrganization(orgID)
            .subscribe(res => {
                this.orgMembers = res.members;
            }, err => {
                displayBackendError(err);
            });

        this.inviteForm = this.fb.group({
            emails: ['', OrganizationDetailsComponent.emailsValidator]
        });
    }

    inviteClicked() {
        const emails = OrganizationDetailsComponent.extractEmails(this.inviteForm.get('emails').value);

        return this.organizationService.inviteUser(this.organization.uuid, emails).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Success',
                text: 'Successfully invited user to organization'
            })),
            tap(() => this.inviteForm.reset())
        );
    }

    createOrgWalletClicked() {
        return this.walletService.createOrganizationWalletTransaction(this.organization.uuid).pipe(
            displayBackendErrorRx(),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            tap(() => this.ngOnInit()),
        );
    }

    deleteMember(orgID: string, memberID: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.removeMemberFromOrganization(orgID, memberID)
            .subscribe(() => {
                    swal({
                        title: '',
                        text: 'Success!',
                        type: 'success'
                    }).then(function () {
                        this.organizationService.getMembersForOrganization(orgID)
                            .subscribe(res => {
                                this.orgMembers = res.members;
                                SpinnerUtil.hideSpinner();
                            }, hideSpinnerAndDisplayError);
                    }.bind(this));
                },
                hideSpinnerAndDisplayError);
    }
}
