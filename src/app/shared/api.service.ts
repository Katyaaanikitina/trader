import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DailyPriceInfoFull } from './intefaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private readonly _http: HttpClient) { }

  getPricesPerDayFull(timeStartFrom: string, daysNumber: number): Observable<DailyPriceInfoFull[]> {
    return this._http.get<DailyPriceInfoFull[]>(`${environment.API_BASE_URL}history?apikey=${environment.API_KEY}&period_id=1DAY&time_start=${timeStartFrom}&limit=${daysNumber}`)
  }
}