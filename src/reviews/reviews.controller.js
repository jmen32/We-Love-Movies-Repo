const service = require("./reviews.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  } else {
    return next({
      status: 404,
      message: `Review cannot be found.`,
    });
  }
}

async function destroy(req, res){
    const { review } = res.locals
    await service.destroy(review.review_id)
    res.status(204).json({message: '204 No Content'})  
}

async function update(req, res) {
  const updatedReview = { ...res.locals.review, ...req.body.data };
  await service.update(updatedReview);
  const reviewToReturn = await service.getReviewWithCritic(
    res.locals.review.review_id
  );
  res.json({ data: reviewToReturn });
}
// async function update(req, res, next){
//     const {review} = res.locals
//     console.log("Review", JSON.stringify(review))
//     const updatedReview = {
//         ...review, 
//         ...req.body.data,
//     };
//     console.log("body", JSON.stringify(req))
//     console.log("UpdatedReview", JSON.stringify(updatedReview))
//     const data = await service.update(updatedReview);
//     console.log("data", JSON.stringify(data))
//     const critic = await service.readCritic(data.review_id);
//     res.json({ data: { ...data, critic } }); // try not nesting
// }

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)]
}