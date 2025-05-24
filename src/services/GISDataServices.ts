// src/services/geoDataService.ts
import { db } from "../db/connection";
import {
  GISData,
  addGISCategory,
  AddGeoFile,
  GISDataSchema,
} from "../validations/GISData.validation";
import {
  quantitiesTable,
  GISdataTable,
  GIScategoriesTable,
  locationsTable,
} from "../db/schemas/index";
import { ConflictError } from "@errors/api";
import { parseFile } from "../utils/geoFileParse/parseFile";
import { eq, isNull, sql } from "drizzle-orm";

export const addStudyGISData = async (geoData: GISData[], studyId: number) => {
  for (const geoItem of geoData) {
    let quantityId: number | null = null;

    if (geoItem.quantity) {
      const result = await db.insert(quantitiesTable).values({
        string_val: geoItem.quantity.string_val,
        number_val: geoItem.quantity.number_val,
      });
      quantityId = result[0].insertId;
    }

    await db.insert(GISdataTable).values({
      category_id: geoItem.category_id,
      condition: geoItem.condition,
      accessibility: geoItem.accessibility,
      location_id: geoItem.location_id,
      study_id: studyId as number,
      quantity_id: quantityId,
      author_id: geoItem.author_id,
      note: geoItem.note,
    });
  }
};

export const addCategoryService = async (data: addGISCategory) => {
  const existing = await db.select().from(GIScategoriesTable);
  if (existing.length === 0) {
    throw new ConflictError("the category already exists!");
  }

  await db.insert(GIScategoriesTable).values(data);

  return {
    message: "added!",
    data: null,
    code: 200,
  };
};

export const addGeoDataService = async (data: GISData) => {
  let quantityId: number | null = null;

  if (data.quantity) {
    const result = await db.insert(quantitiesTable).values({
      string_val: data.quantity.string_val,
      number_val: data.quantity.number_val,
    });
    quantityId = result[0].insertId;
  }

  await db.insert(GISdataTable).values({
    category_id: data.category_id,
    condition: data.condition,
    accessibility: data.accessibility,
    location_id: data.location_id,
    study_id: null,
    quantity_id: quantityId,
    author_id: data.author_id,
    note: data.note,
  });

  return {
    message: "the Geo-data is inserted successfully",
    data: {
      category_id: data.category_id,
      condition: data.condition,
      accessibility: data.accessibility,
      location_id: data.location_id,
      study_id: "the data does not belong to any study!",
      quantity_id: quantityId,
      author_id: data.author_id,
      note: data.note,
    },
    code: 200,
  };
};

export const addGeoFileService = async (data: AddGeoFile) => {
  const parsedData = await parseFile(
    data.file,
    data.body.author_id,
    data.body.note
  );

  const validatedData = parsedData.map((item) => GISDataSchema.parse(item));

  await db.insert(GISdataTable).values(validatedData);

  return {
    success: true,
    message: "File processed successfully",
    data: {
      recordsProcessed: validatedData.length,
      firstEntry: validatedData[0],
    },
    code: 200,
  };
};

export const getGeoTableService = async (page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;

  const data = await db
    .select({
      id: GISdataTable.id,
      condition: GISdataTable.condition,
      accessibility: GISdataTable.accessibility,
      location: {
        id: locationsTable.id,
        name: locationsTable.name,
        center_lat: locationsTable.center_lat,
        center_long: locationsTable.center_long,
        area: locationsTable.area,
      },
      category: {
        id: GIScategoriesTable.id,
        name: GIScategoriesTable.name,
      },
    })
    .from(GISdataTable)
    .leftJoin(locationsTable, eq(GISdataTable.location_id, locationsTable.id))
    .leftJoin(
      GIScategoriesTable,
      eq(GISdataTable.category_id, GIScategoriesTable.id)
    )
    .where(isNull(GISdataTable.study_id))
    .limit(pageSize)
    .offset(offset)
    .execute();

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(GISdataTable)
    .where(isNull(GISdataTable.study_id))
    .execute();

  return {
    message: "Geo data table with pagination",
    data: {
      items: data,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        // TODO: check if you need the below values in your code base.
        //! front-end devs can compute these values
        hasNextPage: page * pageSize < count,
        hasPreviousPage: page > 1,
      },
    },
    code: 200,
  };
};

// TODO: make a fetching data based on importance for maps
// ? first load the locations with the names
// ? then some details will be shown on a click with an API (the author data and the quantity id)
// ! the author will be shown on the dashboard but not the user's interface so may be different APIs (maybe the importance of the other data will differ also)

export const getGeoMapService = async () => {
  const data = await db
    .select({
      id: GISdataTable.id,
      condition: GISdataTable.condition,
      accessibility: GISdataTable.accessibility,
      location: {
        id: locationsTable.id,
        name: locationsTable.name,
        center_lat: locationsTable.center_lat,
        center_long: locationsTable.center_long,
        area: locationsTable.area,
      },
      category: {
        id: GIScategoriesTable.id,
        name: GIScategoriesTable.name,
      },
    })
    .from(GISdataTable)
    .leftJoin(locationsTable, eq(GISdataTable.location_id, locationsTable.id))
    .leftJoin(
      GIScategoriesTable,
      eq(GISdataTable.category_id, GIScategoriesTable.id)
    )
    .where(isNull(GISdataTable.study_id));

  return {
    message: data.length > 0 ? "Geo data found" : "No data at the moment",
    data: data,
    code: 200,
  };
};
