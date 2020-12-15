import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @Input() data;
  highcharts = Highcharts;
  chartOption;
  constructor() { }

  ngOnInit() {
    this.chartOption = {
      chart: {
        type: 'pie'
      },
      title: this.data.title,
      plotOptions: this.data.plotOptions,
      legend:this.data.legend,
      series: this.data ? this.data.series : null
    }
  }
}