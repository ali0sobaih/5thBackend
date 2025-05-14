// src/services/study.service.ts
import { db } from "../db/connection";
import { addStudy } from "../validations/study.validation";
import { location } from "../validations/location.validation";
import { GISData } from "../validations/GISData.validation";
import { studiesTable, locationsTable } from "../db/schemas/index";
import { createLocationService } from "./locationService";
import { eq } from "drizzle-orm";
import { addStudyGISData } from "./geoDataService";

export const addStudyService = async (studyData: addStudy) => {
  const isDraft = true;
  let locationId = studyData.location_id;

  // Create study draft record
  const [studyResult] = await db.insert(studiesTable).values({
    title: studyData.title,
    study: studyData.study,
    author_id: studyData.author_id,
    status: studyData.status,
    location_id: locationId,
    draft: isDraft,
  });

  const studyId = studyResult.insertId;

  // Create draft geoData if provided
  if(studyData.geoData){
    addStudyGISData(studyData.geoData, studyId, studyData.author_id);
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

type saveDraft = {
  study_id: number;
};

export const saveStudyService = async() => {

} 

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
