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



import pool from "./db.js";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const [translationRows] = await pool.query("SELECT * FROM translations");
            const [languageRows] = await pool.query("SELECT * FROM first_row_languages");

            let grid = [];
            let firstRowLanguages = [];

            // Populate firstRowLanguages from DB
            languageRows.forEach(({ col_index, language }) => {
                firstRowLanguages[col_index] = language;
            });

            // Populate grid from translations table
            translationRows.forEach(({ id, row_index, col_index, language, value }) => {
                if (!grid[row_index]) grid[row_index] = [];
                grid[row_index][col_index] = { id, language, value };
            });

            res.status(200).json({ grid, firstRowLanguages });
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ error: "Database error" });
        }
    }
}
