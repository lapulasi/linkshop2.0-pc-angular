import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {DashboardService} from "./dashboard.service";
import {Router} from "@angular/router";

declare var $: any;


@Component({
  templateUrl: 'dashboard.component.html',
  styles: ['.marginTop{margin-top: 40px}']
})
export class DashboardComponent implements OnInit {
  targetModel: String = '1';
  dimensionModel: String = '1';
  timeGranularity: String = '1';
  orgGranularity: String = '0';

  orgName: any;
  companyId: any;

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  isTarget: Boolean = true; // 指标
  target: any; // 指标
  dimension: any; // 维度
  isTime: Boolean = true; // 时间粒度
  dateType: String = 'day';
  isShowTime: Boolean = true; // 显示时间粒度
  isOrg: Boolean = false; // 组织粒度

  isLine: Boolean = false;
  isBar: Boolean = false;
  isPie: Boolean = false;
  chartStyle: String = '1';
  isCheck: Boolean = false;

  orgCode: any;
  dateAxis: Array<any> = [];
  levelData: any;
  levelId: any;

  startDate: any;
  endDate: any;

  guestCount: Array<any> = [];
  averageDwellTime: Array<any> = [];
  collectPower: Array<any> = [];
  gender: Array<any> = [];
  age: Array<any> = [];

  lineChartData: Array<any> = [];
  lineChartLabels: Array<any> = this.dateAxis;
  lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  lineChartLegend = false;
  lineChartType = 'line';

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = this.dateAxis;
  public barChartType = 'bar';
  public barChartLegend = false;

  public barChartData: any[] = [];

  // Pie
  public pieChartLabels: string[] = this.dateAxis;
  public pieChartData: number[] = [];
  public pieChartType = 'pie';


  constructor(private service: DashboardService, private datePipe: DatePipe,
              private router: Router) {
    this.bsValue.setDate(this.bsValue.getDate() - 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit(): void {
    $('.dropdown-toggle').dropdown();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.companyId = JSON.parse(currentUser).companyId;
    } else {
      this.router.navigate(['/login']);
    }
  }

  getOrgInfo(event, staticModal) {
    // console.log('event===' + JSON.stringify(event, null, 4));
    staticModal.hide();
    this.orgName = event.name;
    this.orgCode = event.orgCode;

    this.getOrgLevel();
  }

  getOrgLevel() {
    if (this.orgCode === undefined || this.orgCode === null) {
      alert('请选择组织');
    } else {
      this.service.getOrgLevel({
        orgCode: this.orgCode
      }).subscribe(data => {
        // console.log(data);
        this.levelData = data;
        this.levelId = this.levelData[0].id;
        this.isOrg = true;
      });
    }
  }

  onOrgGranuChange(event) {
    this.levelId = this.levelData[event].id;
  }

  selectOrg(staticModal) {
    this.companyId = localStorage.getItem('select_companyId');  // 测试阶段用
    staticModal.show();
    // this.companyId = '109';
  }

  onTargetChange(event) {
    console.log(event);
    console.log(this.targetModel);
    this.target = event;
    if (this.target === '1' || this.target === '2' || this.target === '3') {
      this.isTarget = true;
      this.dimensionModel = '1';
    } else {
      this.isTarget = false;
      this.isTime = false;
      this.isOrg = false;
    }
  }

  onDimensionChange(event) {
    console.log(event);
    this.dimension = event;
    if ((this.target === '1' || this.target === '2' || this.target === '3') || this.targetModel === '1') {
      if (event === '1') {
        this.isTime = true;
        this.isOrg = false;
        this.isShowTime = true;
      } else if (event === '2') {
        // console.log(this.levelData)
        if (this.levelData) {
          this.isOrg = true;
        }
        this.isTime = false;
        this.isShowTime = false;
      }
    }
  }

  onChartChange(event) {
    this.chartStyle = event;
    if (this.isCheck) {
      this.showChart();
    }
  }

  getChartStyle() {
    if (this.chartStyle === '1') {
      this.isLine = true;
      this.isBar = false;
      this.isPie = false;
    } else if (this.chartStyle === '2') {
      this.isLine = false;
      this.isBar = true;
      this.isPie = false;
    } else if (this.chartStyle === '3') {
      this.isLine = false;
      this.isBar = false;
      this.isPie = true;
    }
  }

  onTimeChange(event) {
    // console.log(event);
    const timeType = ['day', 'week', 'month'];
    this.dateType = timeType[parseInt(event) - 1];
  }

  checkData() {
    if (this.orgCode === undefined || this.orgCode === null) {
      alert('请选择组织');
    } else {
      this.isCheck = true;
      this.getTime();
      if (this.target === '1' || this.target === '2' || this.target === '3' || this.targetModel === '1') {
        if (this.dimension === '1' || this.dimensionModel === '1') {
          this.checkDate();
        } else if (this.dimension === '2') {
          this.checkLevel();
        }
      } else if (this.target === '4') {
        this.checkGender();
      } else if (this.target === '5') {
        this.checkAge();
      }
    }
  }

  getTime() {
    const startDateStr = this.datePipe.transform(this.bsRangeValue[0], 'yyyy-MM-dd');
    const endDateStr = this.datePipe.transform(this.bsRangeValue[1], 'yyyy-MM-dd');
    this.startDate = startDateStr;
    this.endDate = endDateStr;
  }

  checkDate() {
    if (this.dateType === undefined || this.dateType === null) {
      alert('请选择时间粒度');
    } else {
      this.service.getDataByDate({
        orgCode: this.orgCode,
        startDate: this.startDate,
        endDate: this.endDate,
        dateType: this.dateType
      }).subscribe(data => {
        // console.log(data);
        this.initData(data);
      });
    }

  }

  checkLevel() {
    if (this.levelId === undefined || this.levelId === null) {
      alert('请选择组织粒度');
    } else {
      this.service.getDataByLevel({
        orgCode: this.orgCode,
        startDate: this.startDate,
        endDate: this.endDate,
        levelId: this.levelId
      }).subscribe(data => {
        // console.log(data);
        this.initData(data);
      });
    }
  }

  checkGender() {
    this.service.getDataByGender({
      orgCode: this.orgCode,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe(data => {
      // console.log(data);
      this.initData(data);
    });
  }

  checkAge() {
    this.service.getDataByAge({
      orgCode: this.orgCode,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe(data => {
      // console.log(data);
      this.initData(data);
    });
  }

  initData(data) {
    this.clearData();
    for (let i = 0, len = data.length; i < len; i++) {
      if (this.target === '1' || this.target === '2' || this.target === '3') {
        if (this.dimension === '1') {
          this.dateAxis.push(this.formatTime(data[i]._id));
        } else if (this.dimension === '2') {
          this.dateAxis.push(data[i].name);
        }
        this.guestCount.push(data[i].guestCount);
        const tempDwellTime = data[i].guestCount === 0 ? 0 : (data[i].stayMins / data[i].guestCount);
        this.averageDwellTime.push(tempDwellTime);
        const tempCollectPower = data[i].orgArea === 0 ? 0 : (data[i].guestCount / data[i].orgArea);
        this.collectPower.push(tempCollectPower);
      } else if (this.target === '4') {
        this.dateAxis.push(data[i]._id);
        this.gender.push(data[i].count);
      } else if (this.target === '5') {
        this.dateAxis.push(data[i]._id);
        this.age.push(data[i].count);
      }
    }
    this.showChart();
  }

  clearData() {
    this.dateAxis.length = 0;
    this.guestCount = [];
    this.averageDwellTime = [];
    this.collectPower = [];
    this.gender = [];
    this.age = [];
  }

  showChart() {
    this.getChartStyle();
    this.lineChartLabels = this.barChartLabels = this.pieChartLabels = this.dateAxis;
    if (this.chartStyle === '1') {// 折线图
      if (this.target === '1') {// 客流
        this.lineChartData = this.guestCount;
      } else if (this.target === '2') {// 平均驻留时间
        this.lineChartData = this.averageDwellTime;
      } else if (this.target === '3') {
        this.lineChartData = this.collectPower;
      } else if (this.target === '4') {// 性别
        this.lineChartData = this.gender;
      } else if (this.target === '5') {// 年龄
        this.lineChartData = this.age;
      }
    } else if (this.chartStyle === '2') {// 柱状图
      if (this.target === '1') {
        this.barChartData = this.guestCount;
      } else if (this.target === '2') {// 平均驻留时间
        this.barChartData = this.averageDwellTime;
      } else if (this.target === '3') {
        this.barChartData = this.collectPower;
      } else if (this.target === '4') {// 性别
        this.barChartData = this.gender;
      } else if (this.target === '5') {// 年龄
        this.barChartData = this.age;
      }
    } else if (this.chartStyle === '3') {// 饼状图
      if (this.target === '1') {
        this.pieChartData = this.guestCount;
      } else if (this.target === '2') {// 平均驻留时间
        this.pieChartData = this.averageDwellTime;
      } else if (this.target === '3') {
        this.pieChartData = this.collectPower;
      } else if (this.target === '4') {// 性别
        this.pieChartData = this.gender;
      } else if (this.target === '5') {// 年龄
        this.pieChartData = this.age;
      }
    }
  }

  formatTime(time) {
    return time.toString().substr(4);
  }
}
