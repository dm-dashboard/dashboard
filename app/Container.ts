import { ISocketManager, SocketManager } from './core/SocketManager';
import { IPluginManager, PluginManager } from './core/PluginManager';
import { IWatchDog, WatchDog } from './core/WatchDog';
import { IScheduler, Scheduler } from './core/Scheduler';
import { IWebServer, WebServer } from './web/WebServer';
import { IMongoConnection, MongoConnection } from './core/MongoConnection';
import { Symbols } from './Symbols';
import { ILogger, AppLogger } from './core/AppLogger';
import { IConfiguration, Configuration } from './config/Configuration';

import { Container } from 'inversify';

let container = new Container();
container.bind<IConfiguration>(Symbols.IConfiguration).to(Configuration);
container.bind<ILogger>(Symbols.ILogger).to(AppLogger);
container.bind<IMongoConnection>(Symbols.IMongoConnection).to(MongoConnection);
container.bind<IWebServer>(Symbols.IWebServer).to(WebServer);
container.bind<IScheduler>(Symbols.IScheduler).to(Scheduler);
container.bind<IWatchDog>(Symbols.IWatchDog).to(WatchDog);
container.bind<IPluginManager>(Symbols.IPluginManager).to(PluginManager);
container.bind<ISocketManager>(Symbols.ISocketManager).to(SocketManager);

export { container };
