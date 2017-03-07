import { SocketManager } from './core/SocketManager';
import { PluginManager } from './core/PluginManager';
import { WatchDog } from './core/WatchDog';
import { Scheduler } from './core/Scheduler';
import { WebServer } from './web/WebServer';
import { MongoConnection } from './core/MongoConnection';
import { AppLogger } from './core/AppLogger';
import { Configuration } from './config/Configuration';


import { ReflectiveInjector } from 'injection-js';

const container = ReflectiveInjector.resolveAndCreate([
    Configuration, AppLogger, MongoConnection, WebServer,
    Scheduler, WatchDog, PluginManager, SocketManager
]);

export { container };
