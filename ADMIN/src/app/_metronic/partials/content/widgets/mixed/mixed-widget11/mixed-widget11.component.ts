import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { SalesService } from 'src/app/modules/sales/service/sales.service';
@Component({
  selector: 'app-mixed-widget11',
  templateUrl: './mixed-widget11.component.html',
})
export class MixedWidget11Component implements OnInit {
  @Input() chartColor: string = '';
  @Input() chartHeight: string;
  chartOptions: any = {};

  @Output() DiscountR:  EventEmitter<any> = new EventEmitter();

  @Input() year_current:any;
  @Input() meses:any = [];
  year_1:string = '';
  report_sale_for_year:any = null;
  constructor(
    public salesService: SalesService,
  ) {}

  ngOnInit(): void {
    // this.chartOptions = getChartOptions(this.chartHeight, this.chartColor);
    this.year_1 = this.year_current;
    this.reportSaleForYear();
  }

  reportSaleForYear(){
    let data = {
       year: this.year_1,
    }
    this.report_sale_for_year = null;
    this.salesService.reportSaleForYear(data).subscribe((resp:any) => {
       console.log(resp);
       var categories_labels:any = [];
       var series_data:any = [];
       this.report_sale_for_year = resp;

       var series_data_year_current:any = [];
       this.report_sale_for_year.sales_for_month_year.forEach((element:any) => {
        series_data_year_current.push(element.sale_total);
       });
       series_data.push({
        name: 'Ventas del año '+this.year_1,
        data: series_data_year_current,
       })
       var series_data_year_last:any = [];
       this.report_sale_for_year.sales_for_month_year_last.forEach((element:any) => {
        series_data_year_last.push(element.sale_total);
       });
       series_data.push({
        name: 'Ventas del año '+(parseInt(this.year_1) - 1),
        data: series_data_year_last,
       })

       this.DiscountR.emit({
        discount: resp.query_discount,
        cupone: resp.query_cupone,
       });
      //  var max_data = Math.max(...series_data);
      //  var min_data = Math.min(...series_data);
      //  console.log(max_data,min_data);
      this.chartOptions = getChartOptions(this.chartHeight, this.chartColor,series_data,this.meses);
    })
   }
}

function getChartOptions(chartHeight: string, chartColor: string,series_data: Array<any>,categories_label: Array<any>) {
  const labelColor = getCSSVariableValue('--bs-gray-500');
  const borderColor = getCSSVariableValue('--bs-gray-200');
  const secondaryColor = getCSSVariableValue('--bs-gray-300');
  const baseColor = getCSSVariableValue('--bs-' + chartColor);

  return {
    series: series_data,
    // [
    //   {
    //     name: 'Net Profit',
    //     data: [50, 60, 70, 80, 60, 50, 70, 60],
    //   },
    //   {
    //     name: 'Revenue',
    //     data: [50, 60, 70, 80, 60, 50, 70, 60],
    //   },
    // ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: chartHeight,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories_label,
      // ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      type: 'solid',
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return val + " PEN"; //+ ' revenue';
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      padding: {
        top: 10,
      },
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
