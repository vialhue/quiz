var path = require('path');

// Pra POSTGRESS, DATABASE_URL = postgress://user:passwf@host:port/database
// Pra SQLITE, DATABASE_URL = DATABASE_URL=sqlite://:@:/
var url      = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

// Carga del modelo ORM
var Sequelize = require('sequelize');

// Usar la BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect  : protocol, 
    protocol : protocol,
    port     : port,
    host     : host,
    storage  : storage,
    omitNull : true }
);

// Difinir la tabla QUIZ dentro de la BBDD
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// Se exporta la definición de la tabla para que se pueda usar el otros JS.
exports.Quiz = Quiz;

// Crear e inicializr la tabla en la BBDD.
// 1 - Sincronizar la BBDD
sequelize.sync().then(function() {
    // 2 - Cuenta los registros de QUIZ (para ver si está vacia).
    Quiz.count().then(function(count) {
        // 3 - Si tiene 0 registros, esta vacia, la crea con una pregunta.
        if (count === 0) {
            Quiz.create({ pregunta: 'Capital de Italia',
                          respuesta: 'Roma',
                          tema: "humanidades"
                        });            
            Quiz.create({ pregunta: 'Capital de Portugal',
                          respuesta: 'Lisboa',
                          tema: "humanidades"
                        }).then(function() { console.log('Base de datos inicializada con 2 pregunta.');
            });
        }
    });
});
                         