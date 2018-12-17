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

  public static newChart(ctx: any) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['JUN', 'JUL', 'OCT', 'SEP', 'NOV', 'DEC'],
        datasets: [{
          label: 'Money',
          data: [11, 9, 25, 19, 29, 28],
          backgroundColor: [
          '#3B599855'
          ],
          borderColor: [
          '#3B5998'
          ],
          borderWidth: 4
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 6,
              fontColor: 'rgba(0,0,0,0.3'
            },
            gridLines: {
              offsetGridLines: true,
              borderDash: [8, 4]
            }
          }],
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
              offsetGridLines: true
            },
            ticks: {
              fontColor: 'rgba(0,0,0,0.3)'
            },
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }

  ngOnInit() {
    const ctx = document.getElementById('myChart');
    console.log(ctx);
    const myChart = new Chart(<any>ctx, {
      type: 'line',
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 6,
              fontColor: 'rgba(0,0,0,0.3'
            },
            gridLines: {
              offsetGridLines: true,
              borderDash: [8, 4]
            }
          }],
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
              offsetGridLines: true
            },
            ticks: {
              fontColor: 'rgba(0,0,0,0.3)'
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
