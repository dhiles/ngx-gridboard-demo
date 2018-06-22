import { Directive, ElementRef, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Item, ItemMouseDownEvent } from './item';

@Directive({
  selector: '[gbResize]'
})
export class ResizeDirective {
  @Input() resizeType: string;
  @Input() item: Item;
  @Output() mouseDownEmitter: EventEmitter<ItemMouseDownEvent> = new EventEmitter<any>();

  @HostListener('mousedown', ['$event']) onMouseDown(event: any) {
      this.mouseDownEmitter.emit({event: event, resize: true, resizeType: this.resizeType, item: this.item});
  }
  constructor(private el: ElementRef) { }

}


