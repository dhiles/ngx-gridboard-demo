import {
  Component, Input, Output, OnInit, ViewChild, ComponentFactoryResolver,
  OnDestroy, EventEmitter, HostListener, ElementRef, Renderer2
} from '@angular/core';
import { NgxGridboardService } from '../ngx-gridboard.service'; 
import { PanelItem } from '../panel/panel-item';
import { PanelDirective } from '../panel/panel.directive';
import { PanelComponent } from '../panel/panel.component';
import { Item, ItemMouseDownEvent } from '../item';

@Component({
  selector: 'gb-item-container',
  templateUrl: './ngx-gridboard-item-container.component.html',
  styleUrls: ['./ngx-gridboard-item-container.component.css']
})
export class NgxGridboardItemContainerComponent implements OnInit {
   @Input() item: Item;
   @Input() defaultColor: string;
   @Input() highlightColor: string; 
   @Output() mouseDownEmitter: EventEmitter<ItemMouseDownEvent> = new EventEmitter<any>();
   activeItemValue: Item;

   @Output()
   activeItemChange = new EventEmitter<Item>();
 
   @Input()
   get activeItem() {
     return this.activeItemValue;
   }
 
   set activeItem(val) {
     this.activeItemValue = val;
     this.activeItemChange.emit(this.activeItemValue);
   }
 
   @HostListener('mouseenter') onMouseEnter() {
     if (!this.activeItem) {
       this.highlight(this.highlightColor || this.defaultColor || 'yellow');
     }
   }
 
   @HostListener('mouseleave') onMouseLeave() {
     if (!this.activeItem) {
       this.highlight(null);
     }
   }
 
   @HostListener('mousedown', ['$event']) onMouseDown(event: any) {
     if (!this.activeItem) {
       this.activeItem = this.item;
       this.highlight(this.highlightColor || this.defaultColor || 'yellow');
       this.mouseDownEmitter.emit({ event: event, item: this.item, resize: false });
     }
   }
 
   @HostListener('mouseup') onMouseUp() {
     if (this.activeItem === this.item) {
       this.highlight(null);
     }
   }
 

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private ngxGridboardService: NgxGridboardService
  ) { }

  ngOnInit() {
//    this.loadComponent();
  }

  private highlight(color: string) {
    this.elementRef.nativeElement.style.backgroundColor = color;
  }


  itemResizeMouseDown(result: ItemMouseDownEvent) {
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
