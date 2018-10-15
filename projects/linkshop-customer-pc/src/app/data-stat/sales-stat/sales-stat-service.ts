import {Injectable} from "@angular/core";
import {WebHttpClient} from "../../web.httpclient";
import EChartOption = echarts.EChartOption;
import {map} from "rxjs/internal/operators";
import {ChartStat} from "../chart-stat";

@Injectable()
export class SalesStatService {

  daySaleLineOption: EChartOption; // 平均日销售
  weekSaleLineOption: EChartOption; // 周内销售分析
  weekAvgPriceLineOption: EChartOption; // 周内均价分析
  weekEtaLineOption: EChartOption; // 周内效率分析

  constructor(private http: WebHttpClient, private chart: ChartStat) {}

  loadChart(cond: any) {
    this.loadDaySaleLine(cond);
    this.loadWeekLine(cond);
  }

  // 平日销售
  loadDaySaleLine(cond: any) {
    this.http.get(`/org/dayStat/${cond.org.code}`,
      {startDate: cond.date.start, endDate: cond.date.end}).pipe(
        map(result => {
          const dates = result.map(rs => rs._id.substring(4, rs._id.length));
          const amounts = result.map(rs => rs.salesAmount);
          const volumes = result.map(rs => rs.salesVolume);

          this.daySaleLineOption = this.chart.lineChartStyle(dates,
            [this.chart.lineSeriesItem(amounts, 0, ['#6F92EA', '#3BCBCA'], 'top'),
              this.chart.barSeriesItem(volumes, 1)
              // this.chart.lineSeriesItem(volumes, 1, ['#6F92EA', '#A8C4F6'], 'right')
            ]);
        })
    ).subscribe();
  }

  loadWeekLine(cond: any) {

    this.http.get(`/org/weekStat/${cond.org.code}`,
      {startDate: cond.date.start, endDate: cond.date.end}).pipe(
      map(result => {
        const dates = result.map(rs => rs._id.substring(4, rs._id.length));

        const amounts = result.map(rs => rs.salesAmount);
        const volumes = result.map(rs => rs.salesVolume);
        // 均价、客均价
        const avgPriceArr = result.map(rs => (rs.salesAmount / rs.salesVolume).toFixed(2));
        const guestAvgPriceArr = result.map(rs => (rs.salesAmount / rs.guestCount).toFixed(2));
        // 坪效、集客力
        const pxArr = result.map(rs => (rs.salesAmount / rs.shopArea).toFixed(2));
        const jklArr = result.map(rs => (rs.guestCount / rs.shopArea).toFixed(2));

        this.weekSaleLineOption = this.chart.lineChartStyle(dates,
          [this.chart.lineSeriesItem(amounts, 0, ['#6F92EA', '#3BCBCA'], 'top'),
            this.chart.lineSeriesItem(volumes, 1, ['#6F92EA', '#A8C4F6'], 'right')]);

        this.weekAvgPriceLineOption = this.chart.lineChartStyle(dates,
          [this.chart.lineSeriesItem(avgPriceArr, 0, ['#6F92EA', '#3BCBCA'], 'top'),
            this.chart.lineSeriesItem(guestAvgPriceArr, 1, ['#6F92EA', '#A8C4F6'], 'right')]);

        this.weekEtaLineOption = this.chart.lineChartStyle(dates,
          [this.chart.lineSeriesItem(pxArr, 0, ['#6F92EA', '#3BCBCA'], 'top'),
            this.chart.lineSeriesItem(jklArr, 1, ['#6F92EA', '#A8C4F6'], 'right')]);
        // console.log(result);
      })
    ).subscribe();

  }


}
