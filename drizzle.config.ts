import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schemas/index.ts",
    out: "./migrations",
    dialect: "mysql",
    dbCredentials: {
        host: "localhost" as string ,
        user: "root" as string ,
        password: "crossroads" as string ,  
        database: "smartsyriahorizon" as string ,
        port: 3306,  
        ssl: undefined
    }
});