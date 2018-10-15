import {Component, OnChanges, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {Organization} from '../../../../../shared/organization';
import {DateTimeFormatter, Instant, LocalDate} from 'js-joda';
import {HttpClient} from '@angular/common/http';
import {Shop} from '../../../../../shared/heat-map-view/shop';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-customer-pc-heat-map-view',
  templateUrl: './customer-pc-heat-map-view.component.html',
  styleUrls: ['./customer-pc-heat-map-view.component.css']
})
export class CustomerPcHeatMapViewComponent implements OnInit, OnChanges {

  selectedOrganization: Organization = null;

  shopList: Array<Shop> = [];

  bsRangeValue: Date[] = [new Date(), new Date()];

  dateStringRange: Array<string> = [LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE),
    LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)];

  currentPage;

  itemsPerPage = 6;

  popUpShop: Shop ;

  popUpBsRangeValue: Date[] = [];

  popUpDateStringRange = [];

  modalRef: BsModalRef;

  companyId;

  orgName;

  orgCode;

  config = {
    keyboard: true,
    class: 'gray modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };


  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: BsModalService) { }

  ngOnInit() {

    this.route.parent.parent.data.subscribe(data => this.orgCode = data.org.orgCode);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getOrgInfo(event: Organization, staticModal) {
    staticModal.hide();
    this.selectedOrganization = event;
    this.http.get('/org/shops', {params: {orgCode: `${this.selectedOrganization.orgCode}`}})
      .subscribe((data: Array<any>) => {
        this.shopList = data.map(value => value['orgObj']);
      });

  }
  selectOrg(staticModal) {
    this.companyId = localStorage.getItem('select_companyId');  // 测试阶段用
    staticModal.show();
  }

  viewSingleHeatMap(shop: Shop, template: TemplateRef<any>): void {
    // this.router.navigate([`${shop.id}`], {relativeTo: this.route});
    this.popUpShop = shop;
    this.modalRef = this.modalService.show(template, this.config);
    this.popUpBsRangeValue = this.bsRangeValue;
  }

  toDateStringRange(dateRange: Array<Date>): Array<string> {
    return dateRange.map(
      date => LocalDate.ofInstant(Instant.ofEpochMilli(date.getTime()))
        .format(DateTimeFormatter.ISO_LOCAL_DATE));
  }

  onStartDateChange($event: Date): void {
    if ($event) {
      this.bsRangeValue[0] = $event;
      this.dateStringRange = this.bsRangeValue.map(
        date => LocalDate.ofInstant(Instant.ofEpochMilli(date.getTime()))
          .format(DateTimeFormatter.ISO_LOCAL_DATE));
    }
  }

  onEndDateChange($event: Date): void {
    if ($event) {
      this.bsRangeValue[1] = $event;
      this.dateStringRange = this.bsRangeValue.map(
        date => LocalDate.ofInstant(Instant.ofEpochMilli(date.getTime()))
          .format(DateTimeFormatter.ISO_LOCAL_DATE));
    }

  }

  onValueChange($event: Array<Date>): void {
    if ($event) {
      this.dateStringRange = $event.map(
        date => LocalDate.ofInstant(Instant.ofEpochMilli(date.getTime()))
          .format(DateTimeFormatter.ISO_LOCAL_DATE));
    }
  }


  onValueChange2($event: Array<Date>): void {
    if ($event) {
      this.popUpDateStringRange = $event.map(
        date => LocalDate.ofInstant(Instant.ofEpochMilli(date.getTime()))
          .format(DateTimeFormatter.ISO_LOCAL_DATE));
    }
  }

}
