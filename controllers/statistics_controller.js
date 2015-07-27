var models = require('../models/models.js');

// Creo un objeto para pasarlo al EJS con la información de las estadisticas, es más facil de tratar.
var estadistica = {
    preguntasTotales : 0,
    comentariosTotales :0,
    comentariosPorPregunta: 0,
    preguntasSinComentarios: 0,
    preguntasConComentarios: 0
};

// Calculará las estadísticas y renderizará el ejs de statistics. Debido a la asincronica de serializa
// hay que ir concatenando promesas hasta llegar al finally.
exports.show = function(req, res, next) {
    models.Quiz.count()
    .then(function(result) { 
        // Preguntas totales.
        estadistica.preguntasTotales = result;
        return models.Comment.count();
    })
    .then(function(result) { 
        // Comentarios totales
        estadistica.comentariosTotales = result;
        // Número medio de comentarios por pregunta
        estadistica.comentariosPorPregunta = (estadistica.comentariosTotales / estadistica.preguntasTotales).toFixed(1);
        return models.Comment.aggregate('QuizId', 'count', { distinct: true });
    }).then(function(result) {
        // Número de preguntas con comentario.
        estadistica.preguntasConComentarios = result;
        // Número de preguntas sin comentario.
        estadistica.preguntasSinComentarios = estadistica.preguntasTotales - estadistica.preguntasConComentarios;
    })
    .finally(function() {
        res.render('statistics', {estadisticas: estadistica, errors : []});        
    })
    

};