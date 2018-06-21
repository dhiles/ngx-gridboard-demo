# ngx-gridboard

ngx-gridboard is an angular grid component which contains movable resizable panels each of which contains a component. The grid is built from a layout definition which specifies for each panel a component class and initial position and dimensions.   

## Installation

npm install ngx-gridboard --save

## Usage

### import NgxGridboardModule and sub-components as entryComponents.
```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxGridboardModule } from 'ngx-gridboard';
import { HeroProfileComponent } from './components/hero-profile.component';
import { HeroJobAdComponent } from './components/hero-job-ad.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroJobAdComponent, HeroProfileComponent
  ],
  imports: [
    BrowserModule, NgxGridboardModule
  ],
  exports: [
    HeroJobAdComponent, HeroProfileComponent
  ],
  providers: [],
  entryComponents: [ HeroJobAdComponent, HeroProfileComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
### Default usage

<gb-gridboard [items]="items" [options]="options"></gb-gridboard>

### Which expects a setup like the following:

#### options: fields for mediaQuery lanes are optional. When defined, lanes will be set at the apecified #### media query size, otherwise the default value for lanes is used. 

```javascript
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
    { id: 0, w: 3, h: 1, x: 0, y: 0, panelItem: new PanelItem(HeroProfileComponent, {name: 'Bombasto', bio: 'Brave as they come'})},
    { id: 1, w: 1, h: 1, x: 4, y: 0, panelItem: new PanelItem(HeroJobAdComponent,   {headline: 'Hiring for several positions',
    body: 'Submit your resume today!'}) },
    { id: 2, w: 1, h: 2, x: 0, y: 1, panelItem: new PanelItem(HeroJobAdComponent,   {headline: 'Openings in all departments',
    body: 'Apply today'}) }
  ];
```

## Authors

* **Douglas Hiles** 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* the gridList layout engine is based on the hootsuite GridList


