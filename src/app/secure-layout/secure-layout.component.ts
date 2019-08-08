import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { UserService } from '../user-utils/user-service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { SpinnerUtil } from '../utilities/spinner-utilities';

@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.css']
})
export class SecureLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
   
  }

}
