import { Component } from '@angular/core';
import { PanelItem, LaneChange, NgxGridboardService } from 'ngx-gridboard';
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
  title = 'the ngx-gridboard 1.0.11 demo app';
  activeItem: any;
  laneChanges: Subject<LaneChange> = new Subject();

  options = {
    fixedLanes: 5,
    mediaQueryLanes: {
      xl: 5,
      lg: 5,
      md: 4,
      sm: 3,
      xs: 2
    },
    direction: 'vertical',
    highlightColor: 'black',
    marginPx: 10,
    borderPx: 2,
    headerPx: 40,
    gridContainerStyles: {
      'background-color': 'rgb(171, 171, 196)'
    },
    gridItemContainerStyles: {
    }
  };


  items = [
    {
      id: 0, w: 1, h: 1, x: 4, y: 0, panelItem: new PanelItem(ChartComponent, {
        headline: 'Hiring for several positions',
        body: 'Submit your resume today!'
      })
    },
    { id: 1, w: 3, h: 1, x: 0, y: 0, panelItem: new PanelItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' }) },
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

  decrementLanes() {
    if (this.options.fixedLanes > 1) {
      this.options.fixedLanes -= 1;
    }
  }

  incrementLanes() {
    this.options.fixedLanes += 1;
  }

  onLaneChange(event: LaneChange) {
    this.laneChanges.next(event);
  }

  addItem() {
    const item = {
      id: 0, w: 1, h: 1, x: 1, y: 0, panelItem: new PanelItem(HeroJobAdComponent, {
        headline: 'adding',
        body: 'New Item!'
      })
    };
    this.items.push(item);
  }

  removeFirstItem() {
    if (this.items.length) {
      this.items[0].panelItem.gridboardItem.deleteItem();
    }
  }

}

