import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { XHRUpload, DragDrop, Dashboard } from 'uppy'; 
import swal from 'sweetalert2';

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

  private newsLinks: string[] = [
    "https://www.index.hr/vijesti/clanak/sud-eua-odlucio-njemacke-cestarine-su-protivne-pravu-europske-unije/2094023.aspx",
    "https://www.index.hr/vijesti/clanak/most-podnio-kaznenu-prijavu-protiv-ivice-kirina-zbog-pronevjere/2094050.aspx",
    "https://www.index.hr/vijesti/clanak/kuna-blago-ojacala-prema-euru/2094047.aspx",
    "https://www.index.hr/vijesti/clanak/potukli-se-na-jarunu-maloljetnik-tesko-ozlijedjen/2093378.aspx"
  ]

  private news: NewsLink[] = [];

  constructor() { }

  ngOnInit() {
    this.setUploadAreas();
    this.fetchNews(0);
  }

  private fetchNews(index: number) {
    var that = this;
    var link = this.newsLinks[index];

    if(index < (this.newsLinks.length - 1)) {
      setTimeout(() => { this.fetchNews(index + 1)} , 100);
    }
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
      target: "#proj-files-upload-target"
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

  private setUploadFilesProject() {

  }

}
