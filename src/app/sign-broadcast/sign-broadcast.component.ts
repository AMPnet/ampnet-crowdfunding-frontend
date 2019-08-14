import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as QRCode from 'qrcode'
import { API } from '../utilities/endpoint-manager';
import * as Stomp from'@stomp/stompjs'
import { TXFullDataModel } from './tx-data-model'

@Component({
  selector: 'app-sign-broadcast',
  templateUrl: './sign-broadcast.component.html',
  styleUrls: ['./sign-broadcast.component.css']
})
export class SignBroadcastComponent implements OnInit, AfterViewInit {

  @Input() txData: string
  @Output() onTxBroadcasted = new EventEmitter()


  constructor() { }

  ngOnInit() {

      this.initSockets()
  }

  ngAfterViewInit() {
    QRCode.toCanvas(document.getElementById("sign-tx-canvas"), 
      this.txData, console.log)
  }

  initSockets() {
    var url = "wss://api.ampnet.io/websocket/websocket"
    var client = Stomp.Stomp.client(url)

    client.activate()

    let castedData: TXFullDataModel = JSON.parse(this.txData)
    
    setTimeout(() => {
      client.subscribe("/tx_status/" + castedData.tx_data.tx_id, (msg) => {
        this.txData = ""
        client.deactivate()
        this.onTxBroadcasted.emit(castedData.tx_data.tx_id.toString())
      })
    }, 500)
  }

}
