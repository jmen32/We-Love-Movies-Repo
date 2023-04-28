const service = require("./movies.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function read(req, res){
  const {movie} = res.locals
  res.json({data: movie});
}

async function list(req, res) {
    const {is_showing} = req.query;
    if(is_showing){
        const listShowing = (await service.listShowing());
        return res.json({data: listShowing})
    }
    const list = await service.list();
    res.json({data: list})
}

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(Number(movieId));
  if (movie) {
    res.locals.movie = movie;
    return next();
  } else {
    return next({
      status: 404,
      message: "Movie cannot be found.",
    });
  }
}

async function listTheaters(req, res, next){
    const {movie} = res.locals;
    // console.log("listTheatersMOvies", JSON.stringify(movie))
    const theaters = await service.listTheaters(movie.movie_id)
    // console.log("listTheaters", JSON.stringify(theaters))
    res.json({data: theaters})
}

async function listReviews(req, res, next){
    const { movie } = res.locals;
    const reviews = await service.listReviews(movie)
    // console.log("LIST REVIEWS", JSON.stringify(reviews))
    res.json({data: reviews})
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [
        asyncErrorBoundary(movieExists), asyncErrorBoundary(read),
    ],
    listTheaters: [
        asyncErrorBoundary(movieExists),asyncErrorBoundary(listTheaters), 
    ],
    listReviews: [
        asyncErrorBoundary(movieExists),asyncErrorBoundary(listReviews),
    ]
}
