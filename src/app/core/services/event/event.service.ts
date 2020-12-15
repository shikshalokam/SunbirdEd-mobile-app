import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  $projectUpdate = new Subject();

  constructor() { }

  emitProjectUpdate() {
    this.$projectUpdate.next();
  }
}
