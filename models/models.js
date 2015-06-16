var path = require('path');

// Carga del modelo ORM
var Sequelize = require('sequelize');

// Usar la BBDD SQLite
var sequelize = new Sequelize(null, null, null, { dialect: "sqlite", storage: "quiz.sqlite"});

// Difinir la tabla QUIZ dentro de la BBDD
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// Se exporta la definición de la tabla para que se pueda usar el otros JS.
exports.Quiz = Quiz;

// Crear e inicializr la tabla en la BBDD.
// He tenido que usar las "promesas" ya que con otras versiones de seuelize me decia que estaba obsoleta.
// 1 - Sincronizar la BBDD
sequelize.sync().success(function() {
    // 2 - Cuenta los registros de QUIZ (para ver si está vacia).
    Quiz.count().success(function(count) {
        // 3 - Si tiene 0 registros, esta vacia, la crea con una pregunta.
        if (count === 0) {
            Quiz.create({ pregunta: 'Capital de Italia',
                           respuesta: 'Roma'
                        }).success(function() {
                                console.log('Base de datos inicializada con 1 pregunta.');
            });
        }
    });
});
                         