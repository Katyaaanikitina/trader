import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StatisticsService } from '../../services/statistics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-market-info',
  templateUrl: './market-info.component.html',
  styleUrls: ['./market-info.component.scss']
})
export class MarketInfoComponent {
  price!: number;
  date!: string;

  private _socket!: WebSocket;
  private _isSubscribeToWebSocket!: Subscription;
  isConnecting = false;

  isLivePriceSubscribed = false;

  constructor(private readonly _statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this._isSubscribeToWebSocket = this._statisticsService.isSubscribeToWebSocket$.subscribe((value) => { 
      this.isLivePriceSubscribed = value;
      (value) ? this._connectWebSocket() : this._disconnectFromWebSocket();
    })
  }

  ngOnDestroy(): void {
    this._disconnectFromWebSocket();
    this._isSubscribeToWebSocket.unsubscribe();
  }

  private _connectWebSocket(): void {
    this.isConnecting = true;
    this._socket = new WebSocket(environment.WEBSOCKET_BASE_URL);

    this._socket.onopen = (event) => {
      console.log('Connected')

      this._socket.send(JSON.stringify({
        "type": "hello",
        "apikey": environment.API_KEY,
        "subscribe_data_type": ["trade"],
        "subscribe_filter_symbol_id": ["BITSTAMP_SPOT_BTC_USD$", "BITFINEX_SPOT_BTC_LTC$"]
      }));
    };

    this._socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.price = data.price;
      this.date = data.time_exchange;

      this.isConnecting = false;
    };

    this._socket.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
    };
  }

  private _disconnectFromWebSocket(): void {
    if (this._socket) {
      this._socket.close(); 
    }
  }
}
