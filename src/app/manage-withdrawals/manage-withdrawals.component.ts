import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-withdrawals',
  templateUrl: './manage-withdrawals.component.html',
  styleUrls: ['./manage-withdrawals.component.css']
})
export class ManageWithdrawalsComponent implements OnInit {

  withdrawals: WithdrawalModel[]

  constructor() { 



  }

  ngOnInit() {
    this.withdrawals = [
      {
        name: "ABC",
        id: 12
      },
      {
        name: "DEF",
        id: 12
      },
      {
        name: "GFF",
        id: 12
      }
    ]
  }

}
