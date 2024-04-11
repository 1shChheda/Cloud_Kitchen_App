import express from 'express';
import App from './services/ExpressApp';
import dbConn from './services/Database';
import { PORT } from './config';

const StartServer = async () => {
    const app = express();

    await dbConn();

    await App(app);

    app.listen(PORT, () => {
        console.log(`Server running at ${PORT}`);
    });
}

StartServer();

// Deploying on Cloud:
    // Make sure NodeJs is installed on your server
    // Make sure all the prerequisites related to your project are configured on your server 
    // We need to install "PM2" or similar tools to monitor our project on production environment. 
        // If it crashed on runtime, or anything unwanted occurs, then it'll restart your project immediately
    // Next, upload your project and start on the specified port (PORT 8080 here)
    // Finally we need to setup a reverse proxy to bind our exposed port to reach to the audience

    // 1) We need to dockerize our project & dependency images (ex: MongoDB, Nodejs, etc)
    // 2) Configure "docker compose" file to run the containers easily thr' a command
    // 3) add NGINX to handle reverse proxy
    // 4) setup CI/CD server configuration to run our integration and test coverages (right before deploying our artifacts on cloud)
        // --> ex: Elastic Beanstalk, AWS instance, Google Cloud
    // Aditionally, we can manage our containers by adding Kubernetes & Ingress Nginx --> to work as proxy and loop balancer for our containers
    
// Certain changes in "package.json" file:
    // Now, when I run "npm install", I noticed: IT ALSO EXECUTED "npm run build" and "tsc -p ." AUTOMATICALLY?!
    // WHAT?! How? Why?
        // --> This is the result of the "postinstall" script
        // --> When you run npm install, it automatically executes any scripts defined in the "postinstall" field after installing the dependencies. 
        // --> In your case, the "postinstall" script is set to "npm run build", which, in turn, runs "tsc -p .".
        // --> This ensures that your TypeScript code is compiled into JavaScript code every time you install dependencies.
