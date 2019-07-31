import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Uppy from 'uppy'

declare var $: any;

@Component({
  selector: 'app-single-withdrawal',
  templateUrl: './single-withdrawal.component.html',
  styleUrls: ['./single-withdrawal.component.css']
})
export class SingleWithdrawalComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setUploadArea();
    }, 300)
  }

  setUploadArea() {
    let uppy = Uppy.Core({
      id: "payment-reciept",
      restrictions: {
        maxFileSize: null,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: null
      }
    });
    uppy.use(Uppy.Dashboard, {
      target: document.getElementById('payment-reciept-upload-target'),
      height: 300,
      width: $(".root-content-container").width(),
      inline: true,
      proudlyDisplayPoweredByUppy: false,
      note: "Upload the payment reciept for the withdrawal in PDF format"
    })
  }

}
