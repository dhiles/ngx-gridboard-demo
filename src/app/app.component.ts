import { Component } from '@angular/core';
import { PanelItem, LaneChange } from 'ngx-gridboard';
import { HeroProfileComponent } from './components/hero-profile.component';
import { HeroJobAdComponent } from './components/hero-job-ad.component';
import { ChartComponent } from './components/chart.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'the ngx-gridboard demo app';
  laneChange: LaneChange;
  activeItem: any;

  options = {
    lanes: 5,
    mediaQueryLanes: {
      xl: 5,
      lg: 5,
      md: 4,
      sm: 3,
      xs: 2
    },
    direction: 'vertical',
    highlightColor: '#85C1E9'
  };

  items = [
    { id: 0, w: 3, h: 1, x: 0, y: 0, panelItem: new PanelItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' }) },
    {
      id: 1, w: 1, h: 1, x: 4, y: 0, panelItem: new PanelItem(ChartComponent, {
        headline: 'Hiring for several positions',
        body: 'Submit your resume today!'
      })
    },
    {
      id: 2, w: 1, h: 2, x: 0, y: 1, panelItem: new PanelItem(HeroJobAdComponent, {
        headline: 'Openings in all departments',
        body: 'Apply today'
      })
    }
  ];

  getItems() {
    this.items.forEach(function (item) {
      console.log(item);
    });
  }

  onLaneChange(event: LaneChange) {
    this.laneChange = event;
  }





}
