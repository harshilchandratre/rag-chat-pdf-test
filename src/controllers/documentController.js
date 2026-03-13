import { unlink, readdir } from "node:fs/promises";
import path from "node:path";
import { indexDocument } from "../rag/pipeline.js";

const DOCS_DIR = "./data/documents";

// POST /documents/upload
// multer already saved the file by the time this runs
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received." });

    // saved file path 
    const uploadedPath = req.file.path;

    // trigger indexing immediately after upload
    await indexDocument(uploadedPath);
    res.json({
      message: "Uploaded successfully.",
      filename: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /documents/clear/:filename
export const clearDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    // Sanitize — prevent path traversal
    const safe = path.basename(filename);
    await unlink(path.join(DOCS_DIR, safe));
    res.json({ message: `${safe} deleted.` });
  } catch (err) {
    if (err.code === "ENOENT")
      return res.status(404).json({ error: "File not found." });
    res.status(500).json({ error: err.message });
  }
};

// GET /documents — list indexed docs so UI can repopulate on refresh
export const listDocuments = async (req, res) => {
  try {
    const files = await readdir(DOCS_DIR);
    res.json({ documents: files.filter((f) => f.endsWith(".pdf")) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
