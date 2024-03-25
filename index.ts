import express from "express";
import bodyParser from "body-parser";
import { AdminRoute, VendorRoute } from "./routes";

const app = express();
const PORT = 8080

/* for initial test
app.use('/', (req, res, next) => {

    return res.status(200).json('Hello! Welcome to Backend')

});
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', AdminRoute);
app.use('/vendor', VendorRoute);

app.listen(PORT, () => {

    console.clear();
    console.log(`Server running at ${PORT}`);
});