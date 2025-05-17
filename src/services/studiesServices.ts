// src/services/study.service.ts
import { db } from "../db/connection";
import { addStudy, updateLocation } from "../validations/study.validation";
import { GISData } from "../validations/GISData.validation";
import {
  studiesTable,
  GISdataTable,
  locationsTable,
} from "../db/schemas/index";
import { eq } from "drizzle-orm";
import { addStudyGISData } from "./GISDataServices";
import { NotFoundError } from "@errors/api";

export const addStudyService = async (studyData: addStudy) => {
  const isDraft = true;
  let locationId = studyData.location_id;

  // Create study draft record
  const [studyResult] = await db.insert(studiesTable).values({
    title: studyData.title,
    study: studyData.study,
    author_id: studyData.author_id,
    status: "byEmployees",
    location_id: locationId,
    draft: isDraft,
  });

  const studyId = studyResult.insertId;

  // Create draft geoData if provided
  if (studyData.geoData) {
    addStudyGISData(studyData.geoData, studyId);
  }

  return {
    message: "Study saved as draft successfully",
    data: {
      studyId,
      isDraft,
    },
    code: 200,
  };
};

export const updateLocationService = async (locationData: updateLocation) => {
  const [existingStudy] = await db
    .select()
    .from(studiesTable)
    .where(eq(studiesTable.id, locationData.study_id));

  if (!existingStudy) {
    throw new NotFoundError("there is no such study in the Draft");
  }

  const [existingLocation] = await db
    .select()
    .from(locationsTable)
    .where(eq(locationsTable.id, locationData.location_id));

  if (!existingLocation) {
    throw new NotFoundError("there is no such location to add to the Draft");
  }

  await db
    .update(studiesTable)
    .set({
      location_id: locationData.location_id,
    })
    .where(eq(studiesTable.id, locationData.study_id));

  const [updatedStudy] = await db
    .select()
    .from(studiesTable)
    .where(eq(studiesTable.id, locationData.study_id));

  return {
    message: "Location successfully updated for the study",
    data: updatedStudy,
    code: 200,
  };
};

export const updateGISService = async (study_id: number, data: GISData[]) => {
  const [existingStudy] = await db
    .select()
    .from(studiesTable)
    .where(eq(studiesTable.id, study_id));

  if (!existingStudy) {
    throw new NotFoundError("there is no such study in the Draft");
  }

  await addStudyGISData(data, study_id);

  return {
    message: "new data is added to the Study draft!",
    data: {
      study: study_id,
      "data added": data,
    },
    code: 200,
  };
};

export const saveStudyService = async (study_id: number) => {
  const MIN_RECOMMENDED_ENTRIES = 3;

  const [study] = await db
    .select()
    .from(studiesTable)
    .where(eq(studiesTable.id, study_id));

  if (!study) {
    throw new Error("Study not found");
  }

  if (!study.location_id) {
    return {
      message: "Cannot publish study - Location data is required",
      code: 400,
      data: null,
    };
  }

  const GISdata = await db
    .select()
    .from(GISdataTable)
    .where(eq(GISdataTable.study_id, study_id));

  if (GISdata.length === 0) {
    return {
      message: "Cannot save study - At least one GIS data entry is required",
      code: 400,
      data: null,
    };
  }

  let warning = null;
  if (GISdata.length < MIN_RECOMMENDED_ENTRIES) {
    warning = `Study published with ${GISdata.length} GIS entries. Recommended minimum is ${MIN_RECOMMENDED_ENTRIES}.`;
  }

  console.log("the length of the array" + GISdata.length);

  const [updatedStudy] = await db
    .update(studiesTable)
    .set({ draft: false })
    .where(eq(studiesTable.id, study_id));

  return {
    message: "Study successfully saved!",
    data: {
      study: updatedStudy,
      gis_entry_count: GISdata.length,
      warning,
    },
    code: warning ? 400 : 200,
  };
};

export const setMinEntriesService = async (num: number) => {
  return {
    message: "set successfully!",
    data: num,
    code: 200,
  };
};

export const showAIPendingService = async () => {
  const study = await db
    .select()
    .from(studiesTable)
    .where(eq(studiesTable.status, "ai_pending"));

  if (study.length == 0) {
    return {
      message: "there are no pending studies!",
      data: null,
      code: 200,
    };
  }

  return {
    message: "the pending studies",
    data: study,
    code: 200,
  };
};
