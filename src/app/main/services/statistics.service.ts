import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { ChartData, DailyPriceInfoShort } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

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

  mapForChart(prices: DailyPriceInfoShort[]): ChartData {
    return prices.reduce((acc: ChartData, curr) => {
      acc.data.push(curr.price);
      acc.labels.push(curr.date.toLocaleDateString('en-US'))
      return acc;
    }, {labels: [], data: []})
  }
}