#!/usr/bin/env node

import express from "express";
import fetch from "node-fetch";
import { parseArguments } from "./utils/args.js";
import { CacheHandler } from "./utils/cache-handler.js";

const app = express();

(async () => {
  const options = parseArguments() as {
    port?: number;
    origin: string;
    "clear-cache"?: string;
  };

  const cache = new CacheHandler();

  if (Object.keys(options).includes("clear-cache")) {
    await cache.clear();
    return;
  }

  if (!options.origin) {
    console.log(
      "❌Please provide an origin url where all the requests will be directed to."
    );
    return;
  }

  const port = options?.port ?? 3000;
  app.listen(port, () => {
    console.log(
      `✅Caching proxy server is running on port http://localhost:${port}`
    );
  });

  app.use(async (req, res) => {
    let cacheKey = req.url.replace("/", "");

    if (!cacheKey) {
      cacheKey = "index";
    }

    const data = await cache.get(cacheKey);

    if (data) {
      res.set("X-Cache", "HIT");
      res.send(data);
    } else {
      res.set("X-Cache", "MISS");

      const response = await fetch(`${options.origin}/${cacheKey}`);
      let error = false;

      if (response.ok) {
        try {
          const data = await response.json();
          await cache.set(cacheKey, JSON.stringify(data));
          res.send(data);
        } catch (e) {
          error = true;
        }
      } else {
        error = true;
      }

      if (error) {
        const json = {
          message: "Failed to process request",
        };
        cache.set(cacheKey, JSON.stringify(json));

        res.send(json);
      }
    }
  });
})();
