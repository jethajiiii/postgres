import express from 'express';
import {Client} from 'pg';


const app = express();

app.use(express.json());

// we can do it both ways
const pgClient1 = new Client(process.env.PG_URL);
  

// const pgClient2 = new Client({
//     user: "neondb_owner",
//     password: "npg_gE4P9JIyoNOA",
//     port: 5432,
//     host: "ep-tiny-cell-aocc7y3g-pooler.c-2.ap-southeast-1.aws.neon.tech",
//     database: "neondb",
//     ssl: true,
// }) 

// async function main() {
//     await pgClient2.connect();
//     const response = await pgClient2.query("INSERT INTO users (username, email) VALUES('sudhanshu','sudh@gmail.com');");
//     console.log(response.rows);
// }

pgClient1.connect().then(() => console.log("Connected to DB")).catch(err => console.error(err));
 
// app.post('/users', async(req, res) => {
//     const username = req.body.username;
//     const email = req.body.email;

//     const query = `INSERT INTO users (username, email) VALUES ('${username}', '${email}');`

//     await pgClient2.query(query);
//     res.status(201).json({ message: "User created successfully" });
// })


// to prevent from sql injection 
app.post('/users', async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;

   try{



     const query = `INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING id;`
     const addressQuery = `INSERT INTO addresses (user_id, street, city, state, country) VALUES ($1, $2, $3, $4, $5);`

    await pgClient1.query('BEGIN'); // Start transaction

    const userResult = await pgClient1.query(query, [name, email, phone]);
    const userId = userResult.rows[0].id;

    
    const addressResult = await pgClient1.query(addressQuery, [userId, street, city, state, country]);
        // user_id as foreign key 

    pgClient1.query('COMMIT'); // Commit transaction  



    res.status(201).json({ message: "User created successfully", userId });




   }catch(err){
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
   }
})
// therefore no other sql command can be injected through username or email field as they will be treated as string literals and not executable sql commands





  
app.listen(3000, () => {
    console.log("Server is running on port 3000");
}  )