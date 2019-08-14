import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { XHRUpload, DragDrop, Dashboard } from 'uppy'; 
import swal from 'sweetalert2';
import { ManageProjectsService } from '../manage-projects-service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/projects/project-service';
import { ProjectModel } from '../../projects/create-new-project/project-model'
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { WalletModel } from '../../organizations/organization-details/organization-model';
import * as QRCode from 'qrcode';
import { timeout } from 'q';
import { API } from 'src/app/utilities/endpoint-manager';
import { headersToString } from 'selenium-webdriver/http';
import { validURL } from '../../utilities/link-valid-util';

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

  qrCodeData: String = ""
  

  constructor(private projectService: ProjectService ,private manageProjectsService: ManageProjectsService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.setUploadAreas();
    // this.fetchNews(0);
    this.fetchAllData();
  }

  fetchAllData() {
    this.getProject(() => {
      SpinnerUtil.showSpinner();

      this.projectService.getProjectWallet(this.project.id).subscribe((res: WalletModel) => {
        SpinnerUtil.hideSpinner();
        this.wallet = res;
        setTimeout(() => {
          this.setUploadAreas();
        }, 300)
      }, err => {
        if(err.status == "404") { // 0501 meaning - "Missing wallet for org"
          this.createInitQRCODE();
        } else {
          console.log(err)
          displayBackendError(err);
        }
        SpinnerUtil.hideSpinner();
      })
    });
  }

  createInitQRCODE() {
    this.projectService.generateTransactionToCreateProjectWallet(this.project.id).subscribe((res) => {

      var qrCodeData = {
        "tx_data" : res,
        "base_url": API.APIURL
      }
      this.qrCodeData = JSON.stringify(qrCodeData)
    }, err  => {
      displayBackendError(err);
    });
  }

  addNewsLink() {
    SpinnerUtil.showSpinner();
    let linkHolder = $("#newsLink").val();
    if(validURL(linkHolder)) {
      this.manageProjectsService.addNewsToProject(this.project.id, linkHolder).subscribe(res => {
        this.getProject(() => { });
      }, err => {
        displayBackendError(err);
      });
    } else {
      swal("", "Link invalid! The news link " + linkHolder + " is not a valid link");
    }
  }

  deleteNewsClicked(link: string) {
    SpinnerUtil.showSpinner();
    this.manageProjectsService.deleteNewsFromProject(this.project.id, link).subscribe(res => {
      SpinnerUtil.hideSpinner();
     this.getProject(() => {});
    }, err => {
      SpinnerUtil.hideSpinner();
      displayBackendError(err);
    })
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

  toggleProjectStatusClicked() {
    SpinnerUtil.showSpinner()
    this.projectService.updateProject(
      this.project.id,
      this.project.name,
      this.project.description,
      this.project.location,
      this.project.location_text,
      this.project.return_on_investment,
      !this.project.active
    ).subscribe(res => {
      this.getProject(() => {})
    }, err => {
      SpinnerUtil.hideSpinner()
      displayBackendError(err)
    })
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

  private configureUppy(uppy: Uppy.Core.Uppy , areaID: string) {
    let width = $("#core-root-manager").width();
    uppy.use(Uppy.Dashboard, { 
      target: areaID,
      inline: true,
      height: 300,
      width: width
    });
    
    var headers = API.tokenHeaders();
    headers.headers["Access-Control-Allow-Origin"] = "*";

    uppy.use(Uppy.XHRUpload, { 
      endpoint: API.generateComplexRoute("/project", [ this.project.id.toString(), "image", "main"]),
      headers: {
        "Authorization" : headers.headers["Authorization"]
      },
      metaFields: [
        "name", "filename"
      ],
      fieldName: "image"
    }).on('upload-success', () => {
      this.getProject(() => {});
    });

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

    filesUppy.use(Uppy.XHRUpload, {
      endpoint: API.generateComplexRoute("/project", [
        this.project.id.toString(), "document"
      ]),
      headers: {
        "Authorization" : API.tokenHeaders().headers["Authorization"]
      },
      metaFields: [
        "name", "filename"
      ],
      fieldName: "file",
      bundle: false
    }).on('upload-success', () => {
      this.getProject(() => {});
      filesUppy.close();
    });
  }

  

  updateProject() {

    let projectName = $("#project-name").val()
    let projectDescription = $("#project-description").val()
    let locationName = $("#location-name").val()


    // function isEmptyOrNull(item: String): boolean {
    //   if(item == undefined) { return true }
    //   if(item == null) { return true }
    //   if(item.length == 0) { return true }
    //   return false
    // }

    // if(
    //   isEmptyOrNull(projectName),
    //   isEmptyOrNull(projectDescription),
    //   isEmptyOrNull(locationName)
    // ) {
    //   swal("", "Project name, description and location name can't be empty", "info")
    //   return
    // }

    var updatedProject = this.project
    updatedProject.name = projectName
    updatedProject.description = projectDescription
    updatedProject.location_text = locationName

    SpinnerUtil.showSpinner()
    this.projectService.updateProject(
      updatedProject.id,
      updatedProject.name,
      updatedProject.description,
      updatedProject.location,
      updatedProject.location_text,
      updatedProject.return_on_investment,
      updatedProject.active
    ).subscribe(res => {
      SpinnerUtil.hideSpinner()
      this.getProject(() => {})
    }, hideSpinnerAndDisplayError )
  }

  addNewsClicked() {

  }

  public deleteFile(index: number): any {
    swal({
      text: "Are you sure you want to delete this file? This action cannot be reversed",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "No"
    }).then(() => {
      SpinnerUtil.showSpinner();
      this.manageProjectsService
        .deleteDocument(this.project.id, index).subscribe(res => {
          SpinnerUtil.hideSpinner();
          this.getProject(() => {});
        }, err => {
          SpinnerUtil.hideSpinner();
          displayBackendError(err);
        })
    });

  }

  // linkClicked(index: number) {
  //   let link = this.newsLinks[index];
  //   window.location.href = link;
  // }

  private setUploadFilesProject() {

  }

}
