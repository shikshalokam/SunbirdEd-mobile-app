import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { menuConstants, ToastMessageService, DbService, UtilsService } from 'src/app/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class CardsComponent implements OnInit {
  totalData: any;
  @Input() data;
  @Input() showpopover;
  @Output() onGetTemplate = new EventEmitter();
  constructor(
    private popoverController: PopoverController,
    private router: Router,
    private toast: ToastMessageService,
    private translate: TranslateService,
    private alert: AlertController,
    private db: DbService,
    private utils: UtilsService
  ) {
  }

  ngOnInit() {
  }




  public getData(id) {
    this.onGetTemplate.emit(id);
  }


  async openPopover(ev: any, project) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: { menus: menuConstants.PROJECT },
      event: ev,
      translucent: true,
    });
    popover.onDidDismiss().then((data) => {
      if (data.data) {
        this.action(data.data, project);
      }
    });
    return await popover.present();
  }

  action(event, project) {
    switch (event) {
      case "editProject": {
        this.router.navigate(['/menu/project-edit', project._id]);
        break;
      }
      case "deleteProject": {
        this.askPermissionToDelete(project);
        break;
      }
      case "shareProject": {
        this.toast.showMessage('MESSAGES.COMING_SOON', 'danger');
        break;
      }
    }
  }
  async askPermissionToDelete(project) {
    let data;
    this.translate.get(["MESSAGES.DELETE_CONFIRMATION", "LABELS.CANCEL", "LABELS.SUBMIT"]).subscribe((text) => {
      data = text;
    });
    const alert = await this.alert.create({
      message: data["MESSAGES.DELETE_CONFIRMATION"] + "Project ?",
      buttons: [
        {
          text: data["LABELS.CANCEL"],
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => { },
        },
        {
          text: data["LABELS.SUBMIT"],
          handler: () => {
            project.isDeleted = true;
          }
        }
      ]
    });
    await alert.present();
  }

  update(project) {
    project.isEdit = true;
    this.db.createPouchDB(environment.db.projects);
    project = this.utils.setStatusForProject(project);
    this.db.update(project).then(success => {
      project._rev = success.rev;
      this.toast.showMessage('MESSAGES.PROJECT_DELETED_SUCCESSFUL', 'success');
    }).catch(error => {
    })
  }
}
