
import {
  Component, Directive, HostListener,
  Input, Output, Query, EventEmitter, AfterContentInit,
  AfterViewInit, ViewChild, ContentChildren, ViewChildren,
  QueryList, forwardRef, Inject, ElementRef, Renderer2,
  ComponentFactoryResolver, OnInit, OnDestroy
} from '@angular/core';

import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Observable, Subject, fromEvent } from 'rxjs';
import { map, filter, catchError, mergeMap, debounceTime } from 'rxjs/operators';
import { containsTree } from '@angular/router/src/url_tree';
import { Item, ItemMouseDownEvent } from './item';
import { PanelItem } from './panel/panel-item';
import { PanelDirective } from './panel/panel.directive';
import { PanelComponent } from './panel/panel.component';
import { GridList, GridListHelper } from './gridList/gridList';
import { NgxGridboardService } from './ngx-gridboard.service';

export interface Coords {
  x: number;
  y: number;
}

export class LaneChange {
  mq: string;
  lanes: number;
}

@Component({
  selector: 'gb-gridboard',
  templateUrl: './ngx-gridboard.component.html',
  styleUrls: ['ngx-gridboard.component.css']
})
export class NgxGridboardComponent implements OnInit, AfterViewInit {
  instance: NgxGridboardComponent;
  temporaryItemIndex: number;
  parent: any;
  id: number;
  activeItem: Item;
  activated = false;

  // dragItem: any = null;
  @Input() items: any;
  @Input() options: any;
  @Output() laneChange: EventEmitter<LaneChange> = new EventEmitter();
  @ViewChild('gridContainer') gridContainer: ElementRef;
  @ViewChild('positionHighlightItem') positionHighlight: ElementRef;
  @ViewChildren('dragItem') itemElementRefs: QueryList<ElementRef>;
  @ViewChild('highlightItem') dragElement: ElementRef;
  @ViewChild('innerContent') innerContent: ElementRef;

  _maxGridCols: number;
  name: string;
  _items: any;

  gridList: any;
  gridElement: any;
  mouseMoves: any;
  resizes: any;
  inputValue: string;
  draggableItem: any = null;
  previousDragPosition: Coords = null;
  maxItemWidth: number;
  maxItemHeight: number;

  _previousDragPosition: any;
  @HostListener('mouseup') onMouseUp() {
    this.activeItem = undefined;
    if (this.draggableItem) {
      this.itemMouseUp();
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.activeItem) {
      this.activated = true;
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.activeItem) {
      this.activated = false;
    }
  }

  constructor(
    public elementRef: ElementRef,
    public renderer: Renderer2,
    public media: ObservableMedia,
    public ngxGridboardService: NgxGridboardService
  ) {
    this.instance = this;
    this.name = 'GridList';
    this.temporaryItemIndex = -1;
  }

  ngOnInit() {
    if (this.options.cellWidth) {
      this.ngxGridboardService.cellWidth = this.options.cellWidth;
    }
    if (this.options.cellHeight) {
      this.ngxGridboardService.cellHeight = this.options.cellHeight;
    }
  }

  ngAfterViewInit() {
    this.init();

    this.mouseMoves = fromEvent(this.gridContainer.nativeElement, 'mousemove')
      .pipe(map((i: any) => {
        return { x: i.pageX, y: i.pageY };
      }, debounceTime(100))
      );

    // wait .5s between keyups to emit current value
    // throw away all other values
    // const debouncedInput = this.mouseMoves.debounceTime(10);

    const subscribe = this.mouseMoves.subscribe((pos: any) => {
      if (this.draggableItem) {
        this.itemMouseMove(pos, this.draggableItem);
      }

    });

    this.media.asObservable()
      .pipe(
        map((change: MediaChange) => change.mqAlias)
      ).subscribe((mq) => this.loadResponsiveContent(mq));

  }

  loadResponsiveContent(mq) {
    let lanes = this.options.lanes;
    if (this.options.mediaQueryLanes.hasOwnProperty(mq)) {
      lanes = this.options.mediaQueryLanes[mq];
    }
    this.resizeGrid(lanes);
    this.laneChange.emit({ mq: mq, lanes: lanes });
  }

  init() {
    // Read items and their meta data. Ignore other list elements (like the
    // position highlight)
    const self = this;
    this.updateItemsWithElementRefs();
    this.maxItemWidth = this.getMaxItemWidth();
    this.maxItemHeight = this.getMaxItemHeight();

    // Used to highlight a position an element will land on upon drop
    //this.positionHighlight = this.elementRef.nativeElement.querySelector('.position-highlight');
    this.removePositionHighlight();

    this.initGridList();
    this.reflow();
  }

  updateItemsWithElementRefs() {
    const self = this;
    this.itemElementRefs.forEach(function (itemContainer: any, i) {
      const id = itemContainer.elementRef.nativeElement.getAttribute('data-id');
      self.items[id].elementRef = itemContainer.elementRef;
    });
  }


  getMaxItemWidth() {
    let maxWidth = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].w > maxWidth) {
        maxWidth = this.items[i].w;
      }
    }
    return maxWidth;
  }

  getMaxItemHeight() {
    let maxHeight = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].h > maxHeight) {
        maxHeight = this.items[i].w;
      }
    }
    return maxHeight;
  }

  initGridList() {
    // Create instance of GridList (decoupled lib for handling the grid
    // positioning and sorting post-drag and dropping)
    this.gridList = new GridList(this.items, {
      lanes: this.options.lanes,
      direction: this.options.direction
    });
  }

  resizeGrid(lanes: number) {
    this.gridList.resizeGrid(lanes);
    this.updateGridSnapshot();
    this.render();
  }

  reflow() {
    this.calculateCellSize();
    this.render();
  }

  render() {
    this._applySizeToItems();
    this._applyPositionToItems();
  }

  resizeItem(item: any, width: number, height: number) {
    this._createGridSnapshot();
    this.gridList.resizeItem(item, { w: width, h: height });
    this.updateGridSnapshot();
    this.render();
  }

  highlightPositionForItem(item: Item) {
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'width', this._getItemWidth(item) + 'px');
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'height', this._getItemHeight(item) + 'px');
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'left', item.x * this.ngxGridboardService.cellWidth + 'px');
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'top', item.y * this.ngxGridboardService.cellHeight + 'px');
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'display', 'inline');

    if (this.options.heightToFontSizeRatio) {
      this.renderer.setStyle(this.positionHighlight.nativeElement, 'font-size', this.ngxGridboardService.fontSize);
    }
  }

  removePositionHighlight() {
    this.renderer.setStyle(this.positionHighlight.nativeElement, 'display', 'none');
  }

  calculateCellSize() {
    if (this.options.direction === 'horizontal') {
      this.ngxGridboardService.cellHeight = Math.floor(this.gridContainer.nativeElement.offsetHeight / this.options.lanes);
      this.ngxGridboardService.cellWidth = this.ngxGridboardService.cellHeight * this.ngxGridboardService.widthHeightRatio;
    } else {
      this.ngxGridboardService.cellWidth = Math.floor(this.gridContainer.nativeElement.offsetWidth / this.options.lanes);
      this.ngxGridboardService.cellHeight = this.ngxGridboardService.cellWidth / this.ngxGridboardService.widthHeightRatio;
    }
    if (this.options.heightToFontSizeRatio) {
      this.ngxGridboardService.fontSize = this.ngxGridboardService.cellHeight * this.ngxGridboardService.heightToFontSizeRatio;
    }
  }

  _getItemWidth(item: Item) {
    return item.w * this.ngxGridboardService.cellWidth;
  }

  _getItemHeight(item: Item) {
    return item.h * this.ngxGridboardService.cellHeight;
  }

  _applySizeToItems() {
    const self = this;
    for (let i = 0; i < self.items.length; i++) {
      this.items[i].panelItem.gridboardItem.resize();
      //  self.renderer.setStyle(self.items[i].elementRef.nativeElement, 'width', self._getItemWidth(self.items[i]) + 'px');
      //  self.renderer.setStyle(self.items[i].elementRef.nativeElement, 'height', self._getItemHeight(self.items[i]) + 'px');
      //  if (self.options.heightToFontSizeRatio) {
      //    self.renderer.setStyle(self.items[i].elementRef.nativeElement, 'font-size', self.ngxGridboardService.fontSize);
      //  }
    }
  }

  _applyPositionToItems() {
    const self = this;
    // TODO: Implement group separators
    for (let i = 0; i < self.items.length; i++) {
      // Don't interfere with the positions of the dragged items
      if (self.items[i].move) {
        continue;
      }
      self.renderer.setStyle(self.items[i].elementRef.nativeElement, 'left', self.items[i].x * self.ngxGridboardService.cellWidth + 'px');
      self.renderer.setStyle(self.items[i].elementRef.nativeElement, 'top', self.items[i].y * self.ngxGridboardService.cellHeight + 'px');
    }
    // Update the width of the entire grid container with enough room on the
    // right to allow dragging items to the end of the grid.
    if (this.options.direction === 'horizontal') {
      this.renderer.setStyle(this.gridContainer.nativeElement, 'width',
        (this.gridList.grid.length + this.maxItemWidth) * this.ngxGridboardService.cellWidth + 'px');
    } else {
      this.renderer.setStyle(this.gridContainer.nativeElement, 'height',
        (this.gridList.grid.length + this.maxItemHeight) * this.ngxGridboardService.cellHeight + 'px');
    }
  }

  activeItemChange(item: Item) {
    console.log('activeItemChange=' + item.id);
  }

  itemMouseUp() {
    const self = this;
    if (this.draggableItem) {
      this.onStop();
      this.draggableItem.move = false;
      this.draggableItem.resize = false;
      self.renderer.setStyle(this.draggableItem.elementRef.nativeElement, 'z-index', 0);
    }
    this.draggableItem = null;
  }

  itemResizeMouseUp(result: any) {
  }


  itemMouseDown(result: ItemMouseDownEvent) {
    result.event.stopPropagation();
    this.draggableItem = result.item; 
    if (result.resize) {
      this.draggableItem.resize = true;
      this.draggableItem.resizeType = result.resizeType;
    } else {
      this.draggableItem.move = true;
    }
    this.onStart();
  }

  getRelativeCoords(pos: Coords, target: any) {
    const bounds = target.getBoundingClientRect();
    const x = pos.x - bounds.left;
    const y = pos.y - bounds.top;
    return { x: x, y: y };
  }

  itemMouseMove(pos: Coords, item: any) {
    const self = this;
    if (item.move) {
      self.renderer.setStyle(item.elementRef.nativeElement, 'left', pos.x - (item.elementRef.nativeElement.offsetWidth / 2) + 'px');
      self.renderer.setStyle(item.elementRef.nativeElement, 'top', pos.y - (item.elementRef.nativeElement.offsetHeight / 2) + 'px');
      self.renderer.setStyle(item.elementRef.nativeElement, 'z-index', 1000);
      this.onDrag(this.draggableItem);
    } else if (item.resize) {
      const relativeCoords = this.getRelativeCoords(pos, this.gridContainer.nativeElement);
      if (item.resizeType === 'se-resize-handle' || item.resizeType === 'e-resize-handle' || item.resizeType === 'ne-resize-handle') {
        self.renderer.setStyle(item.elementRef.nativeElement, 'width',
          (relativeCoords.x - item.elementRef.nativeElement.offsetLeft) + 10 + 'px');
      }

      if (item.resizeType === 'w-resize-handle' || item.resizeType === 'nw-resize-handle' || item.resizeType === 'sw-resize-handle') {
        let right = (item.x + item.w) * this.ngxGridboardService.cellHeight;
        const left = relativeCoords.x - 5;
        let width = right - left;
        if (width < 0) {
          width = 0;
          right = left - 10;
        }
        self.renderer.setStyle(item.elementRef.nativeElement, 'left', left + 'px');
        self.renderer.setStyle(item.elementRef.nativeElement, 'width', width + 'px');
      }

      if (item.resizeType === 'ne-resize-handle' || item.resizeType === 'n-resize-handle' || item.resizeType === 'nw-resize-handle') {
        const bottom = (item.y + item.h) * this.ngxGridboardService.cellHeight;
        let top = relativeCoords.y - 5;
        let height = bottom - top;
        if (height < 0) {
          height = 0;
          top = bottom - 10;
        }
        self.renderer.setStyle(item.elementRef.nativeElement, 'top', top + 'px');
        self.renderer.setStyle(item.elementRef.nativeElement, 'height', height + 'px');
      }

      if (item.resizeType === 'se-resize-handle' || item.resizeType === 's-resize-handle' || item.resizeType === 'sw-resize-handle') {
        self.renderer.setStyle(item.elementRef.nativeElement, 'height',
          (relativeCoords.y - item.elementRef.nativeElement.offsetTop) + 10 + 'px');
      }
      self.renderer.setStyle(item.elementRef.nativeElement, 'z-index', 1000);
    }
  }

  onStart() {
    // Create a deep copy of the items; we use them to revert the item
    // positions after each drag change, making an entire drag operation less
    // distructable
    this._createGridSnapshot();

    // Since dragging actually alters the grid, we need to establish the number
    // of cols (+1 extra) before the drag starts

    this._maxGridCols = this.gridList.grid.length;
  }

  onDrag(item: any) {
    const newPosition = this._snapItemPositionToGrid(item);

    if (this._dragPositionChanged(newPosition)) {
      this._previousDragPosition = newPosition;

      this.gridList.moveItemToPosition(item, newPosition);

      // Visually update item positions and highlight shape
      this._applyPositionToItems();
      this.highlightPositionForItem(item);
    }
  }

  onStop() {
    if (this.draggableItem.move) {
      this.draggableItem.move = false;
      this.updateGridSnapshot();
      this._previousDragPosition = null;
      this._applyPositionToItems();
      this.removePositionHighlight();
    } else if (this.draggableItem.resize) {
      const offsetWidth = this.draggableItem.elementRef.nativeElement.offsetWidth === 0 ?
        1 : this.draggableItem.elementRef.nativeElement.offsetWidth;
      const offsetHeight = this.draggableItem.elementRef.nativeElement.offsetHeight === 0 ?
        1 : this.draggableItem.elementRef.nativeElement.offsetHeight;
      const width = Math.ceil(offsetWidth / this.ngxGridboardService.cellWidth);
      const height = Math.ceil(offsetHeight / this.ngxGridboardService.cellHeight);
      this.resizeItem(this.draggableItem, width, height);
    }
  }

  _dragPositionChanged(newPosition: any) {
    if (!this._previousDragPosition) {
      return true;
    }
    return (newPosition[0] !== this._previousDragPosition[0] ||
      newPosition[1] !== this._previousDragPosition[1]);
  }

  _snapItemPositionToGrid(item: any) {
    // const position = item.$element.position();
    //   const position = $(item.elementRef.nativeElement).position();
    const positionLeft = item.elementRef.nativeElement.offsetLeft;
    const positionTop = item.elementRef.nativeElement.offsetTop;

    //   position[0] -= this.$element.position().left;

    //   let col = Math.round(position.left / this.cellWidth),
    //       row = Math.round(position.top / this.cellHeight);

    let col = positionLeft === 0 ? 0 : Math.round(positionLeft / this.ngxGridboardService.cellWidth),
      row = positionTop === 0 ? 0 : Math.round(positionTop / this.ngxGridboardService.cellHeight);

    // Keep item position within the grid and don't let the item create more
    // than one extra column
    col = Math.max(col, 0);
    row = Math.max(row, 0);

    if (this.options.direction === 'horizontal') {
      col = Math.min(col, this._maxGridCols);
      row = Math.min(row, this.options.lanes - item.h);
    } else {
      col = Math.min(col, this.options.lanes - item.w);
      row = Math.min(row, this._maxGridCols);
    }
    return [col, row];
  }

  _createGridSnapshot() {
    this._items = GridListHelper.cloneItems(this.items);
  }

  updateGridSnapshot() {
    // Notify the user with the items that changed since the previous snapshot
    this.triggerOnChange();
    GridListHelper.cloneItems(this.items, this._items);
  }

  triggerOnChange() {
    if (typeof (this.options.onChange) !== 'function') {
      return;
    }
    this.onChange.call(
      // this, this.gridList.getChangedItems(this._items, '$element'));
      this, this.gridList.getChangedItems(this._items, 'elementRef'));
  }

  flashItems(items: any) {
    const self = this;
    for (let i = 0; i < items.length; i++) {
      (function (nativeElement: any) {
        self.renderer.addClass(nativeElement, 'changed');
        setTimeout(function () {
          self.renderer.removeClass(nativeElement, 'changed');
        }, 0);
      })(items[i].elementRef.nativeElement);
    }
  }

  onChange(changedItems: any) {
    this.flashItems(changedItems);
  }

}

