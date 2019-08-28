import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletActivationService } from '../wallet-activation.service';
import { SpinnerUtil } from 'src/app/utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from 'src/app/utilities/error-handler';
import { API } from 'src/app/utilities/endpoint-manager';

@Component({
  selector: 'app-activate-sign',
  templateUrl: './activate-sign.component.html',
  styleUrls: ['./activate-sign.component.css']
})
export class ActivateSignComponent implements OnInit {

  activationData: String = ""

  title: string = "Sign data with mobile app to activate"

  constructor(private route: ActivatedRoute, private activationService: WalletActivationService) { }

  ngOnInit() {
    let walletID = this.route.snapshot.params.id;
    
    SpinnerUtil.showSpinner()
    this.activationService.getActivationData(walletID).subscribe((res:any) => {
      SpinnerUtil.hideSpinner();
      let txDataModel = {
        "base_url": API.APIURL,
        "tx_data": res
      }
      this.activationData = JSON.stringify(txDataModel)
    }, hideSpinnerAndDisplayError )
  }

}
