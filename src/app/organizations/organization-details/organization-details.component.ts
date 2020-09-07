import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import swal from 'sweetalert2';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { Organization, OrganizationMember, OrganizationService } from '../../shared/services/project/organization.service';
import { BroadcastService } from '../../shared/services/broadcast.service';

declare var $: any;

@Component({
    selector: 'app-organization-details',
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {

    orgWalletInitialized: boolean;
    txData: string;
    txID: number;
    organization: Organization;
    orgWallet?: WalletDetails;
    orgMembers: OrganizationMember[];

    qrCodeData: String = '';

    constructor(private activeRoute: ActivatedRoute,
                private organizationService: OrganizationService,
                private walletService: WalletService,
                private broadcastService: BroadcastService) {
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
    }

    inviteClicked() {
        SpinnerUtil.showSpinner();
        const email = $('#email-invite-input').val();
        this.organizationService.inviteUser(this.organization.uuid, email).subscribe(res => {
            SpinnerUtil.hideSpinner();
            swal('Success', 'Successfully invited user to organization', 'success');
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    async createOrgWalletClicked() {
        const arkaneConnect = new ArkaneConnect('AMPnet', {environment: 'staging'});
        const account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);

        this.walletService.createOrganizationWalletTransaction(this.organization.uuid).subscribe(async res => {
            this.orgWalletInitialized = false;
            this.txData = JSON.stringify(res.tx);
            this.txID = res.tx_id;

            const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                walletId: account.wallets[0].id,
                data: res.tx,
                type: SignatureRequestType.AETERNITY_RAW
            });
            this.broadcastService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id).subscribe(_ => {
                swal('', 'Success', 'success');
                this.ngOnInit();
            }, displayBackendError);
        }, err => {
            displayBackendError(err);
        });

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
