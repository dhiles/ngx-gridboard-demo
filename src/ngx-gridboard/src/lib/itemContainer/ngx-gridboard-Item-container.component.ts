import {
  Component, Input, Output, OnInit, ViewChild, ComponentFactoryResolver,
  OnDestroy, EventEmitter, HostListener, ElementRef, Renderer2
} from '@angular/core';
import { NgxGridboardService } from '../ngx-gridboard.service'; 
import { PanelItem } from '../panel/panel-item';
import { PanelDirective } from '../panel/panel.directive';
import { PanelComponent } from '../panel/panel.component';
import { Item } from '../item';

@Component({
  selector: 'gb-item-container',
  templateUrl: './ngx-gridboard-item-container.component.html',
  styleUrls: ['./ngx-gridboard-item-container.component.css']
})
export class NgxGridboardItemContainerComponent implements OnInit {
   @Input() item: Item;
   @Output() mouseDownEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private ngxGridboardService: NgxGridboardService
  ) { }

  ngOnInit() {
//    this.loadComponent();
  }

  itemResizeMouseDown(result: any) {
    this.mouseDownEmitter.emit(result);
  }

  resize() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', (this.item.w*this.ngxGridboardService.cellWidth) + 'px');
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', (this.item.h*this.ngxGridboardService.cellHeight) + 'px');
    if (this.ngxGridboardService.heightToFontSizeRatio) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'font-size', this.ngxGridboardService.fontSize);
    } 
  } 
}
