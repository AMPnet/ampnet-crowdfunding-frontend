import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogInModalService } from './log-in-modal.service';
declare var $: any;

@Component({
  selector: 'app-log-in-modal',
  templateUrl: './log-in-modal.component.html',
  styleUrls: ['./log-in-modal.component.css']
})
export class LogInModalComponent implements OnInit {

  email: string;
  password: string;

  constructor(private router: Router, 
    private loginService: LogInModalService) { }

  ngOnInit() {
  }

  logInFacebookClicked() {
    $('#log-in-modal').modal('toggle');
    this.router.navigate(['/dash']);
  }

  logInGoogleClicked() {
    $('#log-in-modal').modal('toggle');
    this.router.navigate(['/dash']);
  }

  logInMailClicked() {
    this.loginService.performEmailLogin(this.email, this.password)
      .subscribe(result => {
        localStorage.setItem('access_token', result.token);
      }, error => {
        alert('Error: ' + JSON.stringify(error));
      });
  }

}
