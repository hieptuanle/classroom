// import bcrypt from "bcryptjs";
// import { DataTypes, Model } from "sequelize";

// import { db } from "../../db/db.js";

// type UserAttributes = {
//   id: string;
//   email: string;
//   username: string;
//   password: string;
//   full_name: string;
//   avatar_url?: string;
//   role: "admin" | "teacher" | "student";
//   is_active: boolean;
//   last_login?: Date;
//   profile: any;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// type UserCreationAttributes = {
//   id?: string;
//   email: string;
//   username: string;
//   password: string;
//   full_name: string;
// } & Partial<Omit<UserAttributes, "id" | "createdAt" | "updatedAt">>;

// class UserModel extends Model<UserAttributes, UserCreationAttributes> {
//   declare id: string;
//   declare email: string;
//   declare username: string;
//   declare password: string;
//   declare full_name: string;
//   declare avatar_url?: string;
//   declare role: "admin" | "teacher" | "student";
//   declare is_active: boolean;
//   declare last_login?: Date;
//   declare profile: any;
//   declare readonly createdAt: Date;
//   declare readonly updatedAt: Date;

//   public async comparePassword(candidatePassword: string): Promise<boolean> {
//     return bcrypt.compare(candidatePassword, this.getDataValue("password"));
//   }

//   public getPublicProfile() {
//     return {
//       id: this.id,
//       email: this.email,
//       username: this.username,
//       full_name: this.full_name,
//       avatar_url: this.avatar_url,
//       role: this.role,
//       profile: this.profile,
//       createdAt: this.createdAt,
//       updatedAt: this.updatedAt,
//     };
//   }
// }

// UserModel.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true,
//       },
//     },
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         len: [3, 50],
//         isAlphanumeric: true,
//       },
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: [6, 100],
//       },
//     },
//     full_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: [1, 100],
//       },
//     },
//     avatar_url: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       validate: {
//         isUrl: true,
//       },
//     },
//     role: {
//       type: DataTypes.ENUM("admin", "teacher", "student"),
//       defaultValue: "student",
//       allowNull: false,
//     },
//     is_active: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//       allowNull: false,
//     },
//     last_login: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     profile: {
//       type: DataTypes.JSONB,
//       defaultValue: {},
//     },
//   },
//   {
//     sequelize: db,
//     modelName: "User",
//     tableName: "Users",
//     timestamps: true,
//     hooks: {
//       beforeCreate: async (user: UserModel) => {
//         if (user.getDataValue("password")) {
//           user.setDataValue("password", await bcrypt.hash(user.getDataValue("password"), 10));
//         }
//       },
//       beforeUpdate: async (user: UserModel) => {
//         if (user.changed("password")) {
//           user.setDataValue("password", await bcrypt.hash(user.getDataValue("password"), 10));
//         }
//       },
//     },
//   },
// );

// export default UserModel;
