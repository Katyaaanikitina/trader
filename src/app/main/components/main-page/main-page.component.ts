import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { ChartData, DailyPriceInfoShort } from 'src/app/shared/interfaces';
import { BehaviorSubject, Observable, Subject, Subscribable, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  pricesPerDay!: ChartData;

  constructor(private readonly _statisticsService: StatisticsService) {};

  ngOnInit() {
    // this.loadPrices("thisYear");
  }

  loadPrices(period: "30days" | "thisYear" | "3years") {
    this.getPrices(period).pipe(take(1)).subscribe((data) => {
      this._statisticsService.pricesPerDay$.next(this._statisticsService.mapDataForChart(data))
    });
  }

  getPrices(period: "30days" | "thisYear" | "3years"): Observable<DailyPriceInfoShort[]> {
    const today = new Date();
    let daysPassed = 30;
    
    switch(period) {
      case ("30days"):
        return this._statisticsService.getPricesPerDayShort(this._statisticsService.getDate30DaysAgo(today), daysPassed);
      
      case ("3years"): 
        const firstDay3YearsAgo = `${today.getFullYear() - 3}-01-01T00:00:00`;
        daysPassed = this._statisticsService.countDaysFrom(firstDay3YearsAgo);
        return this._statisticsService.getPricesPerDayShort(firstDay3YearsAgo, daysPassed);

      default:
        const firstDayOfYear = `${today.getFullYear()}-01-01T00:00:00`;
        daysPassed = this._statisticsService.countDaysFrom(firstDayOfYear);
        return this._statisticsService.getPricesPerDayShort(firstDayOfYear, daysPassed);
    }
  }
}
