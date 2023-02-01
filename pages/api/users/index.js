import { Client } from 'pg';

export default async function handler(req, res) {
	const client = new Client({
		host: process.env.AWS_HOSTNAME,
		port: 5432,
		database: process.env.DB_NAME,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
	});

	try {
		if (req.method === 'GET') {
			await client.connect();

			const result = await client.query('SELECT * FROM aws_users');

			res.status(200).json(result.rows);
		}
	} catch (error) {
		console.log(error.message);
	}

	if (req.method === 'POST') {
		const { username, age, bio } = req.body;

		try {
			await client.connect();

			const sql =
				'INSERT INTO aws_users (username, age, bio) VALUES ($1, $2, $3)';
			const values = [username, age, bio];

			await client.query(sql, values);

			res
				.status(200)
				.json({ message: `added user '${username}' to the database` });
		} catch (error) {
			console.log(error.message);
		}
	}
}
