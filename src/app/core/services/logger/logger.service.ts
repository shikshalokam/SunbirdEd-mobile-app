import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }
  log(data:any,msg) {
    console.log("in loger service");
    console.log(data + '== >' + msg);
  }
}