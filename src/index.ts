import express from 'express';
import {Client} from 'pg';


const app = express();

app.use(express.json());

// we can do it both ways
// const pgClient1 = new Client("postgresql://neondb_owner:npg_gE4P9JIyoNOA@ep-tiny-cell-aocc7y3g-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
  

const pgClient2 = new Client({
    user: "neondb_owner",
    password: "npg_gE4P9JIyoNOA",
    port: 5432,
    host: "ep-tiny-cell-aocc7y3g-pooler.c-2.ap-southeast-1.aws.neon.tech",
    database: "neondb",
    ssl: true,
}) 

// async function main() {
//     await pgClient2.connect();
//     const response = await pgClient2.query("INSERT INTO users (username, email) VALUES('sudhanshu','sudh@gmail.com');");
//     console.log(response.rows);
// }

pgClient2.connect().then(() => console.log("Connected to DB")).catch(err => console.error(err));
 
// app.post('/users', async(req, res) => {
//     const username = req.body.username;
//     const email = req.body.email;

//     const query = `INSERT INTO users (username, email) VALUES ('${username}', '${email}');`

//     await pgClient2.query(query);
//     res.status(201).json({ message: "User created successfully" });
// })


// to prevent from sql injection 
app.post('/users', async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;

    const query = `INSERT INTO users (username, email) VALUES ($1, $2)`;

    await pgClient2.query(query, [username, email]);   // pass array of values to be inserted in place of $1, $2
    res.status(201).json({ message: "User created successfully" });
})
// therefore no other sql command can be injected through username or email field as they will be treated as string literals and not executable sql commands





  
app.listen(3000, () => {
    console.log("Server is running on port 3000");
}  )