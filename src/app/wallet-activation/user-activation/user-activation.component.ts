import { Component, OnInit } from '@angular/core';
import { WalletActivationService } from '../wallet-activation.service';
import { hideSpinnerAndDisplayError, displayErrorMessage, displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { UserActivationModel } from './user-activation.model';
import { ArkaneUtil } from 'src/app/utilities/arkane-util';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit {

  users: UserActivationModel[];

  constructor(private activationService: WalletActivationService, private broadService: BroadcastService) { }

  ngOnInit() {
    SpinnerUtil.showSpinner()

    this.activationService.getUnactivatedWallets("user").subscribe((res: any) => {

      this.users = res.users;
      console.log(this.users)
      SpinnerUtil.hideSpinner();

    }, hideSpinnerAndDisplayError)

  }

  activateUserClicked(id: number) {
    SpinnerUtil.showSpinner()
    
    this.activationService.getActivationData(id).subscribe(async (res: any) => {
      console.log("RES_TX", res.tx)
      try {
        let sigres = await ArkaneUtil.signTx(res.tx)
        console.log("SIGRES", sigres);
      
        this.broadService.broadcastSignedTx(encodeURI(sigres), res.tx_id).subscribe(res => {
          alert(JSON.stringify(res))
          SpinnerUtil.hideSpinner()

        }, err => {
          displayBackendError(err)
          SpinnerUtil.hideSpinner()

        })
      } catch(reason) {
        displayErrorMessage("Failed signing transaciton")
      }
    }, hideSpinnerAndDisplayError)
  }

}
