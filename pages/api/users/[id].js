import newPool from '../../../pool';
import { Client, Pool } from 'pg';

export default async function handler(req, res) {
	const db_credentials = {
		host: process.env.AWS_HOSTNAME,
		port: 5432,
		database: process.env.DB_NAME,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
	};

	const client = new Client(db_credentials);

	const pool = new Pool(db_credentials);

	const poolClient = await pool.connect();

	try {
		if (req.method === 'GET') {
			const userId = req.query.id;
			const sqlQuery = `SELECT * FROM aws_users WHERE id = $1`;
			const queryValues = [userId];

			const result = await poolClient.query(sqlQuery, queryValues);

			res.status(200).json(result.rows);
		}
	} catch (error) {
		console.log(error.message);
	} finally {
		poolClient.release();
	}
}
