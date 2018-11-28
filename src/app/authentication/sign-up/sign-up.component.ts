import { Component, OnInit, Injectable } from '@angular/core';

import * as $ from 'jquery';
import { Http, Request, Response } from '@angular/http';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private http: Http) { }

  ngOnInit() {

  }

}
