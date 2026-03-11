import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export const loader = async (filePath) => {
  const buffer = await readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const text = result.text ?? "";
    return text.match(/(.|[\r\n]){1,500}/g) ?? [];
  } finally {
    await parser.destroy();
  }
};
