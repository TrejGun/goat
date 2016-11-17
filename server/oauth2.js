process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;
process.env.APP = "oauth2";

// HACK
import "core-js/fn/object/values";

import winston from "winston";
import "./configs/winston";
import express from "./utils/express";
import cookieParser from "cookie-parser";
import session from "./auth/session";
import login from "./auth/oauth";
import webpack from "webpack";

const app = express();
app.use(cookieParser());

session(app);
login(app);

if (process.env.NODE_ENV !== "production") {
	const config = require(`./configs/webpack.${process.env.APP}`);
	const compiler = webpack(config);
	const webpackdev = require(`./configs/webpack.${process.env.APP}.dev`);

	app.use(require("webpack-dev-middleware")(compiler, webpackdev));
	app.use(require("webpack-hot-middleware")(compiler));
}

["cors", "pre", "main", "public", "private", "static"].forEach(name => {
	require(`./routes/${name}.js`).default(app, __dirname, "/");
});

const listener = app.listen(process.env.PORT, () => {
	winston.info(`Express server listening on port ${listener.address().port}`);
});

process.on("uncaughtException", winston.error);

export default app;