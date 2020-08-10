import { Component, OnInit } from '@angular/core';
import { PendingUserModel } from '../../main-admin/pending-user-model';

declare var _: any;
declare var $: any;

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
    pendingUsers: PendingUserModel[];

    constructor() {
    }

    ngOnInit() {
        this.pendingUsers = _.fill(Array(10), {
            name: 'John Smith',
            contact: 'john.smith@gmail.com'
        });
    }

    onUserClicked() {
        $('#reviewUserModal').modal();
    }
}
