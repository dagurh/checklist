import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  if (!redis.isOpen) await redis.connect();

  if (req.method === "GET") {
    const data = await redis.get("checklist");
    return res.status(200).json(data ? JSON.parse(data) : {});
  }

  if (req.method === "POST") {
    const { state } = req.body;
    await redis.set("checklist", JSON.stringify(state));
    return res.status(200).json(state);
  }

  return res.status(405).json({ error: "Method not allowed" });
}