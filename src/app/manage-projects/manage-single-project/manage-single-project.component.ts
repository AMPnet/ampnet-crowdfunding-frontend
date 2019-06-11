import { Component, OnInit } from '@angular/core';
import * as Uppy from 'uppy';
import { XHRUpload, DragDrop } from 'uppy'; 

@Component({
  selector: 'app-manage-single-project',
  templateUrl: './manage-single-project.component.html',
  styleUrls: ['./manage-single-project.component.css']
})
export class ManageSingleProjectComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    var uppy = Uppy.Core({
      restrictions: {
        maxFileSize: null,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: ["image/*"]
      }
    });
    uppy.use(Uppy.Dropbox, { });
    uppy.use(Uppy.Tus, { endpoint: 'https://master.tus.io/files/' })
    uppy.use(Uppy.Dashboard, { 
      target: '#drag-drop-area',
      inline: true
    });
  }

}
