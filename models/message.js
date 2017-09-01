// 'use strict';
// module.exports = function(sequelize, DataTypes) {
//   var Message = sequelize.define('Message', {
//     text: DataTypes.STRING(140)
// }, {});
//
//  Message.associate = function(models){
//     //  Message.belongsTo(models.User, {
//     //      foreignKey: 'userId', //if message belongs to user, the foreign key would be on message
//     //     //  otherKey: 'userId',
//     //     //  through: 'likes'
//     //  })
//
//     Message.belongsToMany(models.User, {
//         foreignKey: 'messageId',
//         otherKey: 'userId',
//         through: 'likes'
//     })
//  };
//
//
//
//   return Message;
// };

//sequelize migration:create --name create_relationship_between_book_author


'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    text: DataTypes.STRING(140)
    }, {});

    Message.associate = function(models){
         Message.belongsTo(models.User, {
             as: 'user',
             foreignKey: 'userId' //if message belongs to user, the foreign
            //  otherKey: 'userId',

        });

        Message.hasMany(models.Like, {
            as: 'likes',
            foreignKey: 'messageId',
        });
     };

  return Message;
};
