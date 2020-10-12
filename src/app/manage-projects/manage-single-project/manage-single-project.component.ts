import { Component, OnInit } from '@angular/core';
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
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
    selector: 'app-manage-single-project',
    templateUrl: './manage-single-project.component.html',
    styleUrls: ['./manage-single-project.component.css'],
})
export class ManageSingleProjectComponent implements OnInit {
    project$: Observable<Project>;
    projectWallet$: Observable<WalletDetails>;
    updateForm$: Observable<FormGroup>;

    refreshProjectSubject = new BehaviorSubject<Project>(null);
    refreshProjectWalletSubject = new BehaviorSubject<void>(null);

    constructor(private projectService: ProjectService,
                private walletService: WalletService,
                private http: BackendHttpClient,
                private manageProjectsService: ManageProjectsService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private router: Router,
                private fb: FormBuilder,
                private route: ActivatedRoute) {
        const projectUUID = this.route.snapshot.params.projectID;
        this.project$ = this.refreshProjectSubject.pipe(
            switchMap(project => project !== null ? of(project) : this.projectService.getProject(projectUUID)),
        );

        this.projectWallet$ = this.refreshProjectWalletSubject.pipe(
            switchMap(() => this.walletService.getProjectWallet(projectUUID)),
            catchError(err => {
                if (err.status === 404) {
                    this.createProjectWallet(projectUUID).subscribe();
                    return EMPTY;
                } else {
                    return throwError(err);
                }
            }),
            displayBackendErrorRx(),
        );

        this.updateForm$ = this.project$.pipe(map(project => {
                return fb.group({
                    name: [project.name, Validators.required],
                    description: [project.description, Validators.minLength(3)],
                    location: fb.group({
                        lat: [project.location.lat],
                        long: [project.location.long],
                    }),
                    roi: fb.group({
                        from: [project.roi.from],
                        to: [project.roi.to],
                    }),
                    image: [null],
                    documents: [[]]
                });
            })
        );
    }

    ngOnInit() {
        // this.fetchAllData().subscribe();
    }

    // fetchAllData() {
    //     SpinnerUtil.showSpinner();
    //     return this.getProject().pipe(
    //         switchMap(() => this.walletService.getProjectWallet(this.project.uuid)),
    //         catchError(err => {
    //             if (err.status === 404) {
    //                 this.createProjectWallet().subscribe();
    //                 return EMPTY;
    //             } else {
    //                 throwError(err);
    //             }
    //         }),
    //         displayBackendErrorRx(),
    //         tap(res => {
    //             this.wallet = res;
    //
    //             setTimeout(function () {
    //                 this.setUploadAreas();
    //             }.bind(this));
    //         }),
    //         finalize(() => SpinnerUtil.hideSpinner())
    //     );
    // }

    createProjectWallet(projectUUID: string) {
        return this.popupService.new({
            type: 'info',
            text: 'Verify the project creation with your blockchain wallet. You will be prompted now!'
        }).pipe(
            tap(() => SpinnerUtil.showSpinner()),
            switchMap(() =>
                this.walletService.createProjectWalletTransaction(projectUUID)
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
            tap(() => {
                this.refreshProjectSubject.next(null);
                this.refreshProjectWalletSubject.next();
            }),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    addNewsLink(project: Project) {
        const linkHolder = $('#newsLink').val();
        if (validURL(linkHolder)) {
            return this.manageProjectsService.addNewsToProject(project, linkHolder).pipe(
                displayBackendErrorRx(),
                tap(updatedProject => {
                    this.refreshProjectSubject.next(updatedProject);
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

    deleteNewsClicked(project: Project, link: string) {
        SpinnerUtil.showSpinner();
        this.manageProjectsService.deleteNewsFromProject(project, link).pipe(
            displayBackendErrorRx(),
            tap(() => this.refreshProjectSubject.next(null)),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    // getProject() {
    //     const id = this.route.snapshot.params.projectID;
    //     return this.projectService.getProject(id).pipe(
    //         displayBackendErrorRx(),
    //         tap(res => {
    //             this.project = res;
    //             this.mapLat = this.project.location.lat;
    //             this.mapLong = this.project.location.long;
    //         })
    //     );
    // }

    toggleProjectStatusClicked(project: Project) {
        return this.projectService.updateProject(project.uuid, {active: !project.active}).pipe(
            displayBackendErrorRx(),
            tap(() => this.refreshProjectSubject.next(null)),
        );
    }

    updateProject(project: Project, form: FormGroup) {
        return () => {
            const controls = form.controls;
            console.log(controls['location'].value);
            return this.projectService.updateProject(project.uuid, {
                name: controls['name'].value,
                description: controls['description'].value,
                location: controls['location'].value,
                roi: controls['roi'].value,
            }).pipe(
                displayBackendErrorRx(),
                tap(updatedProject => this.refreshProjectSubject.next(updatedProject)),
            );
        };
    }

    deleteFile(project: Project, documentID: number) {
        return this.popupService.new({
            text: 'Are you sure you want to delete this file? This action cannot be reversed',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No'
        }).pipe(
            switchMap(res => res.value === true ?
                this.manageProjectsService.deleteDocument(project.uuid, documentID).pipe(displayBackendErrorRx()) : EMPTY),
            tap(() => SpinnerUtil.showSpinner()),
            tap(() => this.refreshProjectSubject.next(null)),
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

    // private configureUppy(uppy: Uppy.Core.Uppy, areaID: string) {
    //     const width = $('#core-root-manager').width();
    //     uppy.use(Uppy.Dashboard, {
    //         target: areaID,
    //         inline: true,
    //         height: 300,
    //         width: width
    //     });
    //
    //     uppy.use(Uppy.XHRUpload, {
    //         endpoint: `/api/project/project/${this.project.uuid}/image/main`,
    //         headers: {
    //             'Authorization': this.http.authHttpOptions().headers.get('Authorization')
    //         },
    //         metaFields: [
    //             'name', 'filename'
    //         ],
    //         fieldName: 'image'
    //     }).on('upload-success', () => {
    //         this.fetchAllData().subscribe();
    //     });
    // }

    // private setUploadAreas() {
    //     const imageUppy = this.setUpUppy('image-upload-project', ['image/*']);
    //     this.configureUppy(imageUppy, '#drag-drop-area-img');
    //
    //     const filesUppy = Uppy.Core({
    //         id: 'files-upload-uppy'
    //     });
    //     const width = $('#core-root-manager').width();
    //     filesUppy.use(Uppy.Dashboard, {
    //         target: '#files-upload-uppy',
    //         inline: true,
    //         height: 200,
    //         width: width
    //     });
    //
    //     filesUppy.use(Uppy.XHRUpload, {
    //         endpoint: `/api/project/project/${this.project.uuid}/document`,
    //         headers: {
    //             'Authorization': this.http.authHttpOptions().headers.get('Authorization')
    //         },
    //         metaFields: [
    //             'name', 'filename'
    //         ],
    //         fieldName: 'file',
    //         bundle: false
    //     }).on('upload-success', () => {
    //         this.fetchAllData().subscribe();
    //         filesUppy.close();
    //     });
    // }
}
