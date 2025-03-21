import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.body;

    if (!id) {
        console.error("❌ Missing row ID in request body");
        return res.status(400).json({ message: 'Missing row ID' });
    }

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'multilingual_db',
        });

        console.log(`🔍 Checking if row with ID ${id} exists...`);
        const [rows] = await connection.query(`SELECT * FROM translations WHERE id = ?`, [id]);

        if (rows.length === 0) {
            console.error(`❌ Row ID ${id} not found in database`);
            await connection.end();
            return res.status(404).json({ message: 'Row not found' });
        }

        console.log(`🗑 Deleting row with ID ${id}...`);
        await connection.query(`DELETE FROM translations WHERE id = ?`, [id]);

        console.log(`✅ Successfully deleted row ID ${id}`);
        await connection.end();
        res.status(200).json({ message: 'Row deleted successfully' });

    } catch (error) {
        console.error('❌ MySQL Error:', error);
        res.status(500).json({ message: 'Error deleting row', error: error.message });
    }
}
