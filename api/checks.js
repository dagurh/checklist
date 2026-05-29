const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command) {
  const r = await fetch(REDIS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  return (await r.json()).result;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const data = await redis(["GET", "checklist"]);
    return res.status(200).json(data ? JSON.parse(data) : {});
  }

  if (req.method === "POST") {
    const { state } = req.body;
    await redis(["SET", "checklist", JSON.stringify(state)]);
    return res.status(200).json(state);
  }
}