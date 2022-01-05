'use strict';

const { Model, DataTypes } = require("sequelize/dist");
const bcrypt = require('bcrypt');
const sequelize = require("sequelize");

module.exports = (sequelize) => {
    class Courses extends Model {}
    User.init({
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        estimatedTime: {
            type: DataTypes.STRING,
        },
        materialsNeeded: {
            type: DataTypes.STRING,
        },
        userId: {

        },
    }, { sequelize });

    return Courses;
};