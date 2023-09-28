const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const bcrypt = require("bcryptjs");
const Role = require("./Role");
const ContentCreator = require("./ContentCreator");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // gender: {
    //   type: DataTypes.ENUM("Male", "Female", "Other"),
    //   defaultValue: "Male",
    //   allowNull: true,
    // },
    // mobile_number: {
    //   type: DataTypes.BIGINT,
    //   allowNull: true,
    // },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role_id: {
      type: DataTypes.BIGINT,
      defaultValue: 2,
      references: {
        model: "roles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    status: {
      type: DataTypes.ENUM("Active", "InActive", "Deleted", "Suspended"),
      defaultValue: "Active",
    },
  },
  {
    tableName: 'users',
    hooks: {
      async beforeCreate(user, options) {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      async beforeUpdate(user, options) {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

User.hasOne(ContentCreator, {
  foreignKey: "user_id",
  as: "contentCreator",
});

// User.beforeCreate(async (user, options) => {
//   if (user.changed("password")) {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//   }
// });

User.prototype.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  // console.log("Comparing passwords:");
  // console.log("candidatePassword:", candidatePassword);
  // console.log("this.password:", this.password);
  // console.log("isMatch:", isMatch);

  return isMatch;
};

// async function updateUserRole() {
//   try {
//     const user = await User.findByPk(9);

//     if (!user) {
//       console.log("User not found.");
//       return;
//     }

//     // Update the user's role_id
//     user.role_id = 1;
//     await user.save();

//     console.log("User role updated successfully.");
//   } catch (error) {
//     console.error("Error updating user role:", error);
//   }
// }
// updateUserRole();
console.log("HERE ", User === sequelize.models.User);
module.exports = User;
