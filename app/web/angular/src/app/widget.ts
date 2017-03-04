export class Widget {

    name: string;

    x: number;
    y: number;
    width: number;
    height: number;

    config: {};

    constructor(name: string, x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.name = name;

        this.config = {
            col: this.x,
            row: this.y,
            sizeX: this.width,
            sizeY: this.y
        };
    }

}
