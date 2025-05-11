// services/study.service.ts
import { db } from "../db/connection";
import { addStudy } from "../validations/study.validation";
import { studiesTable } from "../db/schemas/studies";
import { createLocationService } from "./locationService";
import { eq } from "drizzle-orm";

export const addStudyService = async (studyData: addStudy) => {
  let location_id = studyData.location_id;

  if (!location_id && studyData.location) {
    const newLocation = await createLocationService(studyData.location);
    location_id = newLocation.id;
  }

  await db.insert(studiesTable).values({
    title: studyData.title,
    study: studyData.study,
    author_id: studyData.author_id,
    status: studyData.status,
    location_id,
  });

  return {
    message: "Study was added!",
    data: {
      title: studyData.title,
      author_id: studyData.author_id,
      location_id,
    },
    code: 200,
  };
};

export const showAIPendingService = async () => {
  const study = await db
    .select()
    .from(studiesTable)
    .where(eq(studiesTable.status, "ai_pending"));

  if (study.length == 0){
    return {
        message: "there are no pending studies!",
        data: null,
        code: 200
    }
  }

  return {
    message: "the pending studies",
    data: study,
    code: 200,
  }

};
