var models = require('../models/models.js');

// Autoload - Factoriza el codigo si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    models.Quiz.find(quizId).then(
        function(quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next(new Error('No existe quizId=' + quizId));
            }
        }
    ).catch(function(error) { next(error); });
};

// método GET para /quizes
exports.index = function(req, res) {
    models.Quiz.findAll().then(function(quizes) {
        res.render('quizes/index.ejs', { quizes : quizes});
    });
}

// método GET para las /quizes/:id, ahora busca la pegrunta en la BBDD
exports.show = function(req, res) {
    res.render('quizes/show', { quiz : req.quiz });
};

// método GET para las /quizes/answer, ahora comprueba la respuesta de la pregunta en BBDD
exports.answer = function(req, res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    }
    res.render('quizes/answer', { quiz : req.quiz, respuesta : resultado});
};
