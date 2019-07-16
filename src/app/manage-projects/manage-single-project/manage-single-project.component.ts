import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { XHRUpload, DragDrop, Dashboard } from 'uppy'; 
import swal from 'sweetalert2';
import { ManageProjectsService } from '../manage-projects-service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/projects/project-service';
import { ProjectModel } from '../../projects/create-new-project/project-model'
import { displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { WalletModel } from '../../organizations/organization-details/organization-model';
import * as QRCode from 'qrcode';

declare var _: any;
declare var $: any;

@Component({
  selector: 'app-manage-single-project',
  templateUrl: './manage-single-project.component.html',
  styleUrls: ['./manage-single-project.component.css']
})
export class ManageSingleProjectComponent implements OnInit {

  public files: string[] = [
    "Building permit",
    "Working permit",
    "Ecological permit",
    "Development certificate"
  ];

  private news: NewsLink[] = [];

  project: ProjectModel;
  wallet: WalletModel;
  

  constructor(private projectService: ProjectService ,private manageProjectsService: ManageProjectsService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.setUploadAreas();
    // this.fetchNews(0);
    this.getProject(() => {
      SpinnerUtil.showSpinner();

      this.projectService.getProjectWallet(this.project.id).subscribe((res: WalletModel) => {
        SpinnerUtil.hideSpinner();
        this.wallet = res;
        this.setUploadAreas();
      }, err => {
        if(err.status == "404") { // 0501 meaning - "Missing wallet for org"
          this.createInitQRCODE();
        } else {
          displayBackendError(err);
        }
        SpinnerUtil.hideSpinner();
      })
    });
  }

  createInitQRCODE() {
    this.projectService.generateTransactionToCreateProjectWallet(this.project.id).subscribe((res) => {
      QRCode.toCanvas(document.getElementById("pairing-code"), JSON.stringify(res), (err) => {
        if(err) { alert(err) }
      });
    }, err  => {
      displayBackendError(err);
    });
  }

  getProject(onComplete: () => void) {
    SpinnerUtil.showSpinner();
    let id = this.route.snapshot.params.projectID;
    this.projectService.getProject(id).subscribe((res: ProjectModel) => {
      SpinnerUtil.hideSpinner();
      this.project = res;
      onComplete();
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    });
  }

  // private fetchNews(index: number) {
  //   var that = this;
  //   var link = this.newsLinks[index];

  //   this.manageProjectsService.getLinkPreview(link).subscribe((res: any) => {

  //     this.news.push({
  //       title: res.title,
  //       description: res.description,
  //       url: res.link,
  //       image: res.image.url
  //     });

  //     if(index < (this.newsLinks.length - 1)) {
  //       setTimeout(() => { this.fetchNews(index + 1)} , 100);
  //     }
  //   }, err => {

  //   });

    
  // }

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

  private configureUppy(uppy: Uppy.Core.Uppy , areaID: string) {
    let width = $("#core-root-manager").width();
    uppy.use(Uppy.Dashboard, { 
      target: areaID,
      inline: true,
      height: 300,
      width: width
    });
    uppy.use(Uppy.Tus, { endpoint: 'https://master.tus.io/files/' })
  }
  
  private setUploadAreas() {

    var imageUppy = this.setUpUppy("image-upload-project", ["image/*"],)
    this.configureUppy(imageUppy, "#drag-drop-area-img");

    var filesUppy = Uppy.Core({
      id: "files-upload-uppy"
    });
    filesUppy.use(Uppy.Dashboard, {
      id: "myfilesdash",
      trigger: "#proj-files-upload-target"
    });
  }

  public deleteFile(index: number): any {
    swal({
      text: "Are you sure you want to delete this file? This action cannot be reversed",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then(() => {
      this.files = _.filter(this.files, (val, i) => {
        if(index != i) { return val }
      });
    });

  }

  // linkClicked(index: number) {
  //   let link = this.newsLinks[index];
  //   window.location.href = link;
  // }

  private setUploadFilesProject() {

  }

}
