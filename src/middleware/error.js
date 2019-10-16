const middleware = {};
//renderizar a la pagina 404
middleware.primer = ((req, res, next) => {
    const error = new Error("Ruta no encontrada");
    res.status(404);
    next(error);
});

middleware.segundo = ((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        mensaje: error.message
    })
});

module.exports = middleware;

// app.use((req, res, next) => {
//     const error = new Error("No encontrado");
//     res.status(404);
//     next(error);
// });
// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         mensaje: error.message
//     })
// });