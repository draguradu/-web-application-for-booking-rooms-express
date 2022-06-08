import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import routes from "./routes";

createConnection().then(async () => {

    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    app.use("/", routes);

    app.listen(9000, () => {
      console.log("Server has started on port 9000. Open http://localhost:9000/ to see results");
    });

}).catch(error => console.log(error));
