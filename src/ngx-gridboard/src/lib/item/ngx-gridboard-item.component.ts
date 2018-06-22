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
  selector: 'gb-item',
  templateUrl: './ngx-gridboard-item.component.html',
  styleUrls: ['./ngx-gridboard-item.component.css']
})
export class NgxGridboardItemComponent implements OnInit {
  activated = false;
  @Input() item: Item;
  @Input() activeItem: Item;
  @Output() mouseDownEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(PanelDirective) panelHost: PanelDirective;
  @ViewChild('inner') inner: ElementRef;
  @HostListener('mouseenter') onMouseEnter() {
    this.activated = true;
    if (!this.activeItem) {
      this.setInner();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.activated = false;
    this.inner.nativeElement.style.top = '0px';
    this.inner.nativeElement.style.left = '0px';
    this.inner.nativeElement.style.right = '0px';
    this.inner.nativeElement.style.bottom = '0px';
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private ngxGridboardService: NgxGridboardService
  ) { }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.item.panelItem.component);

    const viewContainerRef = this.panelHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<PanelComponent>componentRef.instance).data = this.item.panelItem.data;
    this.item.panelItem.gridboardItem = this;
  }

  itemResizeMouseDown(result: ItemMouseDownEvent) {
    this.mouseDownEmitter.emit(result);
  }

  resize() {
    this.renderer.setStyle(this.item.elementRef.nativeElement, 'width', (this.item.w*this.ngxGridboardService.cellWidth) + 'px');
    this.renderer.setStyle(this.item.elementRef.nativeElement, 'height', (this.item.h*this.ngxGridboardService.cellHeight) + 'px');
    if (this.ngxGridboardService.heightToFontSizeRatio) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'font-size', this.ngxGridboardService.fontSize);
    }
  }


  private setInner() {
    this.inner.nativeElement.style.top = '10px';
    this.inner.nativeElement.style.left = '10px';
    this.inner.nativeElement.style.bottom = '10px';
    this.inner.nativeElement.style.right = '10px';
  }


}
