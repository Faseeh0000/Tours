import app from "./index.js";
import dotenv from "dotenv";
import connectDB from ".//connections/dbConnections.js";
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";

dotenv.config({ path: "./config.env" });


(async () => {
 // await connectPostgres();
  connectDB();

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });
})();

