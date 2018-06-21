import { Directive, ElementRef, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Item } from './item';

@Directive({
  selector: '[gbResize]'
})
export class ResizeDirective {
  constructor(private el: ElementRef) { }
  @Input() id: number;
  @Input() activeItem: Item;
  @Output() mouseDownEmitter: EventEmitter<any> = new EventEmitter<any>();
  // @Output() mouseUpEmitter: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('mousedown', ['$event']) onMouseDown(event: any) {
      this.mouseDownEmitter.emit({event: event, id: this.id});
  }

//  @HostListener('mouseup') onMouseUp() {
//    this.mouseUpEmitter.emit({event: event, id: this.id});
//  }
}


