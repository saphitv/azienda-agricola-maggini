
const mysql = require('mysql2/promise');
const express = require('express');
const makeDbString = require('./utils');
const {join} = require("path");

const app = express();
app.use(express.json());
const port = 3001;
const main = async () => {
    process.loadEnvFile(join(__dirname, '../.env'))
    console.log(process.env)
    const connection = await mysql.createConnection(makeDbString({
        dbType: 'mysql',
        option: {
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            host: process.env.PROD == 'true' ? 'db' : 'localhost',
            port: 3306,
            database: process.env.MYSQL_DATABASE
        }
    }));
    app.post('/query', async (req, res) => {
        const {sql, params, method} = req.body;
        // prevent multiple queries
        const sqlBody = sql.replace(/;/g, '');
        try {
            const result = await connection.query({
                sql: sqlBody,
                values: params,
                rowsAsArray: method === 'all',
                typeCast: function (field, next) {
                    if (field.type === 'TIMESTAMP' || field.type === 'DATETIME' || field.type === 'DATE') {
                        return field.string();
                    }
                    return next();
                },
            });

            if (method === 'all') {
                res.send(result[0]);
            } else if (method === 'execute') {
                res.send(result);
            }
        } catch (e) {
            res.status(500).json({error: e});
        }

        //res.status(500).json({error: 'Unknown method value'});
    });

    app.use((err, req, res, next) => {
        console.error(err)
        res.status(err.status || 500)
        res.json({error: 'error'})
    })
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
main();
