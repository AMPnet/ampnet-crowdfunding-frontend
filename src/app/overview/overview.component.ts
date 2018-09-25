import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  components: string[];

  constructor() { }

  ngOnInit() {
    this.components = ['1', '2', '3', '4', '5', '6', '7'];
  }

}
