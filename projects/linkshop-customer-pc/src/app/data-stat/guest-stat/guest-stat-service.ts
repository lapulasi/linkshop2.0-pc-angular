import {Injectable} from "@angular/core";
import {WebHttpClient} from "../../web.httpclient";
import EChartOption = echarts.EChartOption;
import {ChartStat} from "../chart-stat";
import {map} from "rxjs/internal/operators";

@Injectable()
export class GuestStatService {

  guestPieOption: EChartOption; // 人流结构
  shopGuestPieOption: EChartOption; // 各店人流占比
  stayPieOption: EChartOption; // 驻留结构
  shopStayPieOption: EChartOption; // 各店驻留占比
  jklPieOption: EChartOption; // 集客力占比
  pxPieOption: EChartOption; // 坪效占比

  guestLineOption: EChartOption; // 顾客到店趋势
  stayLineOption: EChartOption; // 顾客驻留趋势
  jklLineOption: EChartOption; // 集客力增长趋势
  pxLineOption: EChartOption; // 坪效增长趋势

  guestBarOption: EChartOption; // 顾客最多时段
  stayBarOption: EChartOption; // 驻留最多时段

  constructor(private http: WebHttpClient, private chart: ChartStat) {}

  loadChart(cond: any) {
    this.loadGuestPie(cond);
    this.loadShopRatePie(cond);

    this.loadGuestBar(cond);
    this.loadStayBar(cond);

    this.loadGuestLine(cond);
    this.loadStayLine(cond);
    this.loadJkAndPxLine(cond);
  }

  // 人流结构、驻留结构
  loadGuestPie(cond: any) {
    this.http.get(`/org/${cond.org.code}/accessLogs`,
      {startDate: cond.date.start, endDate: cond.date.end}).subscribe((result: Array<any>) => {
      // console.log(result);

      const M_20_30 = {count: 0, name: '男 20-30岁', stayMin: 0};
      const M_30_40 = {count: 0, name: '男 30-40岁', stayMin: 0};
      const M_40_50 = {count: 0, name: '男 40-50岁', stayMin: 0};
      const F_20_30 = {count: 0, name: '女 20-30岁', stayMin: 0};
      const F_30_40 = {count: 0, name: '女 30-40岁', stayMin: 0};
      const other = {count: 0, name: '其他', stayMin: 0};
      for (const item of result) {
        if (item['gender'] === 'M' && item['age'] >= 20 && item['age'] <= 30) {
          M_20_30.count++;
          M_20_30.stayMin = M_20_30.stayMin + item.stayMin;
        } else if (item['gender'] === 'M' && item['age'] >= 30 && item['age'] <= 40) {
          M_30_40.count++;
          M_30_40.stayMin = M_30_40.stayMin + item.stayMin;
        } else if (item['gender'] === 'M' && item['age'] >= 40 && item['age'] <= 50) {
          M_40_50.count++;
          M_40_50.stayMin = M_40_50.stayMin + item.stayMin;
        } else if (item['gender'] === 'F' && item['age'] >= 20 && item['age'] <= 30) {
          F_20_30.count ++;
          F_20_30.stayMin = F_20_30.stayMin + item.stayMin;
        } else if (item['gender'] === 'F' && item['age'] >= 30 && item['age'] <= 40) {
          F_30_40.count++;
          F_30_40.stayMin = F_30_40.stayMin + item.stayMin;
        } else {
          other.count++;
          other.stayMin = other.stayMin + item.stayMin;
        }
      }
      const countSortArr = [M_20_30, M_30_40, M_40_50, F_20_30, F_30_40, other].sort((a, b) => a.count >= b.count ? 1 : -1);
      const staySortArr = [M_20_30, M_30_40, M_40_50, F_20_30, F_30_40, other].sort((a, b) => a.stayMin / a.count >= b.stayMin / b.count ? 1 : -1);

      const legendData = countSortArr.map(rs => {
        return {name: rs.name, icon: 'rect'};
      });
      const countSeriesData = countSortArr.map(rs => {
        return {name: rs.name, value: rs.count};
      });
      const staySeriesData = staySortArr.map(rs => {
        return {name: rs.name, value: (rs.count === 0 ? 0 : rs.stayMin / rs.count).toFixed(2)};
      });
      this.guestPieOption = this.chart.pieChartStyle(legendData, countSeriesData);
      this.stayPieOption = this.chart.pieChartStyle(legendData, staySeriesData);
    });
  }

  // 各店占比
  loadShopRatePie(cond: any) {
    this.http.get(`/org/regional/shop`,
      {levelId: cond.org.shopLevelId, orgCode: cond.org.code, adcode: '', startDate: cond.date.start, endDate: cond.date.end}).pipe(
      map(result => {
        this.guestRatePie(result);
        this.stayRatePie(result);
        this.jkRatePie(result);
        this.pxRatePie(result);

      })
    ).subscribe();
  }

  // 各店人流占比
  guestRatePie(result: any) {
    result.sort((a, b) => a.data.guestCount > b.data.guestCount ? -1 : 1);
    if (result.length > 6) {
      const temp = result.slice(0, 6);
      const otherCount = result.slice(6).reduce((pre, curr) => pre + curr.data.guestCount, 0);
      temp.push({data: {guestCount: otherCount}, name: '其他'});
      result = temp;
    }
    const legendData = result.map(val => ({name: val.name, icon: 'rect'}));
    const seriesData = result.map(val => ({value: val.data.guestCount, name: val.name}));
    this.shopGuestPieOption = this.chart.pieChartStyle(legendData, seriesData);
  }

  // 各店驻留占比
  stayRatePie(result: any) {
    result.sort((a, b) => a.data.guestStayTime / a.data.guestCount > a.data.guestStayTime / b.data.guestCount ? -1 : 1);
    if (result.length > 6) {
      const temp = result.slice(0, 6);
      const otherCount = result.slice(6).reduce((pre, curr) => pre + curr.data.guestCount, 0);
      const otherStayMin = result.slice(6).reduce((pre, curr) => pre + curr.data.guestStayTime, 0);
      temp.push({data: {guestCount: otherCount, guestStayTime: otherStayMin}, name: '其他'});
      result = temp;
    }
    const legendData = result.map(val => ({name: val.name, icon: 'rect'}));
    const seriesData = result.map(val => ({value: Math.round(val.data.guestStayTime * 100 / val.data.guestCount) / 100, name: val.name}));
    this.shopStayPieOption = this.chart.pieChartStyle(legendData, seriesData);
  }

  // 集客力占比
  jkRatePie(result: any) {
    result.sort((a, b) => a.data.guestCount / a.data.allShopArea > a.data.guestCount / b.data.allShopArea ? -1 : 1);
    if (result.length > 6) {
      const temp = result.slice(0, 6);
      const otherCount = result.slice(6).reduce((pre, curr) => pre + curr.data.guestCount, 0);
      const otherShopArea = result.slice(6).reduce((pre, curr) => pre + curr.data.allShopArea, 0);
      temp.push({data: {guestCount: otherCount, allShopArea: otherShopArea}, name: '其他'});
      result = temp;
    }
    const legendData = result.map(val => ({name: val.name, icon: 'rect'}));
    const seriesData = result.map(val => ({value: Math.round(val.data.allShopArea === 0 ? 0 : val.data.guestCount / val.data.allShopArea), name: val.name}));
    this.jklPieOption = this.chart.pieChartStyle(legendData, seriesData);
  }

  // 坪效占比
  pxRatePie(result: any) {
    result.sort((a, b) => a.data.allAmount / a.data.allShopArea > a.data.allAmount / b.data.allShopArea ? -1 : 1);
    if (result.length > 6) {
      const temp = result.slice(0, 6);
      const otherAmount = result.slice(6).reduce((pre, curr) => pre + curr.data.allAmount, 0);
      const otherShopArea = result.slice(6).reduce((pre, curr) => pre + curr.data.allShopArea, 0);
      temp.push({data: {allAmount: otherAmount, allShopArea: otherShopArea}, name: '其他'});
      result = temp;
    }
    const legendData = result.map(val => ({name: val.name, icon: 'rect'}));
    const seriesData = result.map(val => ({value: Math.round(val.data.allShopArea === 0 ? 0 : val.data.allAmount / val.data.allShopArea), name: val.name}));
    this.pxPieOption = this.chart.pieChartStyle(legendData, seriesData);
  }

  // 顾客最多时段
  loadGuestBar(cond: any) {
    this.http.get(`/org/${cond.org.code}/accessLogs/customerCountOfTimePeriod`,
      {startDate: cond.date.start, endDate: cond.date.end})
      .subscribe((result: Array<any>) => {
        const arr = result.sort((a, b) => {
          if (a['count'] > b['count']) { return -1; } else if (b['count'] > a['count']) { return 1; } else { return 0; }
        }).filter(value => value['count'] > 0);
        const sumCount = arr.reduce((previousValue, currentValue) => previousValue + currentValue['count'], 0);

        const xAxisData = arr.map(value => value['hour'] + '点');
        const seriesData = arr.map(value => value['count'] * 100 / sumCount);
        this.guestBarOption = this.chart.barChartStyle(xAxisData, seriesData);
      });
  }

  // 驻留最多时段
  loadStayBar(cond: any) {
    this.http.get(`/org/${cond.org.code}/accessLogs/customerStayTime`, {startDate: cond.date.start, endDate: cond.date.end})
      .subscribe((result: Array<any>) => {
        const arr = result.map(value => {
          const avgStayMin = value['stayMinSum'] / value['count'];
          value['avgStayMin'] = avgStayMin || 0;
          return value;
        })
          .sort((a, b) => a['avgStayMin'] >= b['avgStayMin'] ? -1 : 1)
          .filter(value => value['avgStayMin'] > 0);

        const sumCount = arr.reduce((pre, curr) => pre + curr['avgStayMin'], 0);

        const xAxisData = arr.map(value => value['hour'] + '点');
        const seriesData = arr.map(value => value['avgStayMin'] * 100 / sumCount );
        this.stayBarOption = this.chart.barChartStyle(xAxisData, seriesData);
      });
  }

  // 顾客到店趋势
  loadGuestLine(cond: any) {
    this.http.get(`/org/${cond.org.code}/accessLogs/customerCountOfTimePeriod`,
      {startDate: cond.date.start, endDate: cond.date.end})
      .subscribe((result: Array<any>) => {

        const xAxisData = result.map(value => value['hour'] + '点');
        const seriesData = result.map(value => value['count']);
        this.guestLineOption = this.chart.lineChartStyle(xAxisData, [this.chart.lineSeriesItem(seriesData, 0, ['#6F92EA', '#3BCBCA'], 'top')]);
      });
  }

  // 顾客驻留趋势
  loadStayLine(cond: any) {
    this.http.get(`/org/${cond.org.code}/accessLogs/customerStayTime`,
      {startDate: cond.date.start, endDate: cond.date.end})
      .subscribe((result: Array<any>) => {
      // console.log(result);

        const xAxisData = result.map(value => value['hour'] + '点');
        const seriesData = result.map(value => (value['count'] === 0 ? 0 : value['stayMinSum'] / value['count']).toFixed(2));
        this.stayLineOption = this.chart.lineChartStyle(xAxisData, [this.chart.lineSeriesItem(seriesData, 0, ['#6F92EA', '#3BCBCA'], 'top')]);
      });
  }

  // 集客力和坪效增长趋势
  loadJkAndPxLine(cond: any) {
    this.http.get(`/org/dayStat/${cond.org.code}`,
      {startDate: cond.date.start, endDate: cond.date.end}).pipe(
      map(result => {
        const dates = result.map(rs => rs._id.substring(4, rs._id.length));
        const pxArr = result.map(rs => (rs.salesAmount / rs.shopArea).toFixed(2));
        const jklArr = result.map(rs => (rs.guestCount / rs.shopArea).toFixed(2));

        this.jklLineOption = this.chart.lineChartStyle(dates, [this.chart.lineSeriesItem(pxArr, 0, ['#6F92EA', '#3BCBCA'], 'top')]);
        this.pxLineOption = this.chart.lineChartStyle(dates, [this.chart.lineSeriesItem(jklArr, 0, ['#6F92EA', '#3BCBCA'], 'top')]);
      })
    ).subscribe();
  }



}
