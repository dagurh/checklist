import { put, del, list } from "@vercel/blob";

const FILENAME = "checklist-checked.json";
const BLOB_BASE = "https://store_Xd2fQuaYj5JSJdMu.public.blob.vercel-storage.com/";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();

  async function readData() {
    try {
      const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
      const found = blobs.find(b => b.pathname === FILENAME);
      if (!found) return {};
      const r = await fetch(found.url + "?t=" + Date.now());
      if (!r.ok) return {};
      return await r.json();
    } catch { return {}; }
  }

  if (req.method === "GET") {
    return res.status(200).json(await readData());
  }

if (req.method === "POST") {
  const { state } = req.body;
  if (!state || typeof state !== "object") return res.status(400).json({ error: "state required" });

  const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
  const old = blobs.filter(b => b.pathname === FILENAME);
  if (old.length) await del(old.map(b => b.url), { token: process.env.BLOB_READ_WRITE_TOKEN });

  await put(FILENAME, JSON.stringify(state), {
    access: "public",
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return res.status(200).json(state);
}

  return res.status(405).json({ error: "Method not allowed" });
}