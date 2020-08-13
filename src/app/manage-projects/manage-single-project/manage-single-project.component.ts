import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import swal from 'sweetalert2';
import { ManageProjectsService } from '../../shared/services/project/manage-projects-service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/shared/services/project/project-service';
import { ProjectModel } from '../../projects/project-model';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { WalletModel } from '../../organizations/organization-details/organization-model';
import { API } from 'src/app/utilities/endpoint-manager';
import { validURL } from '../../utilities/link-valid-util';
import { ArkaneConnect, SecretType, SignatureRequestType, WindowMode } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/shared/services/broadcast.service';
import { NewsLink } from './news-link-model';

declare var _: any;
declare var $: any;

@Component({
    selector: 'app-manage-single-project',
    templateUrl: './manage-single-project.component.html',
    styleUrls: ['./manage-single-project.component.css']
})
export class ManageSingleProjectComponent implements OnInit {

    public files: string[] = [
        'Building permit',
        'Working permit',
        'Ecological permit',
        'Development certificate'
    ];
    project: ProjectModel;
    wallet: WalletModel;
    qrCodeData: String = '';
    private news: NewsLink[] = [];

    constructor(private projectService: ProjectService,
                private manageProjectsService: ManageProjectsService,
                private route: ActivatedRoute,
                private broadService: BroadcastService) {
    }

    ngOnInit() {
        this.fetchAllData();
    }

    fetchAllData() {
        this.getProject(() => {
            SpinnerUtil.showSpinner();

            this.projectService.getProjectWallet(this.project.uuid).subscribe((res: WalletModel) => {
                SpinnerUtil.hideSpinner();
                this.wallet = res;
                setTimeout(() => {
                    this.setUploadAreas();
                }, 300);
            }, err => {
                if (err.status === 404) { // 0501 meaning - "Missing wallet for org"
                    this.createInitQRCODE();
                } else {
                    displayBackendError(err);
                }
                SpinnerUtil.hideSpinner();
            });
        });
    }

    createInitQRCODE() {
        this.projectService.generateTransactionToCreateProjectWallet(this.project.uuid).subscribe((res: any) => {
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
                }, err => {
                    displayBackendError(err);
                });
        } else {
            swal('', 'Link invalid! The news link ' + linkHolder + ' is not a valid link');
        }
    }

    deleteNewsClicked(link: string) {
        SpinnerUtil.showSpinner();
        this.manageProjectsService.deleteNewsFromProject(this.project, link).subscribe(res => {
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
        this.projectService.getProject(id).subscribe((res: ProjectModel) => {
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
        this.projectService.updateProject(
            this.project.uuid,
            this.project.name,
            this.project.description,
            this.project.location,
            this.project.roi,
            !this.project.active
        ).subscribe(res => {
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

        SpinnerUtil.showSpinner();
        this.projectService.updateProject(
            updatedProject.uuid,
            updatedProject.name,
            updatedProject.description,
            updatedProject.location,
            updatedProject.roi,
            updatedProject.active
        ).subscribe(res => {
            SpinnerUtil.hideSpinner();
            this.getProject(() => {
            });
        }, hideSpinnerAndDisplayError);
    }

    public deleteFile(index: number): any {
        swal({
            text: 'Are you sure you want to delete this file? This action cannot be reversed',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No'
        }).then(() => {
            SpinnerUtil.showSpinner();
            this.manageProjectsService
                .deleteDocument(this.project.uuid, index).subscribe(res => {
                SpinnerUtil.hideSpinner();
                this.getProject(() => {
                });
            }, err => {
                SpinnerUtil.hideSpinner();
                displayBackendError(err);
            });
        });
    }

    private setUpUppy(id: string, allowedFileTypes: string[]): Uppy.Core.Uppy {
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

        const headers = API.tokenHeaders();
        headers.headers['Access-Control-Allow-Origin'] = '*';

        uppy.use(Uppy.XHRUpload, {
            endpoint: API.generateComplexRoute('/project', [this.project.uuid.toString(), 'image', 'main']),
            headers: {
                'Authorization': headers.headers['Authorization']
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
            endpoint: API.generateComplexRoute('/project', [
                this.project.uuid.toString(), 'document'
            ]),
            headers: {
                'Authorization': API.tokenHeaders().headers['Authorization']
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
