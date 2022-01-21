import { createClient } from "redis";
import { config } from "../config";
import { logger } from "../util/logger";

const getClient = async () => {
  const client = createClient(config.cache);
  client.on("error", err => logger.error("Redis Client Error", err));
  await client.connect();
  return client;
};

const setCache = async (key: string, value: string, expiry?: number) => {
  try {
    const client = await getClient();
    if (expiry) {
      await client.setEx(key, expiry, value);
    } else {
      await client.set(key, value);
    }
    await client.disconnect();
  } catch (err) {
    logger.error(`Error when setting cache: ${err}`);
  }
};

const getCache = async (key: string) => {
  try {
    const client = await getClient();
    const result = await client.get(key);
    await client.disconnect();
    return result;
  } catch (err) {
    logger.error(`Error when getting cache: ${err}`);
  }
};

const delCache = async (key: string) => {
  try {
    const client = await getClient();
    await client.del(key);
    await client.disconnect();
  } catch (err) {
    logger.error(`Error when deleting cache: ${err}`);
  }
};

export { setCache, getCache, delCache };
