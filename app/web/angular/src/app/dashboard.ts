import { Widget } from './widget';

export class Dashboard {
    id: number;
    name: string;
    widgets: Widget[];

    constructor(id: number, name: string, widgets: Widget[]) {
        this.id = id;
        this.name = name;
        this.widgets = widgets;

    }
}
