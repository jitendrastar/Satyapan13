import { Injectable } from '@angular/core';
import {fromEvent, merge, Observable, of} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {Network} from '@ionic-native/network/ngx';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private online: any;
  constructor(public network: Network, public platform: Platform) {
    this.online = Observable.create(observer => {
      observer.next(true);
    }).pipe(mapTo(true));

    if (this.platform.is('cordova')) {
      // on Device
      this.online = merge(
          this.network.onConnect().pipe(mapTo(true)),
          this.network.onDisconnect().pipe(mapTo(false))
      );
      console.log('this.online',this.online);
    } else {
      // on Browser
      this.online= merge(
          of(navigator.onLine),
          fromEvent(window, 'online').pipe(mapTo(true)),
          fromEvent(window, 'offline').pipe(mapTo(false))
      );
    }

  }


  public getNetworkType(): string {
    return this.network.type;
  }

  public getNetworkStatus(): Observable<boolean> {
    return this.online;
  }
}
