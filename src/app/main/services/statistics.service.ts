import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { ChartData, DailyPriceInfoShort } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  pricesPerDay$: Subject<ChartData> = new Subject();
  isSubscribeToWebSocket$ = new BehaviorSubject(false);
  
  constructor(private readonly _apiService: ApiService) { }

  getPricesPerDayShort(timeStartFrom: string, daysNumber: number): Observable<DailyPriceInfoShort[]> {
    return this._apiService.getPricesPerDayFull(timeStartFrom, daysNumber).pipe(
      map((data) => {
        return data.map((dayInfo) => {
          return {price: dayInfo.price_close, date: new Date(dayInfo.time_period_start)}
        })
      }),

      catchError(err => {
        console.log('Error while fetching data:', err);
        return throwError(err);
      }))
  }

  mapDataForChart(prices: DailyPriceInfoShort[]): ChartData {
    return prices.reduce((acc: ChartData, curr) => {
      acc.data.push(curr.price);
      acc.labels.push(curr.date.toLocaleDateString('en-US'))
      return acc;
    }, {labels: [], data: []})
  }

  getDate30DaysAgo(today: Date): string {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 30);

    const year = pastDate.getFullYear();
    const month = String(pastDate.getMonth() + 1).padStart(2, '0');
    const day = String(pastDate.getDate()).padStart(2, '0');

    return (`${year}-${month}-${day}T00:00:00`);
  }

  countDaysFrom(dateString: string): number {
    const givenDate = new Date(dateString);
    const today = new Date();
    const differenceInMillis = today.getTime() - givenDate.getTime();

    const millisPerDay = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.floor(differenceInMillis / millisPerDay);

    return differenceInDays;
  }
}