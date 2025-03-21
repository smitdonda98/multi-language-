// import dbConnect from "@/lib/mongodb";
// import Input from "@/models/Input";

// export default async function handler(req, res) {
//     await dbConnect();

//     if (req.method === "GET") {
//         try {
//             const existingInput = await Input.findOne();

//             if (!existingInput) {
//                 return res.status(200).json({ grid: [], firstRowLanguages: [] });
//             }

//             res.status(200).json(existingInput);
//         } catch (error) {
//             res.status(500).json({ error: "Failed to fetch data" });
//         }
//     } else {
//         res.status(405).json({ error: "Method not allowed" });
//     }
// }



import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'multilingual_db',
        });

        
        const [columnsResult] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'translations' 
            AND TABLE_SCHEMA = 'multilingual_db'
        `);

        const firstRowLanguages = columnsResult
            .map(col => col.COLUMN_NAME)
            .filter(col => col !== 'id' && col !== 'created_at');

        
        const [rows] = await connection.query(`SELECT * FROM translations`);

        let grid;

        if (rows.length === 0) {
            console.log("⚠️ Database is empty. Returning default grid...");
            grid = [[{ id: uuidv4(), language: "English", value: "", translations: {} }]];
        } else {
            // 
            grid = rows.map(row =>
                firstRowLanguages.map(language => ({
                    id: uuidv4(),
                    language,
                    value: row[language] || "",
                    translations: {},
                }))
            );
        }

        await connection.end();

        res.status(200).json({ grid, firstRowLanguages: firstRowLanguages.length > 0 ? firstRowLanguages : ["English"] });
    } catch (error) {
        console.error('❌ Error loading data:', error);
        res.status(500).json({ message: 'Error loading data', error });
    }
}


