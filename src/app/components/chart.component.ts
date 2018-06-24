import { Component, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { PanelComponent } from 'ngx-gridboard';

declare var google;

@Component({
  styles: ['.hero-profile { background-color: orange; height: 100%; overflow: auto;}'],
  template: `
  <div id="chart_div"></div>  `
})
export class ChartComponent implements PanelComponent, OnInit {
  @Input() data: any;
  chartData: any;
  options: any;
  chart: any;
  resizeWidth = 140;
  resizeHeight = 140;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
  }

  ngOnInit() {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Set a callback to run when the Google Visualization API is loaded.
    // google.charts.setOnLoadCallback(this.loadChart);
    var self = this;
    google.charts.setOnLoadCallback(function () {
      self.loadChart(self);
    });
  }

  loadChart(self: any) {
    // Create the data table.
    self.chartData = new google.visualization.DataTable();
    self.chartData.addColumn('string', 'Topping');
    self.chartData.addColumn('number', 'Slices');
    self.chartData.addRows([
      ['Mushrooms', 3],
      ['Onions', 1],
      ['Olives', 1],
      ['Zucchini', 1],
      ['Pepperoni', 2]
    ]);

    // Set chart options
    self.options = {
      'title': 'How Much Pizza I Ate Last Night',
      'width': this.resizeWidth,
      'height': this.resizeHeight
    };

    // Instantiate and draw our chart, passing in some options.
    self.chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    self.chart.draw(self.chartData, self.options);
  }


  drawChart(width: number, height: number) {
    if (this.options) {
      this.options.width = width;
      this.options.height = height;

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(this.chartData, this.options);
    }
  }


  handleResize(width, height) {
    this.resizeWidth = width;
    this.resizeHeight = height;
    this.drawChart(width, height);
  }
}


