import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wallet-activation',
  templateUrl: './wallet-activation.component.html',
  styleUrls: ['./wallet-activation.component.css']
})
export class WalletActivationComponent implements OnInit {

  activationType = 'users';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.activationType = params.type;
    });
  }

}
