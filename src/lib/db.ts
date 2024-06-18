import Dexie from "dexie";

export const db = new Dexie("Database");
db.version(2).stores({
  shortened_urls: "++id, original, shortened, user_id" // Primary key and indexed props
});

db.open();
