import { Component, OnInit } from '@angular/core';
import {Device} from '../../../../../shared/device';
import {Organization} from '../../../../../shared/organization';
import {HttpClient} from '@angular/common/http';
import {Shop} from '../../../../../shared/heat-map-view/shop';
import {ShopDevice} from '../../../../../shared/shop-device';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-monitor-view',
  templateUrl: './monitor-view.component.html',
  styleUrls: ['./monitor-view.component.scss']
})
export class MonitorViewComponent implements OnInit {

  selectedOrganization: Organization;

  companyId;

  orgName;

  shopDeviceList: Array<ShopDevice> = [];

  currentPage = 1;

  itemsPerPage = 6;

  orgCode;

  config = {
    keyboard: true,
    class: 'gray modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(private http: HttpClient,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.parent.data.subscribe(data => this.orgCode = data.org.orgCode);
  }

  selectOrg(staticModal) {
    this.companyId = localStorage.getItem('select_companyId');  // 测试阶段用
    staticModal.show();
  }

  getOrgInfo(event: Organization, staticModal) {
    staticModal.hide();
    this.selectedOrganization = event;
    this.http.get('/device/list', {params: {shopId: `${3013}`, type: 'VIEW'}})
      .subscribe((shopDeviceList: Array<ShopDevice>) => {
         this.shopDeviceList = shopDeviceList;
      });

  }

}

