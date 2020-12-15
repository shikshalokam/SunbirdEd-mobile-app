import { Component, Input, OnInit } from "@angular/core";
import { AlertController, Platform, PopoverController } from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { UtilsService } from "src/app/core/services/utils.service";
import { LoaderService, ToastMessageService, UnnatiDataService, urlConstants } from "src/app/core";
import { FilePath } from "@ionic-native/file-path/ngx";
import { TranslateService } from "@ngx-translate/core";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

@Component({
  selector: "downlaod-share",
  templateUrl: "./downlaod-share.component.html",
  styleUrls: ["./downlaod-share.component.scss"],
})
export class DownlaodShareComponent {
  @Input() interface;
  @Input() showOptions;
  @Input() name;
  @Input() extension: string;
  @Input() downloadUrl: any;
  texts: any;
  constructor(
    public popoverController: PopoverController,
    private socialSharing: SocialSharing,
    private fileTransfer: FileTransfer,
    private platform: Platform,
    private file: File,
    public alertController: AlertController,
    public utils: UtilsService,
    public toast: ToastMessageService,
    public loader: LoaderService,
    public filePath: FilePath,
    public unnatiSrvc: UnnatiDataService,
    private translate: TranslateService,
    private androidPermissions: AndroidPermissions
  ) {
    this.translate.get(["MESSAGES.ERROR_WHILE_DOWNLOADING", "MESSAGES.SUCCESSFULLY DOWNLOADED"]).subscribe((data) => {
      this.texts = data;
    });
  }

  async openPopupMenu(ev) {
    const popover = await this.popoverController.create({
      component: DownlaodShareComponent,
      componentProps: {
        showOptions: true,
        interface: "simple",
        name: this.name,
        extension: this.extension,
        downloadUrl: this.downloadUrl,
      },
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }

  async download(share?) {
    this.loader.startLoader();

    let config = { url: this.downloadUrl };

    let res = await this.unnatiSrvc.get(config).toPromise();

    if (res.result && !res.result.data && !res.result.data.downloadUrl) {
      this.toast.showMessage(this.texts["MESSAGES.ERROR_WHILE_DOWNLOADING"], "danger");
      this.loader.stopLoader();
      return;
    }

    let fileName = this.utils.generateFileName(this.name);
    fileName = fileName + this.extension;

    const ft = this.fileTransfer.create();
    ft.download(res.result.data.downloadUrl, this.directoryPath() + fileName)
      .then(
        (res) => {
          share ? this.share(res.nativeURL) : this.toast.showMessage(this.texts["MESSAGES.SUCCESSFULLY DOWNLOADED"]);
        },
        (err) => {
          console.log(err);
          this.toast.showMessage(this.texts["MESSAGES.ERROR_WHILE_DOWNLOADING"], "danger");
          this.requestPermission();
        }
      )
      .finally(() => {
        this.interface == "simple" ? this.popoverController.dismiss() : null; // close the overlay for Simple UI
        this.loader.stopLoader();
      });
  }

  requestPermission() {
    if (this.platform.is("android")) {
      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      ]);
    }
  }

  share(path) {
    this.socialSharing.share(null, null, path, null);
  }

  directoryPath(): string {
    let dir_name = "Download/";
    if (this.platform.is("ios")) {
      return this.file.documentsDirectory + dir_name;
    } else {
      return this.file.externalRootDirectory + dir_name;
    }
  }
}
