import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(private readonly _statisticsService: StatisticsService) {};

  ngOnInit() {
    this._statisticsService.getPricesPerDayShort('2021-01-01T00:00:00', 148).subscribe((data) => {
      console.log(data);
    })
  }
}
