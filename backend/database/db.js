export const pool = {
  query: async () => ({ rows: [], rowCount: 0 })
};

export const initDb = async () => {
  console.log("Database-less mode enabled: skipping PostgreSQL database pool and table initialization.");
};
