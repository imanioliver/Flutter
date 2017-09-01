'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER
  }, {});

  Like.associate = function(models){
       Like.belongsTo(models.User, {
           as: 'user',
           foreignKey: 'userId'
       });

      Like.belongsTo(models.Message, {
          as: 'message',
          foreignKey: 'messageId',
      });
   };

  return Like;
};
