'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

//Middleware to authenticate the request
exports.authenticateUser = async( req, res, next) => {
    let message;

    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name}});
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) {
                console.log(`Authentication was successful for email address: ${user.firstName}`);
                req.currentUser = user;
            } else {
                message = `Authentication failed for email address: ${user.firstName}`;
            }
        } else {
            message = `User not found with following email address: ${user.name}`;
        }
    } else {
        message = `Auth header not found`;
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
    next();
    }
};