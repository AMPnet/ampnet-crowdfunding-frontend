import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-utils/user-service';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { UserModel } from '../models/user-model';

@Component({
  selector: 'app-ownership',
  templateUrl: './ownership.component.html',
  styleUrls: ['./ownership.component.css']
})
export class OwnershipComponent implements OnInit {

  user: UserModel;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getOwnProfile().subscribe((res: any) => {
      this.user = res;
    }, hideSpinnerAndDisplayError)
  }

}
