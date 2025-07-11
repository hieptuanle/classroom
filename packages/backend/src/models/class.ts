import { DataTypes, Model } from "sequelize";

import { db } from "../db/db.js";

type ClassAttributes = {
  id: string;
  name: string;
  description?: string;
  class_code: string;
  invite_code?: string;
  owner_id: string;
  status: "active" | "archived" | "draft";
  settings: any;
  createdAt?: Date;
  updatedAt?: Date;
};

type ClassCreationAttributes = {
  id?: string;
  name: string;
  owner_id: string;
} & Partial<Omit<ClassAttributes, "id" | "createdAt" | "updatedAt">>;

class ClassModel extends Model<ClassAttributes, ClassCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare class_code: string;
  declare invite_code?: string;
  declare owner_id: string;
  declare status: "active" | "archived" | "draft";
  declare settings: any;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public async generateInviteCode() {
    this.invite_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return this.save();
  }

  public getPublicInfo() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      class_code: this.class_code,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}

ClassModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    class_code: {
      type: DataTypes.STRING(8),
      unique: true,
      allowNull: false,
    },
    invite_code: {
      type: DataTypes.STRING(6),
      unique: true,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "archived", "draft"),
      defaultValue: "active",
      allowNull: false,
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        allow_students_post: false,
        show_grades: true,
        notifications_enabled: true,
      },
    },
  },
  {
    sequelize: db,
    modelName: "Class",
    tableName: "Classes",
    timestamps: true,
    hooks: {
      beforeValidate: (classInstance: ClassModel) => {
        if (!classInstance.getDataValue("class_code")) {
          classInstance.setDataValue("class_code", Math.random().toString(36).substring(2, 10).toUpperCase());
        }
      },
    },
  },
);

export default ClassModel;
