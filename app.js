const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

// Configuración para manejar datos enviados por POST
app.use(bodyParser.urlencoded({ extended: false }));

// Plantillas
app.set('view engine', 'ejs');

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'node_crud',
    port: 3306
});

// Comprobar la conexión
db.connect(err => {
    if (err) {
        console.log("Error al conectar a la base de datos: " + err);
    } else {
        console.log("La base de datos funciona y está conectada");
    }
});

// Iniciar servidor
const port = 3308;
app.listen(port, () => {
    console.log(`El servidor está en http://localhost:${port}`);
});

// Listar usuarios
app.get('/', (req, res) => {
    const query = 'SELECT id, nombre, email, age, phone, address, gender, created_at FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error(`Error en DB: ${err}`);
            res.send('Error en la conexión a la base de datos');
        } else {
            res.render('index', { users: results });
        }
    });
});

// Mostrar formulario para agregar usuario
app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { nombre, email, age, phone, address, gender } = req.body;
    const query = 'INSERT INTO users (nombre, email, age, phone, address, gender) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nombre, email, age, phone, address, gender], (err) => {
        if (err) {
            console.error("Error al agregar usuario:", err);
            res.send("Error al agregar usuario");
        } else {
            res.redirect('/');
        }
    });
});



// Editar usuario - Renderizar formulario
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id, nombre, email, age, phone, address, gender FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            res.send('Error al obtener el usuario');
        } else {
            res.render('edit', { user: results[0] });
        }
    });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, age, phone, address, gender } = req.body;
    const query = 'UPDATE users SET nombre = ?, email = ?, age = ?, phone = ?, address = ?, gender = ? WHERE id = ?';
    db.query(query, [nombre, email, age, phone, address, gender, id], (err) => {
        if (err) {
            console.error("Error al editar usuario:", err);
            res.send("Error al editar usuario");
        } else {
            res.redirect('/');
        }
    });
});

// Eliminar usuario
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error("Error al eliminar usuario:", err);
            res.send("Error al eliminar usuario");
        } else {
            res.redirect('/');
        }
    });
});
