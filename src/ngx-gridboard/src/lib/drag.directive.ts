import { Directive, ElementRef, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Item } from './item';

@Directive({
  selector: '[gbDrag]'
})
export class DragDirective {
  @Input() defaultColor: string;
  @Input() highlightColor: string;
  @Input() item: Item;
  @Output() mouseDownEmitter: EventEmitter<any> = new EventEmitter<any>();
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
      this.mouseDownEmitter.emit({ event: event, id: this.item.id });
    }
  }

  @HostListener('mouseup') onMouseUp() {
    if (this.activeItem === this.item) {
      this.highlight(null);
    }
  }

  constructor(private el: ElementRef) { }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }


}

