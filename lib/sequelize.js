import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config(); // Load environment variables

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
    }
);

export default sequelize;
