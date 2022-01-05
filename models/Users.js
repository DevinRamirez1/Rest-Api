'use strict';

const { Model, DataTypes } = require("sequelize/dist");
const bcrypt = require('bcrypt');
const sequelize = require("sequelize");

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        emailAddress: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
    }, { sequelize });

    return User;
}