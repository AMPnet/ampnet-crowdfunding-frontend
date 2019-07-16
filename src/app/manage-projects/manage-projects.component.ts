import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


declare var _:any;

@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {

  manageProjectsModel: ManageProjectsModel[];

  constructor(private router: Router) { }

  onUserClicked() {
    this.router.navigate(['manage_project', '10']);
  }

  ngOnInit() {

    this.manageProjectsModel = _.fill(Array(3), {
      name: "Vjetroelektrana Orjak Greda",
      locationName: "Croatia",
      fundingNeeded: "50000",
      groupOwnerName: "Greenpeace Cro"
    });

  }

}
