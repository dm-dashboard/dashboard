import * as express from 'express';

module Route {

    export class Home {

        public index(req: express.Request, res: express.Response, next: express.NextFunction) {
            res.send('Hello World');
        }
    }
}

export = Route;
