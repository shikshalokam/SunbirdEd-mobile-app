import { Component, OnInit, Input } from '@angular/core';
import {
  urlConstants, NetworkService, LoaderService,
  ToastMessageService, KendraApiService
} from '../../../core';
import { Storage } from '@ionic/storage';
import * as _ from 'underscore';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.scss'],
})
export class AddEntityComponent implements OnInit {
  // @Input() url;
  subEntities;
  noSubEntity: boolean = false;
  entities = [];
  page = 1;
  limit = 25;
  childEntity;
  searchText = '';
  profileData;
  stateId;
  selectedEntity;
  title;
  entityCount;
  constructor(
    private networkService: NetworkService,
    private loader: LoaderService,
    private toast: ToastMessageService,
    private storage: Storage,
    private kendraApiService: KendraApiService,
    private modalCtrl: ModalController,
  ) {
    this.onSearch = _.debounce(this.onSearch, 500)
  }

  ngOnInit() {
    this.checkUserMapping();
  }

  selectEntity(event) {
    this.selectedEntity = event;
  }
  selectSubEntity(subEntity) {
    this.childEntity = subEntity.detail.value;
    this.entities = [];
    this.page = 1;
    this.getEntities(subEntity.detail.value);
  }
  getEntities(entityType) {
    if (this.networkService.isNetworkAvailable) {
      this.loader.startLoader();
      const config = {
        url: urlConstants.API_URLS.GET_ENTITY_LIST + this.stateId + '?type=' + entityType + '&search=' + this.searchText + '&page=' + this.page + '&limit=' + this.limit
      }
      this.kendraApiService.get(config).subscribe(data => {
        if (data.result.data && data.result.data.length) {
          this.entities = this.entities.concat(data.result.data);
          this.entityCount = data.result.count;
          this.noSubEntity = false;

        } else {
          this.noSubEntity = true;
        }

        this.loader.stopLoader();
      }, error => {
        this.loader.stopLoader();
      })
    } else {
      this.toast.showMessage('MESSAGES.YOU_ARE_WORKING_OFFLINE_TRY_AGAIN', 'danger');
    }
  }
  checkUserMapping() {
    this.storage.get('profileData').then(data => {
      this.profileData = data;
      this.stateId = this.profileData.state._id;
      this.title = this.profileData.state.name;
      this.getSubEntities(this.profileData.state._id);
    })
  }

  loadMoreEntities() {
    this.page++;
    this.getEntities(this.childEntity);
  }
  getSubEntities(stateId) {
    if (this.networkService.isNetworkAvailable) {
      this.loader.startLoader();
      const config = {
        url: urlConstants.API_URLS.GET_SUBENTITIES + stateId
      }
      this.kendraApiService.get(config).subscribe(data => {
        this.loader.stopLoader();
        if (data.result) {
          let selist = []
          data.result.forEach(se => {
            let entity = {
              name: se,
              value: se,
            }
            selist.push(entity);
          });
          this.subEntities = selist.reverse();
          this.selectedEntity = this.subEntities[0];
          this.childEntity = this.subEntities[0].value;
          this.getEntities(this.subEntities[0].value)
        }
      }, error => {
        this.loader.stopLoader();
      })
    } else {
      this.toast.showMessage('MESSAGES.YOU_ARE_WORKING_OFFLINE_TRY_AGAIN', 'danger');
    }
  }

  onSearch(event) {
    this.entities = [];
    this.page = 1;
    this.searchText = event.detail ? event.detail.data : '';
    if (event.detail && event.detail.data == null) {
      this.searchText = '';
    }
    this.getEntities(this.childEntity);
  }
  close() {
    this.modalCtrl.dismiss();
  }
  addEntity() {
    if (this.selectedEntity) {
      this.modalCtrl.dismiss(this.selectedEntity);
    }
  }
}
