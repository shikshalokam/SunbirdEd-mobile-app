import { Injectable } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OpenResourcesService {

  constructor() { }
  launchExternalApp(iosSchemaName: string, androidPackageName: string, httpUrl: string) {
    let app: string;
    app = androidPackageName;
    AppAvailability.check(app).then(
      () => { // success callback
        (<any>window).cordova.InAppBrowser.open(httpUrl, '_system');
      },
      () => { // error callback
        (<any>window).cordova.InAppBrowser.open(httpUrl, '_system');
      }
    );
  }

  openBodh(link: string) {
    this.launchExternalApp('', environment.LMSAppId, link);
  }
}
