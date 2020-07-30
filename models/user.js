// We require bcryptjs so that we can encrypt passwords before we store them in the database
var bcrypt = require("bcryptjs");
// We create our user model and export it
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The user model has a column of email. It is a unique, valid email that cannoy be null
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password column is a string that cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  // We create a method for our User object. This will check if the argument password matches the encrypted password. It is used in the passport authentication
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // This hook is automaticaly called before we create our row in the users table. It ensures that the password which is stored in the database is encrypted
  User.addHook("beforeCreate", function(user) {
    // This sets the password equal to a hashed version of the original entered password
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
