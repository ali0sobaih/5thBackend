import { db } from "../db/connection";
import { usersTable, rolesUsersTable, rolesTable } from "../db/schemas/index";
import { and, eq, or, like, sql } from "drizzle-orm";

const getEmployeeBaseQuery = () =>
  db
    .select({
      id: usersTable.id,
      first_name: usersTable.first_name,
      last_name: usersTable.last_name,
      username: usersTable.username,
    })
    .from(usersTable)
    .innerJoin(rolesUsersTable, eq(rolesUsersTable.users_id, usersTable.id))
    .innerJoin(rolesTable, eq(rolesUsersTable.role_id, rolesTable.id));

export const getEmployeesService = async () => {
  const results = await getEmployeeBaseQuery()
    .where(eq(rolesTable.name, "employee"))
    .execute();

  if (results.length === 0) {
    return {
      message: "No employees found",
      data: null,
      code: 200,
    };
  }

  return {
    message: "Employees retrieved successfully",
    data: results,
    code: 200,
  };
};

export const searchForEmpService = async (searchParams: {
  searchTerm: string;
}) => {
  const { searchTerm } = searchParams;
  const searchPattern = `${searchTerm}%`; 

  console.log(searchTerm); 
  console.log(searchPattern);

  const results = await getEmployeeBaseQuery()
    .where(
      and(
        eq(rolesTable.name, "employee"),
        or(
          like(usersTable.first_name, `${searchTerm}%`),
          like(usersTable.last_name, `${searchTerm}%`),
          like(usersTable.username, `${searchTerm}%`),
          sql`CONCAT(${usersTable.first_name}, ' ', ${
            usersTable.last_name
          }) LIKE ${`${searchTerm}%`}`
        )
      )
    )
    .execute();

  return {
    message:
      results.length > 0 ? "Search results found" : "No matching employees",
    data: results,
    code: 200,
  };
};
