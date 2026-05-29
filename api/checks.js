import { put, list } from "@vercel/blob";

const BLOB_FILENAME = "checklist-checked.json";

async function getExistingUrl() {
  const { blobs } = await list();
  const found = blobs.find(b => b.pathname === BLOB_FILENAME);
  return found?.url || null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const url = await getExistingUrl();
    if (!url) return res.status(200).json({});
    const data = await fetch(url + "?t=" + Date.now()).then(r => r.json());
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { index, checked } = req.body;
    if (typeof index !== "number") return res.status(400).json({ error: "index required" });

    let data = {};
    const url = await getExistingUrl();
    if (url) {
      try { data = await fetch(url + "?t=" + Date.now()).then(r => r.json()); } catch {}
    }

    if (checked) data[index] = true; else delete data[index];

    await put(BLOB_FILENAME, JSON.stringify(data), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}