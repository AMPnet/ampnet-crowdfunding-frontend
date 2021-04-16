import { Component } from '@angular/core';
import { Wallet, WalletService, WalletState } from '../../shared/services/wallet/wallet.service';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of, throwError } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Project, ProjectService } from '../../shared/services/project/project.service';
import { UserService } from '../../shared/services/user/user.service';
import { ManageProjectsService } from '../../shared/services/project/manage-projects.service';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from '../../shared/services/router.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { DocPurpose, Document } from '../../shared/services/project/organization.service';
import { URLValidator } from '../../shared/validators/url.validator';
import { SpinnerUtil } from '../../utilities/spinner-utilities';

@Component({
    selector: 'app-project-edit',
    templateUrl: './project-edit.component.html',
    styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent {
    walletState = WalletState;

    project$: Observable<ProjectView>;
    projectWallet$: Observable<Wallet | WalletState>;
    isProjectOwner$: Observable<boolean>;
    updateForm$: Observable<FormGroup>;
    newsForm: FormGroup;

    refreshProjectSubject = new BehaviorSubject<Project>(null);
    refreshProjectWalletSubject = new BehaviorSubject<void>(null);

    constructor(private projectService: ProjectService,
                private walletService: WalletService,
                private userService: UserService,
                private manageProjectsService: ManageProjectsService,
                private arkaneService: ArkaneService,
                private popupService: PopupService,
                private translate: TranslateService,
                private router: RouterService,
                private fb: FormBuilder,
                private route: ActivatedRoute) {
        const projectUUID: string = this.route.snapshot.params.id;
        this.project$ = this.refreshProjectSubject.pipe(
            switchMap(project => project !== null ? of(project) : this.projectService.getProject(projectUUID)),
            map(project => (<ProjectView>{
                ...project,
                generic_documents: project.documents.filter(d => d.purpose === DocPurpose.GENERIC),
                terms_document: project.documents.filter(d => d.purpose === DocPurpose.TERMS)[0]
            })),
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
                    catchError(() => EMPTY)
                )
            )
        );

        this.isProjectOwner$ = combineLatest([this.userService.user$, this.project$]).pipe(
            map(([user, project]) => user.uuid === project.owner_uuid)
        );

        this.updateForm$ = this.project$.pipe(map(project => {
                return fb.group({
                    name: [project.name, Validators.required],
                    short_description: [project.short_description, Validators.minLength(3)],
                    description: [project.description, Validators.minLength(3)],
                    roi: fb.group({
                        from: [project.roi.from, Validators.pattern(/^\d*\.?\d+$/)],
                        to: [project.roi.to, Validators.pattern(/^\d*\.?\d+$/)],
                    }, {validators: [this.roiValidator()]}),
                    location: fb.group({
                        lat: [project.location.lat],
                        long: [project.location.long],
                    }),
                    newImage: [null],
                    currentImage: [project.main_image],
                    newTerms: [null],
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
        return this.popupService.info(
            this.translate.instant('projects.edit.create_wallet_notice')
        ).pipe(
            tap(() => SpinnerUtil.showSpinner()),
            switchMap(() =>
                this.walletService.createProjectWalletTransaction(projectUUID)),
            switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo).pipe(
                catchError(_ => {
                    this.router.navigate([`/dash/manage_groups/${this.route.snapshot.params.groupID}`]);
                    return EMPTY;
                })
            )),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: this.translate.instant('general.transaction_signed.title'),
                text: this.translate.instant('general.transaction_signed.description')
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
            tap(() => this.refreshProjectSubject.next(null)),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    toggleProjectStatusClicked(project: Project) {
        return () => {
            return this.projectService.updateProject(project.uuid, {active: !project.active}).pipe(
                tap(updatedProject => this.refreshProjectSubject.next(updatedProject)),
            );
        };
    }

    updateProject(project: Project, form: FormGroup) {
        return () => {
            return this.projectService.updateProject(project.uuid, {
                name: form.get('name').value,
                short_description: form.get('short_description').value,
                description: form.get('description').value,
                location: form.get('location').value,
                roi: {
                    from: Number(form.get('roi.from').value),
                    to: Number(form.get('roi.to').value)
                },
            }, form.get('newImage').value, form.get('newTerms').value, form.get('newDocuments').value).pipe(
                tap(() => {
                    form.get('newImage').reset();
                    form.get('newTerms').reset();
                    form.get('newDocuments').reset();
                }),
                tap(updatedProject => this.refreshProjectSubject.next(updatedProject)),
            );
        };
    }

    deleteFile(project: Project, documentID: number) {
        return this.popupService.new({
            text: this.translate.instant('projects.edit.delete_file_confirmation.question'),
            confirmButtonText: this.translate.instant('projects.edit.delete_file_confirmation.yes'),
            showCancelButton: true,
            cancelButtonText: this.translate.instant('projects.edit.delete_file_confirmation.no')
        }).pipe(
            switchMap(res => res.value === true ?
                this.manageProjectsService.deleteDocument(project.uuid, documentID) : EMPTY),
            tap(() => SpinnerUtil.showSpinner()),
            tap(() => this.refreshProjectSubject.next(null)),
            finalize(() => SpinnerUtil.hideSpinner())
        );
    }

    isWalletVerified(wallet: Wallet) {
        return !!wallet && !!wallet?.hash;
    }

    private roiValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            const from = control.get('from').value;
            const to = control.get('to').value;
            return from !== null && to !== null && from <= to ? null : {invalidROI: true};
        };
    }
}

interface ProjectView extends Project {
    generic_documents: Document[];
    terms_document: Document;
}
