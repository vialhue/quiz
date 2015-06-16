var models = require('../models/models.js');

// método GET para las /quizes/question, ahora busca la pegrunta en la BBDD
exports.question = function(req, res) {
    models.Quiz.findAll().success(function(quiz) {
        res.render('quizes/question', {pregunta : quiz[0].pregunta});
    });
};

// método GET para las /quizes/answer, ahora comprueba la respuesta de la pregunta en BBDD
exports.answer = function(req, res) {
    models.Quiz.findAll().success(function(quiz) {
        if (req.query.respuesta === quiz[0].respuesta) {
            res.render('quizes/answer', {respuesta : 'Correcto'});
        } else {
            res.render('quizes/answer', {respuesta : 'Incorrecto'});
        }
    });
};
