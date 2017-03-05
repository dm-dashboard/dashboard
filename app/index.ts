require('reflect-metadata');

import { container } from './Container';
import { DMDashboard } from './DMDashboard';

let dashboard = new DMDashboard();

process.on('SIGTERM', function () {
    console.log('Process Terminated');
    dashboard.shutdown()
        .then(() => process.exit(0));
});

process.on('SIGINT', function () {
    dashboard.shutdown()
        .then(() => process.exit(0));
});

dashboard.start(container);
