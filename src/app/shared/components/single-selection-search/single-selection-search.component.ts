import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { urlConstants, NetworkService, LoaderService, ToastMessageService, KendraApiService } from '../../../core';
@Component({
  selector: 'app-single-selection-search',
  templateUrl: './single-selection-search.component.html',
  styleUrls: ['./single-selection-search.component.scss'],
})
export class SingleSelectionSearchComponent implements OnInit {
  @Input() url;
  @Input() type;
  dataList;
  selectedData;
  button;
  title = "LABELS.MY_PROGRAMS";
  constructor(
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private kendraApiService: KendraApiService,
    private networkService: NetworkService,
    private loaderService: LoaderService,
    private toastMessageService: ToastMessageService
  ) { }
  ngOnInit() {
    if (!this.url) {
      this.url = urlConstants.API_URLS.PRIVATE_PROGRAMS;
    }
    this.button = this.type == 'programs' ? 'LABELS.ADD_PROGRAM' : 'LABELS.ADD_STATE'
    this.getData();
  }

  async createProgram() {
    let text;
    this.translate.get(['LABELS.CREATE_PROGRAM', 'LABELS.CREATE_PROGRAM_MESSAGE', 'LABELS.CANCEL', 'LABELS.SAVE', 'LABELS.CREATE_PROGRAM_INPUT_PLACEHOLDER', 'LABELS.CREATE_PROGRAM_INPUT_NAME']).subscribe(data => {
      text = data;
    })
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: text['LABELS.CREATE_PROGRAM'],
      message: text['LABELS.CREATE_PROGRAM_MESSAGE'],
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: text['LABELS.CREATE_PROGRAM_INPUT_PLACEHOLDER']
        }
      ],
      buttons: [
        {
          text: text['LABELS.CANCEL'],
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: text['LABELS.SAVE'],
          handler: (data) => {
            data.created = true;
            this.selectedData = data;
            this.close(this.selectedData);
          }
        }
      ]
    });
    await alert.present();
  }

  getData() {
    if (this.networkService.isNetworkAvailable) {
      this.loaderService.startLoader();
      const config = {
        url: this.url
      }
      this.kendraApiService.get(config).subscribe(data => {
        this.loaderService.stopLoader();

        if (data.result && data.result.length) {
          this.dataList = data.result;
        }
      }, error => {
        this.loaderService.stopLoader();
      })
    } else {
      this.toastMessageService.showMessage('MESSAGES.YOU_ARE_WORKING_OFFLINE_TRY_AGAIN', 'danger');
    }
  }
  selectProgram(data) {
    this.selectedData = data;
  }
  close(data?) {
    this.modalCtrl.dismiss(data);
  }
  addProgram() {
    if (this.selectedData) {
      this.close(this.selectedData);
    }
  }
}
