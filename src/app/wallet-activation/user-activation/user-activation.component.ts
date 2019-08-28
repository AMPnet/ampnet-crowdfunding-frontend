import { Component, OnInit } from '@angular/core';
import { WalletActivationService } from '../wallet-activation.service';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { UserActivationModel } from './user-activation.model';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit {

  users: UserActivationModel[];

  constructor(private activationService: WalletActivationService) { }

  ngOnInit() {
    SpinnerUtil.showSpinner()

    this.activationService.getUnactivatedWallets("user").subscribe((res: any) => {

      this.users = res.users;
      console.log(this.users)
      SpinnerUtil.hideSpinner();

    }, hideSpinnerAndDisplayError)

  }

}
