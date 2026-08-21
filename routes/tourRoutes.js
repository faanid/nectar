/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         duration:
 *           type: number
 *         maxGroupSize:
 *           type: number
 *         difficulty:
 *           type: string
 *         ratingsAverage:
 *           type: number
 *         ratingsQuantity:
 *           type: number
 *         imageCover:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         startDates:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *         secretTour:
 *           type: boolean
 *       example:
 *         name: "The Forest Hiker"
 *         price: 497
 *         description: "Breathtaking hike through the Canadian Banff National Park"
 *         duration: 5
 *         maxGroupSize: 25
 *         difficulty: "easy"
 *         ratingsAverage: 4.7
 *         ratingsQuantity: 37
 *         imageCover: "tour-1-cover.jpg"
 *         images:
 *           - "tour-1-1.jpg"
 *           - "tour-1-2.jpg"
 *           - "tour-1-3.jpg"
 *         startDates:
 *           - "2021-06-19"
 *           - "2021-07-20"
 *           - "2021-08-18"
 *         createdAt: "2021-06-19T00:00:00.000Z"
 *         secretTour: false
 */
const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// router.param("id", tourController.checkID);
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan:year")
.get( authController.protect,
    authController.restrictTo("admin", "lead-guide",'guide'),
  tourController.getMonthlyPlan)

router
  .route("/")
  .get(tourController.getAllTours)
  .post(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.createTour);

  router
  .route("/:id")
  .get(tourController.getTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  );

// router.route('/:tourId/reviews')
// .post(
// authController.protect,
// authController.restrictTo('user'),
// reviewController.createReview
// );


module.exports = router;
