"use strict";

import Q from "q";
import _ from "lodash";
import passport from "passport";

import messenger from "../../utils/messenger.js";
import AbstractController from "./abstract.js";
import MailController from "./../mail.js";
import HashController from "./../hash.js";

export default class AbstractUserController extends AbstractController {

	login(request, response) {
		var defer = Q.defer();

		passport.authenticate("local", {badRequestMessage: "missing-credentials"}, function (error, user, info) {
			defer.makeNodeResolver()(error || info, user);
		})(request, response);

		return defer.promise
			.catch(error => {
				throw messenger.makeError(error.message, request.user, 401);
			});
	}

	register(request) {

		return this.create(request.body)
			.tap(user => {
				return Q.nbind(request.login, request)(user)
			})
			.tap(() => {
				return this.sendEmailVerification(request);
			});
	}

	forgot(request) {
		var clean = _.pick(request.body, ["email"]);
		return this.findOne(clean)
			.then(messenger.notFound(this, request.user))
			.then(user => {
				let hashController = new HashController();
				return hashController.create({user: user._id})
					.then(hash => {
						let mailController = new MailController();
						return mailController.composeMail("user/remind", {to: user.email}, user, {
							hash: hash
						});
					});
			})
			.thenResolve({
				messages: ["Email was sent"]
			});
	}

	change(request) {
		let hashController = new HashController();
		return hashController.findByIdAndRemove(request.params.hash)
			.then(messenger.notFound(hashController, request.user))
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						user.password = request.body.password;
						user.confirm = request.body.confirm;
						return this.save(user);
					});
			})
			.thenResolve({
				messages: ["Now you can login with your new password"]
			});
	}

	sendEmailVerification(request) {
		let hashController = new HashController();
		return hashController.create({user: request.user._id})
			.then(hash => {
				let mailController = new MailController();
				return mailController.composeMail("user/verify", {to: request.user.email}, request.user, {
					hash: hash
				});
			})
			.thenResolve({
				messages: ["Verification email was sent to " + request.user.email]
			});
	}

	verify(request) {
		let hashController = new HashController();
		return hashController.findByIdAndRemove(request.params.hash)
			.then(hash => {
				return this.findById(hash.user, {lean: false})
					.then(user => {
						user.email_verified = true;
						return this.save(user);
					});
			})
			.thenResolve({
				messages: ["Email is verified"]
			});
	}

	logout(request, response) {
		request.logout();
		request.session.logout = true;
		response.clearCookie();
		response.status(204).send("");
	}
}

