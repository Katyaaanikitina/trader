import { Component } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { DailyPriceInfoShort } from 'src/app/shared/interfaces';
import { Observable, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  isLivePriceSubscribed = false;
  private _isSubscribeToWebSocket!: Subscription;

  constructor(private readonly _statisticsService: StatisticsService) {};

  ngOnInit(): void {
    this._isSubscribeToWebSocket = this._statisticsService.isSubscribeToWebSocket$.subscribe((value) => this.isLivePriceSubscribed = value)
    this.loadPrices("thisYear");
  }

  ngOnDestroy(): void {
    this._isSubscribeToWebSocket.unsubscribe();
  }

  loadPrices(period: "30days" | "thisYear" | "3years"): void {
    this._getPrices(period).pipe(take(1)).subscribe((data) => {
      this._statisticsService.pricesPerDay$.next(this._statisticsService.mapDataForChart(data))
    });
  }

  private _getPrices(period: "30days" | "thisYear" | "3years"): Observable<DailyPriceInfoShort[]> {
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

  subscribeOrUnsubscribe(): void {
    this._statisticsService.isSubscribeToWebSocket$.next(!this._statisticsService.isSubscribeToWebSocket$.value);
  }
}
