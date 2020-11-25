import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { displayBackendErrorRx } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { Project, ProjectService } from '../../../../shared/services/project/project.service';
import { Wallet, WalletService, WalletState } from '../../../../shared/services/wallet/wallet.service';
import { ManageProjectsService } from '../../../../shared/services/project/manage-projects.service';
import { catchError, finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';
import { ArkaneService } from '../../../../shared/services/arkane.service';
import { PopupService } from '../../../../shared/services/popup.service';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { URLValidator } from '../../../../shared/validators/url.validator';
import { RouterService } from '../../../../shared/services/router.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-manage-single-project',
    templateUrl: './manage-single-project.component.html',
    styleUrls: ['./manage-single-project.component.scss'],
})
export class ManageSingleProjectComponent {
    walletState = WalletState;

    project$: Observable<Project>;
    projectWallet$: Observable<Wallet | WalletState>;
    updateForm$: Observable<FormGroup>;
    newsForm: FormGroup;

    refreshProjectSubject = new BehaviorSubject<Project>(null);
    refreshProjectWalletSubject = new BehaviorSubject<void>(null);

    detailsShown = true;

    constructor(private projectService: ProjectService,
                private walletService: WalletService,
                private manageProjectsService: ManageProjectsService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private router: RouterService,
                private fb: FormBuilder,
                private route: ActivatedRoute) {
        const projectUUID = this.route.snapshot.params.projectID;
        this.project$ = this.refreshProjectSubject.pipe(
            switchMap(project => project !== null ? of(project) : this.projectService.getProject(projectUUID)),
            shareReplay(1)
        );

        this.projectWallet$ = this.refreshProjectWalletSubject.pipe(
            switchMap(() => this.walletService.getProjectWallet(projectUUID)
                .pipe(
                    catchError(err => {
                        if (err.status === 404) {
                            this.createProjectWallet(projectUUID).subscribe();
                            return of(WalletState.EMPTY);
                        } else {
                            return throwError(err);
                        }
                    }),
                    displayBackendErrorRx(),
                    catchError(() => EMPTY)
                )
            )
        );

        this.updateForm$ = this.project$.pipe(map(project => {
                return fb.group({
                    name: [project.name, Validators.required],
                    description: [project.description, Validators.minLength(3)],
                    roi: fb.group({
                        from: [project.roi.from, Validators.pattern(/^\d*\.?\d+$/)],
                        to: [project.roi.to, Validators.pattern(/^\d*\.?\d+$/)],
                    }, { validators: this.roiValidator}),
                    location: fb.group({
                        lat: [project.location.lat],
                        long: [project.location.long],
                    }),
                    newImage: [null],
                    currentImage: [project.main_image],
                    newDocuments: [[]],
                    oldDocuments: [project.documents]
                });
            })
        );

        this.newsForm = fb.group({
            newsLink: ['', [URLValidator.validate]]
        });
    }

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

    addNewsLink(project: Project, form: FormGroup) {
        return () => {
            const newsLink = form.controls['newsLink'].value;
            return this.manageProjectsService.addNewsToProject(project, newsLink).pipe(
                displayBackendErrorRx(),
                tap(updatedProject => {
                    form.get('newsLink').reset();
                    this.refreshProjectSubject.next(updatedProject);
                })
            );
        };
    }

    deleteNewsClicked(project: Project, link: string) {
        SpinnerUtil.showSpinner();
        return this.manageProjectsService.deleteNewsFromProject(project, link).pipe(
            displayBackendErrorRx(),
            tap(() => this.refreshProjectSubject.next(null)),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    toggleProjectStatusClicked(project: Project) {
        return () => {
            return this.projectService.updateProject(project.uuid, {active: !project.active}).pipe(
                displayBackendErrorRx(),
                tap(updatedProject => this.refreshProjectSubject.next(updatedProject)),
                switchMap(() => this.project$)
            );
        };
    }

    updateProject(project: Project, form: FormGroup) {
        return () => {
            return this.projectService.updateProject(project.uuid, {
                name: form.get('name').value,
                description: form.get('description').value,
                location: form.get('location').value,
                roi: {
                    from: Number(form.get('roi.from').value),
                    to: Number(form.get('roi.to').value)
                }
            }, form.get('newImage').value, form.get('newDocuments').value).pipe(
                displayBackendErrorRx(),
                tap(() => {
                    form.get('newImage').reset();
                    form.get('newDocuments').reset();
                }),
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

    isWalletVerified(wallet: Wallet) {
        return !!wallet && !!wallet?.hash;
    }

    backToOrganizationDetailsScreen() {
        this.router.navigate(['../../'], {relativeTo: this.route});
    }

    private roiValidator: ValidatorFn = (roiFromGroup: FormGroup) => {
        const from = roiFromGroup.get('from').value;
        const to = roiFromGroup.get('to').value;
        return from !== null && to !== null && from <= to ? null : { invalidROI: true };
    }
}
