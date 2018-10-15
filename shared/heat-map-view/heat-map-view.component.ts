import {Component, OnChanges, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Organization} from '../organization';
import {Shop} from './shop';
import {ActivatedRoute, Router} from '@angular/router';
import {DateTimeFormatter, Instant, LocalDate, LocalDateTime} from 'js-joda';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-heat-map-view',
  templateUrl: './heat-map-view.component.html',
  styleUrls: ['./heat-map-view.component.scss']
})
export class HeatMapViewComponent implements OnInit , OnChanges {

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
