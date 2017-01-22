# DM Dashboard

A highly customizable dashboard used to radiate important information to interested people.

This was originally built as part of the [Entelect](http://www.entelect.co.za) "Tech Accelerator" program. The system won first prize and is still actively used within Entelect.

Although originally built for software development teams, there is nothing stopping it's use in other industries and areas.

[TODO: Add screenshot]

## Features

1. Centralized server that does all the grunt work of talking to other systems
2. Browser based clients with always up connection to the server with push updates
2. Customizable dashboards that allows placement of rectangular widgets as you see fit
2. Multiple pages per dashboard, will cycle through them on a customizable interval
3. Multiple dashboards, can have various clients each viewing their own dashboards
4. Broadcasts: Force specified clients to display a temporary dashboard to broadcast a message for a set time period (This feature is still a work in progress)
5. Client control dashboard allowing remote control of connected clients machines, allowing you to identify them, change their active dashboard or force-reload them.
6. Plugin architecture - Endless possibilities. If you have a system that exposes an API, it can be added to your dashboard with a custom plugin.

## Architecture

The core system is a node backend connected via web sockets to an Angular frontend. 

MongoDB is used to store configuration and is also available to plugins for storage of their own data.

Actual monitoring and display is handled by plugins consisting of a backend node script and a custom Angular directive.

There are no plugins installed by default, however the following are available in the plugins repo under the dm-dashboard org:
* Teamcity (designed specifically to keep an eye on multiple projects)
    * Show a history of recent builds across all projects with failed builds floating to the top
    * A list of currently executing builds
    * Build agent queues
    * Some stats of successfull/failed builds over the past day/week/month
* Octopus Deploy
    * Show details of the most recent deploy for a project
* Client Only (Various widgets that don't require a server side component) 
    *  Display an image
    *  Play a Youtube video
    *  Display an iFrame
*  Others that cannot be released due to their company specific natures but doing the following:
    * Communicate over ZeroMQ with a Windows GUI app
    * Consume a client .net API using [edge.js](http://tjanczuk.github.io/edge/)
    * Experimental Microsoft TFS plugin

## Important Notice

This app was originally written in 2014 and has had minimal changes since then. 
It is based on the popular [mean.io](http://mean.io) stack which allowed for the plugin nature of the design.

Even though it works currently (and is actively used) I have decided to open-source and share this code as I'm sure many other teams will benefit from using it. I would also like to bring it kicking and screaming into the present. 

Some things that I would like to see happen:
- Upgrade to Angular 2
- Remove the dependency on mean.io, it was helpful to get plugability quickly during the origianl contest, but it also contains a lot of overhead and unnecessary complexity. I think a plain old node/express (or some other backend framework) with custom plugin code would be much easier to maintain
- Upgrade to a new version of node
- Remove the need to check-in the node_modules folder, this is partly due to the age of the system as some of its indirect dependencies (via mean.io) have changed substantially and a fresh install would break the system.
- Much simple installation process that doesn't require a git clone


If you find it useful, please consider contributing to modernizing it and getting it cleaned up and easier to maintain.

## Installation Instructions

### Prequisites
1. Node v0.12 or greater
1. MongoDB v3 or greater
1. Git v1.9 or greater
1. The dashboard will run on Windows or Linux, though a Linux installation may be easier

### Optional Prequisites
1. Python v2.7 or greater (If you intend to rebuild or fiddle with the node modules. It is required for mongoose)

### To Install
1. If you're running on Windows
  * You will need to enable long filenames, the node_modules folder is included in the repo for historical pain relief :)
  * Run the following on your git bash
    * ``` git config --system core.longpaths true ```
1. Clone the git repo onto the destination server
  * ``` git clone git@github.com:dm-dashboard/dashboard.git ```
1. Change into the checkout folder and install forever.js
  * Forever allows you to run a node script in the background and auto restarts it if it crashes
  * ``` npm install -g forever```
1. Install the mean.io command line tools
  * ``` npm install -g mean-cli```
1. Before we start the server, we will need to configure it for your environment

### To Configure
1. Change to the checkout folder
1. Open config/env/development.json
  1. Update the "db" property to point to your mongo DB
  1. Save and close the file

### Installing Plugins
1. Checkout the desired plugin and copy it to
```[install dir]/packages/custom  ```

#### Sample plugin config process:
1. If you're planning to use the TeamCity plugin, open packages/custom/edp-teamcity/server/teamcity.js
  1. The teamcity plugin contains various submodules
  1. There is a blacklist at the top of the page, any submodule listed here is not booted
  1. Comment out the submodules that you want to load
  1. You will definitely need
    * teamcity-stats-fetcher
  1. You will probably find the following useful
    * teamcity-build-status
    * teamcity-health
    * teamcity-realtime
  1. Save the file and close it
  
### To start everything up
1. Change to the checkout folder
1. Run the following:
    * ```forever start server.js --singleProcess``` 
1. You will see forever starting the node process and then it returns you to the console.
1. To see what forever is currently managing
    * ```forever list```
1. To kill the dashboard process
    * ```forever stop server.js```
    * OR
    * ```forever stop 0```  
1. Open your browser and navigate to 
    * ```http://[path_to_where_you_deployed]:3000```     
1. **Note:** There is currently an error "{ Error: Cannot find module '../build/Release/bson'" when starting up, I'm working on figuring out what it means, but it does not affect functionality so you can ignore it.
  
### Creating an admin user

1. Once connected to the dashboard in your browser, you should see a "Join" link in the top right
1. Click it and create an account - this will create a standard user account
1. Open a console in the checkout folder
1. Run the following
    * ```mean user youremail@email.com -a admin```
    * 
1. Refresh the page, you should now see some admin menus
2. As an admin you will be able to configure plugins using the "Plugins" menu
    * You will also be able to create your first dashboard

### Initial Setup
1. Create a dashboard...TODO
1. Configure plugins...TODO
2. Writing your own plugin ...TODO

