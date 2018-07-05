import { Component } from '@angular/core';
import { PanelItem, LaneChange } from 'ngx-gridboard';
import { HeroProfileComponent } from './components/hero-profile.component';
import { HeroJobAdComponent } from './components/hero-job-ad.component';
import { ChartComponent } from './components/chart.component';
import { Observable, Subject, fromEvent, of } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'the ngx-gridboard 1.0.3 demo app';
  activeItem: any;
  laneChanges: Subject<LaneChange> = new Subject();

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
    highlightColor: '#85C1E9',
    marginPx: 10,
    borderPx: 10,
    headerPx: 40,
    gridContainerStyles: {
      'background-color': 'rgb(171, 171, 196)'
    },
    gridItemContainerStyles: {
    }
  };

  items = [
    {
      w: 1, h: 1, x: 4, y: 0, panelItem: new PanelItem(ChartComponent, {
        headline: 'Hiring for several positions',
        body: 'Submit your resume today!'
      })
    },
    { w: 3, h: 1, x: 0, y: 0, panelItem: new PanelItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' }) },
    {
      w: 1, h: 2, x: 0, y: 1, panelItem: new PanelItem(HeroJobAdComponent, {
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
    this.laneChanges.next(event);
  }





}
