import { promises as fs } from "fs";
import path from "path";

const CACHE_DIR = path.resolve(".cache");

(async () => {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (e: any) {
    console.log("❌Failed to initialize cache directory. ", e.message);
  }
})();

export class CacheHandler {
  cachedDir: string;

  constructor() {
    this.cachedDir = CACHE_DIR;
  }

  getFilePath(key: string) {
    return path.join(this.cachedDir, key) + ".json";
  }

  async set(key: string, data: string) {
    try {
      const path = this.getFilePath(key);

      await fs.writeFile(path, data);
    } catch (e: any) {
      console.log("❌Failed to set cache. ", e.message);
    }
  }

  async get(key: string) {
    try {
      const path = this.getFilePath(key);

      const file = await fs.readFile(path);
      const jsonString = file.toString("utf-8");

      const json = await JSON.parse(jsonString);
      return json;
    } catch (e: any) {
      console.log("❌Failed to get cache. ", e.message);
      return null;
    }
  }

  async clear() {
    try {
      await fs.rm(this.cachedDir, { recursive: true, force: true });
      console.log("✅Cache cleared.");
    } catch (e: any) {
      console.log("❌Failed to clear cache. ", e.message);
    }
  }
}
