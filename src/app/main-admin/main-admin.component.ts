import { Component, OnInit } from '@angular/core';

declare var _: any;
declare var $: any;

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.css']
})
export class MainAdminComponent implements OnInit {

  constructor() { }

  pendingUsers: PendingUserModel[];

  ngOnInit() {
    
    this.pendingUsers = _.fill(Array(10) , {
      name: "John Smith",
      contact: "john.smith@gmail.com"
    });

  }

  onUserClicked() {
    $("#reviewUserModal").modal();
  }

}
