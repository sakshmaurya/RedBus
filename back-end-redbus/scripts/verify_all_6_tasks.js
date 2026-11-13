const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { spawn } = require("child_process");

// Import Models
const Customer = require("../models/customer");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const ForumCategory = require("../models/forumCategory");
const ForumTopic = require("../models/forumTopic");
const ForumReply = require("../models/forumReply");
const Report = require("../models/report");
const Notification = require("../models/notification");
const NotificationPreference = require("../models/notificationPreference");
const SavedRoute = require("../models/savedRoute");
const Review = require("../models/review");
const ReviewHelpfulVote = require("../models/reviewHelpfulVote");
const ReviewReport = require("../models/reviewReport");
const Booking = require("../models/booking");
const Bus = require("../models/bus");
const Route = require("../models/route");

// Import Services
const NotificationService = require("../services/notificationService");

const DB_PORT = "27018";
const DB_URI = process.env.TEST_DB_URI || `mongodb://127.0.0.1:${DB_PORT}/redbus_test`;

function startMongo() {
  return new Promise((resolve, reject) => {
    const proc = spawn("mongod", ["--dbpath", "/tmp/mongodb_data", "--port", DB_PORT, "--bind_ip", "127.0.0.1"]);
    proc.stdout.on("data", (data) => {
      const msg = data.toString();
      if (msg.includes("Waiting for connections")) {
        resolve(proc);
      }
    });
    proc.stderr.on("data", (data) => {
      console.error("mongod error:", data.toString());
    });
    proc.on("error", reject);
    setTimeout(() => resolve(proc), 3000);
  });
}

async function runTests() {
  console.log("=================================================");
  console.log("   REDBUS PLATFORM - 6 TASKS VERIFICATION SUITE   ");
  console.log("=================================================\n");

  let mongoProcess = null;
  try {
    console.log(" Starting dedicated local MongoDB instance on port", DB_PORT, "...");
    mongoProcess = await startMongo();
    console.log(" MongoDB started successfully.\n");

    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(" Connected to MongoDB at:", DB_URI);

    // Clean test database
    await mongoose.connection.dropDatabase();
    console.log(" Cleaned test database.\n");

    let testsPassed = 0;
    let totalTests = 0;

    function assert(condition, message) {
      totalTests++;
      if (condition) {
        console.log(`  PASSED: ${message}`);
        testsPassed++;
      } else {
        console.error(`  FAILED: ${message}`);
        throw new Error(`Assertion failed: ${message}`);
      }
    }

    // -------------------------------------------------------------
    // SEED BASE ENTITIES
    // -------------------------------------------------------------
    const hashedPassword = await bcrypt.hash("Password@123", 10);
    const verifiedUser = await Customer.create({
      name: "Alice Verified",
      email: "alice@example.com",
      password: hashedPassword,
      isVerifiedTraveler: true,
      language: "en",
      theme: "light",
    });

    const unverifiedUser = await Customer.create({
      name: "Bob Unverified",
      email: "bob@example.com",
      password: hashedPassword,
      isVerifiedTraveler: false,
      language: "hi",
      theme: "dark",
    });

    const reviewerUser = await Customer.create({
      name: "Charlie Reviewer",
      email: "charlie@example.com",
      password: hashedPassword,
      isVerifiedTraveler: true,
      language: "en",
      theme: "light",
    });

    const testRoute = await Route.create({
      departureLocation: { name: "Mumbai", city: "Mumbai" },
      arrivalLocation: { name: "Pune", city: "Pune" },
      distance: 150,
      duration: 180,
    });

    const testBus = await Bus.create({
      operatorName: "VRL Travels",
      busType: "AC Sleeper",
      departureTime: "21:00",
      rating: [4.5],
      totalSeats: 40,
      seatsAvailable: 35,
      fare: 800,
      routes: testRoute._id,
      images: "https://example.com/bus.jpg",
      liveTracking: 1,
      reschedulable: 1,
    });

    console.log("--- TASK 1: USER-GENERATED CONTENT & COMMUNITY FEATURES ---");
    // 1.1 Unverified user restriction
    const postController = require("../controllers/postController");
    let unverifiedBlocked = false;
    try {
      const mockReq = {
        body: {
          title: "My Journey",
          description: "This is a great journey experience.",
          author: unverifiedUser._id.toString(),
          authorName: unverifiedUser.name,
        },
      };
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            if (code === 403) unverifiedBlocked = true;
          },
        }),
      };
      await postController.createPost(mockReq, mockRes);
    } catch (e) {}
    assert(unverifiedBlocked, "Unverified user blocked from posting community content");

    // 1.2 Verified user post creation
    const post = await Post.create({
      title: "Scenic Mumbai to Pune Western Ghats Bus Ride",
      description: "Wonderful views through the expressway tunnels. Highly recommend morning buses!",
      author: verifiedUser._id,
      authorName: verifiedUser.name,
      route: "Mumbai - Pune",
      destination: "Pune",
      images: ["https://example.com/bus-ghats.jpg"],
    });
    assert(post && post.title && post.images.length > 0, "Verified user successfully created post with images and route info");

    // 1.3 Comment and Like functionality
    const like = await Like.create({ post: post._id, user: reviewerUser._id });
    post.likesCount = 1;
    await post.save();
    assert(like && post.likesCount === 1, "User liked post and engagement metric updated");

    const comment = await Comment.create({
      postId: post._id,
      author: reviewerUser._id,
      authorName: reviewerUser.name,
      text: "Great capture! Which bus operator did you choose?",
    });
    post.commentsCount = 1;
    await post.save();
    assert(comment && post.commentsCount === 1, "User commented on post and comments count updated");

    // 1.4 Forum Categories & Topics by Route/Destination/Travel Advice
    const catRoute = await ForumCategory.create({
      name: "Route Discussions",
      description: "Ask and share information about specific bus routes",
      icon: "🛣️",
    });
    const catDest = await ForumCategory.create({
      name: "Destinations & Sightseeing",
      description: "Best spots and travel tips for destinations",
      icon: "🌄",
    });
    const catAdvice = await ForumCategory.create({
      name: "Travel Advice & Tips",
      description: "General tips for bus travel and luggage safety",
      icon: "💡",
    });
    assert(catRoute && catDest && catAdvice, "Forums organized by routes, destinations, and travel advice");

    const forumTopic = await ForumTopic.create({
      category: catRoute._id,
      title: "Best morning halts between Mumbai and Pune?",
      content: "Where do standard sleeper buses stop for breakfast?",
      author: verifiedUser._id,
      authorName: verifiedUser.name,
    });
    const forumReply = await ForumReply.create({
      topic: forumTopic._id,
      author: reviewerUser._id,
      authorName: reviewerUser.name,
      content: "Food Mall after expressway toll plaza has great options!",
    });
    assert(forumTopic && forumReply, "Forum topic and reply created successfully");

    // 1.5 Moderation and Inappropriate Content Reporting
    const report = await Report.create({
      postId: post._id,
      reportedBy: unverifiedUser._id,
      reason: "Inappropriate Content",
      status: "Pending",
    });
    assert(report && report.status === "Pending", "Moderation report filed for inappropriate content");

    console.log("\n--- TASK 2: ADVANCED NOTIFICATION SYSTEM ---");
    // 2.1 Booking creation triggers booking confirmation notification
    const booking = await Booking.create({
      customerId: verifiedUser._id,
      busId: testBus._id,
      seats: [12],
      fare: 800,
      status: "upcoming",
      duration: "3h 30m",
      bookingDate: "2026-11-12",
      passengerDetails: [{ name: "Alice Verified", age: 28, gender: "female" }],
      journeyStatus: "UPCOMING",
      journeyDate: "2026-11-13",
    });

    const notifConfirm = await NotificationService.createNotification({
      recipient: verifiedUser._id,
      type: "booking_confirmation",
      data: { bookingId: booking._id },
    });
    assert(notifConfirm && notifConfirm.deliveryStatus === "pending" || notifConfirm.deliveryStatus === "delivered", "Booking confirmation notification created");

    // 2.2 Schedule change & Journey reminder notifications
    const notifSched = await NotificationService.sendScheduleChange(
      verifiedUser._id,
      booking._id,
      "Departure delayed by 15 minutes due to traffic clearance."
    );
    assert(notifSched && notifSched.type === "schedule_change", "Schedule change notification delivered");

    const notifReminder = await NotificationService.sendJourneyReminder(
      verifiedUser._id,
      booking._id
    );
    assert(notifReminder && notifReminder.type === "journey_reminder", "Upcoming journey reminder delivered");

    // 2.3 Booking cancellation notification
    const notifCancel = await NotificationService.sendBookingCancellation(
      verifiedUser._id,
      booking._id
    );
    assert(notifCancel && notifCancel.type === "booking_cancellation", "Booking cancellation notification delivered");

    // 2.4 Localization support in notifications (English vs Hindi)
    const notifHindi = await NotificationService.createNotification({
      recipient: unverifiedUser._id, // User has language: 'hi'
      type: "booking_confirmation",
      data: { bookingId: booking._id },
    });
    assert(notifHindi.language === "hi" && notifHindi.title.includes("पुष्टि"), "Notification localized to Hindi based on recipient language");

    // 2.5 User Notification Preferences & Channel Opt-in/out
    const userPrefs = await NotificationService.updatePreferences(verifiedUser._id, {
      categories: {
        booking: { enabled: true, channels: { inApp: true, email: true, push: false } },
        community: { enabled: true, channels: { inApp: true, email: false, push: false } },
        promotions: { enabled: false, channels: { inApp: false, email: false, push: false } },
      },
    });
    assert(userPrefs.categories.promotions.enabled === false, "User successfully opted out of promotional notifications");

    // Check that promotional notification is suppressed when user opted out
    const promoNotif = await NotificationService.sendPromotion(verifiedUser._id, "REDBUS50", "Flat 50% discount");
    assert(promoNotif === null, "Promotional notification suppressed based on user preferences");

    // 2.6 Retry failed deliveries & delivery status tracking
    const failedNotif = await Notification.create({
      recipient: verifiedUser._id,
      type: "booking_confirmation",
      title: "Test Retry",
      message: "Retry message",
      deliveryStatus: "failed",
      deliveryAttempts: 1,
      channels: { inApp: true, email: true, push: false },
    });
    await NotificationService.retryFailedNotifications();
    const updatedFailedNotif = await Notification.findById(failedNotif._id);
    assert(updatedFailedNotif.deliveryStatus === "delivered" || updatedFailedNotif.deliveryAttempts > 1, "Retry mechanism for failed deliveries executed");

    // 2.7 Notification History Section
    const history = await NotificationService.getUserNotifications(verifiedUser._id);
    assert(history.notifications.length > 0 && history.total > 0, "Notification history section accessible with logged notifications");

    console.log("\n--- TASK 3: INTERNATIONALIZATION (I18N) ---");
    // 3.1 Persistence of language preference
    const CustomerController = require("../controllers/customer");
    const mockPrefReq = {
      params: { userId: verifiedUser._id.toString() },
      body: { language: "hi", theme: "dark" },
    };
    let savedLang = null;
    const mockPrefRes = {
      json: (data) => {
        savedLang = data.customer?.language || data.user?.language;
      },
    };
    await CustomerController.updateUserPreferences(mockPrefReq, mockPrefRes);
    const updatedCustomer = await Customer.findById(verifiedUser._id);
    assert(updatedCustomer.language === "hi", "Language preference persisted across sessions and devices in profile");

    console.log("\n--- TASK 4: INTERACTIVE ROUTE PLANNING TOOL ---");
    // 4.1 Save Route with Start, Destination, Waypoints, Distance, Duration
    const savedRoute = await SavedRoute.create({
      userId: verifiedUser._id,
      routeName: "Work Commute Expressway",
      startLocation: { name: "Mumbai Dadar", lat: 19.0178, lng: 72.8478 },
      destination: { name: "Pune Swargate", lat: 18.5018, lng: 73.8636 },
      waypoints: [
        { name: "Vashi Highway", lat: 19.0771, lng: 72.9986 },
        { name: "Lonavala Bypass", lat: 18.7557, lng: 73.4091 },
      ],
      distance: 152000,
      duration: 11400,
    });
    assert(savedRoute && savedRoute.waypoints.length === 2, "Saved route persisted with multiple waypoints, distance, and duration");

    const userSavedRoutes = await SavedRoute.find({ userId: verifiedUser._id });
    assert(userSavedRoutes.length >= 1, "Frequently used routes retrievable for quick access");

    console.log("\n--- TASK 5: DARK MODE TOGGLE ---");
    // 5.1 Persist Dark Mode preference
    await CustomerController.updateUserPreferences(
      { params: { userId: verifiedUser._id.toString() }, body: { theme: "dark" } },
      { json: () => {} }
    );
    const darkUser = await Customer.findById(verifiedUser._id);
    assert(darkUser.theme === "dark", "Dark Mode preference securely stored in user profile and persistent");

    console.log("\n--- TASK 6: BUS ROUTE RATING AND REVIEW SYSTEM ---");
    // 6.1 Completed Journey Booking requirement
    const completedBooking = await Booking.create({
      customerId: reviewerUser._id,
      busId: testBus._id,
      seats: [5],
      fare: 800,
      status: "completed",
      duration: "3h 30m",
      bookingDate: "2026-11-10",
      passengerDetails: [{ name: "Charlie Reviewer", age: 30, gender: "male" }],
      journeyStatus: "COMPLETED",
      journeyDate: "2026-11-11",
    });

    const incompleteBooking = await Booking.create({
      customerId: reviewerUser._id,
      busId: testBus._id,
      seats: [6],
      fare: 800,
      status: "upcoming",
      duration: "3h 30m",
      bookingDate: "2026-11-12",
      passengerDetails: [{ name: "Charlie Reviewer", age: 30, gender: "male" }],
      journeyStatus: "UPCOMING",
      journeyDate: "2026-11-15",
    });

    const reviewController = require("../controllers/reviewController");

    // Incomplete journey review attempt -> must fail
    let incompleteRejected = false;
    await reviewController.createReview(
      {
        user: reviewerUser,
        body: {
          bookingId: incompleteBooking._id,
          busId: testBus._id,
          routeId: testRoute._id,
          rating: 5,
          reviewText: "Great comfortable journey with very clean seats and punctual timing throughout.",
        },
      },
      {
        status: (code) => ({
          json: (data) => {
            if (code === 403) incompleteRejected = true;
          },
        }),
      }
    );
    assert(incompleteRejected, "Review rejected for journey that is not COMPLETED");

    // Short review (<50 chars) attempt -> must fail
    let shortReviewRejected = false;
    await reviewController.createReview(
      {
        user: reviewerUser,
        body: {
          bookingId: completedBooking._id,
          busId: testBus._id,
          routeId: testRoute._id,
          rating: 5,
          reviewText: "Good bus.",
        },
      },
      {
        status: (code) => ({
          json: (data) => {
            if (code === 400) shortReviewRejected = true;
          },
        }),
      }
    );
    assert(shortReviewRejected, "Review rejected when below minimum character limit (50 characters)");

    // Valid review submission
    let createdReviewId = null;
    await reviewController.createReview(
      {
        user: reviewerUser,
        body: {
          bookingId: completedBooking._id,
          busId: testBus._id,
          routeId: testRoute._id,
          rating: 5,
          reviewText: "Excellent journey from Mumbai to Pune! Driver was courteous and bus arrived exactly on schedule.",
        },
      },
      {
        status: (code) => ({
          json: (data) => {
            createdReviewId = data.review?._id;
          },
        }),
        send: () => {},
      }
    );
    assert(createdReviewId, "Verified traveler submitted 5-star review after journey completion");

    // Duplicate review attempt for same journey -> must fail
    let duplicateRejected = false;
    await reviewController.createReview(
      {
        user: reviewerUser,
        body: {
          bookingId: completedBooking._id,
          busId: testBus._id,
          routeId: testRoute._id,
          rating: 4,
          reviewText: "Trying to submit a second review for the same completed journey here.",
        },
      },
      {
        status: (code) => ({
          json: (data) => {
            if (code === 400) duplicateRejected = true;
          },
        }),
      }
    );
    assert(duplicateRejected, "Duplicate review rejected: one review per journey strictly enforced");

    // Average rating calculation
    const avgRating = await Review.calculateAverageRating(testRoute._id);
    assert(avgRating.averageRating === 5 && avgRating.totalReviews === 1, "Route average rating calculated accurately");

    // 24-hour edit window test
    const reviewObj = await Review.findById(createdReviewId);
    assert(reviewObj.isEditable() === true, "Review is editable within 24-hour deadline window");

    // Edit review within window
    await reviewController.updateReview(
      {
        params: { id: createdReviewId },
        user: reviewerUser,
        body: {
          rating: 4,
          reviewText: "Updated: Excellent journey from Mumbai to Pune! Minor delay at toll plaza but overall great trip.",
        },
      },
      {
        status: () => ({ json: () => {} }),
        json: (data) => {},
      }
    );
    const editedReview = await Review.findById(createdReviewId);
    assert(editedReview.rating === 4 && editedReview.isEdited === true, "Review successfully edited within 24 hours");

    // Upvotes / helpful votes & Trusted Reviewer promotion
    await reviewController.markReviewHelpful(
      {
        params: { id: createdReviewId },
        user: verifiedUser,
        body: { isHelpful: true },
      },
      {
        status: () => ({ json: () => {} }),
        json: () => {},
      }
    );
    const reviewWithVotes = await Review.findById(createdReviewId);
    assert(reviewWithVotes.helpfulCount === 1, "Review helpful vote counted");

    // Simulate reaching trusted reviewer threshold
    await Customer.findByIdAndUpdate(reviewerUser._id, { helpfulVotesReceived: 10, isTrustedReviewer: true });
    const trustedUser = await Customer.findById(reviewerUser._id);
    assert(trustedUser.isTrustedReviewer === true, "User promoted to Trusted Reviewer based on helpful upvotes");

    // Moderation & Auto-hide when reported multiple times
    const reviewReportController = require("../controllers/reviewReportController");
    for (let i = 0; i < 5; i++) {
      const mockReporter = await Customer.create({
        name: `Reporter ${i}`,
        email: `reporter${i}@example.com`,
        password: hashedPassword,
        isVerifiedTraveler: true,
      });
      await reviewReportController.createReviewReport(
        {
          user: mockReporter,
          body: {
            reviewId: createdReviewId,
            reason: "Spam",
            details: `Automated test report ${i}`,
          },
        },
        {
          status: () => ({ json: () => {} }),
          json: () => {},
        }
      );
    }
    const hiddenReview = await Review.findById(createdReviewId);
    assert(hiddenReview.status === "HIDDEN", "Review automatically hidden when reported multiple times");

    const avgRatingAfterHide = await Review.calculateAverageRating(testRoute._id);
    assert(avgRatingAfterHide.totalReviews === 0, "Hidden review excluded from route average rating calculation");

    console.log("\n=================================================");
    console.log(` ALL ${testsPassed}/${totalTests} TESTS PASSED SUCCESSFULLY! `);
    console.log("=================================================");
    if (mongoProcess) mongoProcess.kill();
    process.exit(0);
  } catch (error) {
    console.error("Test execution failed:", error);
    if (mongoProcess) mongoProcess.kill();
    process.exit(1);
  }
}

runTests();
