import { ElementRef } from '@angular/core';
import { PanelItem } from './panel/panel-item';

export interface Item {
    x: number;
    y: number;
    w: number;
    h: number;
    id: number;
    element: ElementRef;
    elementRef: ElementRef;
    panelItem: PanelItem;
  }
