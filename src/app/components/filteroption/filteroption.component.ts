import { Component , ViewEncapsulation  } from '@angular/core';
import { NavParams, PopoverController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TelemetryGeneratorService } from '@app/services/telemetry-generator.service';
import {
  Environment, InteractSubtype, InteractType, PageId
} from '@app/services/telemetry-constants';
@Component({
  selector: 'app-filteroption',
  templateUrl: './filteroption.component.html',
  styleUrls: ['./filteroption.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilteroptionComponent {

  facets: any;
  backButtonFunc: Subscription;

  constructor(
    private navParams: NavParams,
    private popCtrl: PopoverController,
    private platform: Platform,
    private telemetryGeneratorService: TelemetryGeneratorService
    ) {
    this.facets = this.navParams.get('facet');
    this.backButtonFunc = this.platform.backButton.subscribeWithPriority(11, () => {
      this.popCtrl.dismiss();
      this.backButtonFunc.unsubscribe();
    });
  }

  confirm() {
    const values = new Map();
    values['option'] = this.facets.name;
    const appliedFilter = [];
    this.facets.values.map((element) => {
       if (element.apply) {
          appliedFilter.push(element.name);
       }
    });
    values['selectedFilter'] = appliedFilter;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.APPLY_FILTER_CLICKED,
      Environment.HOME,
      PageId.LIBRARY_SEARCH_FILTER,
      undefined,
      values);
    this.popCtrl.dismiss();
  }
}
