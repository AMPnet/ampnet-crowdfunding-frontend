import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { XHRUpload, DragDrop, Dashboard } from 'uppy'; 

declare var $: any;

@Component({
  selector: 'app-manage-single-project',
  templateUrl: './manage-single-project.component.html',
  styleUrls: ['./manage-single-project.component.css']
})
export class ManageSingleProjectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.setUploadAreas();

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

    var filesUppy = this.setUpUppy("file-upload-project", ["*"])
    this.configureUppy(filesUppy, "#drag-drop-area-files");
  }

  private setUploadFilesProject() {

  }

}
