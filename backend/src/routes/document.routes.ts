import { Router } from "express";
import {
  uploadDocument,
  classifyDocument,
  generateTags,
  listDocuments,
  getDocument,
  deleteDocument,
  getTaxonomies,
  getTaxonomyNodes,
} from "../controllers/document.controller";
import DocumentService from "../services/document-processing.service";

const router = Router();

// Document upload and processing
router.route("/upload").post(DocumentService.upload.single("file"), uploadDocument);

// Classification management
router.route("/:id/classify").post(classifyDocument);

// Tag generation
router.route("/:id/tags").post(generateTags);

// Document retrieval
router.route("/").get(listDocuments);
router.route("/:id").get(getDocument);

// Document deletion
router.route("/:id").delete(deleteDocument);

// Taxonomy helpers (for admin UI dropdowns)
router.route("/taxonomies").get(getTaxonomies);
router.route("/taxonomies/:id/nodes").get(getTaxonomyNodes);

export default router;
