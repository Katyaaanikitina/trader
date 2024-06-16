import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { StatisticsService } from '../../services/statistics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() dataType!: string;
  chart!: any;
  private _dataSub!: Subscription;

  constructor(private readonly _statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this._dataSub = this._statisticsService.pricesPerDay$.subscribe((data) => {
      (this.chart) ? this._updateChart(data.labels, data.data) : this._drawChart(data.labels, data.data);
    })
  }

  ngOnDestroy(): void {
    this._dataSub.unsubscribe();
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

  private _updateChart(labels: string[], data: number[]): void {
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }
}
