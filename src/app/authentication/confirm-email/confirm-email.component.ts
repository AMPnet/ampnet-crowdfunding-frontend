import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  email: string;
  private sub: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
