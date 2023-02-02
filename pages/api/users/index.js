import { Client } from 'pg';

export default async function handler(req, res) {
	const client = new Client({
		host: process.env.AWS_HOSTNAME,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
	});

	if (req.method === 'GET') {
		// retrieve all users from DB
		try {
			await client.connect();

			const result = await client.query(
				'SELECT * FROM aws_users ORDER BY id'
			);

			res.status(200).json(result.rows);

			client.end();
		} catch (error) {
			console.log(error.message);
		}
	}

	if (req.method === 'POST') {
		const { username, age, bio } = req.body;

		// add user to DB
		try {
			await client.connect();

			const sql =
				'INSERT INTO aws_users (username, age, bio) VALUES ($1, $2, $3)';
			const values = [username, age, bio];

			await client.query(sql, values);

			res
				.status(200)
				.json({ message: `added user '${username}' to the database` });

			client.end();
		} catch (error) {
			console.log(error.message);
		}
	}
}
