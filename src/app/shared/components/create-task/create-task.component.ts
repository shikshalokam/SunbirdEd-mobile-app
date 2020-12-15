import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService, AttachementService, ToastMessageService } from '../../../core';
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  newTask;
  currentYear = new Date().getFullYear();
  today
  constructor(
    private modalCtrl: ModalController,
    private utils: UtilsService,
    private attachmentService: AttachementService,
    private toast: ToastMessageService
  ) { }

  ngOnInit() {
    this.prepareTaskMeta();
  }
  prepareTaskMeta() {
    this.newTask = JSON.parse(JSON.stringify(this.utils.getMetaData('task')));
  }
  close() {
    this.modalCtrl.dismiss();
  }
  openAction() {
    this.attachmentService.selectImage().then(data => {
      !this.newTask.attachments ? this.newTask.attachments = [] : '';
      data.data ? this.newTask.attachments.push(data.data) : ''
    })
  }

  addTask() {
    this.newTask.name ? this.modalCtrl.dismiss(this.newTask) : this.toast.showMessage('MESSAGES.REQUIRED_FIELDS', 'danger')
  }

  share() {
    this.toast.showMessage('MESSAGES.COMING_SOON', 'danger');
  }
}