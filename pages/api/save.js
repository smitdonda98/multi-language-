// import dbConnect from "@/lib/mongodb";
// import Input from "@/models/Input";

// export default async function handler(req, res) {
//     await dbConnect();

//     if (req.method === "POST") {
//         try {
//             const { grid, firstRowLanguages } = req.body;

//             const existingInput = await Input.findOne();

//             if (existingInput) {

//                 existingInput.grid = grid;
//                 existingInput.firstRowLanguages = firstRowLanguages;
//                 await existingInput.save();
//             } else {

//                 const newInput = new Input({ grid, firstRowLanguages });
//                 await newInput.save();
//             }

//             res.status(200).json({ message: "Data updated successfully!" });
//         } catch (error) {
//             res.status(500).json({ error: "Failed to save data", details: error.message });
//         }
//     } else {
//         res.status(405).json({ error: "Method not allowed" });
//     }
// }


import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { grid, firstRowLanguages } = req.body;

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'multilingual_db',
        });

        // ✅ Ensure table exists with an id column
        await connection.query(`
            CREATE TABLE IF NOT EXISTS translations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // ✅ Get existing columns
        const [columnsResult] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'translations' 
            AND TABLE_SCHEMA = 'multilingual_db'
        `);

        const existingColumns = columnsResult
            .map(col => col.COLUMN_NAME)
            .filter(col => col !== 'id' && col !== 'created_at');

        // ✅ Add missing language columns
        for (const language of firstRowLanguages) {
            if (!existingColumns.includes(language)) {
                await connection.query(`ALTER TABLE translations ADD COLUMN \`${language}\` VARCHAR(255)`);
                console.log(`✅ Added column: ${language}`);
            }
        }

        // ✅ Remove deleted languages (columns)
        for (const column of existingColumns) {
            if (!firstRowLanguages.includes(column)) {
                await connection.query(`ALTER TABLE translations DROP COLUMN \`${column}\``);
                console.log(`❌ Dropped column: ${column}`);
            }
        }

        // ✅ Insert or update each row
        for (const [index, row] of grid.entries()) {
            // Assuming row is an array of objects with {language, value}
            const rowData = {};
            row.forEach(field => {
                rowData[field.language] = field.value;
            });

            const languages = Object.keys(rowData);
            const values = Object.values(rowData).map(val => `'${val.replace(/'/g, "''")}'`);
            const updates = languages.map(lang =>
                `\`${lang}\` = '${rowData[lang].replace(/'/g, "''")}'`
            ).join(', ');

            // If your grid data includes a unique rowId, use that instead of index + 1
            const rowId = index + 1; // Simple approach using index as ID
            // If you have a rowId in your data, replace with: const rowId = row[0].rowId;

            const upsertQuery = `
                INSERT INTO translations (id, ${languages.map(lang => `\`${lang}\``).join(', ')}) 
                VALUES (${rowId}, ${values.join(', ')}) 
                ON DUPLICATE KEY UPDATE ${updates}
            `;
            await connection.query(upsertQuery);
            console.log(`✅ Processed row ${rowId}`);
        }

        await connection.end();
        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).json({ message: 'Error saving data', error });
    }
}







