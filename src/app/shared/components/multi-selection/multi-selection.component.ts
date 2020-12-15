import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as _ from 'underscore';
import {  LoaderService,   , urlConstants } from '../../../core';
import { OpenResourcesService } from '../../services';
@Component({
  selector: 'app-multi-selection',
  templateUrl: './multi-selection.component.html',
  styleUrls: ['./multi-selection.component.scss'],
})
export class MultiSelectionComponent implements OnInit {
  @Input() url;
  @Input() selectedResources;
  filters;
  button = "LABELS.ATTACH"
  dataList = [];
  dataCount;
  selectedFilter;
  page = 1;
  limit = 25;
  title = "LABELS.LEARNING_RESOURCES";
  constructor(
    private modalCtrl: ModalController,
    private networkService: NetworkService,
    private loaderService: LoaderService,
    private toastMessageService: ToastMessageService,
    private openResources: OpenResourcesService
  ) {
    this.search = _.debounce(this.search, 500)
  }

  ngOnInit() {
    if (this.url) {
      this.getFilters();
    }
  }
  setFilter(filter) {
    this.filters.forEach(element => {
      element.name == filter.name ? element.isActive = true : element.isActive = false;
      if (element.isActive) {
        this.selectedFilter = element;
        this.dataList = [];
        this.getLearningResources();
      }
    });

  }
  search(event) {
    this.dataList = [];
    this.getLearningResources(event.detail ? event.detail.data : '')
  }
  getFilters() {
    if (this.networkService.isNetworkAvailable) {
      // this.loaderService.startLoader();
      // const config = {
      //   url: urlConstants.API_URLS.GET_LEARNING_RESOURCES_FILTERS
      // }
      // this.kendraApiService.get(config).subscribe(data => {
      //   this.loaderService.stopLoader();
      //   if (data.result && data.result.length) {
      //     this.filters = data.result;
      //     this.setFilter(this.filters[0]);
      //     // this.selectedResources ? this.validateCheckbox(data.result.content) : this.dataList = this.dataList.concat(data.result.content);
      //   }
      // }, error => {
      //   this.loaderService.stopLoader();
      // })
    } else {
      this.toastMessageService.showMessage('MESSAGES.YOU_ARE_WORKING_OFFLINE_TRY_AGAIN', 'danger');
    }
  }
  getLearningResources(searchText?) {
    if (this.networkService.isNetworkAvailable) {
      // searchText = searchText ? searchText : '';
      // this.loaderService.startLoader();
      // let type = {
      //   mimeType: this.selectedFilter.value
      // }
      // const config = {
      //   url: this.url + '&search=' + searchText + '&page=' + this.page + "&limit=" + this.limit,
      //   payload: type
      // }
      // this.kendraApiService.post(config).subscribe(data => {
      //   this.loaderService.stopLoader();
      //   if (data.result && data.result.count) {
      //     this.dataCount = data.result.count;
      //     this.selectedResources ? this.validateCheckbox(data.result.content) : this.dataList = this.dataList.concat(data.result.content);
      //   }
      // }, error => {
      //   this.loaderService.stopLoader();
      // })
    } else {
      this.toastMessageService.showMessage('MESSAGES.YOU_ARE_WORKING_OFFLINE_TRY_AGAIN', 'danger');
    }
  }
  validateCheckbox(data) {
    this.selectedResources.forEach(selectedResource => {
      data.forEach(resource => {
        if (selectedResource.name == resource.name) {
          resource.isChecked = true;
        }
      });
    });
    this.dataList = this.dataList.concat(data);
  }
  loadMoreData() {
    this.page++;
    this.getLearningResources(this.selectedResources);
  }
  selectData(item) {
    item.isChecked = !item.isChecked;
  }
  addResources() {
    let selected = [];
    this.dataList.forEach(list => {
      if (list.isChecked) {
        selected.push(list);
      }
    })
    if (selected) {
      this.close(selected);
    }
  }

  close(data?) {
    this.modalCtrl.dismiss(data);
  }
  openBodh(link) {
    this.networkService.isNetworkAvailable ? this.openResources.openBodh(link) : this.toastMessageService.showMessage('MESSAGES.OFFLINE', 'danger');
  }
}