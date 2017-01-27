import { DMDashboard } from './DMDashboard';


let dashboard = new DMDashboard();

process.on('SIGTERM', function () {
    console.log('SIG');
    dashboard.shutdown()
        .then(() => process.exit(0));
});

dashboard.start();
