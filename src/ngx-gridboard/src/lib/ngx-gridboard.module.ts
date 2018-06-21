
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxGridboardComponent } from './ngx-gridboard.component';
import { NgxGridboardRoutingModule } from './ngx-gridboard-routing.module';
import { ResizeDirective } from './resize.directive';
import { NgxGridboardItemComponent } from './item/ngx-gridboard-item.component';
import { NgxGridboardItemContainerComponent } from './itemContainer/ngx-gridboard-Item-container.component';
import { NgxGridboardService } from './ngx-gridboard.service';
import { PanelModule } from './panel/panel.module';

@NgModule({
  imports: [NgxGridboardRoutingModule,
    CommonModule,
    PanelModule,
    FlexLayoutModule
  ],
  declarations: [
    NgxGridboardComponent,
    ResizeDirective,
    NgxGridboardItemComponent,
    NgxGridboardItemContainerComponent
  ],
  providers: [
    NgxGridboardService  
  ],
  exports: [
    NgxGridboardComponent,
    NgxGridboardItemContainerComponent
  ]
})
export class NgxGridboardModule { }
