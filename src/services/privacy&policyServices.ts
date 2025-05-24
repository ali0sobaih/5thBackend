import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { privacyAndPolicyTable } from "../db/schemas";
import { pnp } from "../validations/pnp.validation";

export const addPnPService = async (addPnPData: pnp) => {
  await db.delete(privacyAndPolicyTable);

  for (const PnPitem of addPnPData) {
    await db
      .insert(privacyAndPolicyTable)
      .values({ heading: PnPitem.heading, content: PnPitem.content });
  }

  return {
    message: "new privacy and policy terms were added successfully!",
    data: null,
    code: 200
  };
};

export const showPnPService = async () => {
  const data = await db.select().from(privacyAndPolicyTable);

  if (data.length === 0) {
    return {
      message: "There are no terms now!",
      data: null,
      code: 200,
    };
  }

  return {
    message: "Privacy and Policy terms!",
    data: data, 
    code: 200,
  };
};
