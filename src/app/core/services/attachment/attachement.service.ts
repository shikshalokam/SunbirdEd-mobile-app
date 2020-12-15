import { Injectable } from "@angular/core";
import { Camera, CameraOptions, PictureSourceType } from "@ionic-native/camera/ngx";
import { Chooser } from "@ionic-native/chooser/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import { IOSFilePicker } from "@ionic-native/file-picker/ngx";
import { File } from "@ionic-native/file/ngx";
import { ActionSheetController, Platform, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { FILE_EXTENSION_HEADERS } from "../../constants/mimeTypes";

@Injectable({
  providedIn: "root",
})
export class AttachementService {
  mediaType: string;
  texts: any;
  constructor(
    private camera: Camera,
    private file: File,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private platform: Platform,
    private filePath: FilePath,
    private chooser: Chooser,
    private filePickerIOS: IOSFilePicker,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        "LABELS.SELECT_IMAGE_SOURCE",
        "LABELS.LOAD_FROM_LIBRARY",
        "LABELS.USE_CAMERA",
        "LABELS.USE_FILE",
        "LABELS.CANCEL",
        "MESSAGES.ERROR_WHILE_STORING_FILE",
      ])
      .subscribe((data) => {
        this.texts = data;
      });
  }

  ngOnInit() {}

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: this.texts["LABELS.SELECT_IMAGE_SOURCE"],
      buttons: [
        {
          text: this.texts["LABELS.LOAD_FROM_LIBRARY"],
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            return false;
          },
        },
        {
          text: this.texts["LABELS.USE_CAMERA"],
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
            return false;
          },
        },
        {
          text: this.texts["LABELS.USE_FILE"],
          handler: () => {
            this.openFile();
            return false;
          },
        },
        {
          text: this.texts["LABELS.CANCEL"],
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
    return actionSheet.onDidDismiss();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 10,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then((imagePath) => {
      if (this.platform.is("android") && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath
          .resolveNativePath(imagePath)
          .then((filePath) => {
            this.copyFile(filePath);
          })
          .catch((err) => {});
      } else {
       this.copyFile(imagePath);
      }
    });
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.directoryPath(), newFileName).then(
      (success) => {
        const data = {
          name: newFileName,
          type: this.mimeType(newFileName),
          isUploaded: false,
          url: "",
        };

        this.actionSheetController.dismiss(data);
      },
      (error) => {
        this.presentToast(this.texts["MESSAGE.ERROR_WHILE_STORING_FILE"]);
      }
    );
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: "bottom",
      duration: 3000,
    });
    toast.present();
  }

  async openFile() {
    new Promise((resolve) => {
      if (this.platform.is("ios")) {
        resolve(this.filePickerIOS.pickFile());
      } else {
        resolve(this.chooser.getFileMetadata());
      }
    })
      .then((res: any) => {
      
        return this.filePath.resolveNativePath(res.uri);
      })
      .then((filePath) => {
       this.copyFile(filePath)
      })

      .catch((err) => {});
  }

  copyFile(filePath) {
    let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
    let currentName = filePath.split("/").pop();
    currentName = currentName.split("?")[0];
    this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName));
  }

  createFileName(name) {
    let d = new Date(),
      n = d.getTime(),
      extentsion = name.split(".").pop(),
      newFileName = n + "." + extentsion;
    return newFileName;
  }

  directoryPath(): string {
    if (this.platform.is("ios")) {
      return this.file.documentsDirectory;
    } else {
      return this.file.externalDataDirectory;
    }
  }

  mimeType(fileName) {
    let ext = fileName.split(".").pop();
    return FILE_EXTENSION_HEADERS[ext];

  }

  deleteFile(fileName) {
    return this.file.removeFile(this.directoryPath(), fileName);
  }
}
