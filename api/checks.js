// api/checks.js — Vercel Serverless Function
// Reads and writes checked state to Vercel KV (Redis)
// GET  /api/checks        → returns { "0": true, "2": true, ... }
// POST /api/checks        → body { index, checked } → saves and returns updated state

import { kv } from "@vercel/kv";

const KEY = "checklist:checked";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const data = (await kv.get(KEY)) || {};
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { index, checked } = req.body;
    if (typeof index !== "number") return res.status(400).json({ error: "index required" });
    const data = (await kv.get(KEY)) || {};
    if (checked) {
      data[index] = true;
    } else {
      delete data[index];
    }
    await kv.set(KEY, data);
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
