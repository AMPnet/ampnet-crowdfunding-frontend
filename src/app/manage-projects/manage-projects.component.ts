import { Component, OnInit } from '@angular/core';


declare var _:any;

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {

  manageProjectsModel: ManageProjectsModel[];

  constructor() { }

  ngOnInit() {

    this.manageProjectsModel = _.fill(Array(10), {
      name: "PowerPlant",
      locationName: "Croatia",
      fundingNeeded: "50000",
      groupOwnerName: "Greenpeace Cro"
    });

  }

}
