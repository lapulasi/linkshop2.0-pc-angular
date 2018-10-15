import {Injectable} from "@angular/core";
import {IndexViewModule} from "./index-view.module";
import { EChartOption } from 'echarts';
import {AdminHttpClient} from "../admin.httpclient";
import {map} from "rxjs/internal/operators";

@Injectable({providedIn: IndexViewModule})
export class ChartService {

  countChartOption: EChartOption; // 客流
  stayChartOption: EChartOption; // 平均驻留
  trendChartOption: EChartOption; // 日间趋势
  periodChartOption: EChartOption; // 客流时段
  ageChartOption: EChartOption; // 年龄段

  countStat = {count: 0, max: {date: '', count: 0}, min: {date: '', count: 0}};
  stayStat = {avgStay: 0, max: {date: '', avgStay: 0}, min: {date: '', avgStay: 0}};
  gender = {maleRate: 0, femaleRate: 0};

  constructor(private http: AdminHttpClient) {}

  // 客流、驻留数据
  countAndStay(dateType: any, orgCode: any, startDate: any, endDate: any) {
    let url = ``;
    if (dateType === 'week') {
      url = `/org/weekStat/${orgCode}`;
    } else if (dateType === 'month') {
      url = `/org/monthStat/${orgCode}`;
    } else {
      url = `/org/dayStat/${orgCode}`;
    }

    this.http.get(url, {startDate: startDate, endDate: endDate}).pipe(
      map(result => {
        const dates = result.map(val => val._id.substring(4, 8));
        const counts = result.map(val => val.guestCount);
        const stays = result.map(val => Math.round(val.guestStayMins / val.guestCount));

        this.countChartOption = this.drawBarChart(dates, counts, 'count');
        this.stayChartOption = this.drawBarChart(dates, stays, 'stay');
        // -----------------------
        const sumCount = result.reduce((prev, curr) => prev + curr['guestCount'], 0);
        const sumStay = result.reduce((prev, curr) => prev + curr['guestStayMins'], 0);

        const countSort = result.sort((a, b) => a['guestCount'] >= b['guestCount'] ? -1 : 1).filter(value => value['guestCount'] > 0);
        const staySort = result.map(value => {
          const avgStayMin = Math.round(value['guestStayMins'] / value['guestCount']);
          value['avgStayMin'] = avgStayMin || 0;
          return value;
        })
          .sort((a, b) => a['avgStayMin'] >= b['avgStayMin'] ? -1 : 1)
          .filter(value => value['avgStayMin'] > 0);

        this.countStat = {count: sumCount, max: {date: countSort[0]['_id'].substring(4, 8), count: countSort[0].guestCount},
        min: {date: countSort[countSort.length - 1]['_id'].substring(4, 8), count: countSort[countSort.length - 1].guestCount}};
        this.stayStat = {avgStay: Math.round(sumStay / sumCount), max: {date: staySort[0]['_id'].substring(4, 8), avgStay: staySort[0].avgStayMin},
        min: {date: staySort[staySort.length - 1]['_id'].substring(4, 8), avgStay: staySort[staySort.length - 1].avgStayMin}};

      return result;
      })
    ).subscribe(data => {
      // console.log(data);
    });
  }

  // 日间客流
  countByHour(orgCode: any, startDate: any, endDate: any) {
    this.http.get(`/org/${orgCode}/accessLogs/customerCountOfTimePeriod`,
      {startDate: startDate, endDate: endDate}).pipe(
        map(result => {
          const dates = result.map(val => val.hour);
          const counts = result.map(val => val.count);
          this.trendChartOption = this.drawLineChart(dates, counts, 'count');

          const countData = result.sort((a, b) => a['count'] >= b['count'] ? -1 : 1).filter(value => value['count'] > 0);

          const dates1 = countData.map(val => val.hour);
          const counts1 = countData.map(val => val.count);
          this.periodChartOption = this.drawLineChart(dates1, counts1, 'count');

          return result;
        })
    ).subscribe(data => {
        // console.log('countByHour', data);
    });
  }

  // 日间驻留
  stayByHour(orgCode: any, startDate: any, endDate: any) {
    this.http.get(`/org/${orgCode}/accessLogs/customerStayTime`,
      {startDate: startDate, endDate: endDate}).pipe(
        map(result => {
          const dates = result.map(val => val.hour);
          const avgStays = result.map(val => Math.round(val.stayMinSum / val.count));
          this.trendChartOption = this.drawLineChart(dates, avgStays, 'stay');

          const stayData = result.map(value => {
            const avgStayMin = Math.round(value['stayMinSum'] / value['count']);
            value['avgStayMin'] = avgStayMin || 0;
            return value;
            })
            .sort((a, b) => a['avgStayMin'] >= b['avgStayMin'] ? -1 : 1)
            .filter(value => value['avgStayMin'] > 0);

          const dates1 = stayData.map(val => val.hour);
          const avgStays1 = stayData.map(val => val.avgStayMin);
          this.periodChartOption = this.drawLineChart(dates1, avgStays1, 'stay');

          return result;
        })
    ).subscribe(data => {
      console.log('stayByHour', data);
    });
  }

  // 年龄段
  agePeriod(orgCode: any, startDate: any, endDate: any) {
    this.http.get(`/org/${orgCode}/accessLogs`,
      {startDate: startDate, endDate: endDate}).pipe(
        map(result => {
          const agePeriod = ['20-30', '30-40', '40-50', '50-60', '其他'];
          const fcounts = [];
          const mcounts = [];
          let sumCount = 0;
          let fcount = 0;
          let mcount = 0;
          const arr = [{min: 20, max: 30}, {min: 30, max: 40}, {min: 40, max: 50},
            {min: 50, max: 60}, {min: 60, max: 100}];
          arr.map(age => {
            const numF = result.filter(val => val.gender === 'F' && val.age >= age.min && val.age < age.max).map(val => val).length;
            const numM = result.filter(val => val.gender === 'M' && val.age >= age.min && val.age < age.max).map(val => val).length;
            fcounts.push(numF);
            mcounts.push(numM);
            sumCount = sumCount + numF + numM;
            fcount = fcount + numF;
            mcount = mcount + numM;
          });

          this.gender = {maleRate: mcount * 100 / sumCount, femaleRate: fcount * 100 / sumCount};
          this.ageChartOption = this.drawAgeBarEcharts(mcounts, fcounts, agePeriod, sumCount);
          return result;
        })
    ).subscribe(data => {
      // console.log('agePeriod', data);
    });
  }

  // 客流和驻留柱状图
  drawBarChart(xData, yData, type) {
    return {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '0%',
        top: '6%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            // rotate: 30,
            textStyle: {
              color: 'white'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: ['#0f234f']
            }
          },
          axisLabel: {
            formatter: function(para){
              if (type === 'stay') {
                return para + '分钟';
              }
              return para + '人';
            },
            textStyle: {
              color: '#91939a'
            }
          }
        }
      ],
      series: [
        {
          // name:name,
          type: 'bar',
          barWidth: '60%',
          data: yData,
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#42c1f2' // 0% 处的颜色
                }, {
                  offset: 1, color: '#428af2' // 100% 处的颜色
                }],
              }

            }
          },
        }
      ]
    }
  }

  // 日间趋势和客流时段线形图
  drawLineChart(xData, yData, type) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '2%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: 'white'
            }
          },
          data: xData
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: ['#0f234f']
            }
          },
          axisLabel: {
            formatter: function(para){
              if (type === 'stay') {
                return para + '分钟';
              }
              return para + '人';
            },
            textStyle: {
              color: '#91939a'
            }
          }
        }
      ],
      series: [
        {
          type: 'line',
          itemStyle: {
            normal: {
              color: '#42c2f2'
            }
          },
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(66,194,242,1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(50,130,190,0)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          data: yData
        }
      ]
    }
  }

  // 年龄段柱状图
  drawAgeBarEcharts(mCount, fCount, xData, sumCount) {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '0%',
        top: '20%',
        containLabel: true
      },
      legend: {
        textStyle: {
          color: '#fff',
        },
        selectedMode: false,// 取消图例点击
        data: ['女', '男']
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            rotate: 30,
            textStyle: {
              color: 'white'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          // min: 0,
          // max: 30,
          // interval: 10,
          splitLine: {
            lineStyle: {
              color: ['#0f234f']
            }
          },
          axisLabel: {
            formatter: function(value){
              return sumCount === 0 ? 0 : (value * 100 / sumCount).toFixed(0) + '%';
            },
            textStyle: {
              color: '#91939a'
            }
          }
        }
      ],
      series: [
        {
          name: '男',
          type: 'bar',
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#42c1f2' // 0% 处的颜色
                }, {
                  offset: 1, color: '#428af2' // 100% 处的颜色
                }],
              }

            }
          },
          data: mCount
        },
        {
          name: '女',
          type: 'bar',
          barGap: 0,
          itemStyle: {
            normal: {
              barBorderRadius: [5, 5, 0, 0],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#f33c53' // 0% 处的颜色
                }, {
                  offset: 1, color: '#a134e5' // 100% 处的颜色
                }],
              }

            }
          },
          data: fCount
        }

      ]
    }
  }

}
