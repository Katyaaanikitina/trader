import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { ChartData } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  pricesPerDay!: ChartData;

  constructor(private readonly _statisticsService: StatisticsService) {};

  ngOnInit() {
    this._statisticsService.getPricesPerDayShort('2021-01-01T00:00:00', 180).subscribe((data) => {
      this.pricesPerDay = this._statisticsService.mapForChart(data);
    })
  }
}
