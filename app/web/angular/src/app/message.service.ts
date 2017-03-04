import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessageService {
  private url = 'http://duanemcki-pc:3000';
  private socket;

  rooms: { [index: string]: Observable<any> } = {};

  constructor() {
    this.socket = io(this.url);
  }

  sendMessage(room: string, message: any) {
    this.socket.emit(room, message);
  }

  disconnect() {
    this.socket.disconnect();
  }

  subscribe(room: string) {
    if (!this.rooms[room]) {
      this.rooms[room] = new Observable(observer => {
        this.socket.on(room, (data) => {
          observer.next(data);
        });
      });
    }

    return this.rooms[room];
  }

}
