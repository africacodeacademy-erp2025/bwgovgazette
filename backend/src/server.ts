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

import express from "express";

const app = express();

function setupExpress() {
  app.route("/gazette/upload").post(uploadPDF);
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
