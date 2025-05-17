// scripts/seedGISCategories.ts
import { db } from "../connection";
import { GIScategoriesTable } from "../schemas/index";

async function seedGISCategories() {
  const existing = await db.select().from(GIScategoriesTable);
  if (existing.length === 0) {
    await db.insert(GIScategoriesTable).values([
      { name: "forest", description: "Wooded area with trees" },
      { name: "city center", description: "Urban central zone" },
      { name: "school", description: "Educational institution" },
      { name: "river", description: "Flowing body of water" },
      { name: "sea", description: "Large saltwater body" },
    ]);
    console.log("Seeded GIS categories");
  } else {
    console.log("GIS categories already seeded");
  }
}

seedGISCategories().then(() => process.exit());
