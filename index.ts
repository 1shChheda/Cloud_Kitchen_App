import express from 'express';
import App from './services/ExpressApp';
import dbConn from './services/Database';

const StartServer = async () => {
    const app = express();
    const PORT = 8080

    await dbConn();

    await App(app);

    app.listen(PORT, () => {
        console.log(`Server running at ${PORT}`);
    });
}

StartServer();