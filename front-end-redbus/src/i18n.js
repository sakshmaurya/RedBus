import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    // Navigation
    nav: {
      busTickets: "BUS TICKETS",
      rPool: "rPool",
      busHire: "BUS HIRE",
      travelCommunity: "TRAVEL COMMUNITY",
      forum: "FORUM",
      manageBooking: "MANAGE BOOKING",
      busTicket: "Bus Ticket",
      cancel: "Cancel",
      reschedule: "Reschedule",
      showMyTicket: "Show My Ticket",
      emailSms: "Email / SMS",
      myTrips: "My Trips",
      myProfile: "My Profile",
      signOut: "SignOut",
      login: "Login",
      createAccount: "Create Account",
      adminLogin: "Admin Login",
      adminDashboard: "Admin Dashboard",
      adminLogout: "Admin Logout",
      darkMode: "Dark Mode",
      lightMode: "Light Mode"
    },
    // Homepage
    home: {
      title: "India's No.1 Online Bus Ticket Booking Site",
      subtitle: "Book bus tickets across India",
      searchPlaceholder: "Enter source city",
      destinationPlaceholder: "Enter destination city",
      searchButton: "SEARCH BUSES",
      from: "From",
      to: "To",
      date: "Date",
      globalPresence: "OUR GLOBAL PRESENCE"
    },
    // Auth
    auth: {
      loginTitle: "Login",
      registerTitle: "Create Account",
      email: "Email",
      password: "Password",
      name: "Name",
      confirmPassword: "Confirm Password",
      submit: "Submit",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      loginError: "Invalid email or password",
      registerError: "Registration failed",
      registerSuccess: "Registration successful"
    },
    // Bus Search
    busSearch: {
      from: "From",
      to: "To",
      date: "Date",
      search: "Search Buses",
      noBusesFound: "No buses found for this route",
      selectBus: "Select Bus",
      filters: "Filters",
      sortBy: "Sort By",
      price: "Price",
      duration: "Duration",
      departure: "Departure",
      arrival: "Arrival"
    },
    // Bus Details
    busDetails: {
      seats: "Seats",
      selectSeats: "Select Seats",
      viewSeats: "View Seats",
      fare: "Fare",
      totalFare: "Total Fare",
      bookNow: "Book Now",
      amenities: "Amenities",
      boardingPoints: "Boarding Points",
      droppingPoints: "Dropping Points",
      busType: "Bus Type",
      operator: "Operator",
      rating: "Rating"
    },
    // Booking
    booking: {
      passengerDetails: "Passenger Details",
      passengerInformation: "Passenger Information",
      passenger: "Passenger",
      seat: "Seat",
      passengerName: "Passenger Name",
      age: "Age",
      gender: "Gender",
      contact: "Contact",
      contactDetails: "Contact Details",
      ticketMessage: "Your ticket will be sent to these details",
      email: "Email",
      phone: "Phone",
      payment: "Payment",
      confirmBooking: "Confirm Booking",
      bookingSuccess: "Booking Confirmed!",
      bookingFailed: "Booking Failed",
      male: "Male",
      female: "Female",
      other: "Other"
    },
    // Profile
    profile: {
      myProfile: "My Profile",
      editProfile: "Edit Profile",
      myTrips: "My Trips",
      notifications: "Notifications",
      settings: "Settings",
      personalInfo: "Personal Information",
      accountSettings: "Account Settings"
    },
    // Community
    community: {
      travelCommunity: "Travel Community",
      createPost: "Create Post",
      shareExperience: "Share your travel experience",
      like: "Like",
      comment: "Comment",
      share: "Share",
      noPosts: "No posts yet",
      postTitle: "Post Title",
      postDescription: "Post Description",
      route: "Route",
      routePlaceholder: "Route (e.g. Mumbai to Pune)",
      destination: "Destination",
      destinationPlaceholder: "Destination (e.g. Pune)",
      uploadImages: "Upload Images",
      shareOnTwitter: "Share on X",
      shareOnWhatsApp: "Share on WhatsApp",
      shareOnFacebook: "Share on Facebook",
      copyLink: "Copy Link",
      linkCopied: "Link copied to clipboard!",
      verifiedTraveler: "Verified Traveler"
    },
    // Route Planner
    routePlanner: {
      title: "Route Planner",
      startLocation: "Start Location",
      destination: "Destination",
      addWaypoint: "Add Waypoint",
      calculateRoute: "Calculate Route",
      distance: "Distance",
      duration: "Duration",
      traffic: "Traffic",
      lowTraffic: "Low Traffic",
      moderateTraffic: "Moderate Traffic",
      heavyTraffic: "Heavy Traffic",
      saveRoute: "Save Route",
      savedRoutes: "Saved Routes",
      noSavedRoutes: "No saved routes",
      compareRoutes: "Compare Routes",
      sortByDistance: "Shortest Distance",
      sortByDuration: "Fastest Time",
      sortByTraffic: "Lowest Traffic Delay",
      trafficDelay: "Traffic Delay",
      alternativeRoutes: "Alternative Routes Available",
      liveUpdates: "Live Traffic Updates",
      updatedJustNow: "Updated just now",
      trafficAlert: "Real-time Traffic Alert",
      recommended: "Recommended"
    },
    // Dark Mode
    theme: {
      lightMode: "Light Mode",
      darkMode: "Dark Mode"
    },
    // Language
    language: {
      english: "English",
      hindi: "हिन्दी"
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      submit: "Submit",
      search: "Search",
      filter: "Filter",
      sort: "Sort"
    },
    // Footer
    footer: {
      busHireCities: "Bus Hire Cities",
      busHireAhmedabad: "Bus Hire in Ahmedabad",
      busHireMumbai: "Bus Hire in Mumbai",
      busHireBangalore: "Bus Hire in Bangalore",
      busHireChennai: "Bus Hire in Chennai",
      busHirePune: "Bus Hire in Pune",
      busHireHyderabad: "Bus Hire in Hyderabad",
      busHireDelhi: "Bus Hire in Delhi",
      tempoTravellers: "Tempo travellers in other cities",
      tempoBangalore: "Tempo travellers in Bangalore",
      tempoAhmedabad: "Tempo travellers in Ahmedabad",
      tempoCoimbatore: "Tempo travellers in Coimbatore",
      tempoVadodara: "Tempo travellers in Vadodara",
      tempoKolkata: "Tempo travellers in Kolkata",
      tempoDelhi: "Tempo travellers in Delhi",
      tempoPune: "Tempo travellers in Pune",
      tempoMumbai: "Tempo travellers in Mumbai",
      tempoHyderabad: "Tempo travellers in Hyderabad",
      tempoChennai: "Tempo travellers in Chennai",
      book: "Book",
      busTicket: "Bus Ticket",
      busHire: "Bus hire",
      carRentals: "Car Rentals",
      about: "About",
      aboutUs: "About us",
      contactUs: "Contact us",
      info: "Info",
      tAndC: "T & C",
      privacyPolicy: "Privacy Policy",
      cookiePolicy: "Cookie Policy",
      faq: "FAQ",
      globalSites: "Global Sites",
      india: "India",
      singapore: "Singapore",
      malaysia: "Malaysia",
      indonesia: "Indonesia",
      peru: "Peru",
      colombia: "Colombia",
      ourPartners: "Our Partners",
      goibibo: "Goibibo",
      makemytrip: "Makemytrip",
      copyright: "Ⓒ 2026 RedBus All rights reserved"
    },
    // Landing Page Stats
    stats: {
      numbersGrowing: "THE NUMBERS ARE GROWING",
      customers: "customers",
      customersCount: "23 M",
      customersDesc: "redBus is trusted by over 23 million happy customers globally",
      operators: "OPERATORS",
      operatorsCount: "2600",
      operatorsDesc: "network of over 2600 bus operators worldwide",
      busTickets: "BUS TICKETS",
      busTicketsCount: "180+ M",
      busTicketsDesc: "Over 180 million trips booked using redBus"
    },
    // Safety+ Program
    safety: {
      title: "Introducing Safety+ Program",
      subtitle: "A unique certification program that ensures safety in all buses",
      knowMore: "know More",
      optToTravel: "Opt to Travel Safe with redBus",
      knowMore2: "Know more",
      lookForBuses: "Look for buses with safety+ tag while booking your journey",
      sanitizedBus: "Sanitized Bus",
      sanitizedBusDesc: "All Safety+ buses are sanitized and disinfected before and after every trip.",
      mandatoryMasks: "Mandatory masks",
      mandatoryMasksDesc: "Proper masks are mandatory for all passengers and bus staff.",
      thermalScreening: "Thermal Screening",
      thermalScreeningDesc: "All passengers will undergo thermal screening. Temperature checks for bus drivers and service staff are done before every trip."
    },
    // Coupon Section
    coupon: {
      saveUpTo: "save upto rs 150",
      coupon1: "coupon-1",
      useCode: "Use code FIRST"
    },
    // Track My Bus
    trackBus: {
      title: "TRACK MY BUS - Smarter Way To Travel",
      description: "Track your bus with our 'Track My Bus' feature and know the exact location in real-time.Stay informed and keep your family informed!",
      buses: "Buses",
      busesCount: "10,000",
      busesDesc: "Total buses currently being tracked",
      routes: "Routes",
      routesCount: "60,000",
      routesDesc: "Total routes covered by live tracking",
      users: "Users",
      usersCount: "40,000",
      usersDesc: "Total users using Track My Bus feature"
    },
    // We Promise
    promise: {
      title: "We promise to deliver",
      safetyPlus: "SAFETY+",
      safetyPlusDesc: "With Safety+ we have brought in a set of measures like Sanitized buses, mandatory masks etc. to ensure you travel safely.",
      customerService: "SUPERIOR CUSTOMER SERVICE",
      customerServiceDesc: "We put our experience and relationships to good use and are available to solve your travel issues.",
      lowestPrices: "LOWEST PRICES",
      lowestPricesDesc: "We always give you the lowest price with the best partner offers. And be Poceket friendly for your upcoming trips",
      unmatchedBenefits: "UNMATCHED BENEFITS",
      unmatchedBenefitsDesc: "We take care of your travel beyond ticketing by providing you with innovative and unique benefits."
    },
    // Awards
    awards: {
      title: "AWARDS AND RECOGNITION",
      mostInnovative: "Most Innovative Company",
      mostTrusted: "Most Trusted Brand",
      mobileInnovation: "Mobile Innovation Award"
    },
    // Reviews
    reviews: {
      writeReview: "Write a Review",
      rating: "Rating",
      yourExperience: "Share your experience",
      reviewPlaceholder: "Tell us about your journey. What did you like? What could be improved?",
      characters: "characters",
      cancel: "Cancel",
      submitReview: "Submit Review",
      submitting: "Submitting...",
      recentReviews: "Recent Reviews",
      noReviews: "No reviews yet. Be the first to review!",
      loading: "Loading...",
      loadMore: "Load More",
      errorFetching: "Error fetching reviews",
      helpful: "Helpful",
      notHelpful: "Not Helpful",
      removeVote: "Remove vote",
      report: "Report",
      edit: "Edit",
      delete: "Delete",
      reportReview: "Report Review",
      reportReason: "Report Reason",
      selectReason: "Select a reason",
      spam: "Spam",
      offensiveContent: "Offensive content",
      fakeReview: "Fake review",
      harassment: "Harassment",
      irrelevantContent: "Irrelevant content",
      other: "Other",
      additionalDetails: "Additional Details (optional)",
      detailsPlaceholder: "Provide any additional details about your report...",
      submit: "Submit",
      submitReport: "Submit Report",
      trustedReviewer: "Trusted Reviewer",
      edited: "(Edited)",
      myReviews: "My Reviews"
    }
  }
};

// Hindi translations
const hi = {
  translation: {
    // Navigation
    nav: {
      busTickets: "बस टिकट",
      rPool: "rPool",
      busHire: "बस किराया",
      travelCommunity: "यात्रा समुदाय",
      forum: "मंच",
      manageBooking: "बुकिंग प्रबंधित करें",
      busTicket: "बस टिकट",
      cancel: "रद्द करें",
      reschedule: "पुनर्निर्धारित करें",
      showMyTicket: "मेरा टिकट दिखाएं",
      emailSms: "ईमेल / एसएमएस",
      myTrips: "मेरी यात्राएं",
      myProfile: "मेरी प्रोफाइल",
      signOut: "साइन आउट",
      login: "लॉग इन",
      createAccount: "खाता बनाएं",
      adminLogin: "एडमिन लॉग इन",
      adminDashboard: "एडमिन डैशबोर्ड",
      adminLogout: "एडमिन लॉग आउट",
      darkMode: "डार्क मोड",
      lightMode: "लाइट मोड"
    },
    // Homepage
    home: {
      title: "भारत का नंबर 1 ऑनलाइन बस टिकट बुकिंग साइट",
      subtitle: "भारत भर में बस टिकट बुक करें",
      searchPlaceholder: "स्रोत शहर दर्ज करें",
      destinationPlaceholder: "गंतव्य शहर दर्ज करें",
      searchButton: "बस खोजें",
      from: "से",
      to: "तक",
      date: "दिनांक",
      globalPresence: "हमारी वैश्विक उपस्थिति"
    },
    // Auth
    auth: {
      loginTitle: "लॉग इन",
      registerTitle: "खाता बनाएं",
      email: "ईमेल",
      password: "पासवर्ड",
      name: "नाम",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      submit: "जमा करें",
      alreadyHaveAccount: "पहले से खाता है?",
      dontHaveAccount: "खाता नहीं है?",
      loginError: "अमान्य ईमेल या पासवर्ड",
      registerError: "पंजीकरण विफल",
      registerSuccess: "पंजीकरण सफल"
    },
    // Bus Search
    busSearch: {
      from: "से",
      to: "तक",
      date: "दिनांक",
      search: "बस खोजें",
      noBusesFound: "इस मार्ग के लिए कोई बस नहीं मिली",
      selectBus: "बस चुनें",
      filters: "फ़िल्टर",
      sortBy: "क्रमबद्ध करें",
      price: "कीमत",
      duration: "अवधि",
      departure: "प्रस्थान",
      arrival: "आगमन"
    },
    // Bus Details
    busDetails: {
      seats: "सीटें",
      selectSeats: "सीटें चुनें",
      viewSeats: "सीटें देखें",
      fare: "किराया",
      totalFare: "कुल किराया",
      bookNow: "अभी बुक करें",
      amenities: "सुविधाएं",
      boardingPoints: "बोर्डिंग पॉइंट",
      droppingPoints: "ड्रॉपिंग पॉइंट",
      busType: "बस प्रकार",
      operator: "ऑपरेटर",
      rating: "रेटिंग"
    },
    // Booking
    booking: {
      passengerDetails: "यात्री विवरण",
      passengerInformation: "यात्री जानकारी",
      passenger: "यात्री",
      seat: "सीट",
      passengerName: "यात्री का नाम",
      age: "आयु",
      gender: "लिंग",
      contact: "संपर्क",
      contactDetails: "संपर्क विवरण",
      ticketMessage: "आपका टिकट इन विवरणों पर भेजा जाएगा",
      email: "ईमेल",
      phone: "फोन",
      payment: "भुगतान",
      confirmBooking: "बुकिंग की पुष्टि करें",
      bookingSuccess: "बुकिंग की पुष्टि हो गई!",
      bookingFailed: "बुकिंग विफल",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य"
    },
    // Profile
    profile: {
      myProfile: "मेरी प्रोफाइल",
      editProfile: "प्रोफाइल संपादित करें",
      myTrips: "मेरी यात्राएं",
      notifications: "सूचनाएं",
      settings: "सेटिंग्स",
      personalInfo: "व्यक्तिगत जानकारी",
      accountSettings: "खाता सेटिंग्स"
    },
    // Community
    community: {
      travelCommunity: "यात्रा समुदाय",
      createPost: "पोस्ट बनाएं",
      shareExperience: "अपना यात्रा अनुभव साझा करें",
      like: "पसंद",
      comment: "टिप्पणी",
      share: "साझा करें",
      noPosts: "अभी तक कोई पोस्ट नहीं",
      postTitle: "पोस्ट शीर्षक",
      postDescription: "पोस्ट विवरण",
      route: "मार्ग",
      routePlaceholder: "मार्ग (उदा. मुंबई से पुणे)",
      destination: "गंतव्य",
      destinationPlaceholder: "गंतव्य (उदा. पुणे)",
      uploadImages: "चित्र अपलोड करें",
      shareOnTwitter: "X पर साझा करें",
      shareOnWhatsApp: "व्हाट्सएप पर साझा करें",
      shareOnFacebook: "फेसबुक पर साझा करें",
      copyLink: "लिंक कॉपी करें",
      linkCopied: "लिंक क्लिपबोर्ड पर कॉपी किया गया!",
      verifiedTraveler: "सत्यापित यात्री"
    },
    // Route Planner
    routePlanner: {
      title: "मार्ग नियोजक",
      startLocation: "प्रारंभ स्थान",
      destination: "गंतव्य",
      addWaypoint: "मार्ग जोड़ें",
      calculateRoute: "मार्ग की गणना करें",
      distance: "दूरी",
      duration: "अवधि",
      traffic: "ट्रैफिक",
      lowTraffic: "कम ट्रैफिक",
      moderateTraffic: "मध्यम ट्रैफिक",
      heavyTraffic: "भारी ट्रैफिक",
      saveRoute: "मार्ग सहेजें",
      savedRoutes: "सहेजे गए मार्ग",
      noSavedRoutes: "कोई सहेजा गया मार्ग नहीं",
      compareRoutes: "मार्गों की तुलना करें",
      sortByDistance: "सबसे कम दूरी",
      sortByDuration: "सबसे तेज़ समय",
      sortByTraffic: "न्यूनतम ट्रैफिक देरी",
      trafficDelay: "ट्रैफिक देरी",
      alternativeRoutes: "वैकल्पिक मार्ग उपलब्ध",
      liveUpdates: "लाइव ट्रैफिक अपडेट",
      updatedJustNow: "अभी अपडेट किया गया",
      trafficAlert: "रीयल-टाइम ट्रैफिक अलर्ट",
      recommended: "अनुशंसित"
    },
    // Dark Mode
    theme: {
      lightMode: "लाइट मोड",
      darkMode: "डार्क मोड"
    },
    // Language
    language: {
      english: "English",
      hindi: "हिन्दी"
    },
    // Common
    common: {
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      cancel: "रद्द करें",
      save: "सहेजें",
      delete: "हटाएं",
      edit: "संपादित करें",
      close: "बंद करें",
      submit: "जमा करें",
      search: "खोजें",
      filter: "फ़िल्टर",
      sort: "क्रमबद्ध करें"
    },
    // Footer
    footer: {
      busHireCities: "बस किराया शहर",
      busHireAhmedabad: "अहमदाबाद में बस किराया",
      busHireMumbai: "मुंबई में बस किराया",
      busHireBangalore: "बैंगलोर में बस किराया",
      busHireChennai: "चेन्नई में बस किराया",
      busHirePune: "पुणे में बस किराया",
      busHireHyderabad: "हैदराबाद में बस किराया",
      busHireDelhi: "दिल्ली में बस किराया",
      tempoTravellers: "अन्य शहरों में टेम्पो यात्री",
      tempoBangalore: "बैंगलोर में टेम्पो यात्री",
      tempoAhmedabad: "अहमदाबाद में टेम्पो यात्री",
      tempoCoimbatore: "कोयंबटूर में टेम्पो यात्री",
      tempoVadodara: "वडोदरा में टेम्पो यात्री",
      tempoKolkata: "कोलकाता में टेम्पो यात्री",
      tempoDelhi: "दिल्ली में टेम्पो यात्री",
      tempoPune: "पुणे में टेम्पो यात्री",
      tempoMumbai: "मुंबई में टेम्पो यात्री",
      tempoHyderabad: "हैदराबाद में टेम्पो यात्री",
      tempoChennai: "चेन्नई में टेम्पो यात्री",
      book: "बुक करें",
      busTicket: "बस टिकट",
      busHire: "बस किराया",
      carRentals: "कार किराया",
      about: "हमारे बारे में",
      aboutUs: "हमारे बारे में",
      contactUs: "संपर्क करें",
      info: "जानकारी",
      tAndC: "नियम और शर्तें",
      privacyPolicy: "गोपनीयता नीति",
      cookiePolicy: "कुकी नीति",
      faq: "सामान्य प्रश्न",
      globalSites: "वैश्विक साइटें",
      india: "भारत",
      singapore: "सिंगापुर",
      malaysia: "मलेशिया",
      indonesia: "इंडोनेशिया",
      peru: "पेरू",
      colombia: "कोलंबिया",
      ourPartners: "हमारे भागीदार",
      goibibo: "गोइबिबो",
      makemytrip: "मेकमाईट्रिप",
      copyright: "Ⓒ 2026 RedBus सर्वाधिकार सुरक्षित"
    },
    // Landing Page Stats
    stats: {
      numbersGrowing: "संख्याएं बढ़ रही हैं",
      customers: "ग्राहक",
      customersCount: "23 मिलियन",
      customersDesc: "रेडबस 23 मिलियन से अधिक खुश ग्राहकों द्वारा विश्व स्तर पर विश्वसनीय है",
      operators: "ऑपरेटर",
      operatorsCount: "2600",
      operatorsDesc: "दुनिया भर में 2600 से अधिक बस ऑपरेटरों का नेटवर्क",
      busTickets: "बस टिकट",
      busTicketsCount: "180+ मिलियन",
      busTicketsDesc: "रेडबस का उपयोग करके 180 मिलियन से अधिक यात्राएं बुक की गईं"
    },
    // Safety+ Program
    safety: {
      title: "सेफ्टी+ प्रोग्राम पेश कर रहे हैं",
      subtitle: "एक अनूठा प्रमाणन कार्यक्रम जो सभी बसों में सुरक्षा सुनिश्चित करता है",
      knowMore: "और जानें",
      optToTravel: "रेडबस के साथ सुरक्षित यात्रा करें",
      knowMore2: "और जानें",
      lookForBuses: "अपनी यात्रा बुक करते समय सेफ्टी+ टैग वाली बसों की तलाश करें",
      sanitizedBus: "सैनिटाइज्ड बस",
      sanitizedBusDesc: "सभी सेफ्टी+ बसों को हर यात्रा से पहले और बाद में सैनिटाइज और डिसइन्फेक्ट किया जाता है।",
      mandatoryMasks: "अनिवार्य मास्क",
      mandatoryMasksDesc: "सभी यात्रियों और बस स्टाफ के लिए उचित मास्क अनिवार्य हैं।",
      thermalScreening: "थर्मल स्क्रीनिंग",
      thermalScreeningDesc: "सभी यात्रियों का थर्मल स्क्रीनिंग होगा। बस ड्राइवरों और सेवा स्टाफ के लिए तापमान जांच हर यात्रा से पहले की जाती है।"
    },
    // Coupon Section
    coupon: {
      saveUpTo: "150 रुपये तक बचाएं",
      coupon1: "कूपन-1",
      useCode: "कोड FIRST का उपयोग करें"
    },
    // Track My Bus
    trackBus: {
      title: "मेरी बस ट्रैक करें - यात्रा करने का एक स्मार्ट तरीका",
      description: "हमारे 'मेरी बस ट्रैक करें' सुविधा के साथ अपनी बस को ट्रैक करें और रियल-टाइम में सटीक स्थान जानें। सूचित रहें और अपने परिवार को सूचित रखें!",
      buses: "बसें",
      busesCount: "10,000",
      busesDesc: "वर्तमान में ट्रैक की जा रही कुल बसें",
      routes: "मार्ग",
      routesCount: "60,000",
      routesDesc: "लाइव ट्रैकिंग द्वारा कवर किए गए कुल मार्ग",
      users: "उपयोगकर्ता",
      usersCount: "40,000",
      usersDesc: "मेरी बस ट्रैक करें सुविधा का उपयोग करने वाले कुल उपयोगकर्ता"
    },
    // We Promise
    promise: {
      title: "हम वितरण करने का वादा करते हैं",
      safetyPlus: "सेफ्टी+",
      safetyPlusDesc: "सेफ्टी+ के साथ हमने सैनिटाइज्ड बसों, अनिवार्य मास्क आदि जैसे उपायों का एक सेट लाया है ताकि आप सुरक्षित रूप से यात्रा कर सकें।",
      customerService: "श्रेष्ठ ग्राहक सेवा",
      customerServiceDesc: "हम अपने अनुभव और संबंधों का अच्छा उपयोग करते हैं और आपकी यात्रा समस्याओं को हल करने के लिए उपलब्ध हैं।",
      lowestPrices: "सबसे कम कीमत",
      lowestPricesDesc: "हम हमेशा आपको सर्वोत्तम भागीदार प्रस्तावों के साथ सबसे कम कीमत देते हैं। और अपनी आने वाली यात्राओं के लिए बजट-अनुकूल रहें",
      unmatchedBenefits: "अद्वितीय लाभ",
      unmatchedBenefitsDesc: "हम टिकटिंग से परे आपकी यात्रा का ध्यान रखते हैं और आपको नवाचारी और अनूठे लाभ प्रदान करते हैं।"
    },
    // Awards
    awards: {
      title: "पुरस्कार और मान्यता",
      mostInnovative: "सबसे अभिनव कंपनी",
      mostTrusted: "सबसे विश्वसनीय ब्रांड",
      mobileInnovation: "मोबाइल नवाचार पुरस्कार"
    },
    // Reviews
    reviews: {
      writeReview: "समीक्षा लिखें",
      rating: "रेटिंग",
      yourExperience: "अपना अनुभव साझा करें",
      reviewPlaceholder: "हमें अपनी यात्रा के बारे में बताएं। आपको क्या पसंद आया? क्या सुधार हो सकता है?",
      characters: "वर्ण",
      cancel: "रद्द करें",
      submitReview: "समीक्षा जमा करें",
      submitting: "जमा कर रहा है...",
      recentReviews: "हाल की समीक्षाएं",
      noReviews: "अभी तक कोई समीक्षा नहीं। पहले समीक्षा करें!",
      loading: "लोड हो रहा है...",
      loadMore: "और लोड करें",
      errorFetching: "समीक्षाएं लाने में त्रुटि",
      helpful: "मददगार",
      notHelpful: "मददगार नहीं",
      removeVote: "वोट हटाएं",
      report: "रिपोर्ट",
      edit: "संपादित करें",
      delete: "हटाएं",
      reportReview: "समीक्षा की रिपोर्ट करें",
      reportReason: "रिपोर्ट का कारण",
      selectReason: "एक कारण चुनें",
      spam: "स्पैम",
      offensiveContent: "आपत्तिजनक सामग्री",
      fakeReview: "नकली समीक्षा",
      harassment: "परेशानी",
      irrelevantContent: "अप्रासंगिक सामग्री",
      other: "अन्य",
      additionalDetails: "अतिरिक्त विवरण (वैकल्पिक)",
      detailsPlaceholder: "अपनी रिपोर्ट के बारे में कोई अतिरिक्त विवरण प्रदान करें...",
      submit: "जमा करें",
      submitReport: "रिपोर्ट जमा करें",
      trustedReviewer: "विश्वसनीय समीक्षक",
      edited: "(संपादित)",
      myReviews: "मेरी समीक्षाएं"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      hi: hi
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
