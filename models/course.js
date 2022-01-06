'use strict';

const { Model, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const sequelize = require("sequelize");

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
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
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
               fieldName: 'userId',
               allowNull: false, 
            }
        })
    }

    return Course;
};