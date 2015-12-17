"use strict";

import React from "react";

export default class HTML extends React.Component {
	render() {
		return (
			<html>
			<head>
				<meta charSet="utf-8"/>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
				<meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
				<meta name="description" content="description"/>
				<meta name="keywords" content="keywords"/>
				<meta name="robots" content="all"/>
				<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
				<link rel="shortcut icon" href="favicon.ico"/>
				<title>G.O.A.T.</title>
			</head>
			<body>
				<div id="app"/>
				<link href="assets/style.css" rel="stylesheet"/>
				<script src="assets/bundle.js" type="text/javascript"/>
			</body>
			</html>
		);
	}
}

