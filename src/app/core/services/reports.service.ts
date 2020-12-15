import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { urlConstants } from "..";
import { ModalController } from "@ionic/angular";
@Injectable({
  providedIn: "root",
})
export class ReportsService {
  baseUrl: string;
  filterForReport: any;
  constructor(
    public http: HttpClient,
    public modalController: ModalController
  ) {
    // super(http, auth, toast, modalController);
  }
}
