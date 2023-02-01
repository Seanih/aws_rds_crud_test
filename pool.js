import pg from 'pg';

// this allows you to connect to multiple DBs
class Pool {
	_pool = null;

	connect(options) {
		this._pool = new pg.Pool(options);
		// basic query to test connection to DB
		return this._pool.query('SELECT 1 + 1');
	}

	close() {
		return this._pool.end();
	}

    // REALLY big security issue
	query(sql) {
		return this._pool.query(sql);
	}
}

const newPool = new Pool();

export default newPool;
