import { Component, OnInit } from '@angular/core';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { WalletActivationService } from '../wallet-activation.service';
import { ProjectActivationModel } from './project-activation.model';
import { displayBackendError, hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { ArkaneConnect, SecretType, WindowMode, SignatureRequestType } from '@arkane-network/arkane-connect';
import { BroadcastService } from 'src/app/broadcast/broadcast-service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-project-activation',
  templateUrl: './project-activation.component.html',
  styleUrls: ['./project-activation.component.css']
})
export class ProjectActivationComponent implements OnInit {

  projects: ProjectActivationModel[];

  constructor(private activationService: WalletActivationService,
    private broadService: BroadcastService) { }

  ngOnInit() {
    this.fetchWalletToActivate();
  }

  fetchWalletToActivate() {
    SpinnerUtil.showSpinner();
    this.activationService
      .getUnactivatedWallets('project').subscribe((res: any) => {
      this.projects = res.projects;
      SpinnerUtil.hideSpinner();

    }, displayBackendError);
  }

  activateProjectClicked(uuid: string) {

    this.activationService.getActivationData(uuid).subscribe(async (res: any) => {
      const arkaneConnect = new ArkaneConnect('AMPnet', {
        environment: 'staging'
      });

      const account = await arkaneConnect.flows.getAccount(SecretType.AETERNITY);
      const sigRes = await arkaneConnect.createSigner(WindowMode.POPUP).sign({
        walletId: account.wallets[0].id,
        data: res.tx,
        type: SignatureRequestType.AETERNITY_RAW
      });
      this.broadService.broadcastSignedTx(sigRes.result.signedTransaction, res.tx_id)
        .subscribe(res => {
          SpinnerUtil.hideSpinner();
          swal('', 'Success', 'success');
        }, hideSpinnerAndDisplayError);

    }, hideSpinnerAndDisplayError);

  }

}
