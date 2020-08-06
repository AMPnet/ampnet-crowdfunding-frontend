import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-withdraw-modal',
  templateUrl: './withdraw-modal.component.html',
  styleUrls: ['./withdraw-modal.component.css']
})
export class WithdrawModalComponent implements OnInit {

  constructor(private router: Router) {
  }

  addPaymentOptionClicked() {
    $('#withdraw-modal').modal('toggle');
    this.router.navigate(['dash', 'payment_options', 'new']);
  }

  ngOnInit() {
  }

}
