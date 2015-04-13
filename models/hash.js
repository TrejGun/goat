"use strict";

import {Schema} from "mongoose";

var Hash = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	date: {
		_id: false,
		created: {
			type: Date,
			default: Date.now
		}
	}
}, {versionKey: false});

export default Hash;
