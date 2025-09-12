import * as dotenv from "dotenv";

let result = dotenv.config({ path: ".env.local" });
if (result.error) {
  console.warn(".env.local not found, falling back to .env");
  result = dotenv.config();
}

if (result.error) {
  console.error(
    `Error loading environment file: ${result.error} — aborting server startup.`
  );
  process.exit(1);
}

import { isInteger } from "./utils/utilities";
import { uploadPDF } from "./routes/upload-pdf";
import { searchGazettes } from "./routes/search";

import express from "express";
import cors from "cors";

const app = express();

function setupExpress() {
  app.use(cors());
  // Parse JSON request bodies so routes can safely destructure req.body
  app.use(express.json());
  // Support URL-encoded bodies (optional, useful for form posts)
  app.use(express.urlencoded({ extended: true }));

  app.route("/gazette/upload").post(uploadPDF);
  app.route("/gazette/search").post(searchGazettes);
}

function startServer() {
  let port: number;
  const portArg = process.env.PORT || process.argv[2];

  if (typeof portArg === "string" && isInteger(portArg)) {
    port = parseInt(portArg);

    if (!port) {
      port = 9000;
    }

    app.listen(port, () => {
      console.info(
        `HTTP Rest Api Server is now running at http:localhost:${port}`
      );
    });
  }
}

setupExpress();
startServer();
