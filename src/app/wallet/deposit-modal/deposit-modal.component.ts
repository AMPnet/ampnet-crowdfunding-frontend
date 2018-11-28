import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

declare var $: any;


@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.css']
})
export class DepositModalComponent implements OnInit {

  constructor(private router: Router, private http: Http) { }

  ngOnInit() {
  }

  addPaymentOptionClicked() {
     $('#deposit-modal').modal('toggle');
     this.router.navigate(['dash', 'payment_options', 'new']);
  }



}
