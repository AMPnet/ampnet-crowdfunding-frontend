import { Component, OnInit } from '@angular/core';
import { WalletActivationService } from '../wallet-activation.service';
import { hideSpinnerAndDisplayError, displayErrorMessage, displayBackendError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { UserActivationModel } from './user-activation.model';
import { ArkaneUtil } from 'src/app/utilities/arkane-util';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import { ArkaneConnect, SecretType, WindowMode, SignatureRequestType } from '@arkane-network/arkane-connect';
import swal from 'sweetalert2';

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

  async activateUserClicked(id: number) {
    SpinnerUtil.showSpinner()
    
    this.activationService.getActivationData(id).subscribe(async (res: any) => {
      console.log("RES_TX", res.tx)
      let arkaneConnect = new ArkaneConnect('AMPnet', {
        environment: 'production'
      })
    
      let account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY)
      let sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
        walletId: account.wallets[0].id,
        data: res.tx,
        type: SignatureRequestType.AETERNITY_RAW
      })
      this.broadService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
        .subscribe(res => {
          SpinnerUtil.hideSpinner()
          swal("", "Success", "success")
        }, hideSpinnerAndDisplayError)

    }, hideSpinnerAndDisplayError)
  }

}
