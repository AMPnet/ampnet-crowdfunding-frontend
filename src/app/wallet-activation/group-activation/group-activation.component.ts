import { Component, OnInit } from '@angular/core';
import { WalletActivationService } from '../wallet-activation.service';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import {GroupActivationModel} from "./group-activation.model"
import { ArkaneConnect, SecretType, WindowMode, SignatureRequestType } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-group-activation',
  templateUrl: './group-activation.component.html',
  styleUrls: ['./group-activation.component.css']
})
export class GroupActivationComponent implements OnInit {

  constructor(private activationService: WalletActivationService,
    private broadService: BroadcastService) { }

  groups: GroupActivationModel[]

  ngOnInit() {
    this.fetchWalletToActivate()
  }

  fetchWalletToActivate() {
    SpinnerUtil.showSpinner()
    this.activationService
      .getUnactivatedWallets("organization").subscribe((res: any) => {
      this.groups = res.organizations;
      console.log(this.groups)
      SpinnerUtil.hideSpinner()
      
    }, displayBackendError)
  }

  activateGroupClicked(uuid: string) {

    this.activationService.getActivationData(uuid).subscribe(async (res: any) => {
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
