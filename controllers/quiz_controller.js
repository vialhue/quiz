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
    if (req.query.search !== undefined) {
        // La petición llega del buscador, enviaremos solo las quizes según el patrón.
        var buscar = "%" + req.query.search.replace(" ", "%") + "%";
        models.Quiz.findAll({where: ["pregunta like ?", buscar]}).then(
            function(quizes) {
                res.render('quizes/index.ejs', { quizes : quizes});
            }
        );
    } else {
        // La petición llega sin parametro de buscar, por tanto se envian todas.
        models.Quiz.findAll().then(function(quizes) {
            res.render('quizes/index.ejs', { quizes : quizes});
        });
    }
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

// GET /quizes/new
exports.new = function(req, res) {
    var quiz = models.Quiz.build(
        {pregunta : "Pregunta", respuesta : "Respuesta"}
    );
    res.render('quizes/new', {quiz : quiz});
};

exports.create = function(req, res) {
    var quiz = models.Quiz.build(req.body.quiz);
    // Guarda la pregunta en la BBDD
    quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
        res.redirect('/quizes');
    });
};

