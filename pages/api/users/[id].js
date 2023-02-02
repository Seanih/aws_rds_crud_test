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

			const queryResult = await client.query(sqlQuery, queryValues);

			res.status(200).json(queryResult.rows);

			client.end();
		} catch (error) {
			console.log(error.message);
		}
	}

	if (req.method === 'PATCH') {
		// update specific user data in DB
		try {
			const queryValues = [userId];

			//* <--------- Query with multiple params --------->
			// 1) start query string
			let sqlQuery = `UPDATE aws_users SET `;

			// 2) dynamically retrieve key value pairs from req.body
			let i = 2;
			Object.entries(req.body).forEach(([key, value]) => {
				sqlQuery += `${key} = $${i}, `;
				queryValues.push(value);
				i++;
			});

			// 3) remove ", " from end of string & complete the query
			sqlQuery = sqlQuery.slice(0, -2);
			sqlQuery += ` WHERE id = $1`;
			//* <--------- Query with multiple params --------->

			await client.connect();
			await client.query(sqlQuery, queryValues);

			res.status(200).json('you made the update!');
			client.end();
		} catch (error) {
			console.log(error.message);
		}
	}

	if (req.method === 'DELETE') {
		// delete specific user from DB
		try {
			const queryValues = [userId];
			const sqlQuery = 'DELETE FROM aws_users WHERE id = $1';

			await client.connect();
			await client.query(sqlQuery, queryValues);

			res.status(200).json(`you deleted the user`);
			client.end();
		} catch (error) {
			console.log(error.message);
		}
	}
}
