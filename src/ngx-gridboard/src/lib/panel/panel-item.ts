import { Type } from '@angular/core';
import { NgxGridboardItemComponent } from '../item/ngx-gridboard-item.component';

export class PanelItem {
  public gridboardItem: NgxGridboardItemComponent;
  constructor(public component: Type<any>, public data: any) {}
}
