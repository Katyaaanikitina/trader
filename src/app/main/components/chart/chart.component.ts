import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ChartData } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() dataType!: string;
  @Input() data!: ChartData; 
  chart: any = [];

  constructor() {}

  ngOnInit() {
    this._drawChart(this.data.labels, this.data.data);
  }

  private _drawChart(labels: string[], data: number[]): void {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.dataType,
            data: data,
            borderWidth: 1,
            borderColor: "#000",
            backgroundColor: "#000",
            pointRadius: 0
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
