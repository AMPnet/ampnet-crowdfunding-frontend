import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';
import { Router } from '@angular/router';
import { UserStatusStorage } from '../user-status-storage';

@Component({
    selector: 'app-secure-layout',
    templateUrl: './secure-layout.component.html',
    styleUrls: ['./secure-layout.component.css']
})
export class SecureLayoutComponent {
    constructor() {
    }
}
