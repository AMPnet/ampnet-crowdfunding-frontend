import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    orgWallet: WalletDetails;
    orgMembers: OrganizationMember[];

    qrCodeData: String = '';

    constructor(private activeRoute: ActivatedRoute,
                private organizationService: OrganizationService,
                private walletService: WalletService,
                private broadcastService: BroadcastService,
                private router: Router) {
    }

    ngOnInit() {
        SpinnerUtil.showSpinner();
        this.fetchDetails(() => {
            this.getOrganizationWallet(() => {
                SpinnerUtil.hideSpinner();
            });
            this.getOrgMembers(() => {
                SpinnerUtil.hideSpinner();
            });
        });
    }

    fetchDetails(onComplete: () => void) {
        const routeParams = this.activeRoute.snapshot.params;
        this.organizationService.getSingleOrganization(routeParams.id).subscribe(org => {
            this.organization = org;
            onComplete();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    getOrganizationWallet(onComplete: () => void) {
        const walletID = this.activeRoute.snapshot.params.id;
        this.walletService.getOrganizationWallet(walletID).subscribe(res => {
            this.orgWallet = res;
            onComplete();
        }, err => {
            if (err.status === '404') { // Organization wallet doesn't exist
                this.initializeWalletClicked();
            } else if (err.error.err_code === '0851') {
                swal('', 'The organization is being created. This can take up to a minute. Please check again later.', 'info').then(() => {
                    window.history.back();
                });
            } else {
                displayBackendError(err);
            }
            onComplete();
        });
    }

    initializeWalletClicked() {
        // TODO: remove this if unused
        const orgID = this.activeRoute.snapshot.params.id;
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

    getOrgMembers(onComplete: () => void) {
        SpinnerUtil.showSpinner();
        this.organizationService.getMembersForOrganization(this.organization.uuid)
            .subscribe(res => {
                this.orgMembers = res.members;
                onComplete();
            }, err => {
                displayBackendError(err);
            }, () => SpinnerUtil.hideSpinner());
    }

    deleteMember(orgID: string, memberID: string) {
        SpinnerUtil.showSpinner();
        this.organizationService.removeMemberFromOrganization(orgID, memberID)
            .subscribe(() => {
                    SpinnerUtil.hideSpinner();
                    swal({
                        title: '',
                        text: 'Success!',
                        type: 'success'
                    }).then(function () {
                        this.reloadPage('/dash/manage_groups/' + this.organization.uuid);
                    }.bind(this));
                },
                hideSpinnerAndDisplayError);
    }

    reloadPage(uri: string) {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
            this.router.navigate([uri]));
    }
}
