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

// Legacy gazette routes (backward compatibility)

import { searchGazettes } from "./routes/search";


// New document controller routes
import {
  uploadDocument,
  classifyDocument,
  generateTags,
  deleteDocument,
 // getTaxonomies,
  //getTaxonomyNodes,
  listDocuments as listDocumentsNew,
  getDocument as getDocumentNew,
} from "./controllers/document.controller";
import DocumentService from "./services/document-processing.service";

import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

function setupExpress(): void {
  app.use(cors());
  // Parse JSON request bodies so routes can safely destructure req.body
  app.use(express.json());
  // Support URL-encoded bodies (optional, useful for form posts)
  app.use(express.urlencoded({ extended: true }));

  // ============================================================
  // LEGACY ROUTES (Backward Compatibility)
  // ============================================================
   app.route("/gazette/search").post(searchGazettes);
 

  // ============================================================
  // NEW DOCUMENT API ROUTES
  // ============================================================

  // Upload document (with text extraction)
  app
    .route("/api/documents/upload")
    .post(DocumentService.upload.single("file"), uploadDocument);

  // Classification management
  app.route("/api/documents/:id/classify").post(classifyDocument);

  // Tag generation (LLM-based)
  app.route("/api/documents/:id/tags").post(generateTags);

  // Document retrieval and deletion
  app.route("/api/documents").get(listDocumentsNew);
  app.route("/api/documents/:id").get(getDocumentNew).delete(deleteDocument);

  // Taxonomy helpers (for admin UI)
  //app.route("/api/documents/taxonomies").get(getTaxonomies);
  //app.route("/api/documents/taxonomies/:id/nodes").get(getTaxonomyNodes);

  // Health check endpoint
  app.route("/api/health").get((_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });
}

function startServer(): void {
  let port: number;
  const portArg = process.env.PORT || process.argv[2];

  if (typeof portArg === "string" && isInteger(portArg)) {
    port = parseInt(portArg, 10);

    if (!port) {
      port = 9000;
    }

    app.listen(port, () => {
      console.info(
        `HTTP Rest API Server is now running at http://localhost:${port}`
      );
      console.info(`\nAvailable endpoints:`);
      console.info(`  Legacy:`);
      console.info(`    POST   /gazette/upload`);
      console.info(`    POST   /gazette/search`);
      console.info(`    GET    /gazette/docs`);
      console.info(`    GET    /gazette/docs/:id`);
      console.info(`\n  New API:`);
      console.info(`    POST   /api/documents/upload`);
      console.info(`    POST   /api/documents/:id/classify`);
      console.info(`    POST   /api/documents/:id/tags`);
      console.info(`    GET    /api/documents`);
      console.info(`    GET    /api/documents/:id`);
      console.info(`    DELETE /api/documents/:id`);
      console.info(`    GET    /api/documents/taxonomies`);
      console.info(`    GET    /api/documents/taxonomies/:id/nodes`);
      console.info(`    GET    /api/health\n`);
    });
  } else {
    console.error("Invalid PORT configuration. Using default port 9000.");
    app.listen(9000, () => {
      console.info("HTTP Rest API Server is now running at http://localhost:9000");
    });
  }
}

setupExpress();
startServer();