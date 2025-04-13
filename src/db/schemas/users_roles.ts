import { mysqlTable, int, varchar, boolean } from 'drizzle-orm/mysql-core';
import { usersTable } from './users';
import { rolesTable } from './roles';

export const rolesUsersTable = mysqlTable('roles_users',{
    id: int('id').primaryKey().autoincrement(),
    users_id: int('user_id')
    .notNull()
    .references(() => usersTable.id),
    role_id: int('role_id')
    .notNull()
    .references(() => rolesTable.id),
});