import Assignment from "./assignment.js";
import ClassEnrollment from "./class-enrollment.js";
import Class from "./class.js";
import Submission from "./submission.js";
import User from "./user.js";

// Define associations
// User associations
User.hasMany(Class, { foreignKey: "owner_id", as: "ownedClasses" });
User.hasMany(Assignment, { foreignKey: "created_by", as: "createdAssignments" });
User.hasMany(ClassEnrollment, { foreignKey: "user_id", as: "enrollments" });
User.hasMany(Submission, { foreignKey: "student_id", as: "submissions" });
User.hasMany(Submission, { foreignKey: "graded_by", as: "gradedSubmissions" });

// Class associations
Class.belongsTo(User, { foreignKey: "owner_id", as: "owner" });
Class.hasMany(Assignment, { foreignKey: "class_id", as: "assignments" });
Class.hasMany(ClassEnrollment, { foreignKey: "class_id", as: "enrollments" });

// Assignment associations
Assignment.belongsTo(User, { foreignKey: "created_by", as: "creator" });
Assignment.belongsTo(Class, { foreignKey: "class_id", as: "class" });
Assignment.hasMany(Submission, { foreignKey: "assignment_id", as: "submissions" });

// ClassEnrollment associations
ClassEnrollment.belongsTo(User, { foreignKey: "user_id", as: "user" });
ClassEnrollment.belongsTo(Class, { foreignKey: "class_id", as: "class" });

// Submission associations
Submission.belongsTo(Assignment, { foreignKey: "assignment_id", as: "assignment" });
Submission.belongsTo(User, { foreignKey: "student_id", as: "student" });
Submission.belongsTo(User, { foreignKey: "graded_by", as: "grader" });

export { Assignment, Class, ClassEnrollment, Submission, User };
export default {
  User,
  Class,
  Assignment,
  ClassEnrollment,
  Submission,
};
