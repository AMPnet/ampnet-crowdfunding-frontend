import { AfterViewInit, Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @Input() onlyLogo: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

}
