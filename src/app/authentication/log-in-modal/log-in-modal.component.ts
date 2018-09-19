import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-log-in-modal',
  templateUrl: './log-in-modal.component.html',
  styleUrls: ['./log-in-modal.component.css']
})
export class LogInModalComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logInFacebookClicked() {
    $("#log-in-modal").modal('toggle');
    this.router.navigate(['/dash']);
  }

  logInGoogleClicked() {
    $("#log-in-modal").modal('toggle');
    this.router.navigate(['/dash']);
  }

  logInMailClicked() {
    $("#log-in-modal").modal('toggle');
    this.router.navigate(['/dash']);
  }

}
