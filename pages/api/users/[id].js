import { Client } from 'pg';

export default async function handler(req, res) {
	const client = new Client({
		host: process.env.AWS_HOSTNAME,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
	});

	const userId = req.query.id;

	if (req.method === 'GET') {
		// retrieve specific user from DB
		try {
			const sqlQuery = `SELECT * FROM aws_users WHERE id = $1`;
			const queryValues = [userId];

			await client.connect();

			const result = await client.query(sqlQuery, queryValues);

			res.status(200).json(result.rows);

			client.end();
		} catch (error) {
			console.log(error.message);
		}
	}

	if (req.method === 'PATCH') {
		// update user data in DB
		try {
			const queryValues = [userId];
			let sqlQuery = `UPDATE aws_users SET `;

			// --------------------------->
			// dynamically retrieve columns and values to PATCH
			let i = 2;
			Object.entries(req.body).forEach(([key, value]) => {
				sqlQuery += `${key} = $${i}, `;
				queryValues.push(value);
				i++;
			});
			// then complete the query string
			sqlQuery = sqlQuery.slice(0, -2);
			sqlQuery += ` WHERE id = $1`;
			// <---------------------------

			await client.connect();
			await client.query(sqlQuery, queryValues);

			res.status(200).json('you made the update!');
			client.end();
		} catch (error) {}
	}
}
