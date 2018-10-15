
import * as $ from 'jquery';
import * as h337 from './heatmap.js';
import {ShopGuestPos} from './shop-guest-pos';
export class HeatMap {

  private _config = {
    container: null,
    radius: 20, // 半径
    maxOpacity: 1, // 透明度
    minOpacity: 0.2,
    minRenderThreshold: 0,
    maxRenderThreshold: 10,
    gradient: { 0.25: 'rgb(0,0,255)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)'},
    blur: .75
  };

  originalWidth = 640; //  1280 640
  originalHeight = 480; //  720  480

  private _heatMap;

  private coordinates: Array<any>;

  constructor( type: string, div: HTMLElement, data: Array<ShopGuestPos>) {

    $(div).remove('canvas');
    this._config.container = div;

    if (type === 'month') {
      this._config.radius = 30;
    }

    const currWidth = this._config.container.offsetWidth;
    const currHeight = this._config.container.offsetHeight;

    if (currWidth > 400) {
      this._config.radius = 30;
    }

    this._heatMap = h337.create(this._config);





    // this.coordinates = data.map((pos: any) => this.transformCoordinate(pos));
    this._heatMap.setData({
      // max: 1,
      // min: 100,
      data: data.map( value => this.transformCoordinate(value))
    });

  }

  setData(data: Array<ShopGuestPos>): void {
    this._heatMap.setData({
      // max: 1,
      // min: 100,
      data: data.map( value => this.transformCoordinate(value))
    });
  }

  transformCoordinate(position: any): any {
    const currWidth = this._config.container.offsetWidth;
    const currHeight = this._config.container.offsetHeight;
    const cell = 16;
    const posX = position.x;
    const posY = position.y;
    return { x: (Math.floor(posX * currWidth / this.originalWidth / cell)  ) * cell + cell / 2,
      y: (Math.floor(posY * currHeight / this.originalHeight / cell) ) * cell + cell / 2,
      value: position.value};
    //
    // return {x: Math.floor(position.x * currWidth / 640 ),
    // y: Math.floor(position.y * currHeight / 480),
    // value: position.value};

  }

  maxVal(): number {
    const count = this.coordinates.length;
    let maxVal = 3;
    switch (true)  {
      case count > 5000 : maxVal = 300; break;
      case count > 3000 : maxVal = 200; break;
      case count > 1500 : maxVal = 100; break;
      case count > 1000 : maxVal = 60; break;
      case count > 400 : maxVal = 25; break;
      case count > 200 : maxVal = 15; break;
      case count > 100 : maxVal = 8; break;
      case count >= 50 : maxVal = 4; break;
    }
    return maxVal;

  }

  setRenderThreshold(minRenderThreshold: number, maxRenderThreshold: number): void {
    this._heatMap.setRenderThreshold(minRenderThreshold , maxRenderThreshold);
  }


  setOpacity(opacity): void {
    this._config.maxOpacity = opacity;
    this._heatMap.configure(this._config);
  }

  getExtremaValues(): any {
    return this._heatMap.getExtremaValues();
  }

  destory(): void {
    $(this._config.container).children('canvas').remove();
    console.log('heatMap destroyed');
  }



}
