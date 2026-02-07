import 'dotenv/config'
import { Pool } from 'pg'
async function main(){
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  try { await pool.query('SELECT 1'); console.log('DB connection OK') }
  catch(e){ console.error('DB connection failed', e) }
  finally{ await pool.end() }
}
main()