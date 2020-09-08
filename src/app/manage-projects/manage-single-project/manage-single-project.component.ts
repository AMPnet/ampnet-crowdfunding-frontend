import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Uppy from 'uppy';
import swal from 'sweetalert2';
import { ManageProjectsService } from '../../shared/services/project/manage-projects.service';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectService } from 'src/app/shared/services/project/project.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { validURL } from '../../utilities/link-valid-util';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { BackendHttpClient } from '../../shared/services/backend-http-client.service';

declare var $: any;

@Component({
    selector: 'app-manage-single-project',
    templateUrl: './manage-single-project.component.html',
    styleUrls: ['./manage-single-project.component.css'],
})
export class ManageSingleProjectComponent implements OnInit, AfterViewInit {

    public files: string[] = [
        'Building permit',
        'Working permit',
        'Ecological permit',
        'Development certificate'
    ];
    project: Project;
    wallet: WalletDetails;
    qrCodeData: String = '';

    constructor(private projectService: ProjectService,
                private walletService: WalletService,
                private http: BackendHttpClient,
                private manageProjectsService: ManageProjectsService,
                private route: ActivatedRoute,
                private broadService: BroadcastService) {
    }

    ngOnInit() {
        this.fetchAllData();
    }

    ngAfterViewInit() {
    }

    fetchAllData() {
        this.getProject(() => {
            SpinnerUtil.showSpinner();

            this.walletService.getProjectWallet(this.project.uuid).subscribe(res => {
                SpinnerUtil.hideSpinner();
                this.wallet = res;
                setTimeout(() => {
                    this.setUploadAreas();
                }, 300);
            }, err => {
                if (err.status === 404) { // 0501 meaning - "Missing wallet for org"
                    this.createProjectWallet();
                } else {
                    displayBackendError(err);
                }
                SpinnerUtil.hideSpinner();
            });
        });
    }

    createProjectWallet() {
        this.walletService.createProjectWalletTransaction(this.project.uuid).subscribe(res => {
            swal('', 'Verify the project creation with your blockchain wallet. You will be prompted now!', 'info')
                .then(async () => {
                    const arkaneConnect = new ArkaneConnect('AMPnet', {
                        environment: 'staging'
                    });

                    const account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);
                    const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
                        walletId: account.wallets[0].id,
                        data: res.tx,
                        type: SignatureRequestType.AETERNITY_RAW
                    });
                    this.broadService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
                        .subscribe(_res => {
                            SpinnerUtil.hideSpinner();
                            swal('', 'Success', 'success');
                            this.ngOnInit();
                        }, hideSpinnerAndDisplayError);
                });
        }, err => {
            displayBackendError(err);
        });
    }

    addNewsLink() {
        SpinnerUtil.showSpinner();
        const linkHolder = $('#newsLink').val();
        if (validURL(linkHolder)) {
            this.manageProjectsService.addNewsToProject(this.project, linkHolder)
                .subscribe(updatedProject => {
                    this.project = updatedProject;
                    SpinnerUtil.hideSpinner();
                }, err => {
                    displayBackendError(err);
                });
        } else {
            swal('', 'Link invalid! The news link ' + linkHolder + ' is not a valid link');
        }
    }

    deleteNewsClicked(link: string) {
        SpinnerUtil.showSpinner();
        this.manageProjectsService.deleteNewsFromProject(this.project, link)
            .subscribe(() => {
                SpinnerUtil.hideSpinner();
                this.getProject(() => {
                });
            }, err => {
                SpinnerUtil.hideSpinner();
                displayBackendError(err);
            });
    }

    getProject(onComplete: () => void) {
        SpinnerUtil.showSpinner();
        const id = this.route.snapshot.params.projectID;
        this.projectService.getProject(id).subscribe((res: Project) => {
            SpinnerUtil.hideSpinner();
            this.project = res;
            
            onComplete();
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    toggleProjectStatusClicked() {
        SpinnerUtil.showSpinner();
        this.projectService.updateProject(this.project.uuid, {
            active: !this.project.active
        }).subscribe(() => {
            this.getProject(() => {
            });
        }, err => {
            SpinnerUtil.hideSpinner();
            displayBackendError(err);
        });
    }

    updateProject() {
        const projectName = $('#project-name').val();
        const projectDescription = $('#project-description').val();
        const locationName = $('#location-name').val();

        const updatedProject = this.project;
        updatedProject.name = projectName;
        updatedProject.description = projectDescription;
        updatedProject.location_text = locationName;
        updatedProject.location = {lat: 0, long: 0};

        SpinnerUtil.showSpinner();
        this.projectService.updateProject(updatedProject.uuid, {
            name: updatedProject.name,
            description: updatedProject.description,
            location: updatedProject.location,
            roi: updatedProject.roi,
            active: updatedProject.active
        }).subscribe(() => {
            SpinnerUtil.hideSpinner();
            this.getProject(() => {
            });
        }, hideSpinnerAndDisplayError);
    }

    deleteFile(index: number): any {
        swal({
            text: 'Are you sure you want to delete this file? This action cannot be reversed',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No'
        }).then(() => {
            SpinnerUtil.showSpinner();
            this.manageProjectsService
                .deleteDocument(this.project.uuid, index).subscribe(() => {
                SpinnerUtil.hideSpinner();
                this.getProject(() => {
                });
            }, err => {
                SpinnerUtil.hideSpinner();
                displayBackendError(err);
            });
        });
    }

    setUpUppy(id: string, allowedFileTypes: string[]): Uppy.Core.Uppy {
        return Uppy.Core({
            id: id,
            restrictions: {
                maxFileSize: null,
                maxNumberOfFiles: 1,
                minNumberOfFiles: 1,
                allowedFileTypes: allowedFileTypes
            }
        });
    }

    private configureUppy(uppy: Uppy.Core.Uppy, areaID: string) {
        const width = $('#core-root-manager').width();
        uppy.use(Uppy.Dashboard, {
            target: areaID,
            inline: true,
            height: 300,
            width: width
        });

        uppy.use(Uppy.XHRUpload, {
            endpoint: `/api/project/project/${this.project.uuid}/image/main`,
            headers: {
                'Authorization': this.http.authHttpOptions().headers.get('Authorization')
            },
            metaFields: [
                'name', 'filename'
            ],
            fieldName: 'image'
        }).on('upload-success', () => {
            this.getProject(() => {
            });
        });

    }

    private setUploadAreas() {
        const imageUppy = this.setUpUppy('image-upload-project', ['image/*']);
        this.configureUppy(imageUppy, '#drag-drop-area-img');

        const filesUppy = Uppy.Core({
            id: 'files-upload-uppy'
        });
        const width = $('#core-root-manager').width();
        filesUppy.use(Uppy.Dashboard, {
            target: '#files-upload-uppy',
            inline: true,
            height: 200,
            width: width
        });

        filesUppy.use(Uppy.XHRUpload, {
            endpoint: `/api/project/project/${this.project.uuid}/document`,
            headers: {
                'Authorization': this.http.authHttpOptions().headers.get('Authorization')
            },
            metaFields: [
                'name', 'filename'
            ],
            fieldName: 'file',
            bundle: false
        }).on('upload-success', () => {
            this.getProject(() => {
            });
            filesUppy.close();
        });

        $(document).ready(() => {
            $('#project-description').summernote({
                height: 300,                 // set editor height
                minHeight: null,             // set minimum height of editor
                maxHeight: null,             // set maximum height of editor
                focus: false,
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['font', ['strikethrough', 'superscript', 'subscript']],
                    ['fontsize', []],
                    ['color', []],
                    ['para', ['ul', 'ol']],
                    ['height', []]
                ]
            });
            $('.note-editor').attr('id', 'note-custom');
        });
    }
}
