import "dotenv/config";

import * as mongoCollections from "../config/mongoCollections.js";
import { getMongoID } from "../helper.js";

import fs from "fs";

function replaceOid(jsonObject) {
  function processItem(item) {
    if (item && typeof item === "object") {
      for (const key in item) {
        for (const key2 in item[key]) {
          if (key2 === "$oid") {
            item[key] = getMongoID(item[key][key2]);
          } else if (key2 === "$date") {
            item[key] = new Date(item[key][key2]);
          } else if (key2 === "$numberInt") {
            item[key] = parseInt(item[key][key2], 10);
          } else if (key2 === "$numberDecimal") {
            item[key] = parseFloat(item[key][key2]);
          } else if (key2 === "$numberLong") {
            item[key] = parseInt(item[key][key2], 10);
          } else if (key2 === "$numberDouble") {
            item[key] = parseFloat(item[key][key2]);
          } else {
            processItem(item[key]);
          }
        }
      }
    } else if (Array.isArray(item)) {
      item.forEach((arrayItem) => {
        processItem(arrayItem);
      });
    }
  }

  processItem(jsonObject);

  return jsonObject;
}

const importData = async () => {
  try {
    const collections = ["admins", "credits", "houses"];

    const loadJSON = (filePath) => {
      try {
        const jsonData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(jsonData);
      } catch (error) {
        console.error(`Error loading JSON file: ${error}`);
        return null;
      }
    };

    for (const collection of collections) {
      const data = loadJSON(`seed/seeds/${collection}Data.json`);

      if (data) {
        replaceOid(data);

        const dbCollection = await mongoCollections[collection]();
        const db = dbCollection.s.db; // Extract the `db` object

        // Check if the collection exists before dropping it
        const existingCollections = await db.listCollections().toArray();
        if (existingCollections.some((coll) => coll.name === collection)) {
          await dbCollection.drop();
          console.log(`Dropped existing collection: ${collection}`);
        } else {
          console.log(`Collection ${collection} does not exist. Skipping drop.`);
        }

        await dbCollection.deleteMany({}); // Clear any existing documents
        await dbCollection.insertMany(data); // Insert new documents
        console.log(`Inserted ${data.length} documents into ${collection}`);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
};

console.log("hi");
await importData();

