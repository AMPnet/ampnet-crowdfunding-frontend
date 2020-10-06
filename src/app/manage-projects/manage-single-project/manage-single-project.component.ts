import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { ActivatedRoute, Router } from '@angular/router';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { validURL } from '../../utilities/link-valid-util';
import { WalletDetails } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-wallet.service';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { BackendHttpClient } from '../../shared/services/backend-http-client.service';
import { ManageProjectsService } from '../../shared/services/project/manage-projects.service';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';

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
    mapLat: number;
    mapLong: number;
    projectCoords = [];

    constructor(private projectService: ProjectService,
                private walletService: WalletService,
                private http: BackendHttpClient,
                private manageProjectsService: ManageProjectsService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.fetchAllData().subscribe();
    }

    ngAfterViewInit() {
    }

    fetchAllData() {
        SpinnerUtil.showSpinner();
        return this.getProject().pipe(
            switchMap(() => this.walletService.getProjectWallet(this.project.uuid)),
            catchError(err => {
                if (err.status === 404) {
                    this.createProjectWallet().subscribe();
                    return EMPTY;
                } else {
                    throwError(err);
                }
            }),
            displayBackendErrorRx(),
            tap(res => {
                this.wallet = res;

                setTimeout(function () {
                   this.setUploadAreas();
                }.bind(this));
            }),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    createProjectWallet() {
        return this.popupService.new({
            type: 'info',
            text: 'Verify the project creation with your blockchain wallet. You will be prompted now!'
        }).pipe(
            tap(() => SpinnerUtil.showSpinner()),
            switchMap(() =>
                this.walletService.createProjectWalletTransaction(this.project.uuid)
                    .pipe(displayBackendErrorRx())),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo).pipe(
                catchError(_ => {
                    this.router.navigate([`/dash/manage_groups/${this.route.snapshot.params.groupID}`]);
                    return EMPTY;
                })
            )),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Transaction signed',
                text: 'Transaction is being processed...'
            })),
            switchMap(() => this.fetchAllData()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    addNewsLink() {
        const linkHolder = $('#newsLink').val();
        if (validURL(linkHolder)) {
            return this.manageProjectsService.addNewsToProject(this.project, linkHolder).pipe(
                displayBackendErrorRx(),
                tap(updatedProject => {
                    this.project = updatedProject;
                    $('#newsLink').val('');
                })
            );
        } else {
            return this.popupService.new({
                type: 'error',
                text: `Link invalid! The news link ${linkHolder} is not a valid link`
            });
        }
    }

    deleteNewsClicked(link: string) {
        SpinnerUtil.showSpinner();
        this.manageProjectsService.deleteNewsFromProject(this.project, link).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.getProject()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    getProject() {
        const id = this.route.snapshot.params.projectID;
        return this.projectService.getProject(id).pipe(
            displayBackendErrorRx(),
            tap(res => {
                this.project = res;
                this.mapLat = this.project.location.lat;
                this.mapLong = this.project.location.long;
            })
        );
    }

    toggleProjectStatusClicked() {
        return this.projectService.updateProject(this.project.uuid, {active: !this.project.active}).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.getProject()),
        );
    }

    updateProject() {
        const projectName = $('#project-name').val();
        const projectDescription = $('#project-description').val();
        const locationName = $('#location-name').val();

        const updatedProject = this.project;
        updatedProject.name = projectName;
        updatedProject.description = projectDescription;
        updatedProject.location_text = locationName;
        updatedProject.location = {lat: this.mapLat, long: this.mapLong};

        return this.projectService.updateProject(updatedProject.uuid, {
            name: updatedProject.name,
            description: updatedProject.description,
            location: updatedProject.location,
            roi: updatedProject.roi,
            active: updatedProject.active
        }).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.getProject()),
        );
    }

    deleteFile(index: number): any {
        return this.popupService.new({
            text: 'Are you sure you want to delete this file? This action cannot be reversed',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No'
        }).pipe(
            tap(() => SpinnerUtil.showSpinner()),
            switchMap(() => this.manageProjectsService.deleteDocument(this.project.uuid, index)
                .pipe(displayBackendErrorRx())),
            switchMap(() => this.getProject()),
            finalize(() => SpinnerUtil.hideSpinner())
        );
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
            this.fetchAllData().subscribe();
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
            this.fetchAllData().subscribe();
            filesUppy.close();
        });
    }
}
