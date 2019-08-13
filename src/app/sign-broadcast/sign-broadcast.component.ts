import { Component, OnInit, Input } from '@angular/core';
import * as QRCode from 'qrcode'
import { API } from '../utilities/endpoint-manager';
import * as SockJS from 'sockjs-client'
@Component({
  selector: 'app-sign-broadcast',
  templateUrl: './sign-broadcast.component.html',
  styleUrls: ['./sign-broadcast.component.css']
})
export class SignBroadcastComponent implements OnInit {

  @Input() txData: string

  constructor() { }

  ngOnInit() {

    QRCode.toCanvas(document.getElementById("sign-tx-canvas"), 
      this.txData, console.log)

    let socket = new WebSocket("wss://api.ampnet.io/websocket/websocket")

    socket.onopen = () => {
      console.log("open")
      socket.send(JSON.stringify({"command": "subscribe","identifier":"{\"channel\":\"/tx_status\"}"}))
    }

    socket.onmessage = () => {
      console.log("message")
    }

    socket.onerror = (error) => {
      console.log("WebSocket error: " + error)
    }

  }

}
