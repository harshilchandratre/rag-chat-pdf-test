import express from "express";
import multer from "multer";
import path from "node:path";
import {
  uploadDocument,
  clearDocument,
  listDocuments,
} from "../controllers/documentController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./data/documents"),
  filename: (req, file, cb) => {
    // preserve original name but strip unsafe characters
    const safe = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf")
      return cb(new Error("Only PDF files are allowed."));
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB cap
});

const router = express.Router();

router.post("/upload", upload.single("pdf"), uploadDocument);
router.delete("/clear/:filename", clearDocument);
router.get("/", listDocuments);

export default router;