export class Widget {

    name: string;

    x: number;
    y: number;
    w: number;
    h: number;

    config: {};

    constructor(name:string, x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.name = name;

        this.config = {
            col: this.x,
            row: this.y,
            sizeX: this.w,
            sizeY: this.y
        };
    }

}
