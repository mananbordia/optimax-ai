import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

redisClient.on("connect", () => console.log("Redis connected"));

(async () => {
  if (!redisClient.isOpen) await redisClient.connect();
})();

export default redisClient;
