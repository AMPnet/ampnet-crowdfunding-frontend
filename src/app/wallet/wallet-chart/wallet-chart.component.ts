import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-wallet-chart',
  templateUrl: './wallet-chart.component.html',
  styleUrls: ['./wallet-chart.component.css']
})
export class WalletChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	var ctx = document.getElementById("myChart");
  	console.log(ctx);
		var myChart = new Chart(<any>ctx, {
		    type: 'line',
		    data: {
		        labels: ["JUN", "JUL", "OCT", "SEP", "NOV", "DEC"],
		        datasets: [{
		            label: 'Money',
		            data: [11, 9, 25, 19, 29, 28],
		            backgroundColor: [
		                '#7FA94955'
		            ],
		            borderColor: [
		                '#7FA949'
		            ],
		            borderWidth: 4
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true,
		                    maxTicksLimit: 6,
		                    display: false
		                },
		                gridLines: {
		                	display: false
		                }
		            }],
		            xAxes: [{
		            	gridLines: {
		            		display: false
		            		            	},
		            	ticks: {
		            		fontColor: "rgba(0,0,0,0.3)"
		            	},
		            }]
		        },
		        legend: {
		        	display: false
		        }

		    }
		});
  }

}
