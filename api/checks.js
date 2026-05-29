import { put } from "@vercel/blob";

const BLOB_URL = "https://store_Xd2fQuaYj5JSJdMu.public.blob.vercel-storage.com/checklist-checked.json";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();

  async function readData() {
    try {
      const r = await fetch(BLOB_URL + "?t=" + Date.now());
      if (!r.ok) return {};
      return await r.json();
    } catch { return {}; }
  }

  if (req.method === "GET") {
    return res.status(200).json(await readData());
  }

  if (req.method === "POST") {
    const { index, checked } = req.body;
    if (typeof index !== "number") return res.status(400).json({ error: "index required" });

    const data = await readData();
    if (checked) data[index] = true; else delete data[index];

    await put("checklist-checked.json", JSON.stringify(data), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}