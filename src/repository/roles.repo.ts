import { eq } from "drizzle-orm";
import { db } from "../db";
import { userRoles } from "../db/schema";
import { ROLE_ADMIN, ROLE_GUARD, ROLE_STUDENT } from "../constants/roles";

const defaultRoles = [       // Define default roles,, that is to inserted into the database if they do not exist
  {
    roleId: ROLE_ADMIN,
    roleName: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  },
  {
    roleId: ROLE_STUDENT,
    roleName: "student",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  },
  {
    roleId: ROLE_GUARD,
    roleName: "guard",
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  },
];

export const ensureDefaultRoles = async () => { // the above 3 thing is define for only is set of function to work on it, that is to check if the role exist in the database or not, if not then insert it into the database
  for (const role of defaultRoles) {
    const existing = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.roleId, role.roleId));

    if (existing.length === 0) {
      await db.insert(userRoles).values(role);
    }
  }
};
// it makes sure the userRoles table has the 3 role rows..