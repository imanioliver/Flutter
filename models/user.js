'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    displayname: DataTypes.STRING,
    name: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});

  User.associate = function(models){
    User.hasMany(models.Message,{
        // as: "Messages",
        foreignKey: "userId"
    })



   };

  return User;
};
