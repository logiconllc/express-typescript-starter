import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as config from "./config/config";
import {Models} from "./models";
import * as http from "http";
import {InternalServerError} from "./errors/InternalServerError";
import morgan = require("morgan");
import {Auth} from "./auth/auth";
import {Router} from "./routes";
import {Roles} from "./auth/roles";



export class Server {

    public static app: express.Express;

    constructor() {}

    public static async initializeApp(): Promise<http.Server> {
        try {
            require('dotenv').config();

            Server.app = express();

            // Configure application
            Server.configureApp();

            // Server.initializeDatabase();

            Server.initializeAuth();

            Server.initializeRoles();

            // Initialize Routes
            Router.initializeRoutes(Server.app);


            return Server.app.listen(Server.app.get("port"));
            
        } catch(error) {
            throw new InternalServerError(error.message);
        }

    }

    private static initializeDatabase() {
        const nodeEnv = process.env.NODE_ENV;
        if(nodeEnv) {
            const sequelizeConfig = config[nodeEnv];
            const models = new Models(sequelizeConfig);
            return models.initModels();
        } else {
            throw new InternalServerError("No NODE ENV set");
        }
    }

    private static initializeAuth() {
        Server.app.use(passport.initialize());
        Auth.serializeUser();
        Auth.useBasicStrategy();
        Auth.useBearerStrategy();
        Auth.useLocalStrategy();
    }



    private static initializeRoles() {
        Roles.buildRoles();
        Server.app.use(Roles.middleware());
    }

    private static configureApp() {

        // all environments
        Server.app.set("port", process.env.PORT || 3000);
        Server.app.use(bodyParser.urlencoded({ extended: true }));
        Server.app.use(bodyParser.json());
        Server.app.use(compression());
        Server.app.use(morgan('dev', {
            skip: function (req, res) {
                return res.statusCode < 400;
            }, stream: process.stderr
        }));

        Server.app.use(morgan('dev', {
            skip: function (req, res) {
                return res.statusCode >= 400;
            }, stream: process.stdout
        }));
    }
}
