import {Injectable} from "@angular/core";

@Injectable()
export class ChartStat {

  // ['#6F92EA', '#3BCBCA'] ['#6F92EA', '#A8C4F6']
  lineSeriesItem(data: any, index: any, colors: any, position: any) {
    return {
      type: 'line',
      smooth: true,
      label: {
        show: true,
        position: position,
        color: 'auto' /* 设置为auto 否则label字体有问题 */
      },
      data: data,
      showSymbol: true, /* 必须为true  不然label出不来 */
      yAxisIndex: index,
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: colors[0]
          }, {
            offset: 1, color: colors[1]
          }],
        }
      },
    };
  }

  barSeriesItem(data: any, index: any) {
    return {
      type: 'bar',
      yAxisIndex: index,
      label: {
        show: true,
        formatter: '{c}',
        position: 'top',
        color: 'auto' /* 设置为auto 否则label字体有问题 */
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#6F92EA'
          }, {
            offset: 1, color: '#A8C4F6'
          }],
          globalCoord: false
        }
      },
      data: data
    };
  }

  lineChartStyle(xAxisData: any, series: any) {
    const YAxis = [];
    for (const item of series) {
      YAxis.push({show: false});
    }

    return {
      title: {},
      tooltip: {
        show: false,
        trigger: 'axis'
      },
      legend: {},
      grid: {
        left: '0%',
        top: '10%',
        right: '8%',
        bottom: '10%',
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
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EAEDF2'
          }
        },
        data: xAxisData
      },
      yAxis: YAxis,
      series: series
    };
  }

  pieChartStyle(legendData: any, seriesData: any) {
    return {
      title: {},
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      color: ['#5599FF', '#3BCBCA', '#FCC50A', '#FF7474', '#A14BEC', '#605C72'],
      legend: {
        orient: 'vertical',
        x: 'right',
        y: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#A4A9B3'
        },
        data: legendData
      },
      series: [{
//            name: '销量',
        type: 'pie',
        avoidLabelOverlap: false,
        center: ['40%', '50%'],
        radius: ['30%', '65%'],
        label: {
          normal: {
            show: true,
            position: 'outside',
            formatter: '{d}%'
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: true,
            length: 8,
            length2: 5
          }
        },
        data: seriesData
      }]
    };
  }

  barChartStyle(xAxisData: any, seriesData: any) {
    return {
      title: {},
      tooltip: {
        show: false,
        trigger: 'axis'
      },
      legend: {},
      grid: {
        left: '5%',
        top: '10%',
        right: '5%',
        bottom: '5%',
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
          color: '#9FA4AC',
        },
        data: xAxisData
      },
      yAxis: {
        position: 'right',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: '#9FA4AC',
          formatter: '{value}%'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#EAEDF2'
          }
        },
      },
      series: [
        {
          type: 'bar',
          label: {
            show: true,
            formatter: '{c}%',
            position: 'top',
            color: 'auto' /* 设置为auto 否则label字体有问题 */
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#6F92EA'
              }, {
                offset: 1, color: '#A8C4F6'
              }],
              globalCoord: false
            }
          },
          data: this.formatPercent(seriesData)
        }]
    };
  }

  formatPercent(data) {
    const newData = [];
    for (const item of data) {
      const tempItem = item.toFixed(1);
      newData.push(tempItem);
    }
    return newData;
  }



}
