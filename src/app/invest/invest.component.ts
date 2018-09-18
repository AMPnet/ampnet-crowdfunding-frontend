import { Component, OnInit } from '@angular/core';

declare var feather: any;

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	feather.replace();
  }

}
