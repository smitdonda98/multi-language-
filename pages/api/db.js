import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root", // Change this if your MySQL user is different
    password: "root", // Change to your MySQL password
    database: "multilingual_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
