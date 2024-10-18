import { Component, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../../kt/_utils';

@Component({
  selector: 'app-cards-widget17',
  templateUrl: './cards-widget17.component.html',
  styleUrls: ['./cards-widget17.component.scss'],
})
export class CardsWidget17Component implements OnInit {
  chartOptions: any = {};

  @Input() cssClass: string = '';
  @Input() chartSize: number = 70;
  @Input() chartLine: number = 11;
  @Input() chartRotate?: number = 145;

  @Input() report_sale_for_week:any;

  percentageV:number = 0;
  sale_total_week:number = 0;
  categories:any = [];

  constructor() {}

  ngOnInit(): void {
    console.log(this.report_sale_for_week);
    this.percentageV = this.report_sale_for_week.porcentageV;
    this.sale_total_week =  this.report_sale_for_week.sales_week;
    this.categories  = this.report_sale_for_week.sales_week_categories;
    setTimeout(() => {
      initChart(this.chartSize, this.chartLine, this.chartRotate);
    }, 10);
  }
}

const initChart = function (
  chartSize: number = 70,
  chartLine: number = 11,
  chartRotate: number = 145
) {
  const el = document.getElementById('kt_card_widget_17_chart');

  if (!el) {
    return;
  }

  var options = {
    size: chartSize,
    lineWidth: chartLine,
    rotate: chartRotate,
    //percent:  el.getAttribute('data-kt-percent') ,
  };

  const canvas = document.createElement('canvas');
  const span = document.createElement('span');

  // @ts-ignore
  if (typeof G_vmlCanvasManager !== 'undefined') {
    // @ts-ignore
    G_vmlCanvasManager.initElement(canvas);
  }

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = options.size;

  el.appendChild(span);
  el.appendChild(canvas);

  // @ts-ignore
  ctx.translate(options.size / 2, options.size / 2); // change center
  // @ts-ignore
  ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

  //imd = ctx.getImageData(0, 0, 240, 240);
  const radius = (options.size - options.lineWidth) / 2;

  const drawCircle = function (
    color: string,
    lineWidth: number,
    percent: number
  ) {
    percent = Math.min(Math.max(0, percent || 1), 1);
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round'; // butt, round or square
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Init
  drawCircle('#E4E6EF', options.lineWidth, 100 / 100);
  drawCircle(getCSSVariableValue('--bs-primary'), options.lineWidth, 100 / 150);
  drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, 100 / 250);
};
