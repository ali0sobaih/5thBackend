import { db } from '../connection';
import { rolesTable } from '../schemas/roles';

async function seedRoles() {
  const existing = await db.select().from(rolesTable);
  if (existing.length === 0) {
    await db.insert(rolesTable).values([
      { name: 'employee' },
      { name: 'expert' },
      { name: 'admin' },
      { name: 'investor' },
    ]);
    console.log('Seeded roles');
  } else {
    console.log('Roles already seeded');
  }
}

seedRoles().then(() => process.exit());
