var models = require('../models/models.js');




// método GET para /quizes
exports.index = function(req, res) {
    models.Quiz.findAll().then(function(quizes) {
        res.render('quizes/index.ejs', { quizes : quizes});
    });
}

// método GET para las /quizes/:id, ahora busca la pegrunta en la BBDD
exports.show = function(req, res) {
    models.Quiz.find(req.params.quizId).then(function(quiz) {
        res.render('quizes/show', { quiz : quiz });
    });
};

// método GET para las /quizes/answer, ahora comprueba la respuesta de la pregunta en BBDD
exports.answer = function(req, res) {
    models.Quiz.find(req.params.quizId).then(function(quiz) {
        if (req.query.respuesta === quiz.respuesta) {
            res.render('quizes/answer', { quiz : quiz, respuesta : 'Correcto'});
        } else {
            res.render('quizes/answer', { quiz : quiz, respuesta : 'Incorrecto'});
        }
    });
};
