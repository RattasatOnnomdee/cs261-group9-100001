const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const sql = require('mssql');

app.use(cors());
app.use(bodyparser.json());

let conn = null;

const initMySQL = async () => {
    conn = await sql.connect({
        user: 'sa',
        password: 'cs261',
        server: 'localhost',
        database: 'myDB',
        port: 1433,
        connectionTimeout: 30000, // Increase timeout to 30 seconds
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    });
};

const createTable = `
    IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_NAME = 'users'
)
BEGIN
    CREATE TABLE users (
        userId INT PRIMARY KEY IDENTITY(1,1),
        username VARCHAR(255) NOT NULL
    );
END

IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_NAME = 'requestFormData'
)
BEGIN
    CREATE TABLE requestFormData (
        requestFormId INT PRIMARY KEY IDENTITY(1,1),
        userId INT,
        type NVARCHAR(255),
        status NVARCHAR(MAX), 
        state NVARCHAR(MAX), 
        details NVARCHAR(MAX), 
        FOREIGN KEY (userId) REFERENCES users(userId)
    );
END

-- Add new columns to the requestFormData table

`;

app.post('/user', async (req, res) => {
    try {
        const user = req.body;
        var result = await conn.request()
            .input('username', sql.VarChar, user.studentId)
            .query('SELECT * FROM users WHERE username = @username');

        if (result.recordset.length === 0) {
            await conn.request()
                .input('username', sql.VarChar, user.studentId)
                .query('INSERT INTO users (username) VALUES (@username)');

            result = await conn.request()
                .input('username', sql.VarChar, user.studentId)
                .query('SELECT * FROM users WHERE username = @username');
        }

        res.json({
            message: "Login success",
            userId: result.recordset[0].userId
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

app.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await conn.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM requestFormData WHERE userId = @userId');
        res.json(result.recordset);
        console.log(result.recordset)
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Failed to fetch requests' });
    }
});

app.post('/user/:userId', async (req, res) => {
    try {
        const requestDetails = req.body;
        const id = req.params.userId;

        // Use OUTPUT clause to get the inserted row's requestFormId
        const result = await conn.request()
            .input('userId', sql.Int, id)
            .input('status', sql.NVarChar, requestDetails.status)
            .input('state', sql.NVarChar, requestDetails.state)
            .input('type', sql.VarChar, requestDetails.type)
            .input('details', sql.NVarChar, JSON.stringify(requestDetails.details))
            .query('INSERT INTO requestFormData (userId, type, status, state,details) OUTPUT INSERTED.requestFormId, INSERTED.type, INSERTED.status ,INSERTED.state ,INSERTED.details VALUES (@userId, @type, @status,@state,@details)');

        // Check if we got the inserted data
        if (result.recordset && result.recordset.length > 0) {
            const { requestFormId, type, status,state,details } = result.recordset[0]; // Access the first inserted row

            res.json({
                requestFormId: requestFormId,
                type: type,
                status : status,
                state : state,
                details: details,
                message: 'Insert success'
            });
        } else {
            res.status(500).json({ message: 'Failed to insert data' });
        }

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error.message });
    }
});


app.put('/user/:requestFormId', async (req, res) => {
    try {
        const updateDetails = req.body;
        const id = req.params.requestFormId;

        // Use OUTPUT clause to get the updated requestFormId
        const result = await conn.request()
            .input('requestFormId', sql.Int, id)
            .input('details', sql.NVarChar, JSON.stringify(updateDetails.details))
            .query('UPDATE requestFormData SET details = @details OUTPUT INSERTED.requestFormId, INSERTED.type, INSERTED.details WHERE requestFormId = @requestFormId');

        // Check if we got the updated data
        if (result.recordset && result.recordset.length > 0) {
            const { requestFormId, type, details } = result.recordset[0];
            res.json({
                requestFormId: requestFormId,
                type: type,
                details: details,
                message: 'Update success'
            });
        } else {
            res.status(500).json({ message: 'Failed to update data' });
        }

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});

app.delete('/user/:requestFormId', async (req, res) => { // <--- แก้ไข route
    try {
        const requestFormId = req.params.requestFormId;
        const result = await conn.request()
            .input('requestFormId', sql.Int, requestFormId)
            .query('DELETE FROM requestFormData WHERE requestFormId = @requestFormId');
        
        // if (result.rowsAffected[0] > 0) {
            res.json({
                message: 'DELETE success',
                deleteFormId: requestFormId
            });
            console.log(result.recordset)
        // } else {
            // res.status(404).json({
                // message: 'Request form not found, deletion failed'
            // });
        // }
    } catch (error) {
        console.error('Error deleting request:', error);  // ควร log error details ที่ server
        res.status(500).json({ message: 'Failed to delete request' }); // return generic message ให้ client
    }
});

app.get('/user/draft/:userId', async (req, res) => {
    try {
        const data = []
        const userId = req.params.userId;
        const result = await conn.request()
            .input('state', sql.VarChar, 'Draft')
            .input('userId', sql.Int, userId)
            .query('SELECT type, requestFormId, details FROM requestFormData WHERE userId = @userId AND state = @state');

        for (var i = 0; i < result.recordset.length; i++) {
            const response = {
                type: result.recordset[i].type,
                requestFormId: result.recordset[i].requestFormId,
                date: JSON.parse(result.recordset[i].details).date
            }

            data.push(response);
        }

        res.json(data);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: error });
    }
});


app.listen(8000, async (req, res) => {
    await initMySQL();
    await conn.request().query(createTable);
    console.log('http server runing at ' + 8000);
});