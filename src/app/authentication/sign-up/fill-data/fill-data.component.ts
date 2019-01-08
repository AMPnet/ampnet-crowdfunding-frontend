import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fill-data',
  templateUrl: './fill-data.component.html',
  styleUrls: ['./fill-data.component.css']
})
export class FillDataComponent implements OnInit {

  submissionForm: FormGroup;

  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.email = params['email'];
        this.firstName = params['first_name'];
        this.lastName = params['last_name'];
      });
  }

}
