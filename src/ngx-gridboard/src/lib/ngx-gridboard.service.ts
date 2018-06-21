import { Injectable } from "@angular/core";

@Injectable()
export class NgxGridboardService {
    public options: any;
    public cellWidth: number;
    public cellHeight: number;
    public fontSize: number;
    public widthHeightRatio = 1;
    public heightToFontSizeRatio;
}