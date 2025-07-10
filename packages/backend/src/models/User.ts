import { DataTypes } from "sequelize";
import { db } from "../db/db.js";

const User = db.define(
	"User",
	{
		// Model attributes are defined here
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		full_name: {
			type: DataTypes.STRING,
		},
		avatar: {
			type: DataTypes.STRING,
		},
		role: {
			type: DataTypes.ENUM("admin", "teacher", "student"),
			defaultValue: "student",
		},
	},
	{
		tableName: 'Users',
		timestamps: true,
	}
);

export default User;
