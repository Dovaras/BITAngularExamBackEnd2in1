const express = require("express");
const mysql = require("mysql");

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "cow_farm",
};

const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
});

connection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

const app = express();
app.use(express.json());
const port = 3000;

app.get("/test-conn", (req, res) => {
    connection.query("SELECT 1 + 1 AS solution", (err, rows, fields) => {
        if (err) throw err;
        console.log("The solution is: ", rows[0].solution);
        res.status(200).send({ solution: rows[0].solution });
    });
});

app.get("/cow", (req, res) => {
    connection.query("SELECT * FROM cow", (err, rows, fields) => {
        if (err) throw err;
        res.status(200).send(rows);
    });
});

app.get("/cow/:id", (req, res) => {
    connection.query(
        "SELECT * FROM cow WHERE id = ?",
        req.params.id,
        (err, rows, fields) => {
            if (err) throw err;
            res.status(200).send(rows);
        }
    );
});

app.post("/cow", (req, res) => {
    connection.query(
        "INSERT INTO cow (`name`, `weight`, `total_milk`, `last_milking_time`) VALUES (?, ?, ?, ?)",
        [
            req.body.name,
            req.body.weight,
            req.body.total_milk,
            req.body.last_milking_time,
        ],
        // TODO :: check if this can be simplified
        // "INSERT INTO cow VALUES (?)",   
        // req.body,                       
        (err, rows, field) => {
            if (err) throw err;
            console.log("created: ", { id: rows.insertId, ...req.body });
            res.status(201).send({ id: rows.insertId, ...req.body });
        }
    );
});

app.put("/cow/:id", (req, res) => {
    connection.query(
        "UPDATE cow SET name = ?, weight = ?, total_milk = ?, last_milking_time = ? WHERE id = ?",
        [
            req.body.name,
            req.body.weight,
            req.body.total_milk,
            req.body.last_milking_time,
            req.params.id,
        ],
        (err, rows, field) => {
            if (err) throw err;
            console.log("updated: ", { rows });
            res.status(204).send();
        }
    );
});

app.delete("/cow/:id", (req, res) => {
    console.log(req.params.id);
    connection.query(
        "DELETE FROM cow WHERE id=?",
        req.params.id,
        (err, rows, field) => {
            if (err) throw err;
            console.log("deleted: ", rows);
            // TODO :: should we return 204 when there affectedRows:0
            res.status(204).send();
        }
    );
});

app.listen(port, () =>
    console.log(`Hello world app listening on port ${port}!`)
);