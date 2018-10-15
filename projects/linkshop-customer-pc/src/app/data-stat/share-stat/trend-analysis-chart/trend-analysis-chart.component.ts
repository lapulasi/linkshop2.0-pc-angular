import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {WebHttpClient} from "../../../web.httpclient";
import EChartOption = echarts.EChartOption;
import {map} from "rxjs/internal/operators";

@Component({
  selector: 'app-trend-analysis-chart',
  templateUrl: './trend-analysis-chart.component.html'
})
export class TrendAnalysisChartComponent implements OnInit, OnChanges, OnDestroy{

  @Input() cond: any;
  @Input() page: any;
  dateType = {curr: 'day', list: [{val: 'day', name: '按日'}, {val: 'week', name: '按周'}, {val: 'month', name: '按月'}]};

  trendAnalysisChartOption: EChartOption;
  echart: any;

  constructor(private http: WebHttpClient) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.cond && this.cond.org) {
      this.loadData();
    }

  }

  ngOnDestroy() {
    this.echart.off('legendselectchanged');
  }

  onChartInit(event: any, type: string) {
    this.echart = event;

    this.echart.on('legendselectchanged', params => {
      const legends = params.selected;
      const len = Object.values(legends).filter(val => val === true).length;
      let series = null;
      const option = this.echart.getOption();
      if (len === 1) { // show one line
        series = this.updateOneSeriesLabel(legends);
      } else {
        series = this.updateAllSeriesLabel();
      }
      option.series = series;
      // this.echart.clear();
      this.echart.setOption(option);

    });

  }

  updateOneSeriesLabel(legends: any) {
    const name = Object.keys(legends).filter(val => legends[val] === true)[0];
    const series = this.echart.getOption().series;
    for (let i = 0; i < series.length; i++) {
      if (series[i].name === name) {
        series[i].showSymbol = true;
        series[i].label = {
          normal: {
            show: true,
            formatter: function(params) {
              if (params.seriesName === '设备正常率' || params.seriesName === '转化率') {
                return params.value + '%';
              }
              return params.value;
            },
            position: 'top',
            color: 'auto'
          }
        };
      }
    }
    return series;
  }

  updateAllSeriesLabel() {
    const series = this.echart.getOption().series;
    for (let i = 0; i < series.length; i++) {
      series[i].showSymbol = false;
      series[i].label = {
        normal: {
          show: false
        }
      };
    }
    return series;
  }

  changeDateType(val: any) {
    this.dateType.curr = val;
    this.loadData();
  }

  loadData() {
    let urlPre = `/org/dayStat`;
    if (this.dateType.curr === 'week') {
      urlPre = `/org/weekStat`;
    } else if (this.dateType.curr === 'month') {
      urlPre = `/org/monthStat`;
    }

    this.http.get(`${urlPre}/${this.cond.org.code}`, {startDate: this.cond.date.start, endDate: this.cond.date.end})
      .pipe(
        map(result => {
          const dateArr = result.map(rs => rs._id.substring(4, rs._id.length));
          if (this.page === 'guest') {
            this.guestChart(dateArr, result);
          } else if (this.page === 'sales') {
            this.salesChart(dateArr, result);
          } else if (this.page === 'device') {
            this.deviceChart(dateArr, result);
          }
          return result;
        })
      ).subscribe(data => {
      // console.log(data);
    });
  }


  guestChart(dateArr: any, result: any) {
    const countArr = result.map(rs => rs.guestCount);
    const stayArr = result.map(rs => rs.guestCount === 0 ? 0 : (rs.guestStayMins / rs.guestCount).toFixed(0));
    const jkArr = result.map(rs => rs.shopArea === 0 ? 0 : (rs.guestCount / rs.shopArea + 0.01).toFixed(0));
    const pxArr = result.map(rs => rs.shopArea === 0 ? 0 : (rs.salesAmount / rs.shopArea).toFixed(0));

    const yAxis = [this.yAxisItem(), this.yAxisItem(), this.yAxisItem(), this.yAxisLast()];
    const series = [this.seriesItem('客流', countArr, 0, '#A14BEC'),
      this.seriesItem('驻留', stayArr, 1, '#FCC50A'),
      this.seriesItem('集客力', jkArr, 2, '#6F92EA'),
      this.seriesItem('坪效', pxArr, 3, '#EA6270')];

    const legendData = ['客流', '驻留', '集客力', '坪效'];
    this.trendAnalysisChartOption = this.trendAnalysisChartStyle(legendData, dateArr, yAxis, series);
  }

  salesChart(dateArr: any, result: any) {
    const volumArr = result.map(rs => rs.salesVolume);
    const amountArr = result.map(rs => rs.salesAmount);
    const kjjArr = result.map(rs => rs.guestCount === 0 ? 0 : (rs.salesAmount / rs.guestCount).toFixed(0));
    const zhlArr = result.map(rs => rs.guestCount === 0 ? 0 : (rs.salesVolume * 100 / rs.guestCount).toFixed(0));

    const yAxis = [this.yAxisItem(), this.yAxisItem(), this.yAxisItem(), this.yAxisLast()];
    const series = [this.seriesItem('销量', volumArr, 0, '#A14BEC'),
      this.seriesItem('销额', amountArr, 1, '#FCC50A'),
      this.seriesItem('客均价', kjjArr, 2, '#6F92EA'),
      this.seriesItem('转化率', zhlArr, 3, '#EA6270')];

    const legendData = ['销量', '销额', '客均价', '转化率'];
    this.trendAnalysisChartOption = this.trendAnalysisChartStyle(legendData, dateArr, yAxis, series);
  }

  deviceChart(dateArr: any, result: any) {
    const yxlArr = result.map(rs => (rs.normalNum + rs.abnormalNum) === 0 ? 0 : (rs.normalNum * 100 / (rs.normalNum + rs.abnormalNum)).toFixed(0));

    const yAxis = [this.yAxisLast()];
    const series = [this.seriesItemShowSymbol('设备正常率', yxlArr, 0, '#A14BEC')];
    const legendData = ['设备正常率'];

    this.trendAnalysisChartOption = this.trendAnalysisChartStyle(legendData, dateArr, yAxis, series);
  }

  seriesItem(name: any, data: any, yAxisIndex: any, color: any) {
    return {
      name: name,
      type: 'line',
      smooth: true,
      data: data,
      showSymbol: false,
      yAxisIndex: yAxisIndex,
      lineStyle: {
        width: 3,
        color: color
      },
    };
  }

  seriesItemShowSymbol(name: any, data: any, yAxisIndex: any, color: any) {
    return {
      name: name,
      showSymbol: true,
      type: 'line',
      smooth: true,
      data: data,
      label: {
        normal: {
          show: true,
          formatter: function(params) {
            if (params.seriesName === '设备正常率') {
              return params.value + '%';
            }
            return params.value;
          },
          position: 'top',
          color: 'auto'
        }
      },
      yAxisIndex: yAxisIndex,
      lineStyle: {
        width: 3,
        color: color
      },
    };
  }

  yAxisItem() {
    return {
      show: false,
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
    };
  }

  yAxisLast() {
    return {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#EAEDF2'
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: '#2C293B'
        }
      }
    };
  }

  trendAnalysisChartStyle(legendData: any, dates: any, yAxis: any, series: any) {
    return {
      title: {},
      tooltip: {
        /*鼠标点击效果*/
        show: true,
        trigger: 'axis',
        showContent: true/*去掉浮层框*/,
        formatter: function(params: any) {
          let content = '';
          for (let i = 0; i < params.length; i++) {
            if (params[i].seriesName === '设备正常率' || params[i].seriesName === '转化率') {
              content += params[i].seriesName + ':' + params[i].value + '%' + '<br/>';
            } else {
              content += params[i].seriesName + ':' + params[i].value + '<br/>';
            }
          }
          return content;
        }
      },
      color: ['#A14BEC', '#FCC50A', '#6F92EA', '#EA6270'],
      legend: {
        top: 0,
        data: legendData
      },
      grid: {
        left: '3%',
        top: '10%',
        right: '0%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#9FA4AC'
        },
        data: dates
      },
      yAxis: yAxis,
      series: series
    };
  }

}
