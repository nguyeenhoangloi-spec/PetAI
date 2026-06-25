/**
 * i18n.js — PetAI Language Switching Engine v2.0
 * Full bilingual support: Vietnamese / English
 * - Applies [data-i18n] text, [data-i18n-placeholder], [data-i18n-aria], [data-i18n-title]
 * - Persists language in localStorage key "siteLanguage"
 * - Exposes window.PetAI_i18n API
 */
(function () {
  "use strict";

  var TRANSLATIONS = {
    "vi": {
      "homePageTitle": "PetAI | Nhận diện giống chó thông minh",
      "homeHeroTag": "ĐỀ TÀI: NHẬN DIỆN GIỐNG CHÓ",
      "homeHeroTitle": "NHẬN DIỆN GIỐNG CHÓ",
      "homeHeroDesc": "Xác định chó thuần chủng và chó lai từ ảnh đầu vào, trả về Top-3 giống cùng độ tin cậy và giải thích trực quan.",
      "homeStartBtn": "Bắt đầu nhận diện",
      "homeHowItWorks": "Cách hoạt động",
      "homeAccuracy": "ĐỘ CHÍNH XÁC",
      "homeTryNow": "Thử ngay",
      "homeFeaturesTitle": "Điều gì làm PetAI nổi bật?",
      "homeFeaturesSub": "Trải nghiệm nhận diện nhanh, rõ ràng và dễ hiểu.",
      "homeFeature1Title": "Nhận diện nhanh",
      "homeFeature2Title": "Top-3 giống",
      "homeFeature3Title": "Giải thích trực quan",
      "homeFeature4Title": "Lưu lịch sử",
      "homeDetail1Title": "Nhận diện nhanh, rõ trong vài giây",
      "homeDetail1Desc": "PetAI phân tích ảnh và trả về kết quả rõ ràng, giúp bạn nhận diện giống chó nhanh chóng.",
      "homeDetail1Point1": "Xử lý ảnh nhanh, không chờ lâu",
      "homeDetail1Point2": "Top-3 kết quả kèm độ tin cậy",
      "homeDetail1Point3": "Gợi ý vùng đặc trưng dễ hiểu",
      "homeDemoTitle": "MINH HỌA KẾT QUẢ",
      "homeViewHistory": "Xem lịch sử nhận diện",
      "homeDetail2Title": "Top-3 giống để dễ so sánh",
      "homeDetail2Desc": "Hệ thống trả về 3 giống có khả năng xuất hiện cao nhất, hữu ích cho trường hợp chó lai.",
      "homeDetail2Point1": "Kết quả sắp xếp theo độ tin cậy",
      "homeDetail2Point2": "So sánh nhanh giữa các giống gần nhau",
      "homeDetail2Point3": "Gợi ý phù hợp cho chó lai",
      "homeTop3Title": "TOP-3 GỢI Ý",
      "homeDemoDisclaimer": "Kết quả minh họa, tỷ lệ có thể thay đổi.",
      "homeDetail3Title": "Giải thích trực quan, dễ hiểu",
      "homeDetail3Desc": "Làm nổi bật vùng đặc trưng giúp bạn hiểu vì sao AI đưa ra kết quả.",
      "homeDetail3Point1": "Highlight vùng tai, mắt, mõm",
      "homeDetail3Point2": "Hình ảnh trực quan, dễ theo dõi",
      "homeDetail3Point3": "Tăng độ tin cậy khi tham khảo",
      "homeHighlightedRegions": "VÙNG NỔI BẬT",
      "homeDemoRegionDesc": "Vùng tai và mắt được đánh dấu rõ ràng.",
      "homeDemoHeatmapDesc": "Mô phỏng minh họa heatmap.",
      "homeDetail4Title": "Lưu lịch sử để tra cứu lại",
      "homeDetail4Desc": "Xem lại các lần nhận diện trước đó, tiện so sánh và chia sẻ.",
      "homeDetail4Point1": "Lưu kết quả tự động theo thời gian",
      "homeDetail4Point2": "Lọc nhanh theo giống hoặc ngày",
      "homeDetail4Point3": "Chia sẻ kết quả với bạn bè",
      "homeRecentHistoryTitle": "LỊCH SỬ GẦN NHẤT",
      "homeOpenHistoryBtn": "Mở lịch sử",
      "homeCommunityTitle": "ĐƯỢC TIN DÙNG BỞI CỘNG ĐỒNG YÊU THÚ CƯNG",
      "homeCommunitySub": "PetAI hỗ trợ người nuôi chó, cửa hàng thú cưng và phòng khám thú y ra quyết định nhanh hơn từ ảnh chụp thực tế.",
      "homeStatsUsers": "NGƯỜI DÙNG",
      "homeStatsUsersDesc": "Tài khoản đã đăng ký",
      "homeStatsPredictions": "DỰ ĐOÁN",
      "homeStatsPredictionsDesc": "Lượt nhận diện đã xử lý",
      "homeStatsAccuracyDesc": "Tối ưu cho chó thuần và chó lai",
      "homeStatsSupport": "HỖ TRỢ",
      "homeStatsSupportDesc": "Hỗ trợ trong quá trình sử dụng",
      "homeCoreValuesTitle": "GIÁ TRỊ CỐT LÕI",
      "homeCoreValuesSub": "Nhận diện nhanh, rõ ràng, dễ hiểu với công nghệ học sâu tiên tiến.",
      "homeCoreValue1Tag": "01 / DỮ LIỆU",
      "homeCoreValue1Title": "120+ giống chó",
      "homeCoreValue1Desc": "Phân loại đầy đủ các giống phổ biến và nhận diện chó lai với kho dữ liệu khổng lồ.",
      "homeCoreValue2Tag": "02 / KẾT QUẢ",
      "homeCoreValue2Title": "Top-3 kết quả",
      "homeCoreValue2Desc": "Trả về 3 giống có khả năng cao nhất, tối ưu cho chó lai.",
      "homeCoreValue3Tag": "03 / TRỰC QUAN",
      "homeCoreValue3Desc": "Làm nổi bật các vùng đặc trưng (tai, mắt, mõm) giúp AI nhận diện giống chó chính xác.",
      "homeCoreValue4Tag": "04 / BẢO MẬT",
      "homeCoreValue4Title": "Bảo vệ dữ liệu",
      "homeCoreValue4Desc": "Ảnh tải lên được xử lý an toàn và chỉ dùng cho mục đích nhận diện.",
      "homeCoreValue5Tag": "05 / HIỆU NĂNG",
      "homeCoreValue5Title": "Xử lý tức thì",
      "homeCoreValue5Desc": "Kết quả rõ trong vài giây nhờ hệ thống tối ưu hóa hiệu năng cao.",
      "homePricingTitle": "BẢNG GIÁ MINH BẠCH",
      "homePricingSub": "Chọn gói phù hợp với nhu cầu nhận diện của bạn.",
      "homeForever": "vĩnh viễn",
      "homePlanFreeScans": "10 lượt nhận diện",
      "homePlanFreeAds": "Tối đa 3 lần xem QC",
      "homePlanFreeSuit": "Phù hợp dùng thử",
      "homePlanFreeBtn": "Bắt đầu",
      "homePricing7Days": "7 ngày",
      "homePricing30Days": "30 ngày",
      "homePricing90Days": "90 ngày",
      "homePlanEntScans": "Không giới hạn lượt",
      "homePlanChooseBtn": "Chọn gói",
      "homePlanProBtn": "Chọn Pro",
      "homeWorkflowTitle": "Quy trình nhận diện",
      "homeWorkflowSub": "Từ ảnh đầu vào đến kết quả cuối cùng chỉ trong vài giây.",
      "homeStep1Tag": "BƯỚC 1 - TẢI ẢNH",
      "homeStep1Title": "Tải ảnh rõ nét",
      "homeStep1Desc": "Chụp ảnh chính diện, ánh sáng tốt để tăng độ chính xác.",
      "homeStep1Status": "SẴN SÀNG",
      "homeStep2Tag": "BƯỚC 2 - AI PHÂN TÍCH",
      "homeStep2Title": "Mô hình YOLOv8 + phân loại",
      "homeStep2Desc": "Phát hiện chó và phân loại giống theo đặc trưng khuôn mặt.",
      "homeStep2Status": "Xử lý tức thì",
      "homeStep3Tag": "BƯỚC 3 - TRẢ KẾT QUẢ",
      "homeStep3Title": "Top-3 giống & độ tin cậy",
      "homeStep3Status": "Hoàn thành",
      "homeAudienceTitle": "Phù hợp cho nhiều nhóm người dùng",
      "homeAudience1Title": "Người nuôi thú cưng",
      "homeAudience1Desc": "Kiểm tra nhanh giống chó để theo dõi chăm sóc và định hướng huấn luyện.",
      "homeAudience2Title": "Cửa hàng thú cưng",
      "homeAudience2Desc": "Hỗ trợ tư vấn cho khách dựa trên kết quả AI rõ ràng và dễ hiểu.",
      "homeAudience3Title": "Phòng khám thú y",
      "homeAudience3Desc": "Có thêm dữ liệu tham khảo ban đầu trước khi tiếp nhận và đánh giá.",
      "homeFaqTitle": "CÂU HỎI THƯỜNG GẶP",
      "homeFaqSub": "Giải đáp nhanh các thắc mắc về PetAI.",
      "homeFaq1Q": "Kết quả có chính xác 100% không?",
      "homeFaq1A": "Không. Hệ thống AI trả về kết quả dựa trên xác suất từ kho dữ liệu huấn luyện. Chúng tôi cung cấp Top-3 giống có độ tin cậy cao nhất để người dùng có cái nhìn khách quan và tham khảo tốt hơn, đặc biệt hữu ích với trường hợp chó lai.",
      "homeFaq2Q": "Mất bao lâu để có kết quả?",
      "homeFaq2A": "Hệ thống được tối ưu hóa để trả về kết quả chỉ trong vòng vài giây (thường từ 2-5 giây) sau khi ảnh được tải lên thành công. Tốc độ này có thể thay đổi nhẹ tùy thuộc vào tốc độ mạng của bạn và kích thước file ảnh.",
      "homeFaq3Q": "Ảnh tải lên được xử lý như thế nào?",
      "homeFaq3A": "Mỗi hình ảnh bạn tải lên đều được mã hóa và truyền tải qua giao thức bảo mật. PetAI cam kết chỉ sử dụng ảnh cho mục đích nhận diện giống chó và không chia sẻ dữ liệu cá nhân của bạn với bất kỳ bên thứ ba nào khi chưa có sự đồng ý.",
      "homeFaq4Q": "PetAI có hỗ trợ chó lai không?",
      "homeFaq4A": "Có, PetAI được thiết kế đặc biệt để xử lý cả chó thuần chủng và chó lai. Với chó lai, hệ thống sẽ phân tích các đặc điểm hình thái và hiển thị Top-3 giống chó có đặc điểm tương đồng nhất kèm theo tỷ lệ phần trăm tin cậy cho mỗi giống.",
      "homeCtaSub": "Rõ trong vài giây",
      "homeCtaDesc": "Top-3 giống, độ tin cậy rõ ràng. Tham gia cùng cộng đồng hàng ngàn người yêu thú cưng đang sử dụng PetAI mỗi ngày.",
      "homeStartFreeBtn": "Bắt đầu miễn phí",
      "homeGuideBtn": "Hướng dẫn sử dụng",
      "lockAccountBtn": "Khoá tài khoản",
      "unlockAccountBtn": "Mở khoá tài khoản",
      "deleteUserBtn": "Xoá người dùng",
      "reportedTransfer": "Đã báo chuyển",
      "pendingConfirmOrders": "Đơn chờ duyệt",
      "confirmPaymentTitle": "Xác nhận thanh toán",
      "confirmPaymentSub": "Vui lòng kiểm tra gói dịch vụ đã chọn và tiếp tục",
      "adUnlockRemaining": "Lần mở khóa còn lại",
      "adViewsUsed": "Quảng cáo đã xem",
      "adsWatchedLabel": "Quảng cáo đã xem",
      "languageLabel": "Tiếng Việt",
      "languageFlag": "🇻🇳",
      "shortLabel": "VN",
      "home": "Trang chủ",
      "product": "Sản phẩm",
      "features": "Tính năng",
      "pricing": "Bảng giá",
      "about": "Giới thiệu",
      "login": "Đăng nhập",
      "register": "Đăng ký",
      "logout": "Đăng xuất",
      "dashboard": "Bảng điều khiển",
      "predict": "Nhận diện",
      "uploadPhotoBtn": "Nhận diện",
      "history": "Lịch sử",
      "statistics": "Thống kê",
      "upgrade": "Nâng cấp",
      "payments": "Lịch sử thanh toán",
      "manageUsers": "Người dùng",
      "approveOrders": "Đơn duyệt",
      "systemConfig": "Cấu hình",
      "adminGroupTitle": "QUẢN TRỊ",
      "quickAccess": "Truy cập nhanh",
      "uploadAnalyze": "Phân tích",
      "predictionHistory": "Lịch sử",
      "personalStats": "Thống kê",
      "upgradePlan": "Nâng cấp",
      "personalInfo": "Thông tin cá nhân",
      "accountSettings": "Cài đặt",
      "role": "Vai trò:",
      "plan": "Gói:",
      "aboutPetAI": "Về PetAI",
      "connect": "Kết nối",
      "identifyNow": "Nhận diện ngay",
      "collection": "Bộ sưu tập",
      "privacy": "Chính sách quyền riêng tư",
      "terms": "Điều khoản sử dụng",
      "dataDeletion": "Chính sách xóa dữ liệu",
      "support": "Hỗ trợ",
      "contact": "Liên hệ",
      "copyright": "Bản quyền © 2026 PetAI. Mọi quyền được bảo lưu",
      "footerUserGuide": "HƯỚNG DẪN SỬ DỤNG",
      "footerTerms": "ĐIỀU KHOẢN",
      "footerPrivacy": "BẢO MẬT",
      "footerDesc": "Ứng dụng nhận diện giống chó bằng AI dành cho người yêu thú cưng. Kết quả chính xác, nhanh chóng.",
      "dashWelcomeDesc": "Theo dõi nhanh hoạt động nhận diện, lịch sử và hiệu suất dự đoán của bạn.",
      "uploadNew": "Tải ảnh mới",
      "viewHistory": "Xem lịch sử",
      "totalRevenue": "Tổng doanh thu",
      "revenueFromPaid": "Từ các gói đã thanh toán",
      "totalUsers": "Tổng người dùng",
      "registeredAccounts": "Tài khoản đã đăng ký",
      "newThisWeek": "mới tuần này",
      "pendingOrders": "Đơn chờ duyệt",
      "viewPendingList": "Xem danh sách chờ duyệt",
      "todayNew": "hôm nay",
      "totalSystemPredictions": "Tổng dự đoán hệ thống",
      "allSystemScans": "Toàn bộ lượt quét của hệ thống",
      "todayCount": "hôm nay",
      "totalPredictions": "Tổng dự đoán",
      "yourScans": "Lượt quét của riêng bạn",
      "avgConfidence": "Độ tin cậy TB",
      "avgAccuracy": "Độ chính xác trung bình",
      "breedsAnalyzed": "Giống đã phân tích",
      "uniqueBreedsFound": "Giống chó khác nhau bạn nhận diện",
      "viewReport": "Xem báo cáo",
      "detailedStats": "Thống kê chi tiết",
      "deepAnalysis": "Phân tích sâu về lịch sử quét của bạn",
      "financialAnalytics": "Phân tích Tài chính",
      "revenueAndPlans": "Doanh thu & phân bổ gói dịch vụ",
      "revenueTrend": "Xu hướng Doanh thu",
      "revenueTrendSubtitle": "Tổng tiền từ đơn đã thanh toán (VND)",
      "days7": "7 ngày",
      "days30": "30 ngày",
      "days90": "90 ngày",
      "months12": "12 tháng",
      "custom": "Tùy chọn",
      "selectDateRange": "Chọn khoảng thời gian",
      "fromDate": "Từ ngày",
      "toDate": "Đến ngày",
      "apply": "Áp dụng",
      "subscriptionDistribution": "Phân bổ Gói đăng ký",
      "subscriptionByUser": "Tỷ lệ người dùng theo từng gói",
      "planDetails": "Chi tiết gói dịch vụ",
      "activityCharts": "Biểu đồ hoạt động",
      "liveUpdate": "Cập nhật trực tiếp",
      "predTrend7": "Xu hướng dự đoán 7 ngày gần đây",
      "predTrendSubtitle": "Số lượng ảnh đã nhận diện mỗi ngày",
      "last7days": "7 ngày qua",
      "top5Breeds": "Top 5 giống phổ biến nhất",
      "top5BreedsSubtitle": "Các giống chó được nhận diện nhiều nhất",
      "confidenceDist": "Phân bố độ tin cậy",
      "confidenceDistSubtitle": "Mức độ tin cậy của thuật toán phân loại",
      "recentResults": "Kết quả gần đây",
      "viewAll": "Xem tất cả",
      "viewAllResults": "Xem tất cả kết quả",
      "today": "Hôm nay",
      "yesterday": "Hôm qua",
      "last7daysTab": "7 ngày gần đây",
      "emptyDashboard": "Bạn chưa có lịch sử nhận diện nào. Hãy bắt đầu bằng cách tải ảnh mới.",
      "predictionLabel": "Dự đoán:",
      "historyTitle": "Lịch sử nhận diện",
      "totalPredictionsLabel": "Tổng nhận diện",
      "imageScanCount": "Lượt phân tích ảnh",
      "pureDog": "Chó thuần",
      "pureBreed": "Giống thuần",
      "hybridDog": "Chó lai",
      "hybridBreed": "Giống nghi lai phối",
      "avgConfidenceLabel": "Độ tin cậy TB",
      "avgAccuracyLabel": "Độ chính xác trung bình",
      "identificationList": "Danh sách nhận diện",
      "newIdentification": "Nhận diện mới",
      "all": "Tất cả",
      "searchBreed": "Tìm kiếm giống...",
      "clearSearch": "Xoá tìm kiếm",
      "viewDetail": "Xem chi tiết",
      "emptyHistory": "Chưa có lịch sử nhận diện",
      "emptyHistoryDesc": "Hãy tải ảnh đầu tiên để bắt đầu hành trình dự đoán giống chó.",
      "startNow": "Bắt đầu ngay",
      "modalBreedLabel": "Giống:",
      "modalConfLabel": "Độ tin cậy:",
      "modalDateLabel": "Ngày:",
      "modalSpeciesLabel": "Loài:",
      "close": "Đóng",
      "deleteBtn": "Xóa",
      "deleteConfirm": "Bạn có chắc muốn xóa bản ghi nhận diện này không?",
      "statsTitle": "Thống kê nhận diện của bạn",
      "statsSubtitle": "Tổng quan số lần dự đoán, độ tin cậy và top giống chó phổ biến.",
      "exportReport": "Xuất báo cáo",
      "totalScans": "Tổng lượt nhận diện",
      "totalScansLabel": "Tổng số lần nhận diện",
      "avgConfStat": "Độ tin cậy TB",
      "avgAccStat": "Độ chính xác trung bình",
      "breedsExplored": "Giống đã khám phá",
      "uniqueBreeds": "Giống chó khác nhau",
      "recentActivity": "Hoạt động gần đây",
      "recentActivityLabel": "Lượt nhận diện gần nhất",
      "activityChart": "Biểu đồ hoạt động",
      "trendTitle": "Xu hướng nhận diện",
      "trendSubtitle": "Số lượng ảnh đã nhận diện mỗi ngày",
      "noDataInRange": "Chưa có dữ liệu trong khoảng thời gian này.",
      "top5BreedsTitle": "Top 5 giống phổ biến nhất",
      "top5BreedsDesc": "Các giống chó được nhận diện nhiều nhất",
      "noTopBreedData": "Chưa có đủ dữ liệu để hiển thị top giống.",
      "confidenceDistTitle": "Phân bố độ tin cậy",
      "confidenceDistDesc": "Mức độ tin cậy của thuật toán phân loại",
      "breedDistTitle": "Phân bố giống chó",
      "breedDistDesc": "Tỉ lệ các giống chó được nhận diện",
      "noDataChart": "Chưa có dữ liệu",
      "recentResultsTitle": "Kết quả gần đây",
      "noActivity": "Chưa có hoạt động nào!",
      "noActivityDesc": "Hãy tải ảnh thú cưng lên để bắt đầu nhận diện giống chó.",
      "timesCount": "lần",
      "settingsTitle": "Cài đặt tài khoản",
      "profileSection": "Thông tin cá nhân",
      "fullnameLabel": "Họ tên",
      "fullnameHint": "Tên này hiển thị trên hồ sơ và thanh điều hướng.",
      "usernameLabel": "Tên tài khoản (Username)",
      "usernameLocked": "Không thể thay đổi tên đăng nhập.",
      "emailLabel": "Địa chỉ Email",
      "appearanceSection": "Giao diện",
      "themeLabel": "Chủ đề",
      "themeLight": "Sáng",
      "themeDark": "Tối",
      "themeAuto": "Tự động",
      "privacySection": "Quyền riêng tư",
      "historyStorage": "Lưu trữ lịch sử",
      "historyStorageDesc": "Dữ liệu ảnh và kết quả dự đoán được lưu trong lịch sử. Bạn có thể xóa toàn bộ bất cứ lúc nào.",
      "viewHistoryLink": "Xem lịch sử",
      "clearAllHistory": "Xóa toàn bộ lịch sử",
      "cancel": "Hủy",
      "saveChanges": "Lưu thay đổi",
      "saving": "Đang lưu...",
      "deleting": "Đang xóa...",
      "clearHistoryConfirm": "Bạn có chắc muốn xóa toàn bộ lịch sử nhận diện? Hành động này không thể hoàn tác.",
      "infoSidebarLink": "Thông tin",
      "appearanceSidebarLink": "Giao diện",
      "privacySidebarLink": "Quyền riêng tư",
      "loginTitle": "Đăng nhập tài khoản",
      "loginSubtitle": "Chào mừng bạn quay lại! Vui lòng nhập thông tin.",
      "usernameOrEmail": "Tên đăng nhập hoặc email",
      "usernamePlaceholder": "vd: username hoặc email@example.com",
      "passwordLabel": "Mật khẩu",
      "passwordPlaceholder": "Nhập mật khẩu",
      "forgotPassword": "Quên mật khẩu?",
      "rememberLogin": "Ghi nhớ đăng nhập",
      "loginBtn": "Đăng nhập",
      "orContinueWith": "hoặc tiếp tục với",
      "loginWithGoogle": "Đăng nhập bằng Google",
      "noAccount": "Chưa có tài khoản?",
      "registerNow": "Đăng ký ngay",
      "loginLeftTitle": "Nhận diện giống chó nhanh chóng và ",
      "loginLeftSubtitle": "Trợ lý thông minh giúp bạn nhận diện và hiểu hơn về thú cưng của mình.",
      "loginFeature1Title": "Điểm tin cậy rõ ràng",
      "loginFeature1Desc": "Phân tích chi tiết từ AI",
      "loginFeature2Title": "Lịch sử quét",
      "loginFeature2Desc": "Lưu lại các kết quả nhận diện",
      "usernameShort": "Tên đăng nhập/email cần ít nhất 3 ký tự.",
      "passwordShort": "Mật khẩu cần ít nhất 6 ký tự.",
      "registerTitle": "Tạo tài khoản mới",
      "registerSubtitle": "Điền thông tin bên dưới để bắt đầu nhận diện giống chó.",
      "fullnameLabelReg": "Họ và tên",
      "fullnamePlaceholder": "Nguyễn Văn A",
      "usernameLabelReg": "Tên đăng nhập",
      "usernamePlaceholderReg": "3-20 ký tự, chữ/số/_",
      "passwordLabelReg": "Mật khẩu",
      "passwordPlaceholderReg": "Ít nhất 6 ký tự",
      "confirmPassword": "Xác nhận mật khẩu",
      "confirmPasswordPlaceholder": "Nhập lại mật khẩu",
      "agreeTerms": "Tôi đồng ý với điều khoản dịch vụ và chính sách bảo mật.",
      "createAccount": "Tạo tài khoản",
      "registerWithGoogle": "Đăng ký bằng Google",
      "alreadyHaveAccount": "Đã có tài khoản?",
      "loginNow": "Đăng nhập ngay",
      "regLeftTitle": "Tham gia cộng đồng yêu chó cùng ",
      "regLeftSubtitle": "Lưu lịch sử nhận diện, phân tích thói quen và nhận cảnh báo sức khỏe thông minh cho cún cưng của bạn.",
      "regFeature1Title": "Chào mừng thành viên mới",
      "regFeature1Desc": "Bắt đầu với gói Free ngay hôm nay",
      "regFeature2Title": "10 lượt miễn phí",
      "regFeature2Desc": "Mỗi tài khoản có sẵn lượt trải nghiệm ban đầu",
      "regFeature3Title": "Bảo mật tài khoản",
      "regFeature3Desc": "Thông tin cá nhân được bảo vệ an toàn",
      "fullnameTooShort": "Họ tên cần ít nhất 2 ký tự.",
      "invalidEmail": "Email không hợp lệ.",
      "usernameInvalid": "Tên đăng nhập phải 3-20 ký tự (chữ, số, _).",
      "passwordTooShort": "Mật khẩu cần ít nhất 6 ký tự.",
      "passwordMismatch": "Mật khẩu xác nhận chưa khớp.",
      "upgradeTitle": "Nâng cấp gói sử dụng",
      "upgradeSubtitle": "Chọn gói phù hợp để trải nghiệm đầy đủ tính năng PetAI",
      "planFree": "Free",
      "planBasic": "Basic",
      "planPremium": "Premium",
      "planEnterprise": "Enterprise",
      "currentPlan": "Gói hiện tại",
      "choosePlan": "Chọn gói này",
      "perMonth": "/tháng",
      "forever": "Mãi mãi",
      "mostPopular": "Phổ biến nhất",
      "bestValue": "Giá trị nhất",
      "upgradePlanBtn": "Nâng cấp",
      "buyNow": "Mua ngay",
      "contactSales": "Liên hệ mua",
      "paymentsTitle": "Lịch sử thanh toán",
      "paymentsSubtitle": "Danh sách các giao dịch nâng cấp gói của bạn",
      "orderCode": "Mã đơn",
      "planName": "Gói",
      "amount": "Số tiền",
      "status": "Trạng thái",
      "paymentDate": "Ngày thanh toán",
      "action": "Hành động",
      "statusPending": "Chờ duyệt",
      "statusApproved": "Đã duyệt",
      "statusRejected": "Đã từ chối",
      "statusPaid": "Đã thanh toán",
      "statusCancelled": "Đã hủy",
      "noPayments": "Chưa có giao dịch nào",
      "noPaymentsDesc": "Bạn chưa thực hiện nâng cấp gói nào. Hãy khám phá các gói dịch vụ.",
      "viewPlans": "Xem các gói",
      "uploadProof": "Tải minh chứng",
      "viewProof": "Xem minh chứng",
      "cancelOrder": "Hủy đơn",
      "cancelConfirm": "Bạn có chắc muốn hủy đơn hàng này không?",
      "usersTitle": "Quản lý người dùng",
      "usersSubtitle": "Danh sách tất cả người dùng trong hệ thống",
      "searchUser": "Tìm kiếm người dùng...",
      "filterAll": "Tất cả",
      "filterAdmin": "Admin",
      "filterUser": "Người dùng",
      "userId": "ID",
      "userName": "Tên",
      "userEmail": "Email",
      "userRole": "Vai trò",
      "userPlan": "Gói",
      "userScanCount": "Số lượt quét",
      "userJoined": "Ngày tham gia",
      "userActions": "Hành động",
      "viewUser": "Xem chi tiết",
      "editUser": "Chỉnh sửa",
      "deleteUser": "Xóa người dùng",
      "deleteUserConfirm": "Bạn có chắc muốn xóa người dùng này không?",
      "noUsers": "Không có người dùng nào",
      "confirmationsTitle": "Duyệt đơn nâng cấp",
      "confirmationsSubtitle": "Các đơn hàng đang chờ phê duyệt",
      "approve": "Duyệt",
      "reject": "Từ chối",
      "approveConfirm": "Duyệt đơn này?",
      "rejectConfirm": "Từ chối đơn này?",
      "noPendingOrders": "Không có đơn nào chờ duyệt",
      "uploadTitle": "Nhận diện giống chó",
      "uploadSubtitle": "Tải ảnh lên để AI phân tích và nhận diện giống chó",
      "dragDropHere": "Kéo & thả ảnh vào đây",
      "orClickToSelect": "hoặc click để chọn ảnh",
      "supportedFormats": "Hỗ trợ: JPG, PNG, WEBP. Tối đa 10MB.",
      "analyzeBtn": "Phân tích",
      "analyzing": "Đang phân tích...",
      "resultTitle": "Kết quả nhận diện",
      "confidence": "Độ tin cậy",
      "breedLabel": "Giống",
      "speciesLabel": "Loài",
      "analyzeAnother": "Phân tích ảnh khác",
      "saveToHistory": "Lưu vào lịch sử",
      "noImageSelected": "Chưa chọn ảnh",
      "uploadError": "Có lỗi xảy ra khi tải ảnh lên.",
      "checkoutTitle": "Thanh toán gói",
      "orderSummary": "Tóm tắt đơn hàng",
      "paymentMethod": "Phương thức thanh toán",
      "bankTransfer": "Chuyển khoản ngân hàng",
      "uploadTransferProof": "Tải minh chứng chuyển khoản",
      "submitOrder": "Gửi đơn hàng",
      "processingOrder": "Đang xử lý...",
      "loading": "Đang tải...",
      "error": "Lỗi",
      "success": "Thành công",
      "retry": "Thử lại",
      "back": "Quay lại",
      "next": "Tiếp theo",
      "confirm": "Xác nhận",
      "yes": "Có",
      "no": "Không",
      "search": "Tìm kiếm",
      "filter": "Lọc",
      "export": "Xuất",
      "share": "Chia sẻ",
      "copy": "Sao chép",
      "edit": "Chỉnh sửa",
      "delete": "Xóa",
      "save": "Lưu",
      "notDetermined": "Chưa xác định",
      "forgotLeftTitle": "Khôi phục mật khẩu",
      "forgotLeftSubtitle": "Bảo mật tài khoản là ưu tiên hàng đầu. Chúng tôi sẽ hỗ trợ bạn khôi phục nhanh chóng và an toàn.",
      "forgotFeature1Title": "Xác thực an toàn",
      "forgotFeature1Desc": "Dữ liệu được mã hóa theo tiêu chuẩn bảo mật",
      "forgotFeature2Title": "Email khôi phục tức thì",
      "forgotFeature2Desc": "Nhận liên kết đặt lại chỉ sau vài giây",
      "forgotFeature3Title": "Hỗ trợ 24/7",
      "forgotFeature3Desc": "Đội ngũ luôn sẵn sàng khi bạn cần",
      "forgotTitle": "Quên mật khẩu",
      "forgotSubtitle": "Nhập email để nhận hướng dẫn đặt lại mật khẩu.",
      "registeredEmail": "Email đã đăng ký",
      "sendInstructions": "Gửi hướng dẫn",
      "backToLogin": "Quay lại",
      "loginLink": "đăng nhập",
      "errorPageTitle": "PetAI - Lỗi",
      "errorLabel": "Lỗi",
      "errorTitle": "Đã có sự cố",
      "errorDefaultDesc": "Chúng tôi đang gặp sự cố khi truy xuất dữ liệu. Tài nguyên bạn tìm kiếm có thể đã được chuyển hoặc tạm thời không khả dụng.",
      "backToHome": "Quay lại trang chủ",
      "checkSystem": "Kiểm tra hệ thống",
      "errorRetryLater": "Nếu lỗi vẫn tiếp diễn, vui lòng thử lại sau.",
      "adUnlockTitle": "Xem quảng cáo để mở khóa lượt nhận diện",
      "adUnlockDesc": "Bạn đã sử dụng hết 10 lượt miễn phí. Xem một đoạn quảng cáo ngắn để nhận thêm 3 lượt nhận diện AI. (Tối đa 3 lần).",
      "adScanned": "Đã nhận diện",
      "adSponsor": "Nhà Tài Trợ PetAI",
      "adRemaining": "Còn",
      "adPlaying": "Đang phát quảng cáo mô phỏng",
      "adWarningDesc": "Vui lòng không đóng cửa sổ này. Lượt nhận diện sẽ được cộng vào tài khoản sau khi video kết thúc.",
      "adWatchedComplete": "Tôi đã xem xong",
      "adLimitReachedDesc": "Nếu đã xem đủ 3 lần, bạn cần nâng cấp gói để tiếp tục.",
      "activationTimelineNote": "Sau khi thanh toán thành công, gói của bạn sẽ được kích hoạt tự động trong vòng 1-3 phút.",
      "amountToPay": "Số tiền cần thanh toán:",
      "cannotDowngradeBtn": "Không thể hạ gói",
      "compAIModel": "Lượt nhận diện AI",
      "compAds": "Quảng cáo",
      "compAdvancedFeatures": "Tính năng nâng cao",
      "compBasic": "Cơ bản",
      "compDuration": "Thời hạn sử dụng",
      "compEnterprise": "Doanh nghiệp / Chuyên sâu",
      "compFeature": "Tính năng",
      "compFullAdvancedFeatures": "Đầy đủ + nâng cao",
      "compFullFeatures": "Đầy đủ tính năng",
      "compHighestSupport": "Ưu tiên cao nhất",
      "compLimited": "Giới hạn",
      "compNo": "Không",
      "compPersonal": "Người dùng cá nhân",
      "compPowerUser": "Người dùng thường xuyên",
      "compPriority": "Ưu tiên",
      "compSomeFeatures": "Một số tính năng",
      "compSpeed": "Tốc độ xử lý",
      "compSuitability": "Phù hợp với",
      "compSupport": "Hỗ trợ",
      "compTrial": "Miễn phí",
      "compSuitabilityTrial": "Trải nghiệm",
      "compUnlimited": "Không giới hạn",
      "compVip": "VIP",
      "compYes": "Có",
      "comparisonTableTitle": "So sánh các gói dịch vụ",
      "currentPlanBtn": "Gói hiện tại",
      "currentPlanTitle": "Gói hiện tại của bạn",
      "activeStatus": "Hoạt động",
      "highestPlanMsg": "Bạn đang sử dụng gói cao nhất",
      "highestPlanDesc": "Cảm ơn bạn đã tin dùng và đồng hành cùng hệ thống thông minh PetAI!",
      "paymentInstructions": "Quét mã QR hoặc sử dụng ứng dụng ngân hàng để thanh toán.",
      "renewBtn": "Gia hạn",
      "renewPlanBtn": "Gia hạn gói",
      "selectedPlanLabel": "Bạn đã chọn gói",
      "transferViaVietQR": "Thanh toán qua VietQR",
      "upgradeBillingHistoryBtn": "Lịch sử thanh toán",
      "upgradeBtn": "Nâng cấp",
      "upgradeExperience": "Nâng cấp trải nghiệm",
      "upgradeExperienceDesc": "Mở khóa nhiều hạn mức quét AI hơn, loại bỏ quảng cáo và tối ưu hóa tốc độ nhận diện cún cưng.",
      "helpCardTitle": "Bạn cần hỗ trợ thêm?",
      "helpCardDesc": "Liên hệ đội ngũ hỗ trợ của chúng tôi qua email hoặc chat trực tuyến.",
      "helpCardBtn": "Liên hệ hỗ trợ",
      "errorDefaultText": "Đã xảy ra lỗi",
      "systemError": "Đã xảy ra lỗi hệ thống",
      "msgPleaseLogin": "Vui lòng đăng nhập để sử dụng chức năng này.",
      "msgAdLimitReached": "Bạn đã xem đủ 3 lần quảng cáo. Vui lòng mua gói để tiếp tục.",
      "msgAdUnlocked": "Đã mở khóa thêm 3 lượt nhận diện. Bạn có thể tiếp tục!",
      "msgAdError": "Không thể ghi nhận quảng cáo. Vui lòng thử lại.",
      "msgHigherPlanActive": "Bạn đang có gói cao hơn còn hiệu lực. Không thể mua gói thấp hơn.",
      "msgPlanStillHasScans": "Gói hiện tại của bạn vẫn còn lượt sử dụng. Chỉ có thể gia hạn khi hết hạn hoặc đã hết lượt.",
      "msgInvalidOrder": "Đơn thanh toán không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.",
      "msgAutoConfirm": "Hệ thống đang dùng xác nhận tự động. Vui lòng chờ hệ thống ghi nhận giao dịch.",
      "msgFlowChanged": "Luồng thanh toán đã thay đổi. Hãy tạo đơn ở trang nâng cấp trước.",
      "msgOrderNotFound": "Đơn thanh toán không tồn tại hoặc không hợp lệ.",
      "msgPlanActivated": "Đã xác nhận thanh toán và kích hoạt gói của bạn.",
      "msgPaymentPending": "Đã ghi nhận bạn đã chuyển tiền. Đơn hàng đang chờ admin xác nhận.",
      "msgCannotConfirm": "Không thể ghi nhận (đơn có thể đã được báo/đã xác nhận).",
      "msgPaymentError": "Không thể ghi nhận thanh toán. Vui lòng thử lại.",
      "msgMissingOrderId": "Thiếu mã đơn thanh toán.",
      "msgOrderNotYours": "Đơn thanh toán không tồn tại hoặc không thuộc tài khoản của bạn.",
      "msgNotPaid": "Bạn chưa thanh toán.",
      "msgAutoConfirmDesc": "Hệ thống sẽ tự xác nhận khi nhận được giao dịch. Bạn không cần bấm xác nhận thủ công.",
      "msgLoginToPayHistory": "Vui lòng đăng nhập để xem lịch sử thanh toán.",
      "msgUserOnlyPage": "Trang này chỉ dành cho tài khoản người dùng.",
      "msgSelectImageFirst": "Vui lòng chọn ảnh trước khi bấm phân tích.",
      "msgNoImageSelected": "Bạn chưa chọn ảnh. Vui lòng tải ảnh lên rồi thử lại.",
      "msgOutofQuota": "Bạn đã dùng hết 10 lượt miễn phí và 3 lượt xem quảng cáo. Vui lòng mua gói để tiếp tục.",
      "msgOutofFreeScans": "Bạn đã dùng hết 10 lượt miễn phí. Vui lòng xem quảng cáo để mở khóa thêm.",
      "msgWatchAdToUnlock": "Vui lòng xem quảng cáo để mở khóa thêm lượt nhận diện.",
      "msgAccountLocked": "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
      "msgGoogleEmailFailed": "Không lấy được email từ Google. Vui lòng thử lại.",
      "msgGoogleLoginFailed": "Đăng nhập Google thất bại. Vui lòng thử lại.",
      "adminConfirmationsTitle": "Duyệt đơn nâng cấp - PetAI",
      "adminUsersTitle": "Quản lý người dùng - PetAI",
      "dashboardTitle": "Bảng điều khiển - PetAI",
      "historyPageTitle": "Lịch sử - PetAI",
      "statisticsPageTitle": "Thống kê - PetAI",
      "upgradePageTitle": "Nâng cấp gói - PetAI",
      "paymentsPageTitle": "Lịch sử thanh toán - PetAI",
      "settingsPageTitle": "Cài đặt tài khoản - PetAI",
      "predictPageTitle": "Nhận diện giống chó - PetAI",
      "checkoutPageTitle": "Thanh toán - PetAI",
      "confirmedRevenue": "Doanh thu đã xác nhận",
      "totalRealRevenue": "Tổng doanh thu thực tế",
      "paidOrders": "Đơn đã thanh toán",
      "approvedOrders": "Các đơn đã được duyệt",
      "latestPayment": "Thanh toán gần nhất",
      "lastOrderTime": "Thời gian đơn cuối",
      "needsAdminAction": "Cần admin xử lý",
      "searchConfirmationsPlaceholder": "Tìm mã đơn/username/email/họ tên...",
      "allPlans": "Tất cả gói",
      "clearFilters": "Xoá lọc",
      "recentPaidOrders": "Đơn đã thanh toán gần đây",
      "pendingApprovalsTitle": "Đơn chờ admin xác nhận",
      "userCol": "Người dùng",
      "confirmedAt": "Xác nhận lúc",
      "createdAt": "Tạo lúc",
      "orderIdCol": "Mã đơn",
      "amountCol": "Số tiền",
      "noPaidOrders": "Chưa có đơn hàng nào đã thanh toán.",
      "noPendingApprovals": "Không có đơn chờ xác nhận.",
      "autoConfirmBtn": "Tự động",
      "confirmActionTitle": "Xác nhận thao tác",
      "confirmActionText": "Bạn có chắc muốn thực hiện hành động này?",
      "cancelBtn": "Huỷ",
      "confirmBtn": "Xác nhận",
      "paymentMethodCol": "Phương thức",
      "userListTitle": "Danh sách người dùng",
      "userListSubtitle": "Quản lý trạng thái tài khoản, gói dịch vụ và quyền truy cập.",
      "approveOrdersBtn": "Duyệt đơn",
      "totalUsersCard": "Tổng người dùng",
      "registeredAccountsLabel": "Tài khoản đã đăng ký",
      "totalAdminsCard": "Tổng quản trị",
      "systemAdmins": "Quản trị viên hệ thống",
      "activeLabel": "Hoạt động",
      "activeAccounts": "Tài khoản hoạt động",
      "lockedLabel": "Đã khóa",
      "lockedAccounts": "Tài khoản bị khóa",
      "searchUserPlaceholder": "Tìm username/email/họ tên...",
      "allRoles": "Tất cả vai trò",
      "allStatuses": "Tất cả trạng thái",
      "statusActive": "Hoạt động",
      "statusLocked": "Khóa",
      "userColHeader": "Người dùng",
      "roleColHeader": "Vai trò",
      "statusColHeader": "Trạng thái",
      "createdAtColHeader": "Ngày tạo",
      "planColHeader": "Cấp gói",
      "actionColHeader": "Thao tác",
      "detailBtn": "Chi tiết",
      "noUserData": "Không có dữ liệu.",
      "savePlanLabel": "Lưu gói",
      "updatePlanLabel": "Cập nhật gói",
      "prevPage": "Trang trước",
      "nextPage": "Trang sau",
      "footerDescText": "Ứng dụng nhận diện giống chó bằng AI dành cho người yêu thú cưng. Kết quả chính xác, nhanh chóng.",
      "openMenu": "Mở menu",
      "closeMenu": "Đóng menu",
      "showingText": "Hiển thị",
      "ofText": "trên",
      "usersText": "người dùng",
      "lastLoginCol": "Lần đăng nhập gần nhất",
      "lockedUsersCard": "Tài khoản bị khóa",
      "activeUsersCard": "Người dùng hoạt động",
      "paidUsersCard": "Người dùng trả phí",
      "perPageSuffix": "mỗi trang",
      "actionLock": "Khóa tài khoản",
      "actionUnlock": "Mở khóa tài khoản",
      "actionChangeRole": "Đổi vai trò",
      "actionChangePlan": "Đổi gói dịch vụ",
      "actionSendEmail": "Gửi email",
      "actionDelete": "Xóa tài khoản",
      "confirmDeleteUserTitle": "Xóa tài khoản",
      "confirmDeleteUserText": "Bạn có chắc chắn muốn xóa tài khoản {username}? Nhập '{confirmWord}' để xác nhận xóa.",
      "confirmChangeRoleTitle": "Đổi vai trò người dùng",
      "confirmChangeRoleText": "Bạn có chắc chắn muốn đổi vai trò của {username} thành {role}?",
      "confirmLockUserTitle": "Khóa tài khoản",
      "confirmLockUserText": "Bạn có chắc chắn muốn khóa tài khoản {username}?",
      "confirmUnlockUserTitle": "Mở khóa tài khoản",
      "confirmUnlockUserText": "Bạn có chắc chắn muốn mở khóa tài khoản {username}?",
      "confirmAssignPlanText": "Cấp gói {plan} cho {username}?",
      "deleteInputPlaceholder": "Nhập 'DELETE' hoặc '{username}' để xác nhận",
      "toastLockSuccess": "Tài khoản {username} đã bị khóa.",
      "toastUnlockSuccess": "Tài khoản {username} đã được kích hoạt.",
      "toastDeleteSuccess": "Xóa kết quả nhận diện thành công.",
      "toastDeleteError": "Không thể xóa kết quả nhận diện. Vui lòng thử lại.",
      "toastLockError": "Lỗi khóa tài khoản.",
      "toastUnlockError": "Lỗi kích hoạt tài khoản.",
      "toastRoleSuccess": "Đã cập nhật vai trò cho {username} thành công.",
      "toastRoleError": "Lỗi thay đổi vai trò.",
      "toastPlanSuccess": "Gói dịch vụ đã được cập nhật.",
      "toastPlanError": "Không thể cập nhật gói.",
      "toastServerError": "Lỗi kết nối máy chủ.",
      "toastDefaultError": "Có lỗi xảy ra.",
      "notificationInfoTitle": "Chức năng thông báo tự động",
      "notificationInfoText": "Hệ thống sẽ tự động gửi email thông báo chi tiết đến người dùng khi quản trị viên thực hiện thay đổi trạng thái tài khoản (Khóa/Mở khóa), cấp gói dịch vụ hoặc xóa tài khoản để đảm bảo tính minh bạch.",
      "manualUserCreationNotIntegrated": "Chức năng thêm người dùng thủ công chưa được tích hợp trên backend hệ thống.",
      "pendingConfirmOrdersText": "đơn chờ xác nhận",
      "upgradeDescFree": "Bạn đang sử dụng gói <strong class=\"text-slate-700 dark:text-slate-300\">MIỄN PHÍ (FREE)</strong>. Nâng cấp để tăng lượt nhận diện và trải nghiệm mượt mà không quảng cáo.",
      "upgradeDescPaidPrefix": "Tài khoản của bạn đang sử dụng gói",
      "upgradeDescPaidSuffix": ". Bạn có thể nâng cấp hoặc gia hạn bên dưới.",
      "choosePlanPay": "Chọn gói & Thanh toán",
      "planFreeTitle": "Miễn phí",
      "planFreeSub": "Gói khởi đầu mặc định",
      "planFreePrice": "0đ",
      "planFreePriceSub": "Luôn miễn phí",
      "scanLimit10": "10 lượt nhận diện miễn phí",
      "watchAdsMore": "Xem quảng cáo để thêm lượt",
      "suitableTrial": "Phù hợp dùng thử",
      "freePlanActive": "Gói FREE đang hoạt động",
      "cannotDowngrade": "Không thể hạ cấp",
      "planBasicTitle": "Cơ bản",
      "planBasicSub": "Dành cho nhu cầu nhẹ",
      "planBasicPrice": "1.000đ",
      "planBasicPriceSub": "/ 7 ngày sử dụng",
      "scanLimit50": "50 lượt nhận diện",
      "noAds": "Không quảng cáo",
      "suitableLight": "Phù hợp nhu cầu nhẹ",
      "registerBtn": "Đăng ký",
      "basicPlanActive": "Gói Basic đang hoạt động",
      "usingHigherPlan": "Đang dùng gói cấp cao hơn",
      "planProTitle": "Chuyên nghiệp",
      "planProSub": "Tối ưu & phổ biến nhất",
      "planProPrice": "5.000đ",
      "planProPriceSub": "/ 30 ngày sử dụng",
      "scanLimit200": "200 lượt nhận diện",
      "prioritySpeed": "Ưu tiên tốc độ",
      "adFreeComfort": "Không quảng cáo, dùng thoải mái",
      "recommended": "Khuyên dùng",
      "proPlanActive": "Gói Pro đang hoạt động",
      "planEntTitle": "Doanh nghiệp",
      "planEntSub": "Nhu cầu cực lớn",
      "planEntPrice": "15.000đ",
      "planEntPriceSub": "/ 90 ngày sử dụng",
      "scanLimitUnlimit": "Không giới hạn nhận diện",
      "vipBandwidth": "Tối ưu hóa băng thông & VIP",
      "prioritySupport": "Hỗ trợ ưu tiên hàng đầu",
      "entPlanActive": "Gói Enterprise đang hoạt động",
      "upgradeLabel": "Gói nâng cấp đăng ký",
      "optPro": "Chuyên nghiệp (Pro) — 5.000đ / 30 ngày / 200 lượt",
      "optBasic": "Cơ bản (Basic) — 1.000đ / 7 ngày / 50 lượt",
      "optEnterprise": "Doanh nghiệp (Enterprise) — 15.000đ / 90 ngày / Không giới hạn",
      "gatewayInfo": "Cổng <strong>VietQR tự động</strong>. Bạn chỉ cần quét mã QR được hiển thị và chuyển đúng số tiền cùng nội dung chuyển khoản để hệ thống tự động duyệt.",
      "planLabel": "Gói đăng ký:",
      "durationLabel": "Thời hạn:",
      "scanLimitLabel": "Lượt nhận diện:",
      "totalPayLabel": "Tổng thanh toán:",
      "backBtn": "Quay lại",
      "usingHighestPlan": "Đang dùng gói cao nhất",
      "continuePayBtn": "Tiếp tục thanh toán",
      "confirmPaidBtn": "Tôi đã thanh toán",
      "expiredOnLabel": "Hết hạn:",
      "remainingScansLabel": "lượt còn lại",
      "lifetimeScans": "trọn đời",
      "quotaLimitLabel": "Hạn mức",
      "scansCount": "Số lượt",
      "unlimitedUsage": "Sử dụng thoải mái",
      "accountActiveDesc": "Tài khoản của bạn đang hoạt động tốt",
      "transferMemoLabel": "Nội dung chuyển khoản (Bắt buộc đúng)",
      "faqTitle": "Câu hỏi thường gặp",
      "faq1Q": "Thanh toán xong bao lâu được kích hoạt?",
      "faq1A": "Hệ thống tự động kích hoạt thông qua cổng VietQR trong vòng 1-3 phút ngay khi nhận được giao dịch chuyển khoản chính xác nội dung.",
      "faq2Q": "Có thể nâng cấp khi đang dùng gói cũ không?",
      "faq2A": "Có, bạn có thể nâng cấp lên gói cao hơn bất kỳ lúc nào. Lượt quét và thời hạn của gói mới sẽ được áp dụng ngay lập tức.",
      "faq3Q": "Có thể hủy hoặc hoàn tiền không?",
      "faq3A": "Các giao dịch thanh toán gói dịch vụ là không hoàn lại. Vui lòng kiểm tra kỹ thông tin trước khi thực hiện giao dịch.",
      "faq4Q": "Gói có tự gia hạn không?",
      "faq4A": "Không, hệ thống không tự động gia hạn hoặc trừ tiền tài khoản của bạn. Bạn chủ động gia hạn thủ công khi có nhu cầu.",
      "faq5Q": "Tôi có thể thay đổi gói sau khi nâng cấp không?",
      "faq5A": "Bạn có thể nâng cấp lên gói cao hơn. Việc hạ cấp xuống gói thấp hơn chỉ được thực hiện sau khi gói hiện tại hết hạn sử dụng.",
      "paymentSecurityNote": "Thanh toán được bảo mật và xử lý thông qua hệ thống VietQR.",
      "policyLink": "Chính sách thanh toán",
      "termsLink": "Điều khoản sử dụng",
      "creatingInvoice": "Đang tạo hóa đơn...",
      "planBasicName": "Cơ bản (Basic)",
      "planBasicDuration": "7 ngày",
      "planBasicLimit": "50 lượt",
      "planProName": "Chuyên nghiệp (Pro)",
      "planProDuration": "30 ngày",
      "planProLimit": "200 lượt",
      "planEntName": "Doanh nghiệp (Enterprise)",
      "planEntDuration": "90 ngày",
      "planEntLimit": "Không giới hạn",
      "checkoutDesc": "Quét mã QR để chuyển khoản, sau đó xác nhận để hệ thống kích hoạt gói.",
      "orderIdLabel": "Mã đơn hàng",
      "paymentMethodLabel": "Phương thức",
      "paymentMethodQR": "Chuyển khoản QR",
      "paymentInstructionsTitle": "Hướng dẫn chuyển khoản",
      "instructionStep1": "Mở ứng dụng Ngân hàng trên điện thoại của bạn.",
      "instructionStep2": "Sử dụng tính năng Quét mã QR để thanh toán nhanh nhất.",
      "instructionStep3": "Kiểm tra thông tin số tiền và nội dung chuyển khoản trước khi xác nhận.",
      "accountDetailsTitle": "Thông tin chi tiết tài khoản",
      "bankLabel": "Ngân hàng",
      "accountNumberLabel": "Số tài khoản",
      "accountNameLabel": "Chủ tài khoản",
      "memoLabel": "Nội dung",
      "paymentQrTitle": "Mã QR thanh toán",
      "qrMissingLib": "Thiếu thư viện tạo QR. Cài thêm qrcode để hiển thị QR.",
      "checkingStatus": "Đang kiểm tra",
      "checkingStatusDesc": "Hệ thống đang tự động kiểm tra thanh toán...",
      "autoActivationNote": "Hệ thống sẽ tự động kích hoạt sau 1-5 phút khi nhận được tiền. Nếu quá lâu, vui lòng gửi hỗ trợ.",
      "submitSupportLink": "Gửi hỗ trợ",
      "safeTransactionTitle": "Giao dịch an toàn",
      "safeTransactionDesc": "Thông tin thanh toán của bạn được mã hóa và xử lý tự động bởi hệ thống AI.",
      "invoiceModalTitle": "Hóa Đơn Thanh Toán",
      "invoiceSuccess": "Thanh toán thành công!",
      "invoiceThankYou": "Cảm ơn bạn đã sử dụng dịch vụ của PetAI",
      "customerLabel": "Khách hàng",
      "createdTimeLabel": "Thời gian tạo",
      "confirmedTimeLabel": "Thời gian xác nhận",
      "printInvoiceBtn": "In hóa đơn",
      "welcomeUser": "Xin chào",
      "welcomeUserGuest": "Xin chào, bạn!",
      "thisMonth": "tháng này",
      "predictionsCountPrefix": "Bạn có tổng cộng",
      "predictionsCountSuffix": "bản ghi dự đoán.",
      "hybridRatioExpected": "Tỷ lệ lai dự kiến",
      "identificationTimeLabel": "Thời gian nhận diện:",
      "closeWindowBtn": "Đóng cửa sổ",
      "predResultTitle": "Kết quả nhận diện giống chó",
      "predResultDesc": "Hệ thống AI đã hoàn tất phân tích hình ảnh với độ chính xác cao.",
      "backToDashboard": "Về bảng điều khiển",
      "analyzeAnotherImg": "Phân tích ảnh khác",
      "mainObjectAnalysis": "Phân tích vùng đối tượng chính",
      "analyzingText": "Đang phân tích",
      "mainObjectIdentify": "Nhận diện đối tượng chính",
      "bestPrediction": "Dự đoán tốt nhất",
      "hybridWarningText": "Đây là gợi ý ứng viên lai dựa trên tương đồng hình thái, không phải kết luận di truyền.",
      "hybridRatioTitle": "Phân tích tỷ lệ lai dự tính",
      "dominantGenExpected": "Gen trội dự kiến",
      "similarityText": "Độ tương đồng",
      "recessiveGenExpected": "Gen ẩn dự kiến",
      "visualProofTitle": "Grad-CAM động (Visual Proof)",
      "visualProofRefTitle": "Grad-CAM tham khảo (Visual Proof)",
      "visualProofDesc": "Bản đồ nhiệt theo đúng ảnh bạn vừa tải lên.",
      "visualProofRefDesc": "Bản đồ nhiệt theo giống tham khảo.",
      "aiHighlightArea": "Vùng nổi bật AI tập trung",
      "modelLogicAnalysis": "Phân tích Logic từ Model",
      "decisionHybridText": "Mức tin cậy đủ cho gợi ý ứng viên lai.",
      "decisionPureText": "Mức tin cậy đủ để kết luận giống.",
      "decisionRefText": "Mức tin cậy tham khảo, chưa đủ để kết luận giống.",
      "modelArchitecture": "Kiến trúc mô hình",
      "inferenceOptimization": "Tối ưu suy luận",
      "ordersCreated": "Đơn hàng đã tạo",
      "totalAmountPaid": "Tổng tiền thanh toán",
      "awaitingConfirm": "Đang chờ xác nhận",
      "planExpireLabel": "Hạn",
      "freeLimitPlan": "Gói miễn phí giới hạn",
      "recentOrders": "Đơn hàng gần đây",
      "ordersCount": "đơn",
      "planExpired": "Hết hạn",
      "personalInfoTab": "Thông tin",
      "appearanceTab": "Giao diện",
      "privacyTab": "Quyền riêng tư",
      "personalInfoTitle": "Thông tin cá nhân",
      "saveChangesBtn": "Lưu thay đổi",
      "manageUserRole": "Quản lý và cấp quyền thành viên cho tài khoản",
      "lockedStatus": "Đã khóa",
      "sensitiveArea": "Khu vực nhạy cảm",
      "sensitiveAreaDesc": "Các thao tác dưới đây tác động trực tiếp đến quyền truy cập và dữ liệu của tài khoản này. Hãy chắc chắn trước khi tiếp tục.",
      "quotaSettings": "Gói dịch vụ & Hạn mức sử dụng",
      "currentPlanLabel": "Gói hiện tại",
      "unlockRemainingLabel": "Lần mở khóa còn lại",
      "planExpireDateLabel": "Ngày hết hạn gói",
      "freeUnlimited": "Không giới hạn (Miễn phí)",
      "changePlanLabel": "Thay đổi gói thành viên",
      "assignPlanBtn": "Cấp gói mới",
      "registeredTimeLabel": "Thời gian đăng ký hệ thống",
      "confirmDialogTitle": "Xác nhận",
      "confirmDialogText": "Bạn có chắc?",
      "confirmInputPlaceholder": "Nhập email hoặc tên đăng nhập để xác nhận",
      "similarityTop3": "Tương đồng hình thái (Top 3)",
      "top3Probability": "Top 3 xác suất softmax",
      "welcomeFriend": "bạn",
      "uploadAreaTitle": "Khu vực tải ảnh",
      "changeImageBtn": "Đổi ảnh",
      "freeScansLeft": "Lượt miễn phí còn lại",
      "unlockedFromAds": "Mở khóa từ quảng cáo",
      "adsWatched": "Quảng cáo đã xem",
      "watchAdBtn": "Xem quảng cáo để thêm lượt",
      "yourPaidPlan": "Gói trả phí của bạn",
      "unlimitedScans": "Không giới hạn lượt",
      "loadingQuota": "Đang tải thông tin...",
      "predictionExperience": "Trải nghiệm dự đoán",
      "featureIdentifyConfidence": "Nhận diện giống chó với độ tin cậy %",
      "featureYoloBoundingBox": "Hỗ trợ ảnh có bounding box YOLO",
      "featureAutoSaveHistory": "Lưu lịch sử dự đoán tự động",
      "featureResponsiveLayout": "Tối ưu cho cả Mobile/Tablet/Desktop",
      "noEmailUpdated": "Chưa cập nhật email",
      "enterWord": "Nhập",
      "confirmInputPlaceholderSuffix": "hoặc tên đăng nhập để xác nhận",
      "checkingStatusWait": "Vui lòng không tắt trang cho đến khi giao dịch được xác nhận.",
      "ifTooLong": "Nếu quá lâu, vui lòng",
      "welcomePrefix": "Xin chào",
      "visualAIInsights": "Thông tin phân tích AI",
      "dataDeletionPageTitle": "Xóa dữ liệu cá nhân - PetAI",
      "dataDeletionHeaderTitle": "Xóa dữ liệu cá nhân",
      "dataDeletionSection1Title": "1. Quyền yêu cầu xóa tài khoản và dữ liệu",
      "dataDeletionSection1Desc": "Người dùng luôn có quyền yêu cầu xóa bỏ tài khoản cũng như tất cả dữ liệu cá nhân (tên, email, hình ảnh) đã tích lũy trong quá trình sử dụng hệ thống.",
      "dataDeletionSection2Title": "2. Hướng dẫn xóa tài khoản trong ứng dụng",
      "dataDeletionSection2Desc": "Nếu ứng dụng đã cập nhật chức năng này, vui lòng đi tới phần <strong>Thiết lập / Settings</strong> &gt; Chọn <strong>Quản lý tài khoản</strong> &gt; Nhấn <strong>Xóa tài khoản</strong> để hệ thống tự động loại bỏ thông tin của bạn.",
      "dataDeletionSection3Title": "3. Gửi email yêu cầu",
      "dataDeletionSection3Desc": "Trong trường hợp hệ thống chưa có chức năng xóa trực tiếp, bạn hoàn toàn có thể yêu cầu xóa bằng cách gửi thư. Hãy làm theo hướng dẫn sau:",
      "dataDeletionEmailLabel": "Email nhận yêu cầu:",
      "dataDeletionSubjectLabel": "Tiêu đề email:",
      "dataDeletionSubjectValue": "Yêu cầu xóa dữ liệu/tài khoản",
      "dataDeletionVerificationHint": "Hãy nêu rõ địa chỉ Email bạn dùng để đăng ký để chúng tôi đối\n                chứng.",
      "dataDeletionSection4Title": "4. Quá trình xử lý",
      "dataDeletionSection4Desc": "Tất cả các định dạng dữ liệu, hình ảnh, tài khoản của bạn sẽ được xử lý và xóa vĩnh viễn trong vòng <strong>30 ngày</strong> kể từ khi có yêu cầu.",
      "dataDeletionSection5Title": "5. Một số dữ liệu có thể được giữ lại",
      "dataDeletionSection5Desc": "Một số dữ liệu thuộc về báo cáo thanh toán, giao dịch hóa đơn hoặc các chi tiết nhằm phục vụ tranh chấp có thể sẽ được tiếp tục lưu giữ tùy thuộc vào quy định pháp luật sở tại yêu cầu.",
      "dataDeletionSection6Title": "6. Thông tin liên hệ",
      "dataDeletionSection6Desc": "Mọi khó khăn vui lòng liên lạc:",
      "termsPageTitle": "Điều khoản sử dụng | PetAI",
      "termsHeaderTitle": "Điều khoản dịch vụ",
      "termsSection1Title": "1. Điều kiện sử dụng ứng dụng/website",
      "termsSection1Desc": "Việc bạn truy cập và sử dụng dịch vụ đồng nghĩa với việc bạn xác nhận đã đọc, hiểu và chấp thuận toàn bộ các điều khoản được quy định tại văn bản này.",
      "termsSection2Title": "2. Quyền và trách nhiệm của người dùng",
      "termsSection2Desc": "Người dùng cam kết cung cấp thông tin chân thực khi tạo tài khoản, và tự chịu trách nhiệm bảo mật thông tin đăng nhập của chính bản thân.",
      "termsSection3Title": "3. Quy định về tài khoản",
      "termsSection3Desc": "Việc sử dụng các tính năng cao cấp có thể yêu cầu đăng nhập. Mỗi tài khoản cá nhân chỉ được ủy quyền cho một người, cấm việc mua bán tài khoản.",
      "termsSection4Title": "4. Nội dung hoặc hành vi bị cấm",
      "termsSection4Desc": "Bạn không được phép: (a) sử dụng ứng dụng vào các mục đích phi pháp; (b) khai thác lạm dụng hệ thống API của chúng tôi; (c) can thiệp, sao chép hay dịch ngược phần mềm cũng như mô hình AI mà chúng tôi cung cấp.",
      "termsSection5Title": "5. Giới hạn trách nhiệm của nhà phát triển",
      "termsSection5Desc": "Các phân tích và nhận diện dựa trên AI chỉ mang tính tham khảo và có thể xuất hiện xác suất sai lệch. Chúng tôi không nhận trách nhiệm cho các hậu quả gián tiếp gây ra từ tư vấn kết quả của phần mềm.",
      "termsSection6Title": "6. Chấm dứt tài khoản khi vi phạm",
      "termsSection6Desc": "Chúng tôi bảo lưu toàn quyền đơn phương khóa hoặc xóa sạch tài khoản và dữ liệu liên quan nếu phát hiện người dùng vi phạm nghiêm trọng những điều kiện đã nêu.",
      "termsSection7Title": "7. Thông tin liên hệ",
      "termsSection7Desc": "Mọi thắc mắc và góp ý vui lòng gửi về:",
      "supportPageTitle": "Hỗ trợ | PetAI",
      "supportHeaderTitle": "Hỗ trợ",
      "supportSubtitle": "Chúng tôi luôn sẵn sàng lắng nghe mọi phản hồi từ phía bạn.",
      "supportQuickInfoTitle": "Thông tin nhanh",
      "supportEmailLabel": "Email hỗ trợ:",
      "supportResponseTimeLabel": "Thời gian phản hồi dự kiến:",
      "supportResponseTimeValue": "Từ 1–3 ngày làm việc",
      "supportBasicGuideTitle": "Hướng dẫn sử dụng cơ bản",
      "supportStep1": "1. Tại giao diện chính, chọn <strong>Đăng Nhập</strong> hoặc tạo tài khoản mới.",
      "supportStep2": "2. Vào trang Nhận Diện, cho quyền máy ảnh hoặc tải lên hình.",
      "supportStep3": "3. Chờ từ 2 - 4 giây và AI sẽ trả về kết quả 3 giống chó tiềm năng nhất cùng với lịch sử thống kê.",
      "supportFaqTitle": "Các câu hỏi thường gặp (FAQ)",
      "supportFaq1Q": "Làm sao để đăng nhập?",
      "supportFaq1A": "Bạn nhấp vào nút Đăng nhập ở góc trên cùng của Website hoặc qua menu di động để sử dụng Email/Google.",
      "supportFaq2Q": "Làm sao để xóa tài khoản?",
      "supportFaq2A": "Gửi thư theo <strong>Chính sách xóa dữ liệu</strong> của chúng tôi để được trợ giúp.",
      "supportFaq3Q": "Làm sao để liên hệ hỗ trợ?",
      "supportFaq3A": "Bạn có thể sử dụng biểu mẫu phía dưới mục <strong>Liên Hệ</strong> hoặc gửi thư về support@pet.ai.",
      "supportFaq4Q": "Tôi gặp lỗi trong ứng dụng thì phải làm gì?",
      "supportFaq4A": "Rất mong bạn thông cảm, hãy chụp lại lỗi đó (screenshot), ghi rõ hành động dẫn tới lỗi và gửi email về cho chúng tôi sớm nhất!",
      "revenue": "Doanh thu",
      "usersCountSuffix": "người",
      "noSubscriptionData": "Chưa có dữ liệu gói đăng ký.",
      "pleaseSelectDates": "Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!",
      "startDateAfterEndDate": "Ngày bắt đầu không được lớn hơn ngày kết thúc!",
      "customRange": "Tùy chỉnh",
      "customRangeSubtitle": "Từ ngày {start} đến ngày {end}",
      "revenueTrendSubtitleDefault": "Tổng tiền từ đơn đã thanh toán (VND)",
      "revenueTrendSubtitle7": "Tổng tiền từ đơn đã thanh toán (7 ngày gần đây)",
      "revenueTrendSubtitle30": "Tổng tiền từ đơn đã thanh toán (30 ngày gần đây)",
      "revenueTrendSubtitle90": "Tổng tiền từ đơn đã thanh toán (90 ngày gần đây)",
      "revenueTrendSubtitle12": "Tổng tiền từ đơn đã thanh toán (12 tháng gần đây)",
      "predTrendSubtitleDefault": "Số lượng ảnh đã nhận diện mỗi ngày",
      "predTrendTitle7": "Xu hướng dự đoán 7 ngày gần đây",
      "predTrendTitle30": "Xu hướng dự đoán 30 ngày gần đây",
      "predTrendTitle90": "Xu hướng dự đoán 90 ngày gần đây",
      "predTrendTitle12": "Xu hướng dự đoán 12 tháng gần đây",
      "predTrendTitleCustom": "Xu hướng dự đoán tùy chỉnh",
      "predTrendSubtitleMonth": "Số lượng ảnh đã nhận diện theo tháng",
      "revenueThisMonthTooltip": "Doanh thu được ghi nhận trong tháng này",
      "newUsersThisWeekTooltip": "Số tài khoản mới đăng ký trong 7 ngày qua",
      "newOrdersTodayTooltip": "Các đơn hàng mới tạo ngày hôm nay",
      "predictionsTodayTooltip": "Số lượt dự đoán thực hiện hôm nay",
      "upgradeAccount": "Nâng cấp tài khoản",
      "orderInfo": "Thông tin đơn hàng",
      "servicePlan": "Gói đăng ký",
      "missingQrLibPrefix": "Thiếu thư viện tạo QR. Cài thêm",
      "missingQrLibSuffix": "để hiển thị QR.",
      "autoActivationDesc": "Hệ thống sẽ tự động kích hoạt sau 1-5 phút khi nhận được tiền.",
      "printInvoice": "In hóa đơn",
      "adminConfirmationsPageTitle": "Duyệt đơn - PetAI",
      "approveBankTransfers": "Duyệt đơn chuyển khoản",
      "approveBankTransfersDesc": "Quản lý các đơn thanh toán chuyển khoản và xác nhận nâng cấp gói dịch vụ.",
      "exportConfirmationsTitle": "Xuất danh sách thanh toán",
      "exportConfirmationsScope": "Phạm vi xuất",
      "exportConfirmationsScopeAll": "Tất cả giao dịch",
      "exportConfirmationsScopeFiltered": "Theo bộ lọc hiện tại",
      "exportConfirmationsFormat": "Định dạng tải về",
      "exportConfirmationsBtnDownload": "Tải xuống",
      "toastExportConfirmationsStart": "Đang chuẩn bị file xuất báo cáo...",
      "manageUsersTitle": "Quản lý người dùng",
      "reportedTransferStatus": "Đã báo chuyển",
      "confirmAction": "Xác nhận thao tác",
      "contactPageTitle": "Liên hệ | PetAI",
      "contactInfoTitle": "Thông tin liên lạc",
      "legalInfoTitle": "Thông tin pháp lý",
      "companyNameLabel": "TÊN CÔNG TY",
      "taxIdLabel": "MÃ SỐ THUẾ",
      "representativeLabel": "NGƯỜI ĐẠI DIỆN",
      "licenseDateLabel": "NGÀY CẤP PHÉP",
      "headquartersLabel": "TRỤ SỞ CHÍNH",
      "hotlineLabel": "HOTLINE",
      "appNameLabel": "Tên ứng dụng/website:",
      "appNamePlaceholder": "PetAI",
      "devNameLabel": "Tên nhà phát triển/công ty:",
      "devNamePlaceholder": "CÔNG TY TNHH MỘT THÀNH VIÊN CÔNG NGHỆ KỸ THUẬT TIÊN PHONG",
      "contactEmailLabel": "Email liên lạc",
      "addressLabel": "Địa chỉ:",
      "addressPlaceholder": "P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ",
      "processingTimeNote": "Lưu ý thời gian xử lý:",
      "responseTimeDesc": "Thường trong 1-3 ngày làm việc. Cảm ơn sự hỗ trợ thiết thực\n                    của bạn!",
      "sendMessageOnline": "Gửi tin nhắn trực tuyến",
      "submitForm": "Gửi biểu mẫu",
      "yourNamePlaceholder": "Tên của bạn...",
      "emailAddressPlaceholder": "Địa chỉ email...",
      "supportQuestionPlaceholder": "Bạn cần hỗ trợ gì?",
      "additionalNotesPlaceholder": "Ghi chú chi tiết thêm...",
      "uploadNewPhoto": "Tải ảnh mới",
      "revenueThisMonthSuffix": "tháng này",
      "newUsersThisWeekSuffix": "mới tuần này",
      "newOrdersTodaySuffix": "hôm nay",
      "predictionsTodaySuffix": "hôm nay",
      "dataDeletionPolicyPageTitle": "Chính sách xóa dữ liệu | PetAI",
      "settingsLabel": "Thiết lập / Settings",
      "arrowSelect": "&gt; Chọn",
      "accountManagement": "Quản lý tài khoản",
      "arrowClick": "&gt; Nhấn",
      "deleteAccount": "Xóa tài khoản",
      "autoDeleteInfoDesc": "để hệ thống tự động loại bỏ thông tin của bạn.",
      "deleteDataRequestSubject": "Yêu cầu xóa dữ liệu/tài khoản",
      "fromRequestTime": "kể từ khi có yêu cầu.",
      "retainedDataDesc": "Một số dữ liệu thuộc về báo cáo thanh toán, giao dịch hoá đơn hoặc\n              các chi tiết nhằm phục vụ tranh chấp có thể sẽ được tiếp tục lưu\n              giữ tùy thuộc vào quy định pháp luật sở tại yêu cầu.",
      "petaiErrorTitle": "PetAI - Lỗi {{ code }}",
      "errorCodeTitle": "Lỗi {{ code }}",
      "forgotPasswordPageTitle": "Quên mật khẩu - PetAI",
      "newScan": "Nhận diện mới",
      "viewDetails": "Xem chi tiết",
      "speciesDog": "Chó",
      "historyPaginationAria": "Phân trang lịch sử",
      "identifyNav": "NHẬN DIỆN",
      "dogBreedsNav": "GIỐNG CHÓ",
      "howItWorks": "Cách hoạt động",
      "resultDemoSh": "MINH_HỌA_KẾT_QUẢ.SH",
      "inputLabel": "Đầu vào:",
      "analyzingImageDemo": "\"Đang phân tích đặc trưng giống từ image_01.jpg...\"",
      "analysisResultsDemo": "Kết quả phân tích...",
      "shibaDemoResult": "[1] Shiba Inu: 82% độ tin cậy.",
      "akitaDemoResult": "[2] Akita: 11% độ tin cậy.",
      "basenjiDemoResult": "[3] Basenji: 7% độ tin cậy.",
      "priceFree": "0đ",
      "foreverSuffix": "/ vĩnh viễn",
      "freeScans10": "10 lượt nhận diện",
      "max3Ads": "Tối đa 3 lần xem QC",
      "days7Suffix": "/ 7 ngày",
      "scans50": "50 lượt nhận diện",
      "days30Suffix": "/ 30 ngày",
      "scans200": "200 lượt nhận diện",
      "days90Suffix": "/ 90 ngày",
      "loginPageTitle": "Đăng nhập - PetAI",
      "paymentsUserDesc": "Các đơn bạn đã tạo và trạng thái xử lý hiện tại.",
      "upgradePlanTitle": "Nâng cấp gói",
      "totalOrdersCard": "Tổng đơn hàng",
      "pendingOrdersCard": "Đơn đang chờ",
      "paidStatus": "Đã thanh toán",
      "cancelledStatus": "Đã hủy",
      "expiredStatus": "Hết hạn",
      "pendingStatus": "Khởi tạo",
      "invoiceBtn": "Hóa đơn",
      "continuePay": "Tiếp tục thanh toán",
      "noPaymentsMessage": "Bạn chưa thực hiện giao dịch nâng cấp tài khoản nào trên PetAI.",
      "upgradeNowBtn": "Nâng cấp gói ngay",
      "orderPaginationAria": "Phân trang đơn hàng",
      "predictResultPageTitle": "Kết quả dự đoán | PetAI",
      "mainObjectDetection": "Nhận diện đối tượng chính",
      "hybridRatioAnalysis": "Phân tích tỷ lệ lai dự tính",
      "similarityPrefix": "Độ tương đồng: ",
      "privacyPolicyPageTitle": "Chính sách quyền riêng tư | PetAI",
      "updateDatePrefix": "Ngày cập nhật: 16/06/2026",
      "privacySection1Title": "1. Thông tin nhà phát triển/công ty",
      "devIntroText": "Dịch vụ được phát triển và thiết kế bởi",
      "companyNamePlaceholder": "CÔNG TY TNHH MỘT THÀNH VIÊN CÔNG NGHỆ KỸ THUẬT TIÊN PHONG",
      "devIntroTextSuffix": ". Chúng tôi cam kết bảo\n              vệ thông tin cá nhân và quyền riêng tư của bạn an toàn nhất có\n              thể.",
      "privacySection2Title": "2. Dữ liệu nào được thu thập",
      "privacySection2Desc": "Chúng tôi có thể thu thập các loại dữ liệu bao gồm: Tên tài khoản,\n              Email, Mật khẩu (đã mã hóa an toàn), hình ảnh chó bạn tải về hệ\n              thống nhận diện, cũng như các hành vi tương tác trên ứng dụng.",
      "privacySection3Title": "3. Mục đích sử dụng dữ liệu",
      "privacySection3Desc": "Dữ liệu được dùng để cung cấp quyền truy cập, xác thực bảo mật,\n              tối ưu hóa các mẫu nhận dạng AI qua thời gian, và hỗ trợ kĩ thuật\n              cần thiết.",
      "privacySection4Title": "4. Có chia sẻ dữ liệu với bên thứ ba hay không",
      "privacySection4Desc": "Tuyệt đối không, trừ các hệ thống hạ tầng lõi cần thiết (Firebase,\n              Google Analytics) hoặc nếu có yêu cầu chặt chẽ từ cơ quan có thẩm\n              quyền theo pháp luật.",
      "privacySection5Title": "5. Cookies, Firebase, Analytics",
      "privacySection5Desc": "Ứng dụng có thể sử dụng Cookies, Google Analytics để đo đạc và\n              Crashlytics để thu thập lỗi giúp chúng tôi hoàn thiện chất lượng\n              nhanh chóng hơn.",
      "privacySection6Title": "6. Quyền của người dùng",
      "privacySection6Desc": "Bạn luôn có quyền kiểm soát nội dung cá nhân của mình, yêu cầu\n              xem, chỉnh sửa, trích xuất dữ liệu, hoặc yêu cầu dừng xử lý tại\n              bất kỳ thời điểm nào.",
      "privacySection7Title": "7. Cách yêu cầu xóa dữ liệu",
      "privacySection7Desc": "Bạn có thể chủ động vào Cài đặt -> Xóa tài khoản, hoặc xem\n              hướng dẫn chi tiết tại",
      "privacySection8Title": "8. Thông tin liên hệ",
      "addressLabelPlaceholder": "Địa chỉ: P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ",
      "registerPageTitle": "Tạo tài khoản - PetAI",
      "planPrefix": "GÓI",
      "infoTab": "Thông tin",
      "fromLabel": "Từ",
      "businessDaysCount": "1–3 ngày làm việc",
      "orCreateAccount": "hoặc tạo tài khoản mới.",
      "sendMailUnder": "Gửi thư theo",
      "ourHelpSupport": "của chúng tôi để được trợ giúp.",
      "useFormBelow": "Bạn có thể sử dụng biểu mẫu phía dưới mục",
      "orSendSupportEmail": "hoặc gửi thư về support@pet.ai.",
      "planFreeLabel": "MIỄN PHÍ (FREE)",
      "upgradePromptPrefix": ". Nâng cấp để tăng lượt nhận diện và trải nghiệm mượt mà không quảng cáo.\n                {% else %}\n                  Tài khoản của bạn đang sử dụng gói",
      "upgradePromptSuffix": ". Bạn có thể nâng cấp hoặc gia hạn bên dưới.\n                {% endif %}",
      "scansUnit": "nhận diện",
      "enterprisePlanActive": "Gói Enterprise đang hoạt động",
      "autoVietQR": "VietQR tự động",
      "vietQrInstructions": ". Bạn chỉ cần quét mã QR được hiển thị và chuyển đúng số tiền cùng nội dung chuyển khoản để hệ thống tự động duyệt.",
      "freePlanBenefits": "Quyền lợi gói Miễn phí",
      "basicPlanBenefits": "Quyền lợi gói Cơ bản",
      "proPlanBenefits": "Quyền lợi gói Pro",
      "enterprisePlanBenefits": "Quyền lợi gói Doanh nghiệp",
      "uploadPageTitle": "Tải ảnh & Phân tích - PetAI",
      "uploadHeaderTitle": "Tải ảnh để nhận diện giống chó",
      "dailyPetTipTitle": "Góc kiến thức & Mẹo nhỏ",
      "uploadHeaderDesc": "Kéo thả ảnh chó của bạn để AI phân tích và dự đoán giống với độ tin cậy chi tiết.",
      "clickToSelectPhoto": "hoặc bấm để chọn ảnh từ máy tính",
      "supportedFormatsDesc": "Hỗ trợ JPG, JPEG, PNG • Tối đa 10MB",
      "analyzeNowBtn": "Phân tích ngay",
      "quotaPlanPrefix": "Gói: ",
      "watchAdToUnlock": "Xem quảng cáo để thêm lượt",
      "adminUsersPageTitle": "Quản trị Người dùng - PetAI",
      "adminUsersDesc": "Quản lý trạng thái tài khoản, gói dịch vụ và quyền truy cập của hệ thống.",
      "showingUsers": "Hiển thị {{ start_index }} - {{ end_index }} trên {{ total_users }} người dùng",
      "assignPlanHeader": "Cấp gói",
      "adminUserDetailPageTitle": "Quản trị Người dùng #{{ user.id }} - PetAI",
      "sensitiveAreaTitle": "Khu vực nhạy cảm",
      "quotaSettingsTitle": "Gói dịch vụ & Hạn mức sử dụng",
      "remainingSuffix": "lại",
      "userIdLabel": "Mã số tài khoản (User ID)",
      "orUsernameToConfirm": "hoặc tên đăng nhập để xác nhận",
      "deleteOrUsernamePlaceholder": "DELETE hoặc username",
      "backToList": "Quay lại danh sách",
      "selectPlanToAssign": "Chọn gói cấp",
      "adLimitReachedPrompt": "Bạn đã sử dụng hết 10 lượt miễn phí. Xem một đoạn quảng cáo\n            ngắn để nhận thêm",
      "threeScans": "3 lượt",
      "adLimitLimitPrompt": "nhận diện AI. (Tối đa 3 lần).",
      "invoiceSuccessDesc": "Thanh toán thành công!<br>Hóa đơn của bạn đang được hiển thị.",
      "confirmPaymentText": "Xác nhận đã nhận tiền cho đơn {orderId} ({user} - {plan})?",
      "confirmLockUser": "Khoá tài khoản {username}?",
      "confirmUnlockUser": "Mở khoá tài khoản {username}?",
      "actionFailed": "Thao tác thất bại.",
      "deleteFailed": "Xóa thất bại.",
      "invalidConfirmation": "Xác nhận không đúng.",
      "confirming": "Đang xác nhận...",
      "avatarAlt": "Ảnh đại diện",
      "chuyenKhoanShort": "Chuyển khoản",
      "contactShort": "Liên hệ",
      "onlySupportJpgPng": "Chỉ hỗ trợ ảnh JPG, JPEG hoặc PNG.",
      "waitingPaymentDesc": "Đang chờ thanh toán...<br>Hệ thống sẽ tự động kiểm tra lại sau vài giây.",
      "mixLai": "Mix Lai:",
      "predictedBreed": "Giống dự đoán",
      "referenceBreed": "Giống tham khảo",
      "msgSendSuccessDemo": "Bạn đã bấm Gửi thành công! (Dữ liệu Demo)",
      "reasonPurebredDominant": "Ứng viên thuần chủng/chiếm ưu thế.",
      "reasonPurebredMorphology": "Ứng viên thuần chủng/chiếm ưu thế theo tương đồng hình thái.",
      "reasonHybridCandidate": "Ứng viên nghi lai.",
      "reasonHybridClose": "Ứng viên nghi lai (Top-1 và Top-2 rất sát nhau).",
      "reasonBreedShownTop1": "Giống hiển thị theo Top-1 dự đoán.",
      "reasonNoDetail": "Chưa có diễn giải chi tiết cho lần dự đoán này.",
      "top3NoteSoftmax": "Top 3 theo xác suất softmax.",
      "top3NoteSimilarity": "Top 3 theo tương đồng hình thái (similarity).",
      "notConfigured": "Chưa cấu hình",
      "userGuidePageTitle": "Hướng dẫn sử dụng - PetAI",
      "userGuideHeaderTitle": "Hướng dẫn sử dụng hệ thống PetAI",
      "userGuideSubtitle": "Khám phá các bước chi tiết và mẹo hữu ích để nhận diện chính xác các giống chó cưng bằng AI của chúng tôi.",
      "guideStepsTitle": "Mục lục Hướng dẫn Sử dụng",
      "guideStep1Title": "Bước 1: Đăng nhập/Đăng ký",
      "guideStep1Desc": "Truy cập vào tài khoản để lưu lịch sử nhận diện và quản lý hạn mức.",
      "guideStep2Title": "Bước 2: Tải lên hình ảnh",
      "guideStep2Desc": "Kéo thả ảnh hoặc chọn tệp JPG, JPEG, PNG của cún cưng để tải lên hệ thống.",
      "guideStep3Title": "Bước 3: AI phân tích",
      "guideStep3Desc": "Hệ thống học sâu của PetAI sẽ phân tích các đặc trưng khuôn mặt chó và xử lý trong 2-4 giây.",
      "guideStep4Title": "Bước 4: Xem kết quả chi tiết",
      "guideStep4Desc": "Hiển thị Top 3 giống chó kèm độ tin cậy và bản đồ nhiệt Grad-CAM trực quan.",
      "guideTipsTitle": "Mẹo chụp ảnh để có kết quả chính xác nhất",
      "guideTip1": "Chụp ảnh cận cảnh, rõ nét khuôn mặt của chó.",
      "guideTip2": "Đảm bảo điều kiện ánh sáng tốt, tránh ngược sáng hoặc quá tối.",
      "guideTip3": "Tránh chụp ảnh có nhiều con chó cùng lúc hoặc quá nhiều vật thể gây nhiễu xung quanh.",
      "guideTip4": "Góc chụp chính diện khuôn mặt chó luôn mang lại kết quả tối ưu từ mô hình AI.",
      "guideIntroTitle": "1. Giới thiệu về PetAI",
      "guideIntroDesc": "PetAI là nền tảng nhận diện giống chó thông minh hàng đầu hiện nay. Bằng việc tích hợp mô hình thị giác máy tính học sâu (Deep Learning) YOLOv8 kết hợp cùng các thuật toán phân tích đặc trưng hình thái tiên tiến, PetAI có khả năng nhận diện hơn 120 giống chó phổ biến trên thế giới. Hệ thống không chỉ đưa ra tên giống chó dự đoán mà còn cung cấp độ tin cậy cụ thể, bản đồ nhiệt trực quan hóa đặc điểm nhận diện Grad-CAM, và kho tài liệu bách khoa toàn thư chi tiết cho từng giống chó.",
      "guideRegisterTitle": "2. Hướng dẫn đăng ký tài khoản thành viên",
      "guideRegisterDesc": "Để lưu trữ lịch sử nhận diện lâu dài và quản lý hạn mức quét ảnh linh hoạt, bạn nên sở hữu một tài khoản cá nhân. Các bước thực hiện:",
      "guideRegisterStep1": "Truy cập vào trang Đăng ký từ menu góc trên bên phải hoặc gõ trực tiếp đường dẫn /register.",
      "guideRegisterStep2": "Điền đầy đủ thông tin: Họ tên hiển thị, Tên đăng nhập độc nhất, địa chỉ Email chính xác (để nhận hóa đơn thanh toán) và Mật khẩu bảo mật.",
      "guideRegisterStep3": "Tích chọn đồng ý với Điều khoản Dịch vụ và nhấp chọn nút 'Đăng ký tài khoản' để kích hoạt tài khoản của bạn.",
      "guideLoginTitle": "3. Hướng dẫn đăng nhập hệ thống",
      "guideLoginDesc": "Hệ thống hỗ trợ 2 phương thức đăng nhập tiện lợi giúp bảo đảm an toàn thông tin cá nhân của bạn:",
      "guideLoginMethod1": "Đăng nhập thông thường: Nhập chính xác Email (hoặc Tên đăng nhập) và Mật khẩu cá nhân đã đăng ký vào biểu mẫu tại trang Đăng nhập.",
      "guideLoginMethod2": "Đăng nhập nhanh bằng tài khoản Google: Nhấn chọn nút 'Đăng nhập bằng Google' để liên kết và đăng nhập nhanh chỉ trong 1 lần click chuột thông qua cổng xác thực bảo mật của Google.",
      "guideFreePlanTitle": "4. Chính sách Gói Miễn Phí (Free Plan)",
      "guideFreePlanDesc": "PetAI luôn chào đón mọi người dùng mới bằng chính sách gói cước Miễn phí với cơ chế linh hoạt như sau:",
      "guideFreePlanLimit": "Hạn mức ban đầu: Bạn nhận được 10 lượt nhận diện giống chó miễn phí vĩnh viễn ngay sau khi kích hoạt tài khoản thành công.",
      "guideFreePlanAds": "Mở khóa từ Quảng cáo: Khi dùng hết 10 lượt mặc định, bạn có thể xem quảng cáo ngắn (tối đa 3 lần/ngày) để nhận thêm 3 lượt nhận diện cho mỗi lượt xem hoàn tất.",
      "guideFreePlanOut": "Khi hết lượt sử dụng: Sau khi sử dụng hết tất cả lượt miễn phí mặc định và lượt thưởng từ quảng cáo, bạn cần nâng cấp lên gói cước trả phí để tiếp tục trải nghiệm.",
      "guideIdentifyTitle": "5. Quy trình nhận diện giống chó",
      "guideIdentifyDesc": "Để AI phân tích hình thái học và trả về kết quả dự đoán giống cún cưng chính xác nhất, bạn vui lòng thực hiện:",
      "guideIdentifyStep1": "Tải ảnh cún cưng lên bằng cách kéo thả hình ảnh vào khung tải lên hoặc nhấp chuột để chọn tệp trực tiếp từ bộ nhớ máy tính/điện thoại.",
      "guideIdentifyStep2": "Đảm bảo hình ảnh ở định dạng JPG, JPEG hoặc PNG và có dung lượng nhỏ hơn 10MB.",
      "guideIdentifyStep3": "Nhấn chọn nút 'Phân tích ngay'. Hệ thống AI sẽ tự động chạy bộ lọc YOLOv8 để định vị và khoanh vùng chú chó, sau đó đưa vào mô hình nhận diện giống.",
      "guideIdentifyStep4": "Đợi hệ thống AI xử lý dữ liệu trong khoảng 2-3 giây. Giao diện sẽ tự động tải trang kết quả chi tiết.",
      "guideResultTitle": "6. Giải thích các thông tin kết quả",
      "guideResultDesc": "Trang kết quả cung cấp đầy đủ thông tin phân tích chuyên sâu đa chiều bao gồm:",
      "guideResultItem1": "Tên giống chó: Giống chó được nhận diện có điểm số tương đồng cao nhất.",
      "guideResultItem2": "Độ tin cậy: Tỷ lệ phần trăm thể hiện mức độ chắc chắn của mô hình trí tuệ nhân tạo đối với kết quả dự đoán.",
      "guideResultItem3": "Bách khoa toàn thư: Cung cấp thông tin chi tiết về nguồn gốc, tính cách đặc trưng, cân nặng, chiều cao trung bình và cẩm nang chăm sóc cún cưng.",
      "guideResultItem4": "Bản đồ nhiệt Grad-CAM: Trực quan hóa vùng đặc điểm (như dáng tai, mõm, cấu trúc mắt) mà mô hình AI tập trung phân tích nhiều nhất để ra quyết định phân loại giống.",
      "guideModesTitle": "7. Chế độ phân tích Thuần chủng & Lai",
      "guideModesDesc": "Hệ thống tự động phân loại cún cưng dựa trên điểm số tương quan đặc trưng hình thái học bên ngoài:",
      "guideModesPure": "Nhận diện Thuần chủng: Hiển thị khi độ tin cậy vượt trội (thường từ 80% trở lên), kết luận cún cưng có độ đồng nhất rất cao với giống chuẩn.",
      "guideModesHybrid": "Phân tích Tỷ lệ Lai dự tính: Nếu cún cưng có đặc điểm lai trộn hoặc mô hình nhận diện thấy xác suất Top 1 và Top 2 gần nhau, hệ thống sẽ vẽ biểu đồ ước tính tỷ lệ phần trăm lai giữa các giống hàng đầu.",
      "guideUpgradeTitle": "8. Hướng dẫn nâng cấp gói dịch vụ",
      "guideUpgradeDesc": "Để mở khóa không giới hạn lượt quét ảnh và tắt hoàn toàn quảng cáo phiền nhiễu, bạn hãy thực hiện:",
      "guideUpgradeWhen": "Khi nào cần nâng cấp: Khi tài khoản của bạn hết lượt quét miễn phí hoặc khi bạn muốn trải nghiệm tốc độ xử lý ưu tiên hàng đầu.",
      "guideUpgradeChoose": "Chọn gói cước: Vào mục 'Nâng cấp gói', chọn một trong ba gói: Basic (50 lượt/7 ngày/1,000đ), Pro (200 lượt/30 ngày/5,000đ) hoặc Enterprise (Không giới hạn lượt/90 ngày/15,000đ).",
      "guideUpgradePay": "Thanh toán VietQR động: Quét mã QR hiển thị trên màn hình bằng ứng dụng ngân hàng của bạn. Số tiền và nội dung chuyển khoản (chứa mã hóa đơn) đã được điền tự động để bảo đảm tính chính xác.",
      "guideUpgradeProcess": "Kích hoạt tự động: Cổng giao dịch tự động SePay sẽ ghi nhận biến động số dư tài khoản ngân hàng và kích hoạt gói cước cho bạn sau vài giây mà không cần duyệt thủ công.",
      "guideHistoryTitle": "9. Xem lịch sử nhận diện giống chó",
      "guideHistoryDesc": "Tất cả các kết quả nhận diện giống chó sẽ được lưu trữ đám mây bảo mật trong tài khoản của bạn:",
      "guideHistoryList": "Truy cập mục 'Lịch sử' trên thanh menu để xem lại toàn bộ các bức ảnh cún cưng bạn từng tải lên cùng kết quả phân tích.",
      "guideHistoryAction": "Quản lý dữ liệu: Bạn có thể lọc nhanh lịch sử theo giống chó, xem lại chi tiết phân tích sâu hoặc chọn xóa vĩnh viễn các bản ghi cũ không cần thiết.",
      "guideStatsTitle": "10. Thống kê số liệu phân tích cá nhân",
      "guideStatsDesc": "Hệ thống tự động thống kê và trực quan hóa thói quen sử dụng của bạn:",
      "guideStatsOverview": "Tổng quan số liệu: Cung cấp tổng số lần bạn quét ảnh cún cưng, độ tin cậy trung bình của các lần phân tích và số lượng giống chó phong phú bạn đã khám phá.",
      "guideStatsCharts": "Biểu đồ trực quan hóa: Vẽ biểu đồ xu hướng quét ảnh theo tuần/tháng, biểu đồ tròn phân bổ Top 5 giống chó bạn yêu thích nhất và biểu đồ phân phối điểm số tin cậy.",
      "guideFaqTitle": "11. Các câu hỏi thường gặp (FAQ)",
      "guideFaqQ1": "Độ chính xác của mô hình AI như thế nào?",
      "guideFaqA1": "Mô hình học sâu phân loại giống chó dựa trên các đặc điểm hình thái học bề ngoài học được từ cơ sở dữ liệu lớn. Kết quả mang tính tham khảo cao nhưng không thể thay thế cho các phương pháp xét nghiệm di truyền (DNA) chính thống.",
      "guideFaqQ2": "Làm thế nào để tăng độ chính xác khi nhận diện giống chó?",
      "guideFaqA2": "Hãy chụp ảnh cún cưng ở cự ly gần, rõ nét, góc chụp trực diện khuôn mặt dưới ánh sáng tự nhiên đầy đủ. Tránh chụp ảnh bị rung lắc, quá mờ hoặc có quá nhiều vật thể hay vật nuôi khác xung quanh cún.",
      "guideFaqQ3": "Lượt nhận diện miễn phí hoạt động ra sao?",
      "guideFaqA3": "Sau khi đăng ký tài khoản mới, bạn được cấp sẵn 10 lượt quét miễn phí vĩnh viễn. Khi dùng hết, bạn có thể chọn 'Xem quảng cáo' ở trang Nhận diện để nhận thêm +3 lượt quét cho mỗi lần xem (tối đa 3 lần/ngày).",
      "guideFaqQ4": "Tiền đã chuyển khoản nhưng gói cước chưa được kích hoạt?",
      "guideFaqA4": "Hệ thống SePay tự động xử lý giao dịch thường mất từ 10 giây đến 1 phút tùy tốc độ của ngân hàng. Nếu quá 5 phút chưa được kích hoạt, vui lòng nhấn nút 'Tôi đã chuyển tiền' để báo cáo thủ công hoặc liên hệ hotline hỗ trợ.",
      "guideFaqQ5": "Thông tin dữ liệu hình ảnh của tôi có được bảo mật không?",
      "guideFaqA5": "Tất cả hình ảnh cún cưng tải lên đều được mã hóa lưu trữ an toàn trên máy chủ và chỉ hiển thị trong tài khoản cá nhân của riêng bạn. Bạn có thể xóa lịch sử bất cứ lúc nào.",
      "guideContactTitle": "12. Thông tin liên hệ hỗ trợ",
      "guideContactDesc": "Đội ngũ kỹ thuật hỗ trợ 24/7 luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc của bạn qua các kênh liên lạc sau:",
      "guideContactEmail": "Hòm thư điện tử hỗ trợ khách hàng: support@pet.ai (Xử lý thông tin 24/7)",
      "guideContactPhone": "Hotline hỗ trợ khẩn cấp: 0916 416 409",
      "guideContactAddress": "Văn phòng làm việc chính thức: P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ",
      "currencySuffix": "đ",
      "msgEmailSentReset": "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.",
      "msgEnterEmail": "Vui lòng nhập email",
      "msgStatsLoadFailed": "Không thể tải thống kê. Vui lòng thử lại.",
      "msgLoginViewStats": "Vui lòng đăng nhập để xem thống kê.",
      "msgGoogleOauthNotConfigured": "Google OAuth chưa được cấu hình. Hãy set GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET.",
      "msgGoogleOauthMissing": "Google OAuth chưa được cấu hình.",
      "msgGoogleLoginExpired": "Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.",
      "msgDashboardLoadFailed": "Không thể tải dashboard. Vui lòng thử lại.",
      "msgLoginInvalid": "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",
      "msgLoginViewDashboard": "Vui lòng đăng nhập để truy cập dashboard.",
      "msgHistoryLoadFailed": "Không thể tải lịch sử. Vui lòng thử lại.",
      "msgLoginViewHistory": "Vui lòng đăng nhập để xem lịch sử.",
      "msgDbError": "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại.",
      "msgIncorrectPassword": "Mật khẩu không đúng.",
      "msgPasswordLength": "Mật khẩu phải có ít nhất 6 ký tự",
      "msgUserNotFound": "Tài khoản không tồn tại.",
      "msgUsernameLength": "Tên đăng nhập/Email phải có ít nhất 3 ký tự",
      "msgEnterPassword": "Vui lòng nhập mật khẩu",
      "msgEnterUsernameOrEmail": "Vui lòng nhập tên đăng nhập hoặc email",
      "msgLoggedOut": "Bạn đã đăng xuất.",
      "msgCsrfInvalid": "Phiên thao tác không hợp lệ (CSRF). Vui lòng thử lại.",
      "msgInvalidEmail": "Email không hợp lệ",
      "msgEmailInUse": "Email đã được sử dụng. Vui lòng sử dụng email khác.",
      "msgFullnameLength": "Họ và tên phải có ít nhất 2 ký tự",
      "msgCreateAccountError": "Không thể tạo tài khoản. Vui lòng thử lại.",
      "msgConfirmPasswordMismatch": "Mật khẩu xác nhận không khớp",
      "msgUsernameFormat": "Tên đăng nhập phải có 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới",
      "msgUsernameInUse": "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.",
      "msgEnterAllFields": "Vui lòng nhập đầy đủ thông tin",
      "msgSettingsSaved": "Cài đặt đã được lưu thành công!",
      "msgFullnameRange": "Họ và tên phải có từ 2 đến 128 ký tự.",
      "msgSettingsSaveError": "Không thể lưu cài đặt. Vui lòng thử lại.",
      "msgSettingsLoadError": "Không thể tải cài đặt. Vui lòng thử lại.",
      "msgHistoryClearError": "Không thể xóa lịch sử. Vui lòng thử lại.",
      "msgLoginRequiredAction": "Vui lòng đăng nhập để thực hiện thao tác này.",
      "msgLoginRequiredSettings": "Vui lòng đăng nhập để truy cập cài đặt.",
      "msgQuotaExceededCurrent": "Bạn đã hết lượt sử dụng của gói hiện tại. Vui lòng gia hạn để tiếp tục.",
      "msgQuotaExceeded": "Bạn đã hết lượt sử dụng. Vui lòng gia hạn để tiếp tục.",
      "msgPlanExpired": "Gói của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục.",
      "msgFileNotSupported": "Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, JPEG, PNG.",
      "msgAssignPlanError": "Không thể cấp gói cho user. Vui lòng thử lại.",
      "msgDbInitError": "Không thể khởi tạo DB. Vui lòng thử lại.",
      "msgUserDetailLoadError": "Không thể tải chi tiết người dùng.",
      "msgUserListLoadError": "Không thể tải danh sách người dùng.",
      "msgOrderConfirmError": "Không thể xác nhận đơn (có thể đã xác nhận hoặc không tồn tại).",
      "msgConfirmOrderFailed": "Lỗi xác nhận đơn.",
      "msgMissingOrderIdParam": "Thiếu mã đơn.",
      "msgInvalidUserId": "User ID không hợp lệ.",
      "msgLoginRequiredGeneric": "Vui lòng đăng nhập để truy cập chức năng này.",
      "msgDbInitSuccess": "Đã khởi tạo bảng ứng dụng thành công.",
      "msgSessionInvalidShort": "Phiên đăng nhập không hợp lệ.",
      "msgAccountLockedRelogin": "Tài khoản đã bị khóa. Vui lòng đăng nhập lại.",
      "msgPaymentRecordFailed": "Không thể ghi nhận chuyển tiền. Vui lòng thử lại.",
      "msgUploadSaveFailed": "Không thể lưu ảnh tải lên. Vui lòng thử lại với ảnh khác.",
      "warning": "Cảnh báo",
      "info": "Thông tin",
      "changePasswordTitle": "Thay đổi mật khẩu",
      "currentPasswordLabel": "Mật khẩu hiện tại",
      "currentPasswordPlaceholder": "Nhập mật khẩu hiện tại",
      "newPasswordLabel": "Mật khẩu mới",
      "newPasswordPlaceholder": "Nhập mật khẩu mới (>= 6 ký tự)",
      "confirmNewPasswordLabel": "Xác nhận mật khẩu mới",
      "confirmNewPasswordPlaceholder": "Xác nhận mật khẩu mới",
      "notificationsSection": "Cài đặt thông báo",
      "systemNotificationsLabel": "Thông báo hệ thống",
      "systemNotificationsDesc": "Nhận thông báo trực tiếp trên giao diện khi có hoạt động mới.",
      "emailNotificationsLabel": "Thông báo qua Email",
      "emailNotificationsDesc": "Nhận các báo cáo thống kê và cập nhật tài khoản qua thư điện tử.",
      "subscriptionUpgradeBtn": "Nâng cấp gói",
      "downloadAvatar": "Tải xuống",
      "sponsorFood": "PetFood Ultimate: Dinh dưỡng vượt trội",
      "sponsorToy": "PetToys Co.: Đồ chơi năng động cho cún",
      "sponsorSpa": "PetSpa Premium: Thư giãn đẳng cấp",
      "adLive": "TRỰC TIẾP",
      "adPlayingSponsor": "Quảng cáo tài trợ",
      "adWarningDescShort": "Lượt cộng sẽ được tính sau khi đếm ngược kết thúc.",
      "adCountdownLabel": "Giây còn lại",
      "gradcamModalDescText": "Bản đồ nhiệt Grad-CAM thể hiện các vùng đặc trưng trên cơ thể vật nuôi mà mô hình AI tập trung phân tích nhất để đưa ra quyết định nhận diện.",
      "aiArchitecture": "Kiến trúc AI",
      "heatmapResolution": "Độ phân giải bản đồ",
      "downloadGradcam": "Tải xuống ảnh Grad-CAM",
      "dangerZoneTitle": "Vùng nguy hiểm",
      "dangerZoneDesc": "Hành động không thể hoàn tác nếu quá thời hạn",
      "deleteAccountTitle": "Yêu cầu xóa tài khoản",
      "deleteAccountDesc": "Tài khoản sẽ không bị xóa ngay mà chuyển sang <b>trạng thái chờ xóa trong 30 ngày</b>. Trong thời gian này bạn có thể đăng nhập lại để khôi phục.",
      "deleteModalConfirmTitle": "Xác nhận yêu cầu xóa tài khoản",
      "deleteModalConfirmDesc": "Tài khoản sẽ chuyển sang <b>trạng thái chờ xóa 30 ngày</b>.<br>Trong thời gian này bạn vẫn có thể đăng nhập và khôi phục.",
      "deleteModalWarning1": "⚠️ <b>Sau 30 ngày</b>, tất cả dữ liệu, lịch sử và quyền truy cập sẽ bị <b>vô hiệu hóa vĩnh viễn</b>.",
      "deleteModalWarning2": "⚠️ Quá trình này <b>yêu cầu xác nhận qua email</b> (OTP).",
      "deleteReasonLabel": "Lý do xóa (tùy chọn)",
      "deleteReasonPlaceholder": "Ví dụ: Tôi không còn sử dụng dịch vụ nữa...",
      "sendOtpBtn": "Gửi mã xác nhận",
      "deleteModalOtpTitle": "Nhập mã OTP xác nhận",
      "deleteModalOtpDesc": "Mã đã được gửi đến",
      "deleteModalOtpCountdown": "Mã có hiệu lực trong",
      "deleteConfirmBtn": "Xác nhận xóa tài khoản",
      "deleteResendBtn": "Gửi lại mã OTP",
      "deleteSuccessTitle": "Yêu cầu đã được ghi nhận",
      "deleteSuccessDesc": "Tài khoản của bạn đã được chuyển sang <b>trạng thái chờ xóa</b>.<br>Kiểm tra email để biết thêm chi tiết.",
      "sendingStatus": "Đang gửi...",
      "confirmingStatus": "Đang xác nhận...",
      "otpSentSuccess": "Mã OTP mới đã được gửi.",
      "deletePendingPageTitle": "Tài khoản đang chờ xóa - PetAI",
      "deletePendingHeaderTitle": "Tài khoản đang chờ xóa",
      "deletePendingHeaderDesc": "Yêu cầu xóa tài khoản đã được ghi nhận",
      "deletePendingUserLabel": "Tài khoản:",
      "deletePendingDateLabel": "Tài khoản sẽ bị xóa vĩnh viễn vào",
      "daysLabel": "ngày",
      "hoursLabel": "giờ",
      "minsLabel": "phút",
      "deletePendingWarningTitle": "Bạn vẫn có thể đăng nhập nhưng mọi tính năng sẽ bị tạm khóa.",
      "deletePendingWarningDesc": "Nếu bạn <b>không muốn xóa tài khoản</b>, hãy nhấn nút khôi phục bên dưới.",
      "deletePendingWarningPermanently": "Sau 30 ngày, tất cả dữ liệu sẽ bị vô hiệu hóa vĩnh viễn.",
      "restoreAccountBtn": "Khôi phục tài khoản",
      "logoutBtn": "Đăng xuất",
      "needSupportPrefix": "Cần hỗ trợ? Liên hệ",
      "restoreConfirmTitle": "Xác nhận khôi phục",
      "restoreConfirmDesc": "Mã OTP đã được gửi đến",
      "otpCountdownLabel": "Mã có hiệu lực trong",
      "restoreConfirmBtn": "Xác nhận khôi phục",
      "resendOtpBtn": "Gửi lại mã OTP",
      "sendingOtp": "Đang gửi OTP...",
      "identifyCompleted": "Nhận diện hoàn tất!",
      "top1Conclusion": "Top-1 (kết luận)",
      "days7Ago": "7 ngày qua",
      "days30Ago": "30 ngày qua",
      "timesLabel": "{{ code }} lần",
      "sysLogoUploadDrag": "Kéo thả logo vào đây hoặc nhấp để chọn",
      "sysLogoUploadHelp": "PNG, JPG, JPEG, SVG hoặc WEBP (Tối đa 2MB)",
      "sysPlanBasicDesc": "Dành cho cá nhân dùng thử",
      "scansLabel": "lượt",
      "sysRecommended": "Khuyên dùng",
      "sysPlanProDesc": "Lựa chọn phổ biến nhất",
      "sysPlanEntDesc": "Không giới hạn cho tổ chức",
      "sysTotalPages": "Tổng số trang",
      "sysStatus": "Trạng thái",
      "sysOnline": "Trực tuyến",
      "sysHistory": "Lịch sử",
      "sysAutoSave": "Tự động lưu",
      "sysPermission": "Quyền hạn",
      "sysFilterPolicy": "Chính sách",
      "sysFilterSupport": "Hỗ trợ & HD",
      "planBasicLimitDesc": "<strong>50 lượt</strong> nhận diện",
      "planProLimitDesc": "<strong>200 lượt</strong> nhận diện",
      "planEntLimitDesc": "<strong>Không giới hạn</strong> nhận diện",
      "adUnlockPrompt": "Bạn đã sử dụng hết 10 lượt miễn phí. Xem một đoạn quảng cáo ngắn để nhận thêm",
      "otpVerifyPageTitle": "Xác thực OTP - PetAI",
      "forgotPasswordHeader": "Khôi phục mật khẩu",
      "forgotOtpDesc": "Nếu thông tin bạn nhập là chính xác, mã OTP 6 số đã được gửi đến email khôi phục của tài khoản.",
      "otpCodeLabel": "Mã xác thực OTP",
      "otpExpiryLabel": "Mã OTP sẽ hết hạn sau:",
      "confirmOtpBtn": "Xác nhận OTP",
      "orLabel": "hoặc",
      "reenterEmailLink": "Nhập lại email",
      "resendOtpLink": "Gửi lại mã OTP",
      "emailVerifyHeader": "Xác thực Email",
      "registerOtpDesc": "Chúng tôi đã gửi mã xác thực OTP 6 số đến Gmail của bạn:",
      "confirmAccountBtn": "Xác nhận tài khoản",
      "reregisterLink": "Đăng ký lại",
      "userPlanLabel": "Gói {{ code }}",
      "otpInvalidError": "Vui lòng nhập mã OTP gồm đúng 6 chữ số.",
      "sysPagesUnit": "Trang",
      "otpSendFailedError": "Không thể gửi lại OTP.",
      "connectionFailedError": "Lỗi kết nối.",
      "toastDbConnectionError": "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.",
      "toastEmailOrUsernameNotExist": "Email hoặc tên đăng nhập này không tồn tại trong hệ thống. Vui lòng kiểm tra lại.",
      "toastAccountNotVerified": "Tài khoản này chưa được xác thực email. Vui lòng liên hệ hỗ trợ.",
      "toastMailSystemError": "Hệ thống gửi thư gặp sự cố. Vui lòng thử lại sau.",
      "toastOtpSentGmail": "Mã OTP đã được gửi về Gmail của bạn. Vui lòng xác thực.",
      "toastPleaseEnterOtp": "Vui lòng nhập mã OTP",
      "toastOtpIncorrectOrExpired": "Mã OTP không chính xác hoặc đã hết hạn.",
      "toastOtpFailed5Times": "Bạn đã nhập sai OTP quá 5 lần. Vui lòng yêu cầu khôi phục lại mật khẩu.",
      "toastOtpExpiredResend": "Mã OTP đã hết hạn. Vui lòng bấm gửi lại mã.",
      "toastAccountNotFoundOrLocked": "Tài khoản không tồn tại hoặc đã bị khóa.",
      "toastOtpVerifySuccess": "Xác thực OTP thành công. Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.",
      "toastLoginFailedSystemError": "Không thể thiết lập đăng nhập do lỗi hệ thống. Vui lòng thử lại sau.",
      "toastOtpResendLimit": "Bạn đã yêu cầu gửi lại mã OTP quá 3 lần trong vòng 10 phút. Vui lòng thử lại sau.",
      "toastSendEmailFailed": "Không thể gửi email OTP. Vui lòng thử lại sau.",
      "toastOtpNewSentGmail": "Mã OTP mới đã được gửi thành công về Gmail của bạn.",
      "toastAccountPermanentlyDeleted": "Tài khoản của bạn đã bị xóa vĩnh viễn.",
      "toastAccountUnverifiedLogin": "Tài khoản chưa được xác thực email. Vui lòng xác thực email trước khi đăng nhập.",
      "toastAccountDeletedSupport": "Tài khoản này đã bị xóa vĩnh viễn. Vui lòng liên hệ hỗ trợ nếu cần được giúp đỡ.",
      "toastAccountLockedOrDeleted": "Tài khoản đã bị khóa hoặc đã xóa. Vui lòng liên hệ hỗ trợ.",
      "toastTemporaryPasswordWarning": "Bạn đang sử dụng mật khẩu tạm thời. Vui lòng đổi mật khẩu mới để tiếp tục sử dụng hệ thống.",
      "toastMustAgreeTerms": "Bạn phải đồng ý với điều khoản dịch vụ và chính sách bảo mật",
      "toastGmailOnly": "Chỉ chấp nhận email đăng ký có đuôi @gmail.com",
      "toastSendEmailRegisterFailed": "Không thể gửi email OTP. Vui lòng kiểm tra lại cấu hình email hoặc thử lại sau.",
      "toastRegisterOtpSent": "Mã OTP đã được gửi về Gmail của bạn. Vui lòng xác thực.",
      "toastRegisterInfoNotFound": "Không tìm thấy thông tin đăng ký. Vui lòng thực hiện đăng ký lại.",
      "toastRegisterOtpFailed5Times": "Bạn đã nhập sai OTP quá 5 lần. Vui lòng đăng ký lại từ đầu.",
      "toastRegisterSystemError": "Không thể tạo tài khoản do lỗi hệ thống. Vui lòng thử lại.",
      "toastRegisterResendLimit": "Bạn đã yêu cầu gửi lại mã OTP quá 3 lần trong vòng 10 phút. Vui lòng đợi thêm trước khi thử lại.",
      "toastEnterNewPassword": "Vui lòng điền mật khẩu mới và xác nhận mật khẩu.",
      "toastFillAllPasswordInfo": "Vui lòng điền đầy đủ thông tin để thay đổi mật khẩu.",
      "toastPasswordMinLength": "Mật khẩu mới phải có ít nhất 6 ký tự.",
      "toastPasswordsDoNotMatch": "Mật khẩu mới và xác nhận mật khẩu không khớp.",
      "toastUserNotFound": "Không tìm thấy người dùng.",
      "toastCurrentPasswordIncorrect": "Mật khẩu hiện tại không chính xác.",
      "toastSettingsSaved": "Cài đặt và mật khẩu đã được thay đổi thành công!",
      "toastPleaseLogin": "Vui lòng đăng nhập để thực hiện.",
      "toastInvalidSession": "Phiên đăng nhập không hợp lệ.",
      "toastNoImageUpload": "Không tìm thấy file ảnh tải lên.",
      "toastFilenameEmpty": "Tên file rỗng.",
      "toastNotPaidYet": "Bạn chưa thanh toán.",
      "toastAutoConfirmInfo": "Hệ thống sẽ tự xác nhận khi nhận được giao dịch. Bạn không cần bấm xác nhận thủ công.",
      "toastPlanActivated": "Đã xác nhận thanh toán và kích hoạt gói của bạn.",
      "toastTransferRecordedPending": "Đã ghi nhận bạn đã chuyển tiền. Đơn hàng đang chờ admin xác nhận.",
      "toastTransferRecordFailed": "Không thể ghi nhận (đơn có thể đã được báo/đã xác nhận).",
      "toastConfirmTransferFailed": "Không thể ghi nhận chuyển tiền. Vui lòng thử lại.",
      "toastLoginToViewPayments": "Vui lòng đăng nhập để xem lịch sử thanh toán.",
      "toastUsersOnlyPage": "Trang này chỉ dành cho tài khoản người dùng.",
      "toastInvalidUserId": "User ID không hợp lệ.",
      "toastLoadConfigFailed": "Không thể tải cấu hình hệ thống.",
      "toastSaveConfigSuccess": "Cập nhật cấu hình hệ thống thành công.",
      "toastSaveConfigFailed": "Lỗi lưu cấu hình hệ thống.",
      "toastInvalidLegalPage": "Trang pháp lý không hợp lệ.",
      "toastSaveLegalFailed": "Lỗi cập nhật nội dung trang pháp lý.",
      "toastLogoNotFound": "Không tìm thấy file logo.",
      "toastNoFileSelected": "Chưa chọn file upload.",
      "toastLogoUnsupportedFormat": "Định dạng file không hỗ trợ. Chỉ cho phép PNG, JPG, JPEG, SVG, WEBP.",
      "toastLogoSaveSuccess": "Thay đổi logo trang web thành công.",
      "toastSetPlanFailed": "Lỗi cấp gói cho người dùng.",
      "toastEnterLockReason": "Vui lòng nhập lý do khóa.",
      "toastLockUserSuccess": "Đã khóa người dùng thành công.",
      "toastLockUserFailed": "Lỗi khóa người dùng.",
      "toastUnlockUserSuccess": "Đã mở khóa người dùng thành công.",
      "toastUnlockUserFailed": "Lỗi mở khóa người dùng.",
      "toastDeleteUserFailed": "Lỗi xóa người dùng.",
      "toastErrorOccurred": "Đã xảy ra lỗi",
      "toastUnsupportedFormat": "Định dạng file không được hỗ trợ.",
      "toastUploadImageFailed": "Không thể tải ảnh lên. Vui lòng thử lại.",
      "toastAnalyzeImageFailed": "Đã xảy ra lỗi khi phân tích ảnh",
      "toastConnectionFailed": "Đã xảy ra lỗi kết nối",
      "toastAutoTranslating": "Đang tự động dịch các mục chưa có bản dịch...",
      "toastAutoTranslateSuccess": "Đã tự động dịch thành công!",
      "toastSavePageSuccess": "Đã lưu nội dung trang thành công!",
      "toastRestoreOriginalSuccess": "Đã khôi phục nội dung gốc!",
      "toastRestoreVersionSuccess": "Đã khôi phục phiên bản thành công!",
      "uploading": "Đang tải ảnh lên...",
      "uploadSuccess": "Đã cập nhật ảnh đại diện thành công!",
      "highConf": "Độ tin cậy cao",
      "lowConf": "Độ tin cậy thấp",
      "exportHistory": "Xuất lịch sử",
      "viewGrid": "Lưới",
      "viewTable": "Bảng",
      "dateToday": "Hôm nay",
      "date7Days": "7 ngày qua",
      "date30Days": "30 ngày qua",
      "dateAll": "Tất cả thời gian",
      "sortNewest": "Mới nhất",
      "sortOldest": "Cũ nhất",
      "sortConfHighest": "Độ tin cậy cao nhất",
      "sortConfLowest": "Độ tin cậy thấp nhất",
      "loadMore": "Tải thêm kết quả",
      "confirmDeleteTitle": "Xác nhận xóa",
      "rejectedOrders": "Đơn bị từ chối",
      "cancelledOrders": "Đơn đã hủy",
      "toastRejectSuccess": "Đã từ chối thanh toán thành công.",
      "toastRejectError": "Lỗi từ chối thanh toán.",
      "confirmRejectText": "Từ chối đơn {orderId} của {user}?",
      "orderDetailTitle": "Chi tiết đơn",
      "paymentProof": "Minh chứng giao dịch",
      "transferNote": "Nội dung chuyển khoản",
      "adminNote": "Ghi chú admin",
      "noPaymentProof": "Không có ảnh minh chứng thanh toán.",
      "allTime": "Tất cả thời gian",
      "sortAmountHighest": "Số tiền cao nhất",
      "sortAmountLowest": "Số tiền thấp nhất",
      "methodAll": "Tất cả phương thức",
      "statusAll": "Tất cả trạng thái",
      "rejectConfirmTitle": "Xác nhận từ chối",
      "vsLastMonth": "so với tháng trước",
      "sortBy": "Sắp xếp:",
      "sortAlpha": "Tên A-Z",
      "sortPlan": "Gói cao nhất",
      "addUserBtn": "Thêm người dùng",
      "relativeTimeOnline": "Online",
      "relativeTimeHours": "{num} giờ trước",
      "relativeTimeYesterday": "Hôm qua",
      "relativeTimeDays": "{num} ngày trước",
      "relativeTimeMonths": "{num} tháng trước",
      "rowsPerPage": "Hiển thị",
      "paymentHistoryTitle": "Lịch sử thanh toán",
      "paymentHistoryDesc": "Theo dõi các đơn nâng cấp gói và trạng thái xử lý.",
      "paymentHistoryTotalPaid": "Tổng tiền đã thanh toán",
      "paymentHistoryCurrentPlan": "Gói hiện tại",
      "paymentHistoryFilterAllStatus": "Tất cả trạng thái",
      "allOtherLabel": "Khác",
      "paymentHistoryStatusPending": "Chờ thanh toán",
      "paymentHistoryStatusProcessing": "Đang xử lý",
      "paymentHistoryStatusPaid": "Đã thanh toán",
      "paymentHistoryStatusCancelled": "Đã hủy",
      "paymentHistoryStatusFailed": "Thất bại",
      "paymentHistoryFilterAllPlans": "Tất cả gói",
      "paymentHistoryFilterToday": "Hôm nay",
      "paymentHistoryFilter7Days": "7 ngày",
      "paymentHistoryFilter30Days": "30 ngày",
      "paymentHistoryFilterAllTime": "Tất cả thời gian",
      "paymentHistorySortNewest": "Mới nhất",
      "paymentHistorySortOldest": "Cũ nhất",
      "paymentHistorySortAmountHighest": "Số tiền cao nhất",
      "paymentHistorySortAmountLowest": "Số tiền thấp nhất",
      "paymentHistoryClearFilters": "Xóa bộ lọc",
      "paymentHistoryColOrderId": "Mã đơn",
      "paymentHistoryColPlan": "Gói đăng ký",
      "paymentHistoryColStatus": "Trạng thái",
      "paymentHistoryColAmount": "Số tiền",
      "paymentHistoryColMethod": "Phương thức",
      "paymentHistoryColCreated": "Thời gian tạo",
      "paymentHistoryColActions": "Thao tác",
      "paymentHistoryActionDetail": "Xem chi tiết",
      "paymentHistoryActionProceed": "Tiếp tục thanh toán",
      "paymentHistoryActionCancel": "Hủy đơn",
      "paymentHistoryActionInvoice": "Tải hóa đơn",
      "paymentHistoryTransactionId": "Mã giao dịch",
      "paymentHistoryEmptyText": "Bạn chưa có đơn thanh toán nào.",
      "paymentHistoryEmptySubtext": "Hãy chọn một gói dịch vụ để bắt đầu nâng cấp tài khoản.",
      "paymentHistoryCancelConfirmTitle": "Hủy đơn hàng",
      "paymentHistoryCancelConfirmText": "Bạn có chắc chắn muốn hủy đơn hàng {orderId}?",
      "paymentHistoryModalClose": "Đóng",
      "paymentHistoryPaginationShow": "Hiển thị",
      "paymentHistoryPaginationTo": "đến",
      "paymentHistoryPaginationOf": "trong tổng số",
      "paymentHistoryPaginationOrders": "đơn hàng",
      "paymentHistoryPaginationPerPage": "dòng / trang",
      "sysTabGeneral": "Cấu hình chung",
      "sysTabPlans": "Gói cước dịch vụ",
      "sysTabPayments": "Thanh toán",
      "sysTabEmails": "Email & Thông báo",
      "sysTabLegal": "Các trang chính sách & điều khoản",
      "sysStatLegalCount": "Tổng số trang chính sách",
      "sysStatPlansActive": "Gói cước đang hoạt động",
      "sysStatPaymentsActive": "Phương thức thanh toán",
      "sysStatEmailsActive": "Email hệ thống",
      "sysCardBrandTitle": "Nhận diện thương hiệu",
      "sysCardBrandDesc": "Thiết lập logo, favicon và tên website hiển thị trên hệ thống.",
      "sysLabelLogoCurrent": "Logo hiện tại",
      "sysLabelFaviconCurrent": "Favicon hiện tại",
      "sysLabelSiteName": "Tên website",
      "sysLabelSiteDesc": "Mô tả ngắn website",
      "sysLabelDragDropLogo": "Kéo thả hoặc chọn file để tải logo",
      "sysLabelDragDropFavicon": "Kéo thả hoặc chọn file để tải favicon",
      "sysUploadHelp": "PNG, JPG, JPEG, SVG (Tối đa 2MB)",
      "sysUploadHelpFavicon": "ICO, PNG (Tối đa 500KB)",
      "sysCardContactTitle": "Thông tin liên hệ",
      "sysCardContactDesc": "Cập nhật thông tin liên hệ hiển thị trên website.",
      "sysLabelContactEmail": "Email liên hệ / hỗ trợ",
      "sysLabelContactPhone": "Số điện thoại",
      "sysLabelContactAddress": "Địa chỉ",
      "sysLabelContactFb": "Facebook (URL)",
      "sysCardParamsTitle": "Thiết lập hệ thống",
      "sysCardParamsDesc": "Các thiết lập chung cho hoạt động của hệ thống.",
      "sysLabelDefaultLang": "Ngôn ngữ mặc định",
      "sysLabelDefaultTheme": "Theme mặc định",
      "sysLabelMaintenance": "Chế độ bảo trì",
      "sysMaintenanceToggleOn": "Bật",
      "sysMaintenanceToggleOff": "Tắt",
      "sysMaintenanceHelper": "Khi bật chế độ bảo trì, website sẽ hiển thị trang thông báo bảo trì cho người dùng.",
      "sysBtnViewWebsite": "Xem website",
      "sysBtnSaveAll": "Lưu tất cả thay đổi",
      "sysBtnSaving": "Đang lưu...",
      "sysCardVietQrTitle": "Cấu hình thanh toán VietQR",
      "sysCardVietQrDesc": "Bật tắt và cấu hình thanh toán chuyển khoản ngân hàng qua VietQR.",
      "sysLabelVietQrEnable": "Bật thanh toán VietQR",
      "sysLabelVietQrOwner": "Tên chủ tài khoản",
      "sysLabelVietQrAccount": "Số tài khoản",
      "sysLabelVietQrBank": "Ngân hàng",
      "sysLabelVietQrTemplate": "Nội dung chuyển khoản mẫu",
      "sysLabelVietQrEmail": "Email nhận thông báo thanh toán",
      "sysLabelVietQrInstructions": "Mô tả hướng dẫn thanh toán",
      "sysCardPreviewSlip": "Xem trước hóa đơn thanh toán",
      "sysCardPreviewSlipDesc": "Mô phỏng giao diện hiển thị cho người dùng khi nâng cấp gói.",
      "sysCardEmailTemplatesTitle": "Cấu hình mẫu Email",
      "sysCardEmailTemplatesDesc": "Chỉnh sửa nội dung các mẫu email tự động gửi từ hệ thống.",
      "sysLabelSelectEmailTemplate": "Chọn mẫu email cần sửa",
      "sysLabelEmailOtp": "Email xác thực OTP",
      "sysLabelEmailForgot": "Email quên mật khẩu",
      "sysLabelEmailPayConfirm": "Email xác nhận thanh toán thành công",
      "sysLabelEmailPayReject": "Email từ chối thanh toán",
      "sysLabelEmailDeleteRequest": "Email yêu cầu xóa tài khoản",
      "sysLabelEmailDeleteConfirm": "Email xác nhận đã xóa tài khoản",
      "sysLabelEmailSubject": "Tiêu đề email",
      "sysLabelEmailBody": "Nội dung email (HTML / Văn bản)",
      "sysBtnSendTestEmail": "Gửi email thử nghiệm",
      "sysBtnSaveTemplate": "Lưu mẫu email",
      "sysCardLegalPagesTitle": "Danh sách các trang chính sách",
      "sysLabelSearchLegal": "Tìm kiếm trang...",
      "sysFilterAll": "Tất cả",
      "sysFilterGuide": "Hỗ trợ & Hướng dẫn",
      "sysStickyTitle": "Có thay đổi chưa lưu",
      "sysStickyCancel": "Hủy",
      "sysStickySave": "Lưu thay đổi",
      "sysConfirmMaintenanceTitle": "Bật chế độ bảo trì",
      "sysConfirmMaintenanceText": "Bạn có chắc chắn muốn bật chế độ bảo trì? Website sẽ tạm dừng phục vụ người dùng.",
      "sysConfirmRestoreTitle": "Khôi phục mặc định",
      "sysConfirmRestoreText": "Bạn có chắc chắn muốn khôi phục cấu hình gói cước về mặc định?",
      "sysConfirmDeleteLogo": "Xóa logo hiện tại",
      "sysConfirmDeleteLogoText": "Bạn có chắc chắn muốn xóa logo hiện tại?",
      "sysConfirmDeleteFavicon": "Xóa favicon hiện tại",
      "sysConfirmDeleteFaviconText": "Bạn có chắc chắn muốn xóa favicon hiện tại?",
      "sysConfirmDisablePlan": "Tắt gói dịch vụ",
      "sysConfirmDisablePlanText": "Bạn có chắc chắn muốn tắt gói dịch vụ này? Người dùng sẽ không thể chọn nâng cấp gói này nữa.",
      "sysConfirmSaveBigTitle": "Lưu thay đổi lớn",
      "sysConfirmSaveBigText": "Bạn đang thực hiện các thay đổi cấu hình quan trọng. Bạn có chắc chắn muốn lưu lại không?",
      "sysPlanRecommended": "Khuyên dùng",
      "sysPlanStatusActive": "Đang hoạt động",
      "sysPlanStatusInactive": "Đã tắt",
      "sysPlanStatusToggle": "Trạng thái gói cước",
      "sysPlanFeaturesLabel": "Quyền lợi chính của gói",
      "sysBtnRestorePlan": "Khôi phục mặc định",
      "sysBtnSavePlanOnly": "Lưu cấu hình gói",
      "sysCardSmtpTitle": "Trạng thái SMTP & Gửi email",
      "sysCardSmtpDesc": "Thông tin cấu hình gửi thư được thiết lập trong file bảo mật .env.",
      "sysLabelSmtpHost": "SMTP Server",
      "sysLabelSmtpPort": "Cổng SMTP",
      "sysLabelSmtpUser": "Email gửi thư",
      "sysLabelSmtpStatus": "Trạng thái kết nối",
      "sysSmtpConfigured": "Đã cấu hình (.env)",
      "sysSmtpPasswordHidden": "Mật khẩu (Đã ẩn)",
      "sysPreviewSlipTotal": "Thành tiền",
      "sysPreviewSlipRecipient": "Người nhận",
      "sysPreviewSlipBank": "Ngân hàng",
      "sysPreviewSlipNumber": "Số tài khoản",
      "sysPreviewSlipMemo": "Nội dung",
      "sysPreviewSlipStatus": "Trạng thái",
      "sysPreviewSlipPending": "Chờ thanh toán",
      "sysPreviewSlipGenerated": "Được tạo tự động bởi PetAI",
      "paidSubscribed": "Đang dùng gói trả phí",
      "toastDeleteUserSuccess": "Xóa tài khoản {username} thành công.",
      "toastDeleteUserError": "Không thể xóa tài khoản. Vui lòng thử lại.",
      "errorLockSelf": "Không thể tự khóa tài khoản đang đăng nhập.",
      "errorUserNotFound": "Không tìm thấy người dùng.",
      "errorLockFail": "Không thể khóa người dùng.",
      "errorDeleteSelf": "Không thể tự xóa tài khoản đang đăng nhập.",
      "errorMissingConfirm": "Thiếu xác nhận xóa (confirm).",
      "errorIncorrectConfirm": "Xác nhận xóa không đúng.",
      "errorDeleteHasData": "Chỉ cho phép xóa user chưa có dữ liệu liên quan (lịch sử nhận diện/đơn thanh toán).",
      "errorDeleteFail": "Không thể xóa người dùng.",
      "errorInvalidUserId": "User ID không hợp lệ.",
      "errorSetPlanFail": "Không thể cấp gói cho user.",
      "errorRoleSelf": "Không thể tự thay đổi vai trò của tài khoản đang đăng nhập.",
      "errorInvalidRole": "Vai trò không hợp lệ.",
      "errorSetRoleFail": "Không thể thay đổi vai trò.",
      "appearanceTitle": "Giao diện",
      "changePasswordDesc": "Mật khẩu mới (tối thiểu 6 ký tự)",
      "clearHistoryConfirmText": "Bạn có chắc muốn xóa toàn bộ lịch sử nhận diện? Hành động này sẽ xóa tất cả dữ liệu dự đoán và tệp ảnh liên quan trên máy chủ. Hành động này không thể hoàn tác.",
      "clearHistoryConfirmTitle": "Xác nhận xóa lịch sử",
      "confirmDelete": "Xác nhận xóa",
      "editBtn": "Chỉnh sửa",
      "emailActivityDesc": "Gửi cảnh báo tức thì qua email khi có thay đổi mật khẩu hoặc yêu cầu xóa tài khoản.",
      "emailActivityTitle": "Email thông báo bảo mật",
      "notificationGuideTitle": "Thông tin gửi nhận",
      "notificationsTitle": "Cài đặt thông báo",
      "privacyTitle": "Quyền riêng tư",
      "pwdGuideLen": "Độ dài mật khẩu",
      "pwdGuideLenDesc": "Mật khẩu phải chứa ít nhất 6 ký tự. Nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.",
      "pwdGuideOtp": "Bảo mật hai lớp",
      "pwdGuideOtpDesc": "Các hành động nhạy cảm như xóa tài khoản đều yêu cầu xác thực bằng mã OTP gửi về email đăng ký.",
      "pwdGuideUnique": "Không dùng lại mật khẩu cũ",
      "pwdGuideUniqueDesc": "Tránh sử dụng chung một mật khẩu cho nhiều tài khoản khác nhau trên Internet.",
      "securityGuideTitle": "Hướng dẫn bảo mật",
      "settingsTabAppearance": "Giao diện",
      "settingsTabNotifications": "Thông báo",
      "settingsTabPrivacy": "Quyền riêng tư",
      "settingsTabProfile": "Hồ sơ",
      "settingsTabSecurity": "Bảo mật",
      "systemActivityDesc": "Hiển thị thông báo nổi (toasts) trực quan khi AI hoàn thành phân tích hoặc khi hệ thống được nâng cấp.",
      "systemActivityTitle": "Thông báo trên trình duyệt",
      "errorRequestOtp": "Gặp lỗi khi yêu cầu OTP.",
      "connectionErrorTryAgain": "Lỗi kết nối. Vui lòng thử lại.",
      "enterAll6Digits": "Vui lòng nhập đủ 6 chữ số.",
      "incorrectOtp": "Mã OTP không đúng.",
      "connectionError": "Lỗi kết nối.",
      "errorResendOtp": "Không thể gửi lại OTP.",
      "changeAvatarTitle": "Thay đổi ảnh đại diện",
      "toastDeleteHistoryError": "Lỗi không thể xóa lịch sử.",
      "toastSettingsSaveError": "Không thể lưu cài đặt.",
      "toastNewOtpSent": "Mã OTP mới đã được gửi.",
      "imageCol": "Ảnh",
      "breedCol": "Giống chó",
      "typeCol": "Phân loại",
      "confidenceCol": "Độ tin cậy",
      "timeCol": "Thời gian",
      "actionsCol": "Thao tác",
      "vs7DaysAgo": "so với 7 ngày trước",
      "ratioPercentage": "Chiếm",
      "showingTextPrefix": "Đang hiển thị 1 - ",
      "showingTextMiddle": "trong tổng số",
      "showingTextSuffix": "kết quả.",
      "methodQR": "QR VietQR",
      "methodBank": "Chuyển khoản",
      "allMethods": "Tất cả phương thức",
      "timeToday": "Hôm nay",
      "time7Days": "7 ngày qua",
      "time30Days": "30 ngày qua",
      "perPage": "mỗi trang",
      "buyerInfo": "Thông tin người mua",
      "fullnameUsername": "Họ và tên / Username",
      "transactionSuccess": "Giao dịch thành công",
      "orderCodeUpper": "MÃ ĐƠN:",
      "timeUpper": "THỜI GIAN:",
      "memoUpper": "NỘI DUNG CK:",
      "recipientAccountUpper": "TÀI KHOẢN NHẬN:",
      "timeCreatedLabel": "Thời gian tạo:",
      "timeConfirmedLabel": "Xác nhận lúc:",
      "emptyStateDesc": "Tất cả đơn chuyển khoản hiện đã được đồng bộ.",
      "ordersText": "đơn",
      "planPro": "Pro",
      "password": "Mật khẩu",
      "sysConfigPageTitle": "Cấu hình hệ thống - PetAI",
      "sysConfigTitle": "Cấu hình hệ thống",
      "sysConfigDesc": "Quản lý logo, liên hệ, gói cước dịch vụ, thanh toán và nội dung các trang điều khoản pháp lý.",
      "sysEmailsUnit": "Địa chỉ",
      "sysMethodsUnit": "Phương thức",
      "sysPlansUnit": "Gói",
      "sysPlansTitle": "Gói cước dịch vụ",
      "sysPlansDesc": "Thay đổi đơn giá, số ngày sử dụng và hạn mức lượt quét cho từng gói thành viên đăng ký.",
      "sysPlanBasic": "Gói Cơ Bản (Basic)",
      "sysPlanPro": "Gói Chuyên Nghiệp (Pro)",
      "sysPlanEnterprise": "Gói Doanh nghiệp (Enterprise)",
      "sysPlanPriceVnd": "Giá gói (VNĐ)",
      "sysPlanDurationDays": "Thời gian dùng (Ngày)",
      "sysPlanScanLimit": "Hạn mức quét (Lượt)",
      "sysPlanEntScanNote": "Hạn mức quét (lượt hoặc 'unlimited')",
      "sysLogoUploadNew": "Tải lên tài nguyên mới",
      "sysViewPage": "Xem trang",
      "sysEditPage": "Chỉnh sửa",
      "sysLegalDesc": "Biên soạn nội dung trực tiếp cho các trang pháp luật của hệ thống bằng mã HTML/Văn bản.",
      "sysLegalOptTerms": "Điều khoản sử dụng",
      "sysLegalOptPrivacy": "Chính sách quyền riêng tư",
      "sysLegalOptPayment": "Chính sách thanh toán",
      "sysLegalOptDeletion": "Chính sách xóa dữ liệu",
      "sysLegalOptContact": "Trang Liên hệ",
      "sysLegalOptSupport": "Trang Hỗ trợ",
      "sysLegalOptUserGuide": "Hướng dẫn sử dụng",
      "sysDescTerms": "Các điều khoản và quy định pháp lý ràng buộc giữa người dùng và ứng dụng PetAI.",
      "sysDescPrivacy": "Quy định cách thu thập, bảo mật và sử dụng thông tin cá nhân của người dùng.",
      "sysDescPayment": "Quy trình thanh toán, nâng cấp tài khoản và chính sách hoàn tiền.",
      "sysDescDeletion": "Quy trình và chính sách hỗ trợ người dùng xóa tài khoản cùng dữ liệu lưu trữ.",
      "sysDescContact": "Thông tin liên lạc chính thức, địa chỉ và kênh hỗ trợ trực tiếp của PetAI.",
      "sysDescSupport": "Giải đáp các thắc mắc thường gặp và hỗ trợ kỹ thuật cho người dùng.",
      "sysDescUserGuide": "Cung cấp cẩm nang chi tiết cách sử dụng các chức năng phân tích và chẩn đoán.",
      "paymentSearchPlaceholder": "Tìm theo mã đơn hoặc mã giao dịch...",
      "sysLegalSearchPlaceholder": "Tìm kiếm trang...",
      "langVi": "Tiếng Việt",
      "langEn": "Tiếng Anh",
      "errorPrefix": "Lỗi: ",
      "toastSendingTestEmail": "Đang gửi email thử nghiệm mẫu \"{templateName}\"...",
      "toastSendTestEmailSuccess": "Đã gửi email thử nghiệm thành công tới địa chỉ hỗ trợ của bạn!",
      "toastUploadingAsset": "Đang tải lên tài nguyên...",
      "toastRestorePlansSuccess": "Đã khôi phục cài đặt mặc định các gói. Bấm lưu thay đổi để hoàn tất.",
      "msgCannotRejectOrder": "Không thể từ chối đơn (có thể đã xử lý hoặc không tồn tại).",
      "msgRejectOrderError": "Lỗi từ chối đơn.",
      "msgChangeFaviconSuccess": "Thay đổi favicon trang web thành công.",
      "msgPayDirectly": "Vui lòng thực hiện thanh toán trực tiếp trên trang nâng cấp.",
      "msgInvalidFaviconFormat": "Định dạng file favicon không hỗ trợ. Chỉ cho phép ICO, PNG, JPG, JPEG, SVG, WEBP.",
      "msgInvalidLogoFormat": "Định dạng file logo không hỗ trợ. Chỉ cho phép PNG, JPG, JPEG, SVG, WEBP.",
      "contactEmail": "Email: support@tienphongtech.vn",
      "contactPhone": "Điện thoại: 0916 416 409",
      "contactAddress": "Địa chỉ: P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, Phường Cái Răng, TP. Cần Thơ",
      "historyScan": "Lịch sử nhận dạng",
      "servicePlans": "Gói dịch vụ",
      "footerPayment": "THANH TOÁN",
      "comparedToLastPeriodLabel": "So với kỳ trước",
      "noMatchingUsers": "Không tìm thấy người dùng",
      "paymentPolicy": "Chính sách thanh toán",
      "paymentPolicyPageTitle": "Chính sách thanh toán | PetAI",
      "paymentSection1Desc": "Các quy định về thanh toán và nâng cấp gói dịch vụ.",
      "paymentSection1Title": "1. Quy định chung",
      "paymentSection2Desc": "Chi tiết về các phương thức thanh toán được hỗ trợ.",
      "paymentSection2Title": "2. Phương thức thanh toán",
      "paymentSection3Desc": "Quy trình xác nhận và kích hoạt gói sau khi thanh toán.",
      "paymentSection3Title": "3. Xác nhận và kích hoạt",
      "paymentSection4Desc": "Chính sách hoàn tiền đối với các giao dịch.",
      "paymentSection4Title": "4. Chính sách hoàn tiền",
      "paymentSection5Desc": "Trách nhiệm của người dùng khi thực hiện giao dịch.",
      "paymentSection5Title": "5. Trách nhiệm người dùng",
      "paymentUpdateDatePrefix": "Cập nhật lần cuối:",
      "statsComparisonLabel": "So sánh thống kê",
      "statsHighlights": "Điểm nổi bật",
      "statsHighlightsDesc": "Các chỉ số quan trọng trong kỳ",
      "statsMostCommonBreed": "Giống phổ biến nhất",
      "statsNewBreedsBadge": "Giống mới",
      "statsNoData": "Chưa có dữ liệu",
      "statsPeakActiveDay": "Ngày hoạt động cao điểm",
      "statsPeakConfidence": "Độ tin cậy cao nhất",
      "actionTitle": "Hành động",
      "btnChangeImage": "Đổi ảnh",
      "btnDeleteImage": "Xóa ảnh",
      "btnReanalyze": "Phân tích lại ảnh",
      "card2Description": "Dựa trên đặc điểm hình thái",
      "cardAnalysisTime": "Thời gian phân tích",
      "cardBestBreed": "Giống dự đoán",
      "cardImageInfo": "Ảnh phân tích",
      "cardPredType": "Loại dự đoán",
      "downloadReport": "Tải báo cáo",
      "downloadReportBtn": "Tải ảnh gốc",
      "highConfidenceBadge": "Độ tin cậy cao",
      "infoFileFormat": "Định dạng",
      "infoFileName": "Tên file",
      "infoFileResolution": "Kích thước",
      "infoFileSize": "Dung lượng",
      "infoFileStatus": "Trạng thái",
      "lowConfidenceResult": "Độ tin cậy thấp",
      "mixConclusionDesc": "Dự đoán dựa trên đặc điểm hình thái, không phải xét nghiệm di truyền.",
      "mixConclusionLabel": "Kết luận:",
      "modelStatusValue": "Tốt - Ổn định",
      "noRecentHistory": "Chưa có lịch sử nhận diện",
      "recentHistory": "Lịch sử gần đây",
      "recentHistoryLink": "Xem tất cả lịch sử",
      "shareResult": "Chia sẻ kết quả",
      "similarityLink": "Xem tất cả các giống tương đồng",
      "validImage": "Ảnh hợp lệ",
      "viewHistoryBtn": "Xem lịch sử",
      "saveResultTitle": "Lưu lịch sử",
      "saveResultDesc": "Lưu trữ kết quả để xem lại sau này",
      "downloadReportTitle": "Tải báo cáo PDF",
      "downloadReportDesc": "Xuất tệp báo cáo chi tiết của AI",
      "shareResultTitle": "Chia sẻ kết quả",
      "shareResultDesc": "Chia sẻ hình ảnh kết quả nhận diện cún cưng của bạn lên mạng xã hội hoặc gửi cho bạn bè.",
      "analyzeAnotherTitle": "Phân tích ảnh khác",
      "analyzeAnotherDesc": "Chọn ảnh khác để tiếp tục phân tích",
      "viewModelInfo": "Thông tin mô hình",
      "hybridBreedDesc": "Dựa trên biểu hiện ngoại hình (tai, mõm, màu lông) và tỷ lệ độ tin cậy Top-3, mô hình ước tính tỷ lệ lai ghép giữa 2 giống có độ tin cậy cao nhất:",
      "gradcamLegend": "Bản đồ nhiệt AI tập trung khi nhận diện. Vùng AI chú ý: <span class=\"text-red-500 font-bold\">Cao (Đỏ)</span>, <span class=\"text-yellow-500 font-bold\">Trung bình (Vàng)</span>, <span class=\"text-blue-500 font-bold\">Thấp (Xanh)</span>",
      "mixConclusionPrefix": "Ảnh có đặc điểm lai giữa",
      "mixConclusionAnd": "và",
      "advicePurebredVerify": "Khuyến nghị: kiểm tra gen để xác định độ thuần",
      "simBreedsDesc": "Kho dữ liệu hơn 120 giống chó giúp trích xuất đặc trưng và so sánh độ tương đồng ngoại hình tại thời điểm hiện tại.",
      "needMoreIdentifyDesc": "Hệ thống AI của chúng tôi hỗ trợ tải lên nhiều định dạng ảnh. Hãy tải ảnh mới ngay.",
      "disclaimerDesc1": "Kết quả nhận diện được phân tích dựa trên hình thái học bằng học sâu.",
      "disclaimerDesc2": "Mọi kết quả chỉ mang tính chất tham khảo trực quan, không thay thế cho các xét nghiệm di truyền chính xác.",
      "disclaimerDesc3": "Mức độ tin cậy thể hiện xác suất khớp ngoại hình với kho dữ liệu của chúng tôi.",
      "gradcamModalDesc": "Bản đồ nhiệt Grad-CAM thể hiện các vùng đặc trưng trên cơ thể vật nuôi mà mô hình AI tập trung phân tích nhất để đưa ra quyết định nhận diện.",
      "modelLogicDesc": "Mô hình phân loại: ResNet-101 Deep Convolutional Network\nMô hình phát hiện vật thể: YOLOv5 Realtime Object Detector\nĐộ phân giải: 224x224 (Phân loại), 640x640 (Phát hiện)\nDữ liệu huấn luyện: Trọng số ImageNet + Stanford Dogs (120 giống chó) + tinh chỉnh chuyên sâu.",
      "modelLogicTitle": "Kiến trúc & Logic mô hình",
      "toastPrepReport": "Đang chuẩn bị báo cáo...",
      "toastLinkCopied": "Đã sao chép liên kết!",
      "toastLinkCopyFailed": "Không thể sao chép liên kết.",
      "toastFilenameCopied": "Đã sao chép tên file!",
      "modelStatusValueText": "Tốt - Ổn định",
      "imgFormatBadgeText": "Ảnh hợp lệ",
      "cardAnalysisTimeValue": "Xử lý tức thì",
      "modelArchitectureTitle": "Kiến trúc mô hình",
      "modelStatusTitle": "Trạng thái mô hình",
      "modelAverageConfTitle": "Độ tin cậy TB hệ thống",
      "modelAppTitle": "Ứng dụng mô hình",
      "loginLeftTitleAccent": "chính xác",
      "regLeftTitleAccent": "PetAI",
      "supportHoursLabel": "Giờ hỗ trợ",
      "supportTimeLabel": "Thời gian hỗ trợ",
      "deleteRequests": "Yêu cầu xóa",
      "deleteRequestsTitle": "Quản lý yêu cầu xóa tài khoản",
      "noDeleteRequests": "Không tìm thấy yêu cầu xóa nào",
      "deleteReason": "Lý do xóa",
      "deleteRequestedAt": "Ngày yêu cầu",
      "deleteScheduledAt": "Ngày dự kiến xóa",
      "actionRestore": "Khôi phục",
      "actionDeleteNow": "Xóa ngay",
      "triggerCleanup": "Dọn dẹp hệ thống",
      "deleteRequestsOverview": "Tổng quan yêu cầu xóa",
      "pendingDeleteCount": "Đang chờ xóa",
      "deletedCount": "Đã xóa vĩnh viễn",
      "toastRestoreSuccess": "Đã khôi phục tài khoản thành công!",
      "toastForceDeleteSuccess": "Đã xóa vĩnh viễn tài khoản thành công!",
      "toastCleanupSuccess": "Đã dọn dẹp {count} tài khoản hết hạn!",
      "deleteRequestsSubtitle": "Xem, khôi phục hoặc xóa vĩnh viễn các tài khoản người dùng đã gửi yêu cầu xóa.",
      "deleteRequestsInfoTitle": "Quy trình xóa tài khoản 30 ngày",
      "deleteRequestsInfoText": "Khi người dùng xác nhận yêu cầu xóa, tài khoản sẽ được đưa vào danh sách chờ xóa vĩnh viễn trong 30 ngày. Trong thời gian này, Admin có quyền khôi phục tài khoản nếu người dùng thay đổi quyết định, hoặc thực thi xóa vĩnh viễn ngay lập tức (Force Delete) nếu cần thiết.",
      "pendingDeleteAccounts": "Tài khoản ở trạng thái pending_delete",
      "deletedAccounts": "Tài khoản đã bị vô hiệu hóa hoàn toàn",
      "noDeleteRequestsDesc": "Không có người dùng nào khớp với bộ lọc tìm kiếm.",
      "confirmCleanupTitle": "Dọn dẹp hệ thống",
      "confirmCleanupText": "Bạn có chắc chắn muốn chạy quét và dọn dẹp các tài khoản chờ xóa quá hạn 30 ngày?",
      "confirmRestoreUserTitle": "Khôi phục tài khoản",
      "confirmRestoreUserText": "Bạn có chắc chắn muốn khôi phục tài khoản {username}?",
      "confirmForceDeleteUserTitle": "Xóa vĩnh viễn tài khoản",
      "confirmForceDeleteUserText": "CẢNH BÁO: Bạn đang thực hiện xóa vĩnh viễn tài khoản {username} ngay lập tức. Toàn bộ dữ liệu sẽ bị hủy bỏ. Nhập 'FORCE' để xác nhận.",
      "labelRequested": "Yêu cầu:",
      "labelScheduled": "Dự kiến:",
      "labelDeleted": "Xác nhận xóa:",
      "statusCompleted": "Đã xử lý",
      "placeholderConfirmForce": "Nhập 'FORCE' để xác nhận",
      "exportConfirmationsFormatExcel": "Microsoft Excel (.xlsx)",
      "exportConfirmationsFormatCSV": "CSV File (.csv)",
      "toastExportConfirmationsSuccess": "Xuất dữ liệu thành công!",
      "hybridTipTitle": "Đặc tính chó lai",
      "hybridTipDesc": "Chó lai sở hữu nguồn gen đa dạng, kết hợp độc đáo các đặc điểm ngoại hình và tính cách từ cả bố và mẹ.",
      "addUserModalTitle": "Thêm người dùng mới",
      "addUserFullname": "Họ và tên",
      "addUserUsername": "Tên đăng nhập",
      "addUserEmail": "Email",
      "addUserPassword": "Mật khẩu",
      "addUserRole": "Vai trò",
      "addUserPlan": "Gói dịch vụ",
      "addUserExpiry": "Hạn sử dụng gói",
      "addUserPaidUses": "Số lượt quét cấp thêm",
      "addUserSubmitBtn": "Xác nhận tạo",
      "roleUser": "User (Người dùng)",
      "roleAdmin": "Admin (Quản trị viên)",
      "toastAddUserSuccess": "Tạo người dùng mới thành công!",
      "toastAddUserError": "Lỗi tạo người dùng.",
      "submitting": "Đang xử lý..."
    },
    "en": {
      "homePageTitle": "PetAI | Intelligent Dog Breed Identification",
      "homeHeroTag": "PROJECT: DOG BREED IDENTIFICATION",
      "homeHeroTitle": "DOG BREED IDENTIFICATION",
      "homeHeroDesc": "Identify purebred and mixed breed dogs from input photos, returning Top-3 breeds with confidence scores and visual explanations.",
      "homeStartBtn": "Start Identifying",
      "homeHowItWorks": "How It Works",
      "homeAccuracy": "ACCURACY",
      "homeTryNow": "Try Now",
      "homeFeaturesTitle": "What Makes PetAI Stand Out?",
      "homeFeaturesSub": "Experience fast, clear, and explainable identification.",
      "homeFeature1Title": "Fast Identification",
      "homeFeature2Title": "Top-3 Breeds",
      "homeFeature3Title": "Visual Explanations",
      "homeFeature4Title": "Save History",
      "homeDetail1Title": "Fast, clear results in seconds",
      "homeDetail1Desc": "PetAI analyzes photos and returns clear results, helping you identify dog breeds quickly.",
      "homeDetail1Point1": "Fast image processing without waiting",
      "homeDetail1Point2": "Top-3 results with confidence levels",
      "homeDetail1Point3": "Easy-to-understand highlighted regions",
      "homeDemoTitle": "RESULT ILLUSTRATION",
      "homeViewHistory": "View identification history",
      "homeDetail2Title": "Top-3 breeds for easy comparison",
      "homeDetail2Desc": "The system returns the 3 most likely breeds, useful for mixed breed dogs.",
      "homeDetail2Point1": "Results sorted by confidence scores",
      "homeDetail2Point2": "Quick comparison between close breeds",
      "homeDetail2Point3": "Suitable recommendations for mixed breeds",
      "homeTop3Title": "TOP-3 RECOMMENDATIONS",
      "homeDemoDisclaimer": "Illustrative results, percentages may vary.",
      "homeDetail3Title": "Visual, easy-to-understand explanations",
      "homeDetail3Desc": "Highlights key visual features to explain how the AI makes decisions.",
      "homeDetail3Point1": "Highlights ears, eyes, and snout regions",
      "homeDetail3Point2": "Intuitive and easy-to-track visuals",
      "homeDetail3Point3": "Increases confidence for reference use",
      "homeHighlightedRegions": "HIGHLIGHTED REGIONS",
      "homeDemoRegionDesc": "Ears and eyes regions are clearly highlighted.",
      "homeDemoHeatmapDesc": "Simulated heatmap illustration.",
      "homeDetail4Title": "Save history for future retrieval",
      "homeDetail4Desc": "Review previous scan results for easy comparison and sharing.",
      "homeDetail4Point1": "Saves results automatically over time",
      "homeDetail4Point2": "Quick filter by breed or date",
      "homeDetail4Point3": "Share results with friends",
      "homeRecentHistoryTitle": "RECENT HISTORY",
      "homeOpenHistoryBtn": "Open History",
      "homeCommunityTitle": "TRUSTED BY PET LOVERS",
      "homeCommunitySub": "PetAI helps dog owners, pet shops, and vet clinics make faster decisions from real photos.",
      "homeStatsUsers": "USERS",
      "homeStatsUsersDesc": "Registered accounts",
      "homeStatsPredictions": "PREDICTIONS",
      "homeStatsPredictionsDesc": "Processed scans",
      "homeStatsAccuracyDesc": "Optimized for purebred and mixed breeds",
      "homeStatsSupport": "SUPPORT",
      "homeStatsSupportDesc": "Customer support during usage",
      "homeCoreValuesTitle": "CORE VALUES",
      "homeCoreValuesSub": "Fast, clear, and explainable identification using advanced deep learning.",
      "homeCoreValue1Tag": "01 / DATA",
      "homeCoreValue1Title": "120+ Dog Breeds",
      "homeCoreValue1Desc": "Comprehensive classification of popular breeds and hybrid detection with a huge database.",
      "homeCoreValue2Tag": "02 / RESULTS",
      "homeCoreValue2Title": "Top-3 Results",
      "homeCoreValue2Desc": "Returns the 3 most likely breeds, optimized for mixed breeds.",
      "homeCoreValue3Tag": "03 / VISUALIZATION",
      "homeCoreValue3Desc": "Highlights key visual features (ears, eyes, snout) to show how AI identifies the dog.",
      "homeCoreValue4Tag": "04 / SECURITY",
      "homeCoreValue4Title": "Data Protection",
      "homeCoreValue4Desc": "Uploaded photos are processed securely and used only for identification purposes.",
      "homeCoreValue5Tag": "05 / PERFORMANCE",
      "homeCoreValue5Title": "Instant Processing",
      "homeCoreValue5Desc": "Get clear results in seconds thanks to our high-performance optimized system.",
      "homePricingTitle": "TRANSPARENT PRICING",
      "homePricingSub": "Choose the plan that best fits your identification needs.",
      "homeForever": "forever",
      "homePlanFreeScans": "10 scans",
      "homePlanFreeAds": "Max 3 ad views",
      "homePlanFreeSuit": "Suitable for trial",
      "homePlanFreeBtn": "Get Started",
      "homePricing7Days": "7 days",
      "homePricing30Days": "30 days",
      "homePricing90Days": "90 days",
      "homePlanEntScans": "Unlimited scans",
      "homePlanChooseBtn": "Choose Plan",
      "homePlanProBtn": "Choose Pro",
      "homeWorkflowTitle": "Identification Process",
      "homeWorkflowSub": "From input photo to final results in just a few seconds.",
      "homeStep1Tag": "STEP 1 - UPLOAD",
      "homeStep1Title": "Upload clear photo",
      "homeStep1Desc": "Take a front-facing, well-lit photo to increase accuracy.",
      "homeStep1Status": "READY",
      "homeStep2Tag": "STEP 2 - AI ANALYSIS",
      "homeStep2Title": "YOLOv8 model + classification",
      "homeStep2Desc": "Detects the dog and classifies the breed based on facial features.",
      "homeStep2Status": "INSTANT",
      "homeStep3Tag": "STEP 3 - RESULTS",
      "homeStep3Title": "Top-3 breeds & confidence",
      "homeStep3Status": "COMPLETE",
      "homeAudienceTitle": "Suitable for various user groups",
      "homeAudience1Title": "Pet Owners",
      "homeAudience1Desc": "Quickly check dog breed for care tracking and training guidance.",
      "homeAudience2Title": "Pet Shops",
      "homeAudience2Desc": "Support customer consultation based on clear and explainable AI results.",
      "homeAudience3Title": "Vet Clinics",
      "homeAudience3Desc": "Get initial reference data before intake and clinical assessment.",
      "homeFaqTitle": "FREQUENTLY ASKED QUESTIONS",
      "homeFaqSub": "Quick answers to common questions about PetAI.",
      "homeFaq1Q": "Is the result 100% accurate?",
      "homeFaq1A": "No. The AI system returns results based on probabilities from the training dataset. We provide the Top-3 breeds with the highest confidence scores for better objective reference, which is especially useful for mixed breeds.",
      "homeFaq2Q": "How long does it take to get results?",
      "homeFaq2A": "The system is optimized to return results within seconds (usually 2-5 seconds) after the image is uploaded successfully. This speed may vary slightly depending on your network speed and image file size.",
      "homeFaq3Q": "How is the uploaded image processed?",
      "homeFaq3A": "Each image you upload is encrypted and transmitted via secure protocols. PetAI commits to using the images solely for dog breed identification and will not share your personal data with any third party without your consent.",
      "homeFaq4Q": "Does PetAI support mixed breeds?",
      "homeFaq4A": "Yes, PetAI is specifically designed to handle both purebred and mixed breed dogs. For mixed breeds, the system analyzes morphological features and displays the Top-3 dog breeds with the closest similarity along with confidence percentages for each.",
      "homeCtaSub": "Clear results in seconds",
      "homeCtaDesc": "Top-3 breeds, clear confidence. Join the community of thousands of pet lovers using PetAI every day.",
      "homeStartFreeBtn": "Start for Free",
      "homeGuideBtn": "User Guide",
      "lockAccountBtn": "Lock Account",
      "unlockAccountBtn": "Unlock Account",
      "deleteUserBtn": "Delete User",
      "reportedTransfer": "Transfer Reported",
      "pendingConfirmOrders": "Pending Orders",
      "confirmPaymentTitle": "Confirm Payment",
      "confirmPaymentSub": "Please review selected package and proceed",
      "adUnlockRemaining": "Unlock left",
      "adViewsUsed": "Ads viewed",
      "adsWatchedLabel": "Ads watched",
      "languageLabel": "English",
      "languageFlag": "🇺🇸",
      "shortLabel": "US",
      "home": "Home",
      "product": "Product",
      "features": "Features",
      "pricing": "Pricing",
      "about": "About",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "dashboard": "Dashboard",
      "predict": "Identify",
      "uploadPhotoBtn": "Identify",
      "history": "History",
      "statistics": "Statistics",
      "upgrade": "Upgrade",
      "payments": "Payment History",
      "manageUsers": "Users",
      "approveOrders": "Orders",
      "systemConfig": "Configure",
      "adminGroupTitle": "ADMIN",
      "quickAccess": "Quick Access",
      "uploadAnalyze": "Analyze",
      "predictionHistory": "History",
      "personalStats": "Statistics",
      "upgradePlan": "Upgrade",
      "personalInfo": "Personal Info",
      "accountSettings": "Settings",
      "role": "Role:",
      "plan": "Plan:",
      "aboutPetAI": "About PetAI",
      "connect": "Connect",
      "identifyNow": "Identify Now",
      "collection": "Collection",
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "dataDeletion": "Data Deletion Policy",
      "support": "Support",
      "contact": "Contact",
      "copyright": "Copyright © 2026 PetAI. All rights reserved",
      "footerUserGuide": "USER GUIDE",
      "footerTerms": "TERMS",
      "footerPrivacy": "PRIVACY",
      "footerDesc": "AI-powered dog breed identification app for pet lovers. Fast and accurate results.",
      "dashWelcomeDesc": "Track your identification activity, history and prediction performance at a glance.",
      "uploadNew": "Upload Photo",
      "viewHistory": "View History",
      "totalRevenue": "Total Revenue",
      "revenueFromPaid": "From paid plans",
      "totalUsers": "Total Users",
      "registeredAccounts": "Registered accounts",
      "newThisWeek": "new this week",
      "pendingOrders": "Pending Orders",
      "viewPendingList": "View pending list",
      "todayNew": "today",
      "totalSystemPredictions": "Total System Predictions",
      "allSystemScans": "All scans across the system",
      "todayCount": "today",
      "totalPredictions": "Total Predictions",
      "yourScans": "Your personal scans",
      "avgConfidence": "Avg. Confidence",
      "avgAccuracy": "Average accuracy",
      "breedsAnalyzed": "Breeds Analyzed",
      "uniqueBreedsFound": "Unique breeds you identified",
      "viewReport": "View Report",
      "detailedStats": "Detailed Statistics",
      "deepAnalysis": "In-depth analysis of your scan history",
      "financialAnalytics": "Financial Analytics",
      "revenueAndPlans": "Revenue & subscription plan distribution",
      "revenueTrend": "Revenue Trend",
      "revenueTrendSubtitle": "Total amount from paid orders (VND)",
      "days7": "7 days",
      "days30": "30 days",
      "days90": "90 days",
      "months12": "12 months",
      "custom": "Custom",
      "selectDateRange": "Select date range",
      "fromDate": "From date",
      "toDate": "To date",
      "apply": "Apply",
      "subscriptionDistribution": "Subscription Distribution",
      "subscriptionByUser": "User percentage per plan",
      "planDetails": "Plan Details",
      "activityCharts": "Activity Charts",
      "liveUpdate": "Live updates",
      "predTrend7": "Prediction trend for last 7 days",
      "predTrendSubtitle": "Number of images identified per day",
      "last7days": "Last 7 days",
      "top5Breeds": "Top 5 Most Popular Breeds",
      "top5BreedsSubtitle": "Most frequently identified dog breeds",
      "confidenceDist": "Confidence Distribution",
      "confidenceDistSubtitle": "Classifier confidence level breakdown",
      "recentResults": "Recent Results",
      "viewAll": "View All",
      "viewAllResults": "View all results",
      "today": "Today",
      "yesterday": "Yesterday",
      "last7daysTab": "Last 7 Days",
      "emptyDashboard": "You have no identification history. Start by uploading a new photo.",
      "predictionLabel": "Prediction:",
      "historyTitle": "Identification History",
      "totalPredictionsLabel": "Total Identifications",
      "imageScanCount": "Image scan count",
      "pureDog": "Purebred",
      "pureBreed": "Pure breed",
      "hybridDog": "Mixed Breed",
      "hybridBreed": "Suspected hybrid breed",
      "avgConfidenceLabel": "Avg. Confidence",
      "avgAccuracyLabel": "Average accuracy",
      "identificationList": "Identification List",
      "newIdentification": "New Identification",
      "all": "All",
      "searchBreed": "Search breed...",
      "clearSearch": "Clear search",
      "viewDetail": "View Details",
      "emptyHistory": "No identification history",
      "emptyHistoryDesc": "Upload your first photo to start predicting dog breeds.",
      "startNow": "Start Now",
      "modalBreedLabel": "Breed:",
      "modalConfLabel": "Confidence:",
      "modalDateLabel": "Date:",
      "modalSpeciesLabel": "Species:",
      "close": "Close",
      "deleteBtn": "Delete",
      "deleteConfirm": "Are you sure you want to delete this identification record?",
      "statsTitle": "Your Identification Statistics",
      "statsSubtitle": "Overview of prediction count, confidence and top dog breeds.",
      "exportReport": "Export Report",
      "totalScans": "Total Identifications",
      "totalScansLabel": "Total identification count",
      "avgConfStat": "Avg. Confidence",
      "avgAccStat": "Average accuracy",
      "breedsExplored": "Breeds Explored",
      "uniqueBreeds": "Unique dog breeds",
      "recentActivity": "Recent Activity",
      "recentActivityLabel": "Most recent identifications",
      "activityChart": "Activity Charts",
      "trendTitle": "Identification Trend",
      "trendSubtitle": "Number of images identified per day",
      "noDataInRange": "No data available for this time range.",
      "top5BreedsTitle": "Top 5 Most Popular Breeds",
      "top5BreedsDesc": "Most frequently identified dog breeds",
      "noTopBreedData": "Not enough data to display top breeds.",
      "confidenceDistTitle": "Confidence Distribution",
      "confidenceDistDesc": "Classifier confidence level breakdown",
      "breedDistTitle": "Breed Distribution",
      "breedDistDesc": "Proportion of identified dog breeds",
      "noDataChart": "No data yet",
      "recentResultsTitle": "Recent Results",
      "noActivity": "No activity yet!",
      "noActivityDesc": "Upload a photo of your pet to start identifying dog breeds.",
      "timesCount": "times",
      "settingsTitle": "Account Settings",
      "profileSection": "Personal Information",
      "fullnameLabel": "Full Name",
      "fullnameHint": "This name is displayed on profile and navigation bar.",
      "usernameLabel": "Username",
      "usernameLocked": "Username cannot be changed.",
      "emailLabel": "Email Address",
      "appearanceSection": "Appearance",
      "themeLabel": "Theme",
      "themeLight": "Light",
      "themeDark": "Dark",
      "themeAuto": "Auto",
      "privacySection": "Privacy",
      "historyStorage": "History Storage",
      "historyStorageDesc": "Image data and prediction results are saved in your history. You can clear them at any time.",
      "viewHistoryLink": "View History",
      "clearAllHistory": "Clear all history",
      "cancel": "Cancel",
      "saveChanges": "Save Changes",
      "saving": "Saving...",
      "deleting": "Deleting...",
      "clearHistoryConfirm": "Are you sure you want to clear all identification history? This action cannot be undone.",
      "infoSidebarLink": "Information",
      "appearanceSidebarLink": "Appearance",
      "privacySidebarLink": "Privacy",
      "loginTitle": "Sign In",
      "loginSubtitle": "Welcome back! Please enter your details.",
      "usernameOrEmail": "Username or Email",
      "usernamePlaceholder": "e.g. username or email@example.com",
      "passwordLabel": "Password",
      "passwordPlaceholder": "Enter password",
      "forgotPassword": "Forgot password?",
      "rememberLogin": "Remember me",
      "loginBtn": "Sign In",
      "orContinueWith": "or continue with",
      "loginWithGoogle": "Login with Google",
      "noAccount": "Don't have an account?",
      "registerNow": "Register now",
      "loginLeftTitle": "Fast and accurate dog breed ",
      "loginLeftSubtitle": "A smart assistant that helps you identify and understand your pets better.",
      "loginFeature1Title": "Clear confidence scores",
      "loginFeature1Desc": "Detailed AI analysis",
      "loginFeature2Title": "Scan history",
      "loginFeature2Desc": "Save all identification results",
      "usernameShort": "Username/email must be at least 3 characters.",
      "passwordShort": "Password must be at least 6 characters.",
      "registerTitle": "Create New Account",
      "registerSubtitle": "Fill in the details below to start identifying dog breeds.",
      "fullnameLabelReg": "Full Name",
      "fullnamePlaceholder": "John Doe",
      "usernameLabelReg": "Username",
      "usernamePlaceholderReg": "3-20 chars, letters/numbers/_",
      "passwordLabelReg": "Password",
      "passwordPlaceholderReg": "At least 6 characters",
      "confirmPassword": "Confirm Password",
      "confirmPasswordPlaceholder": "Re-enter password",
      "agreeTerms": "I agree to the terms of service and privacy policy.",
      "createAccount": "Create Account",
      "registerWithGoogle": "Register with Google",
      "alreadyHaveAccount": "Already have an account?",
      "loginNow": "Sign in",
      "regLeftTitle": "Join the dog-loving community with ",
      "regLeftSubtitle": "Save identification history, analyze habits, and receive smart health alerts for your furry friend.",
      "regFeature1Title": "Welcome new member",
      "regFeature1Desc": "Start with the Free plan today",
      "regFeature2Title": "10 free scans",
      "regFeature2Desc": "Each account comes with initial trial scans",
      "regFeature3Title": "Account security",
      "regFeature3Desc": "Personal information is securely protected",
      "fullnameTooShort": "Full name must be at least 2 characters.",
      "invalidEmail": "Invalid email address.",
      "usernameInvalid": "Username must be 3-20 characters (letters, numbers, _).",
      "passwordTooShort": "Password must be at least 6 characters.",
      "passwordMismatch": "Passwords do not match.",
      "upgradeTitle": "Upgrade Subscription Plan",
      "upgradeSubtitle": "Choose the right plan to experience the full features of PetAI",
      "planFree": "Free",
      "planBasic": "Basic",
      "planPremium": "Premium",
      "planEnterprise": "Enterprise",
      "currentPlan": "Current Plan",
      "choosePlan": "Choose Plan",
      "perMonth": "/month",
      "forever": "Forever",
      "mostPopular": "Most Popular",
      "bestValue": "Best Value",
      "upgradePlanBtn": "Upgrade",
      "buyNow": "Buy Now",
      "contactSales": "Contact Sales",
      "paymentsTitle": "Payment History",
      "paymentsSubtitle": "List of your plan upgrade transactions",
      "orderCode": "Order Code",
      "planName": "Plan",
      "amount": "Amount",
      "status": "Status",
      "paymentDate": "Payment Date",
      "action": "Action",
      "statusPending": "Pending",
      "statusApproved": "Approved",
      "statusRejected": "Rejected",
      "statusPaid": "Paid",
      "statusCancelled": "Cancelled",
      "noPayments": "No transactions yet",
      "noPaymentsDesc": "You haven't upgraded any plans yet. Explore available plans.",
      "viewPlans": "View Plans",
      "uploadProof": "Upload Proof",
      "viewProof": "View Proof",
      "cancelOrder": "Cancel Order",
      "cancelConfirm": "Are you sure you want to cancel this order?",
      "usersTitle": "User Management",
      "usersSubtitle": "List of all users in the system",
      "searchUser": "Search users...",
      "filterAll": "All",
      "filterAdmin": "Admin",
      "filterUser": "User",
      "userId": "ID",
      "userName": "Name",
      "userEmail": "Email",
      "userRole": "Role",
      "userPlan": "Plan",
      "userScanCount": "Scan Count",
      "userJoined": "Joined",
      "userActions": "Actions",
      "viewUser": "View Details",
      "editUser": "Edit",
      "deleteUser": "Delete User",
      "deleteUserConfirm": "Are you sure you want to delete this user?",
      "noUsers": "No users found",
      "confirmationsTitle": "Approve Upgrade Orders",
      "confirmationsSubtitle": "Orders awaiting approval",
      "approve": "Approve",
      "reject": "Reject",
      "approveConfirm": "Approve this order?",
      "rejectConfirm": "Reject this order?",
      "noPendingOrders": "No pending orders",
      "uploadTitle": "Dog Breed Identification",
      "uploadSubtitle": "Upload a photo for AI to analyze and identify the dog breed",
      "dragDropHere": "Drag & drop photo here",
      "orClickToSelect": "or click to select image",
      "supportedFormats": "Supported: JPG, PNG, WEBP. Max 10MB.",
      "analyzeBtn": "Analyze",
      "analyzing": "Analyzing...",
      "resultTitle": "Identification Results",
      "confidence": "Confidence",
      "breedLabel": "Breed",
      "speciesLabel": "Species",
      "analyzeAnother": "Analyze another image",
      "saveToHistory": "Save to History",
      "noImageSelected": "No image selected",
      "uploadError": "An error occurred while uploading the image.",
      "checkoutTitle": "Checkout Plan",
      "orderSummary": "Order Summary",
      "paymentMethod": "Payment Method",
      "bankTransfer": "Bank Transfer",
      "uploadTransferProof": "Upload Transfer Proof",
      "submitOrder": "Submit Order",
      "processingOrder": "Processing...",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "retry": "Retry",
      "back": "Back",
      "next": "Next",
      "confirm": "Confirm",
      "yes": "Yes",
      "no": "No",
      "search": "Search",
      "filter": "Filter",
      "export": "Export",
      "share": "Share",
      "copy": "Copy",
      "edit": "Edit",
      "delete": "Delete",
      "save": "Save",
      "notDetermined": "Undetermined",
      "forgotLeftTitle": "Password Recovery",
      "forgotLeftSubtitle": "Account security is our top priority. We will assist you in recovering it quickly and safely.",
      "forgotFeature1Title": "Secure Verification",
      "forgotFeature1Desc": "Data is encrypted according to security standards",
      "forgotFeature2Title": "Instant Recovery Email",
      "forgotFeature2Desc": "Receive a reset link in just a few seconds",
      "forgotFeature3Title": "24/7 Support",
      "forgotFeature3Desc": "Our team is always ready when you need us",
      "forgotTitle": "Forgot Password",
      "forgotSubtitle": "Enter your email to receive instructions to reset your password.",
      "registeredEmail": "Registered Email",
      "sendInstructions": "Send Instructions",
      "backToLogin": "Back to",
      "loginLink": "login",
      "errorPageTitle": "PetAI - Error",
      "errorLabel": "Error",
      "errorTitle": "Something went wrong",
      "errorDefaultDesc": "We are experiencing an issue retrieving data. The resource you are looking for may have been moved or is temporarily unavailable.",
      "backToHome": "Back to home",
      "checkSystem": "Check system",
      "errorRetryLater": "If the issue persists, please try again later.",
      "adUnlockTitle": "Watch ad to unlock scan limit",
      "adUnlockDesc": "You have used all 10 free scans. Watch a short advertisement to receive 3 additional AI scans (Maximum 3 times).",
      "adScanned": "Scanned",
      "adSponsor": "PetAI Sponsor",
      "adRemaining": "Time remaining",
      "adPlaying": "Simulated ad playing",
      "adWarningDesc": "Please do not close this window. AI scan quota will be added to your account after the video finishes.",
      "adWatchedComplete": "I have finished watching",
      "adLimitReachedDesc": "If you have watched 3 times, you need to upgrade your plan to continue.",
      "activationTimelineNote": "Upon successful payment, your plan will be automatically activated within 1-3 minutes.",
      "amountToPay": "Amount to Pay:",
      "cannotDowngradeBtn": "Cannot Downgrade",
      "compAIModel": "AI Scans",
      "compAds": "Ads",
      "compAdvancedFeatures": "Advanced Features",
      "compBasic": "Basic",
      "compDuration": "Duration",
      "compEnterprise": "Enterprise / Professional",
      "compFeature": "Feature",
      "compFullAdvancedFeatures": "Full + Advanced",
      "compFullFeatures": "Full Features",
      "compHighestSupport": "Highest Priority",
      "compLimited": "Limited",
      "compNo": "No",
      "compPersonal": "Personal Use",
      "compPowerUser": "Power Users",
      "compPriority": "Priority",
      "compSomeFeatures": "Some Features",
      "compSpeed": "Processing Speed",
      "compSuitability": "Best Suited For",
      "compSupport": "Support",
      "compTrial": "Free",
      "compSuitabilityTrial": "Trial",
      "compUnlimited": "Unlimited",
      "compVip": "VIP",
      "compYes": "Yes",
      "comparisonTableTitle": "Compare subscription plans",
      "currentPlanBtn": "Current Plan",
      "currentPlanTitle": "Your Current Plan",
      "activeStatus": "Active",
      "highestPlanMsg": "You are using the highest plan",
      "highestPlanDesc": "Thank you for trusting and accompanying the smart PetAI system!",
      "paymentInstructions": "Scan the QR code or use your mobile banking app to pay.",
      "renewBtn": "Renew",
      "renewPlanBtn": "Renew Plan",
      "selectedPlanLabel": "Selected Plan",
      "transferViaVietQR": "Transfer via VietQR",
      "upgradeBillingHistoryBtn": "Billing History",
      "upgradeBtn": "Upgrade",
      "upgradeExperience": "Upgrade Experience",
      "upgradeExperienceDesc": "Unlock more AI scan limits, remove ads, and optimize dog breed identification speed.",
      "helpCardTitle": "Need more help?",
      "helpCardDesc": "Contact our support team via email or live chat.",
      "helpCardBtn": "Contact Support",
      "errorDefaultText": "An error occurred",
      "systemError": "A system error occurred",
      "msgPleaseLogin": "Please login to use this feature.",
      "msgAdLimitReached": "You have watched 3 ads. Please upgrade your plan to continue.",
      "msgAdUnlocked": "Unlocked 3 more scans. You can continue!",
      "msgAdError": "Failed to record ad view. Please try again.",
      "msgHigherPlanActive": "You have a higher plan active. Cannot purchase a lower plan.",
      "msgPlanStillHasScans": "Your current plan still has scans remaining. You can only renew when expired or out of scans.",
      "msgInvalidOrder": "Payment order is invalid or expired. Please try again.",
      "msgAutoConfirm": "The system uses auto-confirmation. Please wait for system to record transaction.",
      "msgFlowChanged": "Payment flow has changed. Please create an order on the upgrade page first.",
      "msgOrderNotFound": "Payment order does not exist or is invalid.",
      "msgPlanActivated": "Payment confirmed and your plan has been activated.",
      "msgPaymentPending": "Payment recorded. Your order is awaiting admin confirmation.",
      "msgCannotConfirm": "Cannot record (order may have been reported/confirmed).",
      "msgPaymentError": "Cannot record payment. Please try again.",
      "msgMissingOrderId": "Missing payment order code.",
      "msgOrderNotYours": "Payment order does not exist or does not belong to your account.",
      "msgNotPaid": "You have not paid yet.",
      "msgAutoConfirmDesc": "The system will auto-confirm when transaction is received. No manual action needed.",
      "msgLoginToPayHistory": "Please login to view payment history.",
      "msgUserOnlyPage": "This page is only for user accounts.",
      "msgSelectImageFirst": "Please select an image before analyzing.",
      "msgNoImageSelected": "No image selected. Please upload an image and try again.",
      "msgOutofQuota": "You have used all 10 free scans and 3 ad views. Please purchase a plan to continue.",
      "msgOutofFreeScans": "You have used all 10 free scans. Please watch an ad to unlock more scans.",
      "msgWatchAdToUnlock": "Please watch an ad to unlock more scans.",
      "msgAccountLocked": "Your account has been locked. Please contact the administrator.",
      "msgGoogleEmailFailed": "Failed to retrieve email from Google. Please try again.",
      "msgGoogleLoginFailed": "Google login failed. Please try again.",
      "adminConfirmationsTitle": "Approve Upgrade Orders - PetAI",
      "adminUsersTitle": "User Management - PetAI",
      "dashboardTitle": "Dashboard - PetAI",
      "historyPageTitle": "History - PetAI",
      "statisticsPageTitle": "Statistics - PetAI",
      "upgradePageTitle": "Upgrade Plan - PetAI",
      "paymentsPageTitle": "Payment History - PetAI",
      "settingsPageTitle": "Account Settings - PetAI",
      "predictPageTitle": "Dog Breed Identification - PetAI",
      "checkoutPageTitle": "Checkout - PetAI",
      "confirmedRevenue": "Confirmed Revenue",
      "totalRealRevenue": "Total Actual Revenue",
      "paidOrders": "Paid Orders",
      "approvedOrders": "Approved Orders",
      "latestPayment": "Latest Payment",
      "lastOrderTime": "Last Order Time",
      "needsAdminAction": "Needs Admin Action",
      "searchConfirmationsPlaceholder": "Search order code/username/email/fullname...",
      "allPlans": "All plans",
      "clearFilters": "Clear Filters",
      "recentPaidOrders": "Recent Paid Orders",
      "pendingApprovalsTitle": "Orders Awaiting Admin Approval",
      "userCol": "User",
      "confirmedAt": "Confirmed At",
      "createdAt": "Created At",
      "orderIdCol": "Order ID",
      "amountCol": "Amount",
      "noPaidOrders": "No paid orders yet.",
      "noPendingApprovals": "No orders awaiting confirmation.",
      "autoConfirmBtn": "Auto",
      "confirmActionTitle": "Confirm Action",
      "confirmActionText": "Are you sure you want to perform this action?",
      "cancelBtn": "Cancel",
      "confirmBtn": "Confirm",
      "paymentMethodCol": "Method",
      "userListTitle": "User List",
      "userListSubtitle": "Manage account status, service plans, and system access permissions.",
      "approveOrdersBtn": "Approve Orders",
      "totalUsersCard": "Total Users",
      "registeredAccountsLabel": "Registered accounts",
      "totalAdminsCard": "Total Admins",
      "systemAdmins": "System administrators",
      "activeLabel": "Active",
      "activeAccounts": "Active accounts",
      "lockedLabel": "Locked",
      "lockedAccounts": "Locked accounts",
      "searchUserPlaceholder": "Search username/email/fullname...",
      "allRoles": "All Roles",
      "allStatuses": "All Statuses",
      "statusActive": "Active",
      "statusLocked": "Locked",
      "userColHeader": "User",
      "roleColHeader": "Role",
      "statusColHeader": "Status",
      "createdAtColHeader": "Created",
      "planColHeader": "Plan",
      "actionColHeader": "Actions",
      "detailBtn": "Details",
      "noUserData": "No data available.",
      "savePlanLabel": "Save Package",
      "updatePlanLabel": "Update Plan",
      "prevPage": "Previous",
      "nextPage": "Next",
      "footerDescText": "AI-powered dog breed identification app for pet lovers. Fast and accurate results.",
      "openMenu": "Open Menu",
      "closeMenu": "Close menu",
      "showingText": "Showing",
      "ofText": "of",
      "usersText": "users",
      "lastLoginCol": "Last Login",
      "lockedUsersCard": "Locked Accounts",
      "activeUsersCard": "Active Users",
      "paidUsersCard": "Paid Users",
      "perPageSuffix": "per page",
      "actionLock": "Lock account",
      "actionUnlock": "Unlock account",
      "actionChangeRole": "Change role",
      "actionChangePlan": "Change plan",
      "actionSendEmail": "Send email",
      "actionDelete": "Delete account",
      "confirmDeleteUserTitle": "Delete Account",
      "confirmDeleteUserText": "Are you sure you want to delete the account of {username}? Type '{confirmWord}' to confirm deletion.",
      "confirmChangeRoleTitle": "Change User Role",
      "confirmChangeRoleText": "Are you sure you want to change the role of {username} to {role}?",
      "confirmLockUserTitle": "Lock Account",
      "confirmLockUserText": "Are you sure you want to lock the account of {username}?",
      "confirmUnlockUserTitle": "Unlock Account",
      "confirmUnlockUserText": "Are you sure you want to unlock the account of {username}?",
      "confirmAssignPlanText": "Assign package {plan} to {username}?",
      "deleteInputPlaceholder": "Type 'DELETE' or '{username}' to confirm",
      "toastLockSuccess": "Account {username} has been locked.",
      "toastUnlockSuccess": "Account {username} has been activated.",
      "toastDeleteSuccess": "Successfully deleted identification record.",
      "toastDeleteError": "Failed to delete identification record. Please try again.",
      "toastLockError": "Error locking account.",
      "toastUnlockError": "Error activating account.",
      "toastRoleSuccess": "Successfully updated role for {username}.",
      "toastRoleError": "Failed to change role.",
      "toastPlanSuccess": "Service plan has been updated.",
      "toastPlanError": "Failed to update plan.",
      "toastServerError": "Server connection error.",
      "toastDefaultError": "An error occurred.",
      "notificationInfoTitle": "Automatic Notifications",
      "notificationInfoText": "The system automatically sends detailed email notifications to the user when administrators lock/unlock accounts, update plans, or delete accounts to ensure transparency.",
      "manualUserCreationNotIntegrated": "Manual user creation function has not been integrated on the backend system yet.",
      "pendingConfirmOrdersText": "pending approval orders",
      "upgradeDescFree": "You are using the <strong class=\"text-slate-300 dark:text-slate-200\">FREE</strong> plan. Upgrade to increase scan limits and enjoy an ad-free experience.",
      "upgradeDescPaidPrefix": "Your account is on the",
      "upgradeDescPaidSuffix": " plan. You can upgrade or renew below.",
      "choosePlanPay": "Choose Plan & Pay",
      "planFreeTitle": "Free",
      "planFreeSub": "Default starter plan",
      "planFreePrice": "0 VND",
      "planFreePriceSub": "Free forever",
      "scanLimit10": "10 free AI scans",
      "watchAdsMore": "Watch ads to get more scans",
      "suitableTrial": "Suitable for trial",
      "freePlanActive": "FREE Plan is active",
      "cannotDowngrade": "Cannot downgrade",
      "planBasicTitle": "Basic",
      "planBasicSub": "For light usage",
      "planBasicPrice": "1,000 VND",
      "planBasicPriceSub": "/ 7 days usage",
      "scanLimit50": "50 AI scans",
      "noAds": "No ads",
      "suitableLight": "Suitable for light usage",
      "registerBtn": "Subscribe",
      "basicPlanActive": "Basic Plan is active",
      "usingHigherPlan": "Using a higher plan",
      "planProTitle": "Pro",
      "planProSub": "Optimal & most popular",
      "planProPrice": "5,000 VND",
      "planProPriceSub": "/ 30 days usage",
      "scanLimit200": "200 AI scans",
      "prioritySpeed": "Priority speed",
      "adFreeComfort": "Ad-free, usage without limits",
      "recommended": "Recommended",
      "proPlanActive": "Pro Plan is active",
      "planEntTitle": "Enterprise",
      "planEntSub": "Extremely high usage",
      "planEntPrice": "15,000 VND",
      "planEntPriceSub": "/ 90 days usage",
      "scanLimitUnlimit": "Unlimited AI scans",
      "vipBandwidth": "Optimized bandwidth & VIP",
      "prioritySupport": "Top priority support",
      "entPlanActive": "Enterprise plan active",
      "upgradeLabel": "Select Upgrade Package",
      "optPro": "Professional (Pro) — 5,000 VND / 30 days / 200 scans",
      "optBasic": "Basic (Basic) — 1,000 VND / 7 days / 50 scans",
      "optEnterprise": "Enterprise (Enterprise) — 15,000 VND / 90 days / Unlimited",
      "gatewayInfo": "Automated <strong>VietQR gateway</strong>. Scan the displayed QR code and transfer the exact amount with the exact memo to get approved automatically.",
      "planLabel": "Subscription plan:",
      "durationLabel": "Duration:",
      "scanLimitLabel": "Scan limit:",
      "totalPayLabel": "Total payment:",
      "backBtn": "Back",
      "usingHighestPlan": "Using the highest plan",
      "continuePayBtn": "Proceed to Payment",
      "confirmPaidBtn": "I have transferred / I have paid",
      "expiredOnLabel": "Expires on:",
      "remainingScansLabel": "scans remaining",
      "lifetimeScans": "lifetime",
      "quotaLimitLabel": "Quota limit",
      "scansCount": "Scans",
      "unlimitedUsage": "Unlimited usage",
      "accountActiveDesc": "Your account is in good standing",
      "transferMemoLabel": "Transfer Memo (Must match exactly)",
      "faqTitle": "Frequently Asked Questions",
      "faq1Q": "How long until my plan is activated after payment?",
      "faq1A": "The system automatically activates your package via the VietQR gateway within 1-3 minutes of receiving the transfer with the correct memo details.",
      "faq2Q": "Can I upgrade while using an active plan?",
      "faq2A": "Yes, you can upgrade to a higher plan at any time. The new plan's scans and duration will be applied immediately.",
      "faq3Q": "Is it possible to cancel or request a refund?",
      "faq3A": "Payment transactions for subscription packages are non-refundable. Please check all details carefully before initiating a transfer.",
      "faq4Q": "Does the plan automatically renew?",
      "faq4A": "No, the system does not auto-renew or deduct funds. You manually renew when needed.",
      "faq5Q": "Can I change packages after upgrading?",
      "faq5A": "You can upgrade to a higher package. Downgrading to a lower package is only permitted after the current package expires.",
      "paymentSecurityNote": "Payments are secure and processed via the VietQR system.",
      "policyLink": "Payment Policy",
      "termsLink": "Terms of Service",
      "creatingInvoice": "Creating invoice...",
      "planBasicName": "Basic",
      "planBasicDuration": "7 days",
      "planBasicLimit": "50 scans",
      "planProName": "Professional (Pro)",
      "planProDuration": "30 days",
      "planProLimit": "200 scans",
      "planEntName": "Enterprise",
      "planEntDuration": "90 days",
      "planEntLimit": "Unlimited",
      "checkoutDesc": "Scan the QR code to transfer, then confirm to activate your plan.",
      "orderIdLabel": "Order ID",
      "paymentMethodLabel": "Method",
      "paymentMethodQR": "QR Transfer",
      "paymentInstructionsTitle": "Bank Transfer Instructions",
      "instructionStep1": "Open the bank app on your phone.",
      "instructionStep2": "Use the Scan QR code feature for the fastest payment.",
      "instructionStep3": "Verify transfer amount and memo details before confirming.",
      "accountDetailsTitle": "Account Details",
      "bankLabel": "Bank",
      "accountNumberLabel": "Account Number",
      "accountNameLabel": "Account Holder",
      "memoLabel": "Memo",
      "paymentQrTitle": "Payment QR Code",
      "qrMissingLib": "Missing QR library. Install qrcode to display QR.",
      "checkingStatus": "Checking",
      "checkingStatusDesc": "System is automatically checking payment...",
      "autoActivationNote": "System will automatically activate 1-5 minutes after payment receipt. If it takes too long, please submit support.",
      "submitSupportLink": "Submit Support",
      "safeTransactionTitle": "Secure Transaction",
      "safeTransactionDesc": "Your payment info is encrypted and automatically processed by the AI system.",
      "invoiceModalTitle": "Payment Invoice",
      "invoiceSuccess": "Payment successful!",
      "invoiceThankYou": "Thank you for using PetAI services",
      "customerLabel": "Customer",
      "createdTimeLabel": "Created Time",
      "confirmedTimeLabel": "Confirmed Time",
      "printInvoiceBtn": "Print Invoice",
      "welcomeUser": "Welcome",
      "welcomeUserGuest": "Welcome, guest!",
      "thisMonth": "this month",
      "predictionsCountPrefix": "You have a total of",
      "predictionsCountSuffix": "prediction records.",
      "hybridRatioExpected": "Expected mixed ratio",
      "identificationTimeLabel": "Identification time:",
      "closeWindowBtn": "Close Window",
      "predResultTitle": "Dog Breed Identification Results",
      "predResultDesc": "AI system has completed image analysis with high accuracy.",
      "backToDashboard": "Back to dashboard",
      "analyzeAnotherImg": "Analyze another image",
      "mainObjectAnalysis": "Main Object Region Analysis",
      "analyzingText": "Analyzing",
      "mainObjectIdentify": "Main Object Identification",
      "bestPrediction": "Best Prediction",
      "hybridWarningText": "This is a morphological similarity-based hybrid suggestion, not a genetic conclusion.",
      "hybridRatioTitle": "Estimated Hybrid Ratio Analysis",
      "dominantGenExpected": "Expected dominant gene",
      "similarityText": "Similarity",
      "recessiveGenExpected": "Expected recessive gene",
      "visualProofTitle": "Dynamic Grad-CAM (Visual Proof)",
      "visualProofRefTitle": "Reference Grad-CAM (Visual Proof)",
      "visualProofDesc": "Heatmap based exactly on the image you just uploaded.",
      "visualProofRefDesc": "Heatmap based on reference breed.",
      "aiHighlightArea": "Highlighted region AI focused on",
      "modelLogicAnalysis": "Logic Analysis from Model",
      "decisionHybridText": "Confidence level sufficient for hybrid suggestion.",
      "decisionPureText": "Confidence level sufficient for breed conclusion.",
      "decisionRefText": "Reference confidence level, insufficient for breed conclusion.",
      "modelArchitecture": "Model architecture",
      "inferenceOptimization": "Inference optimization",
      "ordersCreated": "Created orders",
      "totalAmountPaid": "Total amount paid",
      "awaitingConfirm": "Awaiting confirmation",
      "planExpireLabel": "Expires",
      "freeLimitPlan": "Limited free plan",
      "recentOrders": "Recent Orders",
      "ordersCount": "orders",
      "planExpired": "Expired",
      "personalInfoTab": "Info",
      "appearanceTab": "Appearance",
      "privacyTab": "Privacy",
      "personalInfoTitle": "Personal Info",
      "saveChangesBtn": "Save Changes",
      "manageUserRole": "Manage and assign user roles for the account",
      "lockedStatus": "Locked",
      "sensitiveArea": "Sensitive Area",
      "sensitiveAreaDesc": "The operations below directly affect access permissions and data. Please proceed with caution.",
      "quotaSettings": "Subscription Plan & Usage Quota",
      "currentPlanLabel": "Current Plan",
      "unlockRemainingLabel": "Remaining unlocks",
      "planExpireDateLabel": "Plan expiration date",
      "freeUnlimited": "Unlimited (Free)",
      "changePlanLabel": "Change member plan",
      "assignPlanBtn": "Assign New Package",
      "registeredTimeLabel": "System registration time",
      "confirmDialogTitle": "Confirmation",
      "confirmDialogText": "Are you sure?",
      "confirmInputPlaceholder": "Enter email or username to confirm",
      "similarityTop3": "Morphological Similarity (Top 3)",
      "top3Probability": "Top 3 Softmax Probability",
      "welcomeFriend": "friend",
      "uploadAreaTitle": "Upload Area",
      "changeImageBtn": "Change Image",
      "freeScansLeft": "Free scans remaining",
      "unlockedFromAds": "Unlocked from ads",
      "adsWatched": "Ads watched",
      "watchAdBtn": "Watch ads for more scans",
      "yourPaidPlan": "Your paid plan",
      "unlimitedScans": "Unlimited scans",
      "loadingQuota": "Loading quota info...",
      "predictionExperience": "Prediction Experience",
      "featureIdentifyConfidence": "Identify dog breed with confidence percentage",
      "featureYoloBoundingBox": "Supports images with YOLO bounding boxes",
      "featureAutoSaveHistory": "Automatically save prediction history",
      "featureResponsiveLayout": "Optimized for Mobile/Tablet/Desktop",
      "noEmailUpdated": "No email updated",
      "enterWord": "Enter",
      "confirmInputPlaceholderSuffix": "or username to confirm",
      "checkingStatusWait": "Please do not close this page until the transaction is confirmed.",
      "ifTooLong": "If it takes too long, please",
      "welcomePrefix": "Hello",
      "visualAIInsights": "Visual AI Insights",
      "dataDeletionPageTitle": "Data Deletion - PetAI",
      "dataDeletionHeaderTitle": "Data Deletion",
      "dataDeletionSection1Title": "1. Right to Request Account and Data Deletion",
      "dataDeletionSection1Desc": "Users always have the right to request the deletion of their account as well as all personal data (name, email, images) accumulated during the usage of the system.",
      "dataDeletionSection2Title": "2. Instructions for In-App Account Deletion",
      "dataDeletionSection2Desc": "If the application has this feature updated, please go to <strong>Settings</strong> &gt; select <strong>Manage Account</strong> &gt; click <strong>Delete Account</strong> to automatically remove your information.",
      "dataDeletionSection3Title": "3. Submit Email Request",
      "dataDeletionSection3Desc": "In case the system does not support direct deletion yet, you can submit a deletion request via email. Please follow the instructions below:",
      "dataDeletionEmailLabel": "Request recipient email:",
      "dataDeletionSubjectLabel": "Email subject:",
      "dataDeletionSubjectValue": "Request for account/data deletion",
      "dataDeletionVerificationHint": "Please specify the email address you registered with for verification.",
      "dataDeletionSection4Title": "4. Processing Time",
      "dataDeletionSection4Desc": "All categories of your data, images, and account will be processed and permanently deleted within <strong>30 days</strong> of request submission.",
      "dataDeletionSection5Title": "5. Certain Data May Be Retained",
      "dataDeletionSection5Desc": "Certain data relating to payment reports, invoice transactions, or dispute details may be retained in compliance with applicable local legal regulations.",
      "dataDeletionSection6Title": "6. Contact Information",
      "dataDeletionSection6Desc": "For any difficulties, please contact:",
      "termsPageTitle": "Terms of Service | PetAI",
      "termsHeaderTitle": "Terms of Service",
      "termsSection1Title": "1. Conditions of Use for App/Website",
      "termsSection1Desc": "By accessing and using our service, you acknowledge that you have read, understood, and accepted all terms set forth in this document.",
      "termsSection2Title": "2. User Rights and Responsibilities",
      "termsSection2Desc": "Users commit to providing truthful information when creating an account and are solely responsible for maintaining the confidentiality of their login credentials.",
      "termsSection3Title": "3. Account Rules",
      "termsSection3Desc": "Using premium features may require logging in. Each personal account is authorized for one individual only; buying, selling, or transferring accounts is strictly prohibited.",
      "termsSection4Title": "4. Prohibited Content and Conduct",
      "termsSection4Desc": "You are not permitted to: (a) use the application for any unlawful purposes; (b) exploit or abuse our API system; (c) interfere with, copy, or reverse-engineer the software or the AI models we provide.",
      "termsSection5Title": "5. Limitation of Liability",
      "termsSection5Desc": "AI-based analyses and predictions are for reference only and may contain errors. We assume no liability for any indirect consequences resulting from recommendations or software results.",
      "termsSection6Title": "6. Account Termination upon Violation",
      "termsSection6Desc": "We reserve the right to unilaterally lock or permanently delete accounts and associated data if a user is found to have seriously violated any stated conditions.",
      "termsSection7Title": "7. Contact Information",
      "termsSection7Desc": "For any questions or suggestions, please send to:",
      "supportPageTitle": "Support | PetAI",
      "supportHeaderTitle": "Support",
      "supportSubtitle": "We are always ready to listen to your feedback.",
      "supportQuickInfoTitle": "Quick Info",
      "supportEmailLabel": "Support Email:",
      "supportResponseTimeLabel": "Expected Response Time:",
      "supportResponseTimeValue": "Within 1–3 business days",
      "supportBasicGuideTitle": "Basic Usage Guide",
      "supportStep1": "1. On the main page, select <strong>Login</strong> or create a new account.",
      "supportStep2": "2. Go to the Identify page, grant camera permissions, or upload an image.",
      "supportStep3": "3. Wait 2 - 4 seconds, and the AI will return the top 3 potential breeds along with statistical history.",
      "supportFaqTitle": "Frequently Asked Questions (FAQ)",
      "supportFaq1Q": "How do I login?",
      "supportFaq1A": "Click the Login button at the top right of the website or via the mobile menu to use Email/Google.",
      "supportFaq2Q": "How do I delete my account?",
      "supportFaq2A": "Submit a request according to our <strong>Data Deletion Policy</strong> for assistance.",
      "supportFaq3Q": "How do I contact support?",
      "supportFaq3A": "You can use the form under the <strong>Contact</strong> section or email support@pet.ai.",
      "supportFaq4Q": "What should I do if I encounter an error?",
      "supportFaq4A": "We apologize for the inconvenience. Please take a screenshot of the error, describe the actions leading up to it, and email it to us as soon as possible!",
      "revenue": "Revenue",
      "usersCountSuffix": "users",
      "noSubscriptionData": "No subscription plan data available.",
      "pleaseSelectDates": "Please select both start and end dates!",
      "startDateAfterEndDate": "Start date cannot be after end date!",
      "customRange": "Custom",
      "customRangeSubtitle": "From {start} to {end}",
      "revenueTrendSubtitleDefault": "Total amount from paid orders (VND)",
      "revenueTrendSubtitle7": "Total amount from paid orders (last 7 days)",
      "revenueTrendSubtitle30": "Total amount from paid orders (last 30 days)",
      "revenueTrendSubtitle90": "Total amount from paid orders (last 90 days)",
      "revenueTrendSubtitle12": "Total amount from paid orders (last 12 months)",
      "predTrendSubtitleDefault": "Number of images identified per day",
      "predTrendTitle7": "Prediction trend (last 7 days)",
      "predTrendTitle30": "Prediction trend (last 30 days)",
      "predTrendTitle90": "Prediction trend (last 90 days)",
      "predTrendTitle12": "Prediction trend (last 12 months)",
      "predTrendTitleCustom": "Custom prediction trend",
      "predTrendSubtitleMonth": "Number of images identified per month",
      "revenueThisMonthTooltip": "Revenue recorded in this month",
      "newUsersThisWeekTooltip": "Number of new accounts registered in the last 7 days",
      "newOrdersTodayTooltip": "New orders created today",
      "predictionsTodayTooltip": "Number of predictions performed today",
      "upgradeAccount": "Upgrade account",
      "orderInfo": "Order Information",
      "servicePlan": "Service Plan",
      "missingQrLibPrefix": "Missing QR library. Please install",
      "missingQrLibSuffix": "to display the QR code.",
      "autoActivationDesc": "The system will automatically activate the package 1-5 minutes after payment is received.",
      "printInvoice": "Print Invoice",
      "adminConfirmationsPageTitle": "Approve Orders - PetAI",
      "approveBankTransfers": "Approve Bank Transfers",
      "approveBankTransfersDesc": "Manage bank transfer payment orders and confirm service plan upgrades.",
      "exportConfirmationsTitle": "Export Transaction List",
      "exportConfirmationsScope": "Export Scope",
      "exportConfirmationsScopeAll": "All transactions",
      "exportConfirmationsScopeFiltered": "Filtered transactions",
      "exportConfirmationsFormat": "Export Format",
      "exportConfirmationsBtnDownload": "Download",
      "toastExportConfirmationsStart": "Preparing report export file...",
      "manageUsersTitle": "User Management",
      "reportedTransferStatus": "Reported Transfer",
      "confirmAction": "Confirm Action",
      "contactPageTitle": "Contact | PetAI",
      "contactInfoTitle": "Contact Information",
      "legalInfoTitle": "Legal Information",
      "companyNameLabel": "COMPANY NAME",
      "taxIdLabel": "TAX CODE",
      "representativeLabel": "REPRESENTATIVE",
      "licenseDateLabel": "LICENSE DATE",
      "headquartersLabel": "HEADQUARTERS",
      "hotlineLabel": "HOTLINE",
      "appNameLabel": "App/website name:",
      "appNamePlaceholder": "PetAI",
      "devNameLabel": "Developer/company name:",
      "devNamePlaceholder": "TIEN PHONG TECHNOLOGY ENGINEERING ONE MEMBER COMPANY LIMITED",
      "contactEmailLabel": "Contact Email",
      "addressLabel": "Address:",
      "addressPlaceholder": "P16, Street 8, Lot 49 residential area, Nam Can Tho Urban Area, Cai Rang District, Can Tho City, Vietnam",
      "processingTimeNote": "Note on processing time:",
      "responseTimeDesc": "Usually within 1-3 business days. Thank you for your support!",
      "sendMessageOnline": "Send Message Online",
      "submitForm": "Submit Form",
      "yourNamePlaceholder": "Your name...",
      "emailAddressPlaceholder": "Email address...",
      "supportQuestionPlaceholder": "How can we help you?",
      "additionalNotesPlaceholder": "Additional details...",
      "uploadNewPhoto": "Upload new photo",
      "revenueThisMonthSuffix": "this month",
      "newUsersThisWeekSuffix": "new this week",
      "newOrdersTodaySuffix": "today",
      "predictionsTodaySuffix": "today",
      "dataDeletionPolicyPageTitle": "Data Deletion Policy | PetAI",
      "settingsLabel": "Settings",
      "arrowSelect": "> Select",
      "accountManagement": "Account Management",
      "arrowClick": "> Click",
      "deleteAccount": "Delete Account",
      "autoDeleteInfoDesc": "to have the system automatically remove your information.",
      "deleteDataRequestSubject": "Data/account deletion request",
      "fromRequestTime": "from the time of the request.",
      "retainedDataDesc": "Some data related to payment reports, invoice transactions, or dispute details may continue to be retained depending on applicable legal regulations.",
      "petaiErrorTitle": "PetAI - Error {{ code }}",
      "errorCodeTitle": "Error {{ code }}",
      "forgotPasswordPageTitle": "Forgot Password - PetAI",
      "newScan": "New Scan",
      "viewDetails": "View Details",
      "speciesDog": "Dog",
      "historyPaginationAria": "History Pagination",
      "identifyNav": "IDENTIFICATION",
      "dogBreedsNav": "DOG BREEDS",
      "howItWorks": "How it works",
      "resultDemoSh": "RESULT_DEMO.SH",
      "inputLabel": "Input:",
      "analyzingImageDemo": "\"Analyzing breed features from image_01.jpg...\"",
      "analysisResultsDemo": "Analysis results...",
      "shibaDemoResult": "[1] Shiba Inu: 82% confidence.",
      "akitaDemoResult": "[2] Akita: 11% confidence.",
      "basenjiDemoResult": "[3] Basenji: 7% confidence.",
      "priceFree": "0đ",
      "foreverSuffix": "/ forever",
      "freeScans10": "10 scans",
      "max3Ads": "Max 3 ad views",
      "days7Suffix": "/ 7 days",
      "scans50": "50 scans",
      "days30Suffix": "/ 30 days",
      "scans200": "200 scans",
      "days90Suffix": "/ 90 days",
      "loginPageTitle": "Login - PetAI",
      "paymentsUserDesc": "Orders you have created and their current processing status.",
      "upgradePlanTitle": "Upgrade Package",
      "totalOrdersCard": "Total Orders",
      "pendingOrdersCard": "Pending Orders",
      "paidStatus": "Paid",
      "cancelledStatus": "Cancelled",
      "expiredStatus": "Expired",
      "pendingStatus": "Initiated",
      "invoiceBtn": "Invoice",
      "continuePay": "Continue to pay",
      "noPaymentsMessage": "You have not made any package upgrade transactions on PetAI.",
      "upgradeNowBtn": "Upgrade Now",
      "orderPaginationAria": "Order Pagination",
      "predictResultPageTitle": "Prediction Result | PetAI",
      "mainObjectDetection": "Main Object Detection",
      "hybridRatioAnalysis": "Hybrid Ratio Analysis",
      "similarityPrefix": "Similarity: ",
      "privacyPolicyPageTitle": "Privacy Policy | PetAI",
      "updateDatePrefix": "Last updated: 16/06/2026",
      "privacySection1Title": "1. Developer/company information",
      "devIntroText": "The service is developed and designed by",
      "companyNamePlaceholder": "TIEN PHONG TECHNOLOGY ENGINEERING ONE MEMBER COMPANY LIMITED",
      "devIntroTextSuffix": ". We are committed to protecting your personal information and privacy as securely as possible.",
      "privacySection2Title": "2. What data is collected",
      "privacySection2Desc": "We may collect data including: account name, email, password (securely encrypted), dog images you upload to the identification system, and your usage interactions.",
      "privacySection3Title": "3. Purpose of using data",
      "privacySection3Desc": "Data is used to provide access, verify security, optimize AI models over time, and provide necessary technical support.",
      "privacySection4Title": "4. Sharing data with third parties",
      "privacySection4Desc": "Absolutely not, except for necessary core infrastructure (Firebase, Google Analytics) or strict legal requests from authorized government agencies.",
      "privacySection5Title": "5. Cookies, Firebase, Analytics",
      "privacySection5Desc": "The application may use Cookies, Google Analytics for measurement, and Crashlytics for error collection to help improve our quality.",
      "privacySection6Title": "6. User rights",
      "privacySection6Desc": "You always have control over your personal content, with the right to view, edit, extract, or stop processing data at any time.",
      "privacySection7Title": "7. Requesting data deletion",
      "privacySection7Desc": "You can manually go to Settings -> Delete Account, or see detailed instructions at",
      "privacySection8Title": "8. Contact information",
      "addressLabelPlaceholder": "Address: P16, Street 8, Lot 49 residential area, Nam Can Tho Urban Area, Cai Rang District, Can Tho City, Vietnam",
      "registerPageTitle": "Create Account - PetAI",
      "planPrefix": "PACKAGE",
      "infoTab": "Information",
      "fromLabel": "From",
      "businessDaysCount": "1-3 business days",
      "orCreateAccount": "or create a new account.",
      "sendMailUnder": "Send email according to",
      "ourHelpSupport": "of ours for assistance.",
      "useFormBelow": "You can use the form below the section",
      "orSendSupportEmail": "or send an email to support@pet.ai.",
      "planFreeLabel": "FREE (FREE)",
      "upgradePromptPrefix": ". Upgrade to increase scans and enjoy an ad-free experience. {% else %} Your account is currently using package",
      "upgradePromptSuffix": ". You can upgrade or renew below. {% endif %}",
      "scansUnit": "scans",
      "enterprisePlanActive": "Enterprise Plan is active",
      "autoVietQR": "Automatic VietQR",
      "vietQrInstructions": ". Simply scan the QR code and transfer the exact amount with the matching memo for automatic system approval.",
      "freePlanBenefits": "Free Plan Benefits",
      "basicPlanBenefits": "Basic Plan Benefits",
      "proPlanBenefits": "Pro Plan Benefits",
      "enterprisePlanBenefits": "Enterprise Plan Benefits",
      "uploadPageTitle": "Upload & Analyze - PetAI",
      "uploadHeaderTitle": "Upload Photo to Identify Dog Breed",
      "dailyPetTipTitle": "Pet Knowledge & Tips",
      "uploadHeaderDesc": "Drag and drop your dog's photo for AI analysis and detailed breed prediction.",
      "clickToSelectPhoto": "or click to select photo from computer",
      "supportedFormatsDesc": "Supports JPG, JPEG, PNG • Max 10MB",
      "analyzeNowBtn": "Analyze Now",
      "quotaPlanPrefix": "Plan: ",
      "watchAdToUnlock": "Watch ad to get more scans",
      "adminUsersPageTitle": "Admin User Management - PetAI",
      "adminUsersDesc": "Manage account status, service packages, and system access rights.",
      "showingUsers": "Showing {{ start_index }} - {{ end_index }} of {{ total_users }} users",
      "assignPlanHeader": "Assign Package",
      "adminUserDetailPageTitle": "Admin User #{{ user.id }} - PetAI",
      "sensitiveAreaTitle": "Sensitive Area",
      "quotaSettingsTitle": "Service Package & Quota Settings",
      "remainingSuffix": "remaining",
      "userIdLabel": "User ID",
      "orUsernameToConfirm": "or username to confirm",
      "deleteOrUsernamePlaceholder": "DELETE or username",
      "backToList": "Back to list",
      "selectPlanToAssign": "Select package to assign",
      "adLimitReachedPrompt": "You have used all 10 free scans. Watch a short advertisement to receive",
      "threeScans": "3 scans",
      "adLimitLimitPrompt": "for AI identification. (Max 3 times).",
      "invoiceSuccessDesc": "Payment successful!<br>Your invoice is displayed below.",
      "confirmPaymentText": "Confirm receipt of payment for order {orderId} ({user} - {plan})?",
      "confirmLockUser": "Lock account {username}?",
      "confirmUnlockUser": "Unlock account {username}?",
      "actionFailed": "Action failed.",
      "deleteFailed": "Deletion failed.",
      "invalidConfirmation": "Invalid confirmation.",
      "confirming": "Confirming...",
      "avatarAlt": "Avatar",
      "chuyenKhoanShort": "Transfer",
      "contactShort": "Contact",
      "onlySupportJpgPng": "Only JPG, JPEG or PNG images are supported.",
      "waitingPaymentDesc": "Awaiting payment...<br>The system will automatically recheck in a few seconds.",
      "mixLai": "Mix:",
      "predictedBreed": "Predicted Breed",
      "referenceBreed": "Reference Breed",
      "msgSendSuccessDemo": "You have submitted successfully! (Demo Data)",
      "reasonPurebredDominant": "Purebred/dominant candidate.",
      "reasonPurebredMorphology": "Purebred/dominant candidate based on morphological similarity.",
      "reasonHybridCandidate": "Crossbreed/hybrid candidate.",
      "reasonHybridClose": "Crossbreed/hybrid candidate (Top-1 and Top-2 are very close).",
      "reasonBreedShownTop1": "Breed displayed based on Top-1 prediction.",
      "reasonNoDetail": "No detailed explanation available for this prediction.",
      "top3NoteSoftmax": "Top 3 by softmax probability.",
      "top3NoteSimilarity": "Top 3 by morphological similarity.",
      "notConfigured": "Not configured",
      "userGuidePageTitle": "User Guide - PetAI",
      "userGuideHeaderTitle": "PetAI User Guide",
      "userGuideSubtitle": "Explore detailed steps and useful tips to accurately identify dog breeds using our AI.",
      "guideStepsTitle": "Table of Contents",
      "guideStep1Title": "Step 1: Login/Register",
      "guideStep1Desc": "Log into your account to save scan history and manage limits.",
      "guideStep2Title": "Step 2: Upload photo",
      "guideStep2Desc": "Drag & drop or select a JPG, JPEG, PNG photo of your pet to upload.",
      "guideStep3Title": "Step 3: AI Analysis",
      "guideStep3Desc": "PetAI's deep learning system will analyze facial features and process it in 2-4 seconds.",
      "guideStep4Title": "Step 4: View detailed results",
      "guideStep4Desc": "Displays Top 3 breeds with confidence scores and interactive Grad-CAM heatmaps.",
      "guideTipsTitle": "Photo Tips for Best Accuracy",
      "guideTip1": "Take close-up, clear photos of the dog's face.",
      "guideTip2": "Ensure good lighting conditions; avoid backlighting or overly dark settings.",
      "guideTip3": "Avoid photos with multiple dogs or cluttered backgrounds.",
      "guideTip4": "A straight-on shot of the dog's face always yields optimal AI results.",
      "guideIntroTitle": "1. Introduction to PetAI",
      "guideIntroDesc": "PetAI is a leading smart dog breed identification platform. By integrating the YOLOv8 deep learning computer vision model with advanced morphological feature analysis, PetAI is capable of identifying over 120 common dog breeds worldwide. The system not only predicts the breed name but also provides specific model confidence, a Grad-CAM heatmap visualization of identification features, and a detailed encyclopedia for each breed.",
      "guideRegisterTitle": "2. User Registration Guide",
      "guideRegisterDesc": "To save your scanning history and manage scan quotas flexibly, you should own a personal account. The steps are as follows:",
      "guideRegisterStep1": "Access the Register page from the top-right menu or navigate directly to the /register route.",
      "guideRegisterStep2": "Fill in the form: Full name, unique Username, correct Email address (to receive payment invoices), and a secure Password.",
      "guideRegisterStep3": "Check the box to agree to the Terms of Service and click 'Register Account' to activate your account.",
      "guideLoginTitle": "3. Accessing the System",
      "guideLoginDesc": "The system supports two secure login methods to protect your personal information:",
      "guideLoginMethod1": "Traditional Sign In: Enter your registered Email (or Username) and Password in the form on the Sign In page.",
      "guideLoginMethod2": "Quick Sign In via Google: Click the 'Sign in with Google' button to link and log in instantly via Google's secure authorization gateway.",
      "guideFreePlanTitle": "4. Free Plan Policy",
      "guideFreePlanDesc": "PetAI welcomes all new users with a flexible Free plan policy:",
      "guideFreePlanLimit": "Initial Limit: Receive 10 free dog breed scans permanently immediately after successful account activation.",
      "guideFreePlanAds": "Ad Rewards: When default credits run out, you can watch a short ad (up to 3 times/day) to get 3 additional scans per completed view.",
      "guideFreePlanOut": "Out of credits: After exhausting both free and ad-rewarded credits, you will need to upgrade to a premium package to continue.",
      "guideIdentifyTitle": "5. Dog Breed Scanning Process",
      "guideIdentifyDesc": "To ensure the AI system analyzes and yields the most accurate breed predictions for your dog, please follow these steps:",
      "guideIdentifyStep1": "Upload your dog's image by dragging and dropping it into the upload box or clicking to select the file from your computer or phone.",
      "guideIdentifyStep2": "Ensure the image is in JPG, JPEG, or PNG format and the file size is under 10MB.",
      "guideIdentifyStep3": "Click the 'Analyze Now' button. The AI system will automatically run YOLOv8 to locate and bound the dog, then pass it to the breed classifier.",
      "guideIdentifyStep4": "Wait for 2-3 seconds for the AI system to process. The interface will automatically redirect to the detailed results page.",
      "guideResultTitle": "6. Explaining Result Information",
      "guideResultDesc": "The results page provides comprehensive multidimensional analysis, including:",
      "guideResultItem1": "Predicted Breed: The breed identified with the highest morphological similarity score.",
      "guideResultItem2": "Confidence: A percentage representing the certainty level of the AI model regarding the prediction.",
      "guideResultItem3": "Encyclopedia: Provides detailed information about origin, temperament, weight, height, and pet care tips.",
      "guideResultItem4": "Grad-CAM Heatmap: Visualizes the regions (such as ears, snout, eye shape) that the AI model focused on most to classify the breed.",
      "guideModesTitle": "7. Purebred & Mixed Analysis Modes",
      "guideModesDesc": "The system automatically classifies your pet based on external morphological feature correlation scores:",
      "guideModesPure": "Purebred Recognition: Displayed when model confidence is high (typically 80%+), concluding high consistency with the standard breed.",
      "guideModesHybrid": "Mixed Breed Analysis: If your dog has mixed features or Top-1 and Top-2 probabilities are close, the system plots estimated mixed percentages between the top breeds.",
      "guideUpgradeTitle": "8. Upgrading Your Service Plan",
      "guideUpgradeDesc": "To unlock unlimited scans and remove ads completely, please follow these steps:",
      "guideUpgradeWhen": "When to upgrade: When you run out of free scans or want to experience high-priority processing speeds.",
      "guideUpgradeChoose": "Choose package: Go to 'Upgrade Plan', choose one of three plans: Basic (50 scans/7 days/1kđ), Pro (200 scans/30 days/5kđ), or Enterprise (Unlimited scans/90 days/15kđ).",
      "guideUpgradePay": "Dynamic VietQR Payment: Scan the QR code displayed on screen with your banking app. The amount and memo (containing invoice code) are pre-filled for absolute accuracy.",
      "guideUpgradeProcess": "Auto Activation: The SePay auto-gateway detects account changes and activates your plan in seconds, with no manual review needed.",
      "guideHistoryTitle": "9. Viewing Scan History",
      "guideHistoryDesc": "All dog breed recognition results will be stored securely in your personal account:",
      "guideHistoryList": "Access the 'History' tab on the menu to review all uploaded dog photos and their analysis results.",
      "guideHistoryAction": "Manage Data: You can filter history by breed, re-view deep analysis details, or delete old entries permanently.",
      "guideStatsTitle": "10. Viewing Personal Analytics",
      "guideStatsDesc": "The system automatically statistics and visualizes your usage habits:",
      "guideStatsOverview": "Data Overview: Provides total scans, average model confidence, and the number of unique breeds discovered.",
      "guideStatsCharts": "Visualization: Plots scan trends over time, a pie chart of your top 5 breeds, and confidence distribution charts.",
      "guideFaqTitle": "11. Frequently Asked Questions (FAQ)",
      "guideFaqQ1": "How accurate is the AI model?",
      "guideFaqA1": "The deep learning model classifies breeds based on morphological features from a large dataset. The results are highly reliable but cannot replace professional genetic (DNA) testing.",
      "guideFaqQ2": "How can I improve scan accuracy?",
      "guideFaqA2": "Capture the photo close-up, sharp, facing the dog's head under natural light. Avoid blurry, shaky images or photos with multiple animals/clutter in the frame.",
      "guideFaqQ3": "How do free scan credits work?",
      "guideFaqA3": "New sign-ups get 10 free credits permanently. Once exhausted, you can click 'Watch Ad' to receive +3 credits per view (up to 3 times/day).",
      "guideFaqQ4": "I transferred money but the plan is not active yet?",
      "guideFaqA4": "The automated SePay gateway typically processes transactions within 10 seconds to 1 minute. If it takes longer than 5 minutes, please click 'I transferred money' or contact support.",
      "guideFaqQ5": "Is my photo data secure?",
      "guideFaqA5": "All uploaded dog images are encrypted, stored securely on our servers, and only visible in your personal account. You can clear your history at any time.",
      "guideContactTitle": "12. Support Contact Info",
      "guideContactDesc": "Our technical support team is available 24/7 to resolve any issues or questions via:",
      "guideContactEmail": "Customer support email: support@pet.ai (24/7 Processing)",
      "guideContactPhone": "Emergency support hotline: 0916 416 409",
      "guideContactAddress": "Office address: P16, Street 8, Nam Can Tho Urban Area, Cai Rang Dist, Can Tho City",
      "currencySuffix": " VND",
      "msgEmailSentReset": "If the email exists, we have sent instructions to reset your password.",
      "msgEnterEmail": "Please enter your email",
      "msgStatsLoadFailed": "Could not load statistics. Please try again.",
      "msgLoginViewStats": "Please log in to view statistics.",
      "msgGoogleOauthNotConfigured": "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
      "msgGoogleOauthMissing": "Google OAuth is not configured.",
      "msgGoogleLoginExpired": "Invalid or expired Google login session. Please try again.",
      "msgDashboardLoadFailed": "Could not load dashboard. Please try again.",
      "msgLoginInvalid": "Invalid login session. Please log in again.",
      "msgLoginViewDashboard": "Please log in to access the dashboard.",
      "msgHistoryLoadFailed": "Could not load history. Please try again.",
      "msgLoginViewHistory": "Please log in to view history.",
      "msgDbError": "Database connection error. Please try again.",
      "msgIncorrectPassword": "Incorrect password.",
      "msgPasswordLength": "Password must be at least 6 characters.",
      "msgUserNotFound": "Account does not exist.",
      "msgUsernameLength": "Username/Email must be at least 3 characters.",
      "msgEnterPassword": "Please enter password.",
      "msgEnterUsernameOrEmail": "Please enter username or email.",
      "msgLoggedOut": "You have logged out.",
      "msgCsrfInvalid": "Invalid session operation (CSRF). Please try again.",
      "msgInvalidEmail": "Invalid email.",
      "msgEmailInUse": "Email already in use. Please use a different email.",
      "msgFullnameLength": "Full name must be at least 2 characters.",
      "msgCreateAccountError": "Could not create account. Please try again.",
      "msgConfirmPasswordMismatch": "Confirm password does not match.",
      "msgUsernameFormat": "Username must be 3-20 characters, containing only letters, numbers, and underscores.",
      "msgUsernameInUse": "Username already exists. Please choose a different one.",
      "msgEnterAllFields": "Please enter all information.",
      "msgSettingsSaved": "Settings saved successfully!",
      "msgFullnameRange": "Full name must be between 2 and 128 characters.",
      "msgSettingsSaveError": "Could not save settings. Please try again.",
      "msgSettingsLoadError": "Could not load settings. Please try again.",
      "msgHistoryClearError": "Could not clear history. Please try again.",
      "msgLoginRequiredAction": "Please log in to perform this action.",
      "msgLoginRequiredSettings": "Please log in to access settings.",
      "msgQuotaExceededCurrent": "You have run out of uses for your current package. Please renew to continue.",
      "msgQuotaExceeded": "You have run out of scans. Please renew to continue.",
      "msgPlanExpired": "Your package has expired. Please renew to continue.",
      "msgFileNotSupported": "File format not supported. Only JPG, JPEG, PNG are accepted.",
      "msgAssignPlanError": "Could not assign package to user. Please try again.",
      "msgDbInitError": "Could not initialize database. Please try again.",
      "msgUserDetailLoadError": "Could not load user details.",
      "msgUserListLoadError": "Could not load user list.",
      "msgOrderConfirmError": "Could not confirm order (it might have already been confirmed or doesn't exist).",
      "msgConfirmOrderFailed": "Error confirming order.",
      "msgMissingOrderIdParam": "Missing order ID.",
      "msgInvalidUserId": "Invalid User ID.",
      "msgLoginRequiredGeneric": "Please log in to access this feature.",
      "msgDbInitSuccess": "Database tables initialized successfully.",
      "msgSessionInvalidShort": "Invalid login session.",
      "msgAccountLockedRelogin": "Account is locked. Please login again.",
      "msgPaymentRecordFailed": "Failed to record payment transfer. Please try again.",
      "msgUploadSaveFailed": "Failed to save uploaded photo. Please try another image.",
      "warning": "Warning",
      "info": "Info",
      "changePasswordTitle": "Change Password",
      "currentPasswordLabel": "Current Password",
      "currentPasswordPlaceholder": "Enter current password",
      "newPasswordLabel": "New Password",
      "newPasswordPlaceholder": "Enter new password (min 6 characters)",
      "confirmNewPasswordLabel": "Confirm New Password",
      "confirmNewPasswordPlaceholder": "Confirm new password",
      "notificationsSection": "Notification Settings",
      "systemNotificationsLabel": "System Notifications",
      "systemNotificationsDesc": "Receive instant notifications on the UI when there is new activity.",
      "emailNotificationsLabel": "Email Notifications",
      "emailNotificationsDesc": "Receive periodic reports and account updates via email.",
      "subscriptionUpgradeBtn": "Upgrade Plan",
      "downloadAvatar": "Download",
      "sponsorFood": "PetFood Ultimate: Superior nutrition",
      "sponsorToy": "PetToys Co.: Active toys for dogs",
      "sponsorSpa": "PetSpa Premium: Luxury relaxation",
      "adLive": "LIVE",
      "adPlayingSponsor": "Sponsored Advertisement",
      "adWarningDescShort": "Credits will be added after countdown ends.",
      "adCountdownLabel": "Secs left",
      "gradcamModalDescText": "The Grad-CAM heatmap visualizes the key regions on the pet's body that the AI model focused on most to make the breed prediction decision.",
      "aiArchitecture": "AI Architecture",
      "heatmapResolution": "Map resolution",
      "downloadGradcam": "Download Grad-CAM image",
      "dangerZoneTitle": "Danger Zone",
      "dangerZoneDesc": "Actions cannot be undone if time limit is exceeded",
      "deleteAccountTitle": "Request Account Deletion",
      "deleteAccountDesc": "Your account will not be deleted immediately but will be placed in a <b>pending deletion state for 30 days</b>. During this time, you can log in again to restore it.",
      "deleteModalConfirmTitle": "Confirm Account Deletion Request",
      "deleteModalConfirmDesc": "Your account will be placed in a <b>30-day pending deletion state</b>.<br>During this period, you can still log in and restore it.",
      "deleteModalWarning1": "⚠️ <b>After 30 days</b>, all data, history, and access will be <b>permanently disabled</b>.",
      "deleteModalWarning2": "⚠️ This process <b>requires verification via email</b> (OTP).",
      "deleteReasonLabel": "Reason for deletion (optional)",
      "deleteReasonPlaceholder": "E.g., I no longer use the service...",
      "sendOtpBtn": "Send Verification Code",
      "deleteModalOtpTitle": "Enter Verification OTP",
      "deleteModalOtpDesc": "A code has been sent to",
      "deleteModalOtpCountdown": "Code is valid for",
      "deleteConfirmBtn": "Confirm Account Deletion",
      "deleteResendBtn": "Resend OTP Code",
      "deleteSuccessTitle": "Request Recorded Successfully",
      "deleteSuccessDesc": "Your account has been placed in a <b>pending deletion state</b>.<br>Check your email for more details.",
      "sendingStatus": "Sending...",
      "confirmingStatus": "Confirming...",
      "otpSentSuccess": "New OTP code has been sent.",
      "deletePendingPageTitle": "Account Pending Deletion - PetAI",
      "deletePendingHeaderTitle": "Account Pending Deletion",
      "deletePendingHeaderDesc": "Account deletion request has been recorded",
      "deletePendingUserLabel": "Account:",
      "deletePendingDateLabel": "Your account will be permanently deleted on",
      "daysLabel": "days",
      "hoursLabel": "hours",
      "minsLabel": "minutes",
      "deletePendingWarningTitle": "You can still log in but all features will be temporarily locked.",
      "deletePendingWarningDesc": "If you <b>do not want to delete your account</b>, please click the restore button below.",
      "deletePendingWarningPermanently": "After 30 days, all data will be permanently disabled.",
      "restoreAccountBtn": "Restore Account",
      "logoutBtn": "Logout",
      "needSupportPrefix": "Need support? Contact",
      "restoreConfirmTitle": "Confirm Restoration",
      "restoreConfirmDesc": "OTP code has been sent to",
      "otpCountdownLabel": "Code is valid for",
      "restoreConfirmBtn": "Confirm Restoration",
      "resendOtpBtn": "Resend OTP Code",
      "sendingOtp": "Sending OTP...",
      "identifyCompleted": "Identification completed!",
      "top1Conclusion": "Top-1 (conclusion)",
      "days7Ago": "Last 7 days",
      "days30Ago": "Last 30 days",
      "timesLabel": "{{ code }} times",
      "sysLogoUploadDrag": "Drag & drop logo here or click to select",
      "sysLogoUploadHelp": "PNG, JPG, JPEG, SVG or WEBP (Max 2MB)",
      "sysPlanBasicDesc": "For individual trial use",
      "scansLabel": "scans",
      "sysRecommended": "Recommended",
      "sysPlanProDesc": "Most popular selection",
      "sysPlanEntDesc": "Unlimited use for organizations",
      "sysTotalPages": "Total pages",
      "sysStatus": "Status",
      "sysOnline": "Online",
      "sysHistory": "History",
      "sysAutoSave": "Auto save",
      "sysPermission": "Permission",
      "sysFilterPolicy": "Policies",
      "sysFilterSupport": "Support & Guides",
      "planBasicLimitDesc": "<strong>50 scans</strong>",
      "planProLimitDesc": "<strong>200 scans</strong>",
      "planEntLimitDesc": "<strong>Unlimited scans</strong>",
      "adUnlockPrompt": "You have used all 10 free scans. Watch a short video ad to receive",
      "otpVerifyPageTitle": "OTP Verification - PetAI",
      "forgotPasswordHeader": "Recover Password",
      "forgotOtpDesc": "If the information you entered is correct, a 6-digit OTP code has been sent to the recovery email of the account.",
      "otpCodeLabel": "OTP Verification Code",
      "otpExpiryLabel": "OTP code will expire in:",
      "confirmOtpBtn": "Confirm OTP",
      "orLabel": "or",
      "reenterEmailLink": "Re-enter email",
      "resendOtpLink": "Resend OTP",
      "emailVerifyHeader": "Email Verification",
      "registerOtpDesc": "We have sent a 6-digit OTP verification code to your Gmail:",
      "confirmAccountBtn": "Confirm Account",
      "reregisterLink": "Re-register",
      "userPlanLabel": "Plan {{ code }}",
      "otpInvalidError": "Please enter a valid 6-digit OTP code.",
      "sysPagesUnit": "Pages",
      "otpSendFailedError": "Unable to resend OTP.",
      "connectionFailedError": "Connection error.",
      "toastDbConnectionError": "Database connection error. Please try again later.",
      "toastEmailOrUsernameNotExist": "This email or username does not exist in the system. Please check again.",
      "toastAccountNotVerified": "This account has not been email-verified. Please contact support.",
      "toastMailSystemError": "The mail system is experiencing issues. Please try again later.",
      "toastOtpSentGmail": "An OTP code has been sent to your Gmail. Please verify.",
      "toastPleaseEnterOtp": "Please enter the OTP code.",
      "toastOtpIncorrectOrExpired": "The OTP code is incorrect or has expired.",
      "toastOtpFailed5Times": "You have entered the wrong OTP more than 5 times. Please request a password recovery.",
      "toastOtpExpiredResend": "The OTP code has expired. Please click resend code.",
      "toastAccountNotFoundOrLocked": "Account does not exist or has been locked.",
      "toastOtpVerifySuccess": "OTP verification successful. Please set a new password for your account.",
      "toastLoginFailedSystemError": "Could not establish login due to a system error. Please try again later.",
      "toastOtpResendLimit": "You have requested to resend OTP more than 3 times within 10 minutes. Please try again later.",
      "toastSendEmailFailed": "Could not send OTP email. Please try again later.",
      "toastOtpNewSentGmail": "A new OTP code has been successfully sent to your Gmail.",
      "toastAccountPermanentlyDeleted": "Your account has been permanently deleted.",
      "toastAccountUnverifiedLogin": "This account has not been email-verified. Please verify your email before logging in.",
      "toastAccountDeletedSupport": "This account has been permanently deleted. Please contact support if you need assistance.",
      "toastAccountLockedOrDeleted": "Account is locked or deleted. Please contact support.",
      "toastTemporaryPasswordWarning": "You are using a temporary password. Please change to a new password to continue using the system.",
      "toastMustAgreeTerms": "You must agree to the Terms of Service and Privacy Policy.",
      "toastGmailOnly": "Only registration emails ending in @gmail.com are accepted.",
      "toastSendEmailRegisterFailed": "Could not send OTP email. Please check your email configuration or try again later.",
      "toastRegisterOtpSent": "An OTP code has been sent to your Gmail. Please verify.",
      "toastRegisterInfoNotFound": "Registration information not found. Please register again.",
      "toastRegisterOtpFailed5Times": "You have entered the wrong OTP more than 5 times. Please register again from the beginning.",
      "toastRegisterSystemError": "Could not create account due to a system error. Please try again.",
      "toastRegisterResendLimit": "You have requested to resend OTP more than 3 times within 10 minutes. Please wait before trying again.",
      "toastEnterNewPassword": "Please fill in the new password and confirm password.",
      "toastFillAllPasswordInfo": "Please fill in all information to change your password.",
      "toastPasswordMinLength": "New password must be at least 6 characters.",
      "toastPasswordsDoNotMatch": "New password and confirm password do not match.",
      "toastUserNotFound": "User not found.",
      "toastCurrentPasswordIncorrect": "Current password is incorrect.",
      "toastSettingsSaved": "Settings and password have been changed successfully!",
      "toastPleaseLogin": "Please log in to perform this action.",
      "toastInvalidSession": "Invalid login session.",
      "toastNoImageUpload": "Uploaded image file not found.",
      "toastFilenameEmpty": "Filename is empty.",
      "toastNotPaidYet": "You have not paid yet.",
      "toastAutoConfirmInfo": "The system will automatically confirm upon receiving the transaction. You do not need to confirm manually.",
      "toastPlanActivated": "Payment confirmed and your package has been activated.",
      "toastTransferRecordedPending": "We have recorded your transfer. The order is pending admin confirmation.",
      "toastTransferRecordFailed": "Could not record (order may have already been reported or confirmed).",
      "toastConfirmTransferFailed": "Could not record payment. Please try again.",
      "toastLoginToViewPayments": "Please log in to view your payment history.",
      "toastUsersOnlyPage": "This page is only for user accounts.",
      "toastInvalidUserId": "Invalid User ID.",
      "toastLoadConfigFailed": "Could not load system configuration.",
      "toastSaveConfigSuccess": "System configuration updated successfully.",
      "toastSaveConfigFailed": "Error saving system configuration.",
      "toastInvalidLegalPage": "Invalid legal page.",
      "toastSaveLegalFailed": "Error updating legal page content.",
      "toastLogoNotFound": "Logo file not found.",
      "toastNoFileSelected": "No upload file selected.",
      "toastLogoUnsupportedFormat": "File format not supported. Only PNG, JPG, JPEG, SVG, and WEBP are allowed.",
      "toastLogoSaveSuccess": "Website logo changed successfully.",
      "toastSetPlanFailed": "Error assigning package to user.",
      "toastEnterLockReason": "Please enter the lock reason.",
      "toastLockUserSuccess": "User locked successfully.",
      "toastLockUserFailed": "Error locking user.",
      "toastUnlockUserSuccess": "User unlocked successfully.",
      "toastUnlockUserFailed": "Error unlocking user.",
      "toastDeleteUserFailed": "Error deleting user.",
      "toastErrorOccurred": "An error occurred",
      "toastUnsupportedFormat": "File format is not supported.",
      "toastUploadImageFailed": "Could not upload image. Please try again.",
      "toastAnalyzeImageFailed": "An error occurred while analyzing the image.",
      "toastConnectionFailed": "A connection error occurred",
      "toastAutoTranslating": "Automatically translating untranslated items...",
      "toastAutoTranslateSuccess": "Automatically translated successfully!",
      "toastSavePageSuccess": "Page content saved successfully!",
      "toastRestoreOriginalSuccess": "Original content restored!",
      "toastRestoreVersionSuccess": "Version restored successfully!",
      "uploading": "Uploading avatar...",
      "uploadSuccess": "Profile picture updated successfully!",
      "highConf": "High Confidence",
      "lowConf": "Low Confidence",
      "exportHistory": "Export History",
      "viewGrid": "Grid",
      "viewTable": "Table",
      "dateToday": "Today",
      "date7Days": "Last 7 Days",
      "date30Days": "Last 30 Days",
      "dateAll": "All Time",
      "sortNewest": "Newest",
      "sortOldest": "Oldest",
      "sortConfHighest": "Highest Confidence",
      "sortConfLowest": "Lowest Confidence",
      "loadMore": "Load more results",
      "confirmDeleteTitle": "Confirm Deletion",
      "rejectedOrders": "Rejected Orders",
      "cancelledOrders": "Cancelled Orders",
      "toastRejectSuccess": "Successfully rejected payment.",
      "toastRejectError": "Failed to reject payment.",
      "confirmRejectText": "Reject order {orderId} from {user}?",
      "orderDetailTitle": "Order Details",
      "paymentProof": "Payment Proof",
      "transferNote": "Transfer Note",
      "adminNote": "Admin Note",
      "noPaymentProof": "No payment proof image available.",
      "allTime": "All Time",
      "sortAmountHighest": "Highest Amount",
      "sortAmountLowest": "Lowest Amount",
      "methodAll": "All Methods",
      "statusAll": "All Statuses",
      "rejectConfirmTitle": "Confirm Reject",
      "vsLastMonth": "vs last month",
      "sortBy": "Sort by:",
      "sortAlpha": "Name A-Z",
      "sortPlan": "Highest Plan",
      "addUserBtn": "Add user",
      "relativeTimeOnline": "Online",
      "relativeTimeHours": "{num} hours ago",
      "relativeTimeYesterday": "Yesterday",
      "relativeTimeDays": "{num} days ago",
      "relativeTimeMonths": "{num} months ago",
      "paymentHistoryTitle": "Payment History",
      "paymentHistoryDesc": "Track your upgrade orders and processing status.",
      "paymentHistoryTotalPaid": "Total Paid",
      "paymentHistoryCurrentPlan": "Current Plan",
      "paymentHistoryFilterAllStatus": "All Statuses",
      "allOtherLabel": "Others",
      "paymentHistoryStatusPending": "Pending Payment",
      "paymentHistoryStatusProcessing": "Processing",
      "paymentHistoryStatusPaid": "Paid",
      "paymentHistoryStatusCancelled": "Cancelled",
      "paymentHistoryStatusFailed": "Failed",
      "paymentHistoryFilterAllPlans": "All Plans",
      "paymentHistoryFilterToday": "Today",
      "paymentHistoryFilter7Days": "7 Days",
      "paymentHistoryFilter30Days": "30 Days",
      "paymentHistoryFilterAllTime": "All Time",
      "paymentHistorySortNewest": "Newest",
      "paymentHistorySortOldest": "Oldest",
      "paymentHistorySortAmountHighest": "Amount: Highest",
      "paymentHistorySortAmountLowest": "Amount: Lowest",
      "paymentHistoryClearFilters": "Clear Filters",
      "paymentHistoryColOrderId": "Order ID",
      "paymentHistoryColPlan": "Subscription",
      "paymentHistoryColStatus": "Status",
      "paymentHistoryColAmount": "Amount",
      "paymentHistoryColMethod": "Method",
      "paymentHistoryColCreated": "Created At",
      "paymentHistoryColActions": "Actions",
      "paymentHistoryActionDetail": "View Details",
      "paymentHistoryActionProceed": "Proceed to Payment",
      "paymentHistoryActionCancel": "Cancel Order",
      "paymentHistoryActionInvoice": "Download Invoice",
      "paymentHistoryTransactionId": "Transaction ID",
      "paymentHistoryEmptyText": "You have no payment orders yet.",
      "paymentHistoryEmptySubtext": "Please select a subscription plan to upgrade your account.",
      "paymentHistoryCancelConfirmTitle": "Cancel Order",
      "paymentHistoryCancelConfirmText": "Are you sure you want to cancel order {orderId}?",
      "paymentHistoryModalClose": "Close",
      "paymentHistoryPaginationShow": "Showing",
      "paymentHistoryPaginationTo": "to",
      "paymentHistoryPaginationOf": "of",
      "paymentHistoryPaginationOrders": "orders",
      "paymentHistoryPaginationPerPage": "per page",
      "sysTabGeneral": "General Config",
      "sysTabPlans": "Service Plans",
      "sysTabPayments": "Payments",
      "sysTabEmails": "Email & Notifications",
      "sysTabLegal": "Policies & Terms",
      "sysStatLegalCount": "Total Policy Pages",
      "sysStatPlansActive": "Active Plans",
      "sysStatPaymentsActive": "Payment Methods",
      "sysStatEmailsActive": "System Emails",
      "sysCardBrandTitle": "Brand Identity",
      "sysCardBrandDesc": "Set up logo, favicon, and site name displayed on the system.",
      "sysLabelLogoCurrent": "Current Logo",
      "sysLabelFaviconCurrent": "Current Favicon",
      "sysLabelSiteName": "Site Name",
      "sysLabelSiteDesc": "Site Short Description",
      "sysLabelDragDropLogo": "Drag and drop or click to upload logo",
      "sysLabelDragDropFavicon": "Drag and drop or click to upload favicon",
      "sysUploadHelp": "PNG, JPG, JPEG, SVG (Max 2MB)",
      "sysUploadHelpFavicon": "ICO, PNG (Max 500KB)",
      "sysCardContactTitle": "Contact Details",
      "sysCardContactDesc": "Update contact details shown on the website.",
      "sysLabelContactEmail": "Contact / Support Email",
      "sysLabelContactPhone": "Phone Number",
      "sysLabelContactAddress": "Address",
      "sysLabelContactFb": "Facebook (URL)",
      "sysCardParamsTitle": "System Settings",
      "sysCardParamsDesc": "General configurations for system operations.",
      "sysLabelDefaultLang": "Default Language",
      "sysLabelDefaultTheme": "Default Theme",
      "sysLabelMaintenance": "Maintenance Mode",
      "sysMaintenanceToggleOn": "On",
      "sysMaintenanceToggleOff": "Off",
      "sysMaintenanceHelper": "When maintenance mode is active, the website will display a maintenance notice to users.",
      "sysBtnViewWebsite": "View Website",
      "sysBtnSaveAll": "Save All Changes",
      "sysBtnSaving": "Saving...",
      "sysCardVietQrTitle": "VietQR Payment Settings",
      "sysCardVietQrDesc": "Toggle and configure bank transfer payments via VietQR.",
      "sysLabelVietQrEnable": "Enable VietQR Payments",
      "sysLabelVietQrOwner": "Account Holder Name",
      "sysLabelVietQrAccount": "Account Number",
      "sysLabelVietQrBank": "Bank Name",
      "sysLabelVietQrTemplate": "Transfer Memo Template",
      "sysLabelVietQrEmail": "Notification Email for Payments",
      "sysLabelVietQrInstructions": "Payment Instructions Description",
      "sysCardPreviewSlip": "Live Bank Receipt Preview",
      "sysCardPreviewSlipDesc": "Simulated interface displayed to users during plan upgrades.",
      "sysCardEmailTemplatesTitle": "Email Templates Settings",
      "sysCardEmailTemplatesDesc": "Edit content for automated email templates sent by the system.",
      "sysLabelSelectEmailTemplate": "Select Email Template",
      "sysLabelEmailOtp": "OTP Verification Email",
      "sysLabelEmailForgot": "Forgot Password Email",
      "sysLabelEmailPayConfirm": "Payment Confirmation Email",
      "sysLabelEmailPayReject": "Payment Rejection Email",
      "sysLabelEmailDeleteRequest": "Account Deletion Request Email",
      "sysLabelEmailDeleteConfirm": "Account Deletion Confirmed Email",
      "sysLabelEmailSubject": "Email Subject",
      "sysLabelEmailBody": "Email Body (HTML / Plaintext)",
      "sysBtnSendTestEmail": "Send Test Email",
      "sysBtnSaveTemplate": "Save Email Template",
      "sysCardLegalPagesTitle": "List of Policy Pages",
      "sysLabelSearchLegal": "Search pages...",
      "sysFilterAll": "All",
      "sysFilterGuide": "Support & Guides",
      "sysStickyTitle": "Unsaved Changes Detected",
      "sysStickyCancel": "Cancel",
      "sysStickySave": "Save Changes",
      "sysConfirmMaintenanceTitle": "Enable Maintenance Mode",
      "sysConfirmMaintenanceText": "Are you sure you want to enable maintenance mode? The website will be temporarily inaccessible to users.",
      "sysConfirmRestoreTitle": "Restore Defaults",
      "sysConfirmRestoreText": "Are you sure you want to restore billing packages to default settings?",
      "sysConfirmDeleteLogo": "Delete Current Logo",
      "sysConfirmDeleteLogoText": "Are you sure you want to delete the current logo?",
      "sysConfirmDeleteFavicon": "Delete Current Favicon",
      "sysConfirmDeleteFaviconText": "Are you sure you want to delete the current favicon?",
      "sysConfirmDisablePlan": "Disable Plan",
      "sysConfirmDisablePlanText": "Are you sure you want to disable this subscription plan? Users will no longer be able to select or upgrade to this plan.",
      "sysConfirmSaveBigTitle": "Save Major Changes",
      "sysConfirmSaveBigText": "You are making critical configuration changes. Are you sure you want to save them?",
      "sysPlanRecommended": "Recommended",
      "sysPlanStatusActive": "Active",
      "sysPlanStatusInactive": "Disabled",
      "sysPlanStatusToggle": "Package Status",
      "sysPlanFeaturesLabel": "Plan Core Benefits",
      "sysBtnRestorePlan": "Restore Default",
      "sysBtnSavePlanOnly": "Save Plan Configuration",
      "sysCardSmtpTitle": "SMTP Status & Mail Delivery",
      "sysCardSmtpDesc": "Mail delivery configurations loaded from the secure .env file.",
      "sysLabelSmtpHost": "SMTP Host",
      "sysLabelSmtpPort": "SMTP Port",
      "sysLabelSmtpUser": "Sender Email",
      "sysLabelSmtpStatus": "Connection Status",
      "sysSmtpConfigured": "Configured (.env)",
      "sysSmtpPasswordHidden": "Password (Hidden)",
      "sysPreviewSlipTotal": "Total Amount",
      "sysPreviewSlipRecipient": "Recipient",
      "sysPreviewSlipBank": "Bank Name",
      "sysPreviewSlipNumber": "Account Number",
      "sysPreviewSlipMemo": "Memo",
      "sysPreviewSlipStatus": "Status",
      "sysPreviewSlipPending": "Awaiting Payment",
      "sysPreviewSlipGenerated": "Automatically generated by PetAI",
      "paidSubscribed": "Paid subscription",
      "toastDeleteUserSuccess": "Successfully deleted account for {username}.",
      "toastDeleteUserError": "Failed to delete account. Please try again.",
      "errorLockSelf": "Cannot lock the currently logged-in account.",
      "errorUserNotFound": "User not found.",
      "errorLockFail": "Failed to lock user.",
      "errorDeleteSelf": "Cannot delete the currently logged-in account.",
      "errorMissingConfirm": "Missing delete confirmation.",
      "errorIncorrectConfirm": "Incorrect delete confirmation.",
      "errorDeleteHasData": "Only users with no related data (prediction history/billing records) can be deleted.",
      "errorDeleteFail": "Failed to delete user.",
      "errorInvalidUserId": "Invalid User ID.",
      "errorSetPlanFail": "Failed to assign package to user.",
      "errorRoleSelf": "Cannot change the role of the currently logged-in account.",
      "errorInvalidRole": "Invalid role.",
      "errorSetRoleFail": "Failed to change role.",
      "rowsPerPage": "Show",
      "appearanceTitle": "Appearance",
      "changePasswordDesc": "New password (minimum 6 characters)",
      "clearHistoryConfirmText": "Are you sure you want to delete all prediction history? This will delete all prediction data and associated image files on the server. This action cannot be undone.",
      "clearHistoryConfirmTitle": "Confirm history deletion",
      "confirmDelete": "Confirm delete",
      "editBtn": "Edit",
      "emailActivityDesc": "Send instant email alerts on password changes or account deletion requests.",
      "emailActivityTitle": "Security notification email",
      "notificationGuideTitle": "Delivery Info",
      "notificationsTitle": "Notification Settings",
      "privacyTitle": "Privacy Policies",
      "pwdGuideLen": "Password length",
      "pwdGuideLenDesc": "Password must contain at least 6 characters. We recommend combining uppercase, lowercase letters, numbers, and special characters.",
      "pwdGuideOtp": "Two-factor security",
      "pwdGuideOtpDesc": "Sensitive actions like deleting your account require verification with an OTP sent to your registered email.",
      "pwdGuideUnique": "Do not reuse old passwords",
      "pwdGuideUniqueDesc": "Avoid using the same password for multiple different accounts on the Internet.",
      "securityGuideTitle": "Security Guidelines",
      "settingsTabAppearance": "Appearance",
      "settingsTabNotifications": "Notifications",
      "settingsTabPrivacy": "Privacy",
      "settingsTabProfile": "Profile",
      "settingsTabSecurity": "Security",
      "systemActivityDesc": "Display visual toast notifications when AI completes analysis or when the system is upgraded.",
      "systemActivityTitle": "Browser notifications",
      "errorRequestOtp": "An error occurred while requesting OTP.",
      "connectionErrorTryAgain": "Connection error. Please try again.",
      "enterAll6Digits": "Please enter all 6 digits.",
      "incorrectOtp": "Incorrect OTP code.",
      "connectionError": "Connection error.",
      "errorResendOtp": "Failed to resend OTP.",
      "changeAvatarTitle": "Change avatar",
      "toastDeleteHistoryError": "Failed to delete prediction history.",
      "toastSettingsSaveError": "Failed to save settings.",
      "toastNewOtpSent": "New OTP code has been sent.",
      "imageCol": "Image",
      "breedCol": "Breed",
      "typeCol": "Type",
      "confidenceCol": "Confidence",
      "timeCol": "Time",
      "actionsCol": "Actions",
      "vs7DaysAgo": "vs 7 days ago",
      "ratioPercentage": "Accounts for",
      "showingTextPrefix": "Showing 1 - ",
      "showingTextMiddle": "of",
      "showingTextSuffix": "results.",
      "methodQR": "QR VietQR",
      "methodBank": "Bank Transfer",
      "allMethods": "All Methods",
      "timeToday": "Today",
      "time7Days": "Last 7 Days",
      "time30Days": "Last 30 Days",
      "perPage": "per page",
      "buyerInfo": "Buyer Information",
      "fullnameUsername": "Full Name / Username",
      "transactionSuccess": "Transaction Successful",
      "orderCodeUpper": "ORDER ID:",
      "timeUpper": "TIME:",
      "memoUpper": "MEMO:",
      "recipientAccountUpper": "RECIPIENT ACCOUNT:",
      "timeCreatedLabel": "Created at:",
      "timeConfirmedLabel": "Confirmed at:",
      "emptyStateDesc": "All bank transfer orders are currently synced.",
      "ordersText": "orders",
      "planPro": "Pro",
      "password": "Password",
      "sysConfigPageTitle": "System Configuration - PetAI",
      "sysConfigTitle": "System Configuration",
      "sysConfigDesc": "Manage logo, contact info, service plans, payments and legal page content.",
      "sysEmailsUnit": "Address",
      "sysMethodsUnit": "Methods",
      "sysPlansUnit": "Plans",
      "sysPlansTitle": "Service Plans",
      "sysPlansDesc": "Change prices, duration and scan limits for each membership plan.",
      "sysPlanBasic": "Basic Plan",
      "sysPlanPro": "Pro Plan",
      "sysPlanEnterprise": "Enterprise Plan",
      "sysPlanPriceVnd": "Price (VND)",
      "sysPlanDurationDays": "Duration (Days)",
      "sysPlanScanLimit": "Scan Limit (Scans)",
      "sysPlanEntScanNote": "Scan limit (number or 'unlimited')",
      "sysLogoUploadNew": "Upload New Assets",
      "sysViewPage": "View Page",
      "sysEditPage": "Edit",
      "sysLegalDesc": "Edit content directly for the system's legal pages using HTML/Text.",
      "sysLegalOptTerms": "Terms of Use",
      "sysLegalOptPrivacy": "Privacy Policy",
      "sysLegalOptPayment": "Payment Policy",
      "sysLegalOptDeletion": "Data Deletion Policy",
      "sysLegalOptContact": "Contact Page",
      "sysLegalOptSupport": "Support Page",
      "sysLegalOptUserGuide": "User Guide",
      "sysDescTerms": "Legal terms and conditions binding between users and the PetAI application.",
      "sysDescPrivacy": "Defines how user personal data is collected, secured, and used.",
      "sysDescPayment": "Payment process, account upgrades, and refund policy.",
      "sysDescDeletion": "Process and policy for users to delete their account and stored data.",
      "sysDescContact": "Official contact information, address, and direct support channels of PetAI.",
      "sysDescSupport": "Answers frequently asked questions and provides technical support for users.",
      "sysDescUserGuide": "Provides a detailed guide on how to use the analysis and diagnosis features.",
      "paymentSearchPlaceholder": "Search by order ID or transaction ID...",
      "sysLegalSearchPlaceholder": "Search pages...",
      "langVi": "Vietnamese",
      "langEn": "English",
      "errorPrefix": "Error: ",
      "toastSendingTestEmail": "Sending test email template \"{templateName}\"...",
      "toastSendTestEmailSuccess": "Test email sent successfully to your support address!",
      "toastUploadingAsset": "Uploading asset...",
      "toastRestorePlansSuccess": "Packages restored to defaults. Click save changes to complete.",
      "msgCannotRejectOrder": "Cannot reject order (it may have been processed or does not exist).",
      "msgRejectOrderError": "Error rejecting order.",
      "msgChangeFaviconSuccess": "Successfully changed website favicon.",
      "msgPayDirectly": "Please make payment directly on the upgrade page.",
      "msgInvalidFaviconFormat": "Unsupported favicon format. Only ICO, PNG, JPG, JPEG, SVG, WEBP are allowed.",
      "msgInvalidLogoFormat": "Unsupported logo format. Only PNG, JPG, JPEG, SVG, WEBP are allowed.",
      "contactEmail": "Email: support@tienphongtech.vn",
      "contactPhone": "Phone: +84 916 416 409",
      "contactAddress": "Address: P16, Street 8, Lot 49, Nam Can Tho, Cai Rang, Can Tho",
      "historyScan": "Scan History",
      "servicePlans": "Service Plans",
      "footerPayment": "PAYMENT POLICY",
      "comparedToLastPeriodLabel": "Compared to last period",
      "noMatchingUsers": "No matching users found",
      "paymentPolicy": "Payment Policy",
      "paymentPolicyPageTitle": "Payment Policy | PetAI",
      "paymentSection1Desc": "Regulations on payment and service upgrades.",
      "paymentSection1Title": "1. General Regulations",
      "paymentSection2Desc": "Details on supported payment methods.",
      "paymentSection2Title": "2. Payment Methods",
      "paymentSection3Desc": "Process for confirming and activating plans.",
      "paymentSection3Title": "3. Confirmation and Activation",
      "paymentSection4Desc": "Refund policy for transactions.",
      "paymentSection4Title": "4. Refund Policy",
      "paymentSection5Desc": "User responsibilities during transactions.",
      "paymentSection5Title": "5. User Responsibilities",
      "paymentUpdateDatePrefix": "Last updated:",
      "statsComparisonLabel": "Stats Comparison",
      "statsHighlights": "Highlights",
      "statsHighlightsDesc": "Key metrics in the period",
      "statsMostCommonBreed": "Most Common Breed",
      "statsNewBreedsBadge": "New Breeds",
      "statsNoData": "No data available",
      "statsPeakActiveDay": "Peak Active Day",
      "statsPeakConfidence": "Peak Confidence",
      "actionTitle": "Actions",
      "btnChangeImage": "Change Image",
      "btnDeleteImage": "Delete Image",
      "btnReanalyze": "Reanalyze Image",
      "card2Description": "Based on morphological features",
      "cardAnalysisTime": "Analysis Time",
      "cardBestBreed": "Predicted Breed",
      "cardImageInfo": "Analyzed Image",
      "cardPredType": "Prediction Type",
      "downloadReport": "Download Report",
      "downloadReportBtn": "Download Original",
      "highConfidenceBadge": "High Confidence",
      "infoFileFormat": "Format",
      "infoFileName": "File Name",
      "infoFileResolution": "Resolution",
      "infoFileSize": "Size",
      "infoFileStatus": "Status",
      "lowConfidenceResult": "Low Confidence",
      "mixConclusionDesc": "Prediction is based on morphological features, not a genetic test.",
      "mixConclusionLabel": "Conclusion:",
      "modelStatusValue": "Good - Stable",
      "noRecentHistory": "No recent identification history",
      "recentHistory": "Recent History",
      "recentHistoryLink": "View all history",
      "shareResult": "Share Result",
      "similarityLink": "View all similar breeds",
      "validImage": "Valid Image",
      "viewHistoryBtn": "View History",
      "saveResultTitle": "Save to History",
      "saveResultDesc": "Save this result to review later",
      "downloadReportTitle": "Download PDF Report",
      "downloadReportDesc": "Export detailed AI analysis report",
      "shareResultTitle": "Share Result",
      "shareResultDesc": "Share your dog's identification results on social media or send them to friends.",
      "analyzeAnotherTitle": "Analyze Another Image",
      "analyzeAnotherDesc": "Choose another photo to analyze",
      "viewModelInfo": "Model Info",
      "hybridBreedDesc": "Based on appearance features (ears, muzzle, coat color) and Top-3 confidence levels, the model estimates the mix ratio between the 2 breeds with the highest confidence:",
      "gradcamLegend": "AI heatmap highlights areas of focus. Attention level: <span class=\"text-red-500 font-bold\">High (Red)</span>, <span class=\"text-yellow-500 font-bold\">Medium (Yellow)</span>, <span class=\"text-blue-500 font-bold\">Low (Blue)</span>",
      "mixConclusionPrefix": "Image shows mix characteristics between",
      "mixConclusionAnd": "and",
      "advicePurebredVerify": "Recommendation: perform a genetic test to verify pureness",
      "simBreedsDesc": "A database of over 120 breeds helps extract features and compare appearance similarity in real time.",
      "needMoreIdentifyDesc": "Our AI system supports multiple image formats. Upload a new photo now.",
      "disclaimerDesc1": "Identification results are analyzed based on morphology using deep learning.",
      "disclaimerDesc2": "All results are for visual reference only and do not replace accurate genetic tests.",
      "disclaimerDesc3": "Confidence level represents the probability of appearance match with our database.",
      "gradcamModalDesc": "The Grad-CAM heatmap shows the specific regions on the pet's body that the AI model focused on most to make its classification decision.",
      "modelLogicDesc": "Classification model: ResNet-101 Deep Convolutional Network\nObject detection model: YOLOv5 Realtime Object Detector\nResolution: 224x224 (Classification), 640x640 (Detection)\nTraining data: ImageNet weights + Stanford Dogs (120 breeds) + deep fine-tuning.",
      "modelLogicTitle": "Model Logic & Architecture",
      "toastPrepReport": "Preparing report...",
      "toastLinkCopied": "Link copied to clipboard!",
      "toastLinkCopyFailed": "Could not copy link.",
      "toastFilenameCopied": "Filename copied!",
      "modelStatusValueText": "Good - Stable",
      "imgFormatBadgeText": "Valid image",
      "cardAnalysisTimeValue": "Instant processing",
      "modelArchitectureTitle": "Model architecture",
      "modelStatusTitle": "Model status",
      "modelAverageConfTitle": "System Avg Confidence",
      "modelAppTitle": "Model Application",
      "loginLeftTitleAccent": "identification",
      "regLeftTitleAccent": "PetAI",
      "supportHoursLabel": "Support Hours",
      "supportTimeLabel": "Support Hours",
      "deleteRequests": "Delete Requests",
      "deleteRequestsTitle": "Account Deletion Management",
      "noDeleteRequests": "No account deletion requests found",
      "deleteReason": "Deletion Reason",
      "deleteRequestedAt": "Requested At",
      "deleteScheduledAt": "Scheduled Deletion",
      "actionRestore": "Restore",
      "actionDeleteNow": "Delete Now",
      "triggerCleanup": "System Cleanup",
      "deleteRequestsOverview": "Deletion Requests Overview",
      "pendingDeleteCount": "Pending Deletion",
      "deletedCount": "Permanently Deleted",
      "toastRestoreSuccess": "Account restored successfully!",
      "toastForceDeleteSuccess": "Account permanently deleted successfully!",
      "toastCleanupSuccess": "Cleaned up {count} expired accounts!",
      "deleteRequestsSubtitle": "View, restore or permanently delete user accounts that have requested deletion.",
      "deleteRequestsInfoTitle": "30-day Account Deletion Process",
      "deleteRequestsInfoText": "When a user confirms their deletion request, the account is placed on a 30-day pending list. During this period, the Admin has the right to restore the account if the user changes their mind, or enforce permanent deletion immediately (Force Delete) if necessary.",
      "pendingDeleteAccounts": "Accounts in pending_delete status",
      "deletedAccounts": "Accounts that have been completely deactivated",
      "noDeleteRequestsDesc": "No users match the search filters.",
      "confirmCleanupTitle": "System Cleanup",
      "confirmCleanupText": "Are you sure you want to run cleanup to permanently delete pending accounts past the 30-day period?",
      "confirmRestoreUserTitle": "Restore Account",
      "confirmRestoreUserText": "Are you sure you want to restore the account for {username}?",
      "confirmForceDeleteUserTitle": "Permanently Delete Account",
      "confirmForceDeleteUserText": "WARNING: You are about to permanently delete the account for {username} immediately. All associated data will be removed. Type 'FORCE' to confirm.",
      "labelRequested": "Requested:",
      "labelScheduled": "Scheduled:",
      "labelDeleted": "Deleted:",
      "statusCompleted": "Completed",
      "placeholderConfirmForce": "Type 'FORCE' to confirm",
      "exportConfirmationsFormatExcel": "Microsoft Excel (.xlsx)",
      "exportConfirmationsFormatCSV": "CSV File (.csv)",
      "toastExportConfirmationsSuccess": "Data exported successfully!",
      "hybridTipTitle": "Hybrid Characteristics",
      "hybridTipDesc": "Hybrid dogs possess a diverse gene pool, combining unique physical and behavioral traits from both parents.",
      "addUserModalTitle": "Add New User",
      "addUserFullname": "Full Name",
      "addUserUsername": "Username",
      "addUserEmail": "Email Address",
      "addUserPassword": "Password",
      "addUserRole": "Role",
      "addUserPlan": "Service Plan",
      "addUserExpiry": "Plan Expiration Date",
      "addUserPaidUses": "Additional Scans",
      "addUserSubmitBtn": "Confirm Create",
      "roleUser": "User",
      "roleAdmin": "Admin",
      "toastAddUserSuccess": "New user created successfully!",
      "toastAddUserError": "Failed to create user.",
      "submitting": "Processing..."
    }
  };function translateDynamicToast(text, lang) {
    if (lang !== "en") return text;

    // 1. Chào mừng trở lại, {fullname}!
    if (text.startsWith("Chào mừng trở lại, ") && text.endsWith("!")) {
      const name = text.substring("Chào mừng trở lại, ".length, text.length - 1);
      return "Welcome back, " + name + "!";
    }

    // 2. Xin chào, {fullname}!
    if (text.startsWith("Xin chào, ") && text.endsWith("!")) {
      const name = text.substring("Xin chào, ".length, text.length - 1);
      return "Hello, " + name + "!";
    }

    // 3. Đã xóa người dùng {username} thành công.
    if (text.startsWith("Đã xóa người dùng ") && text.endsWith(" thành công.")) {
      const username = text.substring("Đã xóa người dùng ".length, text.length - " thành công.".length);
      return "Successfully deleted user " + username + ".";
    }

    // 4. Xác thực thành công! Chúc mừng {fullname}, tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.
    if (text.startsWith("Xác thực thành công! Chúc mừng ") && text.endsWith(", tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.")) {
      const fullname = text.substring("Xác thực thành công! Chúc mừng ".length, text.length - ", tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.".length);
      return "Verification successful! Congratulations " + fullname + ", your account has been activated. Please log in.";
    }

    // 5. Đã xác nhận thanh toán cho đơn {order_id}.
    if (text.startsWith("Đã xác nhận thanh toán cho đơn ") && text.endsWith(".")) {
      const order_id = text.substring("Đã xác nhận thanh toán cho đơn ".length, text.length - 1);
      return "Payment confirmed for order " + order_id + ".";
    }

    // 6. Đã xóa lịch sử nhận diện. (Đã xóa {deleted_files} ảnh lưu trữ)
    const matchHistory = text.match(/Đã xóa lịch sử nhận diện\.\s*\(Đã xóa (\d+) ảnh lưu trữ\)/);
    if (matchHistory) {
      return "Cleared prediction history. (Deleted " + matchHistory[1] + " archived images)";
    }

    // 7. Đã cấp gói {plan} cho người dùng thành công.
    const matchPlan = text.match(/Đã cấp gói (.*?) cho người dùng thành công\./);
    if (matchPlan) {
      return "Successfully assigned package " + matchPlan[1] + " to user.";
    }

    // 7b. Đã cấp gói {plan} cho user #{user_id}.
    const matchPlanUser = text.match(/Đã cấp gói (.*?) cho user #(\d+)\./);
    if (matchPlanUser) {
      return "Successfully assigned package " + matchPlanUser[1] + " to user #" + matchPlanUser[2] + ".";
    }

    // 7c. Đã khóa tài khoản {username} thành công.
    if (text.startsWith("Đã khóa tài khoản ") && text.endsWith(" thành công.")) {
      const username = text.substring("Đã khóa tài khoản ".length, text.length - " thành công.".length);
      return "Successfully locked account " + username + ".";
    }

    // 7d. Đã mở khóa tài khoản {username} thành công.
    if (text.startsWith("Đã mở khóa tài khoản ") && text.endsWith(" thành công.")) {
      const username = text.substring("Đã mở khóa tài khoản ".length, text.length - " thành công.".length);
      return "Successfully unlocked account " + username + ".";
    }

    // Lock/Unlock/Delete backend errors
    if (text === "Không thể tự khóa tài khoản đang đăng nhập.") {
      return "Cannot lock the currently logged in account.";
    }
    if (text === "Không thể tự xóa tài khoản đang đăng nhập.") {
      return "Cannot delete the currently logged in account.";
    }
    if (text === "Thiếu xác nhận xóa (confirm).") {
      return "Missing deletion confirmation.";
    }
    if (text === "Xác nhận xóa không đúng.") {
      return "Incorrect deletion confirmation.";
    }
    if (text === "Không thể mở khóa người dùng.") {
      return "Failed to unlock user.";
    }
    if (text === "Không thể khóa người dùng.") {
      return "Failed to lock user.";
    }
    if (text === "Không thể xóa người dùng.") {
      return "Failed to delete user.";
    }
    if (text === "Lỗi tải thông tin người dùng.") {
      return "Failed to load user details.";
    }
    if (text === "Chỉ cho phép xóa user chưa có dữ liệu liên quan (lịch sử nhận diện/đơn thanh toán).") {
      return "Only users with no related history or orders can be deleted.";
    }
    if (text === "Vui lòng đăng nhập.") {
      return "Please log in.";
    }
    if (text === "Invalid page") {
      return "Invalid page";
    }
    if (text === "Version not found") {
      return "Version not found";
    }
    if (text === "Unauthorized") {
      return "Unauthorized";
    }
    if (text === "Server error") {
      return "Server error";
    }
    if (text === "Missing version_id") {
      return "Missing version_id";
    }

    // 8. Đã cập nhật nội dung trang {page}.
    const matchPage = text.match(/Đã cập nhật nội dung trang (.*?)\./);
    if (matchPage) {
      return "Updated content for page " + matchPage[1] + ".";
    }

    // 9. Gói {plan_label} vừa mua thành công.
    const matchPurchase = text.match(/Gói (.*?) vừa mua thành công\./);
    if (matchPurchase) {
      return "Package " + matchPurchase[1] + " purchased successfully.";
    }

    // 10. Mã OTP không chính xác. Bạn còn {attempts} lần nhập. / lần thử.
    const matchOtp = text.match(/Mã OTP không chính xác\.\s*Bạn còn (\d+) (lần nhập|lần thử)\./);
    if (matchOtp) {
      return "Incorrect OTP. You have " + matchOtp[1] + " attempts left.";
    }

    // Account deletion responses mappings
    if (text === "Chưa đăng nhập.") {
      return "Not logged in.";
    }
    if (text === "Không tìm thấy tài khoản.") {
      return "Account not found.";
    }
    if (text === "Tài khoản đã trong trạng thái chờ xóa.") {
      return "Account is already pending deletion.";
    }
    if (text === "Tài khoản đã bị xóa.") {
      return "Account has been deleted.";
    }
    if (text === "Mã OTP không hợp lệ.") {
      return "Invalid OTP.";
    }
    if (text === "Tài khoản không ở trạng thái hợp lệ để xóa.") {
      return "Account is not in a valid state to be deleted.";
    }
    if (text === "Mã OTP đã hết hạn. Vui lòng yêu cầu lại.") {
      return "OTP expired. Please request a new one.";
    }
    if (text === "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 10 phút.") {
      return "You entered it incorrectly too many times. Please try again in 10 minutes.";
    }
    if (text === "Mã OTP không hợp lệ hoặc đã hết hạn.") {
      return "Invalid or expired OTP.";
    }
    if (text === "Yêu cầu xóa tài khoản đã được ghi nhận.") {
      return "Account deletion request has been recorded.";
    }
    if (text === "Lỗi hệ thống. Vui lòng thử lại.") {
      return "System error. Please try again.";
    }
    if (text === "Mã OTP đã được gửi về email của bạn.") {
      return "OTP code has been sent to your email.";
    }
    if (text === "Mã OTP mới đã được gửi.") {
      return "New OTP code has been sent.";
    }
    if (text === "Mã OTP khôi phục đã được gửi về email của bạn.") {
      return "Recovery OTP code has been sent to your email.";
    }
    if (text === "Tài khoản của bạn đã được khôi phục thành công!") {
      return "Your account has been successfully restored!";
    }
    if (text === "Lỗi không thể xóa lịch sử.") {
      return "Failed to delete prediction history.";
    }
    if (text === "Lỗi kết nối máy chủ.") {
      return "Server connection error.";
    }
    if (text === "Không thể lưu cài đặt.") {
      return "Failed to save settings.";
    }
    if (text === "Lỗi kết nối.") {
      return "Connection error.";
    }
    if (text === "Định dạng file không được hỗ trợ.") {
      return "File format not supported.";
    }
    if (text === "Đã cập nhật ảnh đại diện thành công!") {
      return "Profile picture updated successfully!";
    }
    if (text === "Không thể tải ảnh lên.") {
      return "Failed to upload avatar.";
    }
    if (text === "Đang tải ảnh lên...") {
      return "Uploading avatar...";
    }
    if (text === "Đang gửi...") {
      return "Sending...";
    }
    if (text === "Đang gửi lại...") {
      return "Resending...";
    }
    if (text === "Đang xác nhận...") {
      return "Confirming...";
    }
    if (text === "Gặp lỗi khi yêu cầu OTP.") {
      return "Error requesting OTP.";
    }
    if (text === "Lỗi kết nối. Vui lòng thử lại.") {
      return "Connection error. Please try again.";
    }
    if (text === "Vui lòng nhập đủ 6 chữ số.") {
      return "Please enter all 6 digits.";
    }
    if (text === "Không thể gửi lại OTP.") {
      return "Failed to resend OTP.";
    }

    // ── Login / Auth ──
    if (text === "Vui lòng nhập tên đăng nhập hoặc email") {
      return "Please enter your username or email";
    }
    if (text === "Vui lòng nhập mật khẩu") {
      return "Please enter your password";
    }
    if (text === "Tên đăng nhập/Email phải có ít nhất 3 ký tự") {
      return "Username/Email must be at least 3 characters";
    }
    if (text === "Mật khẩu phải có ít nhất 6 ký tự") {
      return "Password must be at least 6 characters";
    }
    if (text === "Tài khoản không tồn tại.") {
      return "Account does not exist.";
    }
    if (text === "Tài khoản chưa được xác thực email. Vui lòng xác thực email trước khi đăng nhập.") {
      return "Account email not verified. Please verify your email before logging in.";
    }
    if (text === "Mật khẩu không đúng.") {
      return "Incorrect password.";
    }
    if (text === "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.") {
      return "Your account has been locked. Please contact the administrator.";
    }
    if (text === "Tài khoản này đã bị xóa vĩnh viễn. Vui lòng liên hệ hỗ trợ nếu cần được giúp đỡ.") {
      return "This account has been permanently deleted. Please contact support if you need help.";
    }
    if (text === "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại.") {
      return "Database connection error. Please try again.";
    }
    if (text === "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.") {
      return "Database connection error. Please try again later.";
    }
    if (text === "Google OAuth chưa được cấu hình.") {
      return "Google OAuth is not configured.";
    }
    if (text === "Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.") {
      return "Google login session is invalid or expired. Please try again.";
    }
    if (text === "Không lấy được email từ Google. Vui lòng thử lại.") {
      return "Could not get email from Google. Please try again.";
    }
    if (text === "Đăng nhập Google thất bại. Vui lòng thử lại.") {
      return "Google login failed. Please try again.";
    }
    if (text === "Bạn đã đăng xuất.") {
      return "You have logged out.";
    }

    // ── Register ──
    if (text === "Vui lòng nhập đầy đủ thông tin") {
      return "Please fill in all required fields";
    }
    if (text === "Bạn phải đồng ý với điều khoản dịch vụ và chính sách bảo mật") {
      return "You must agree to the Terms of Service and Privacy Policy";
    }
    if (text === "Họ và tên phải có ít nhất 2 ký tự") {
      return "Full name must be at least 2 characters";
    }
    if (text === "Chỉ chấp nhận email đăng ký có đuôi @gmail.com") {
      return "Only @gmail.com email addresses are accepted";
    }
    if (text === "Tên đăng nhập phải có 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới") {
      return "Username must be 3-20 characters, containing only letters, numbers and underscores";
    }
    if (text === "Mật khẩu xác nhận không khớp") {
      return "Password confirmation does not match";
    }
    if (text === "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.") {
      return "Username already exists. Please choose another.";
    }
    if (text === "Email đã được sử dụng. Vui lòng sử dụng email khác.") {
      return "Email already in use. Please use another email.";
    }
    if (text === "Không tìm thấy thông tin đăng ký. Vui lòng thực hiện đăng ký lại.") {
      return "Registration information not found. Please register again.";
    }
    if (text === "Không thể tạo tài khoản do lỗi hệ thống. Vui lòng thử lại.") {
      return "Could not create account due to system error. Please try again.";
    }

    // ── OTP / Password Recovery ──
    if (text === "Vui lòng nhập mã OTP") {
      return "Please enter the OTP code";
    }
    if (text === "Mã OTP đã được gửi về Gmail của bạn. Vui lòng xác thực.") {
      return "OTP code has been sent to your Gmail. Please verify.";
    }
    if (text === "Mã OTP không chính xác hoặc đã hết hạn.") {
      return "OTP code is incorrect or expired.";
    }
    if (text === "Bạn đã nhập sai OTP quá 5 lần. Vui lòng yêu cầu khôi phục lại mật khẩu.") {
      return "You entered incorrect OTP more than 5 times. Please request password recovery again.";
    }
    if (text === "Bạn đã nhập sai OTP quá 5 lần. Vui lòng đăng ký lại từ đầu.") {
      return "You entered incorrect OTP more than 5 times. Please register again.";
    }
    if (text === "Mã OTP đã hết hạn. Vui lòng bấm gửi lại mã.") {
      return "OTP code has expired. Please click resend code.";
    }
    if (text === "Tài khoản không tồn tại hoặc đã bị khóa.") {
      return "Account does not exist or has been locked.";
    }
    if (text === "Xác thực OTP thành công. Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.") {
      return "OTP verified successfully. Please set a new password for your account.";
    }
    if (text === "Không thể thiết lập đăng nhập do lỗi hệ thống. Vui lòng thử lại sau.") {
      return "Could not set up login due to system error. Please try again later.";
    }
    if (text === "Mã OTP mới đã được gửi thành công về Gmail của bạn.") {
      return "New OTP code has been sent to your Gmail.";
    }
    if (text === "Bạn đã yêu cầu gửi lại mã OTP quá 3 lần trong vòng 10 phút. Vui lòng thử lại sau.") {
      return "You have requested OTP resend more than 3 times in 10 minutes. Please try again later.";
    }
    if (text === "Bạn đã yêu cầu gửi lại mã OTP quá 3 lần trong vòng 10 phút. Vui lòng đợi thêm trước khi thử lại.") {
      return "You have requested OTP resend more than 3 times in 10 minutes. Please wait before trying again.";
    }
    if (text === "Không thể gửi email OTP. Vui lòng thử lại sau.") {
      return "Could not send OTP email. Please try again later.";
    }
    if (text === "Không thể gửi email OTP. Vui lòng kiểm tra lại cấu hình email hoặc thử lại sau.") {
      return "Could not send OTP email. Please check email settings or try again later.";
    }
    if (text === "Hệ thống gửi thư gặp sự cố. Vui lòng thử lại sau.") {
      return "Mail system encountered an error. Please try again later.";
    }
    if (text === "Email hoặc tên đăng nhập này không tồn tại trong hệ thống. Vui lòng kiểm tra lại.") {
      return "This email or username does not exist. Please check again.";
    }
    if (text === "Tài khoản này chưa được xác thực email. Vui lòng liên hệ hỗ trợ.") {
      return "This account has not been email verified. Please contact support.";
    }

    // ── Settings ──
    if (text === "Vui lòng đăng nhập để truy cập cài đặt.") {
      return "Please log in to access settings.";
    }
    if (text === "Phiên đăng nhập không hợp lệ.") {
      return "Invalid login session.";
    }
    if (text === "Họ và tên phải có từ 2 đến 128 ký tự.") {
      return "Full name must be 2-128 characters.";
    }
    if (text === "Vui lòng điền mật khẩu mới và xác nhận mật khẩu.") {
      return "Please enter new password and confirm password.";
    }
    if (text === "Vui lòng điền đầy đủ thông tin để thay đổi mật khẩu.") {
      return "Please fill in all fields to change password.";
    }
    if (text === "Mật khẩu mới phải có ít nhất 6 ký tự.") {
      return "New password must be at least 6 characters.";
    }
    if (text === "Mật khẩu mới và xác nhận mật khẩu không khớp.") {
      return "New password and confirmation do not match.";
    }
    if (text === "Không tìm thấy người dùng.") {
      return "User not found.";
    }
    if (text === "Mật khẩu hiện tại không chính xác.") {
      return "Current password is incorrect.";
    }
    if (text === "Cài đặt và mật khẩu đã được thay đổi thành công!") {
      return "Settings and password changed successfully!";
    }
    if (text === "Cài đặt đã được lưu thành công!") {
      return "Settings saved successfully!";
    }
    if (text === "Không thể lưu cài đặt. Vui lòng thử lại.") {
      return "Could not save settings. Please try again.";
    }
    if (text === "Không thể tải cài đặt. Vui lòng thử lại.") {
      return "Could not load settings. Please try again.";
    }
    if (text === "Vui lòng đăng nhập để thực hiện thao tác này.") {
      return "Please log in to perform this action.";
    }
    if (text === "Không thể xóa lịch sử. Vui lòng thử lại.") {
      return "Could not delete history. Please try again.";
    }

    // ── Middleware ──
    if (text === "Tài khoản đã bị khóa hoặc đã xóa. Vui lòng liên hệ hỗ trợ.") {
      return "Account has been locked or deleted. Please contact support.";
    }
    if (text === "Bạn đang sử dụng mật khẩu tạm thời. Vui lòng đổi mật khẩu mới để tiếp tục sử dụng hệ thống.") {
      return "You are using a temporary password. Please change your password to continue.";
    }
    if (text === "Phiên thao tác không hợp lệ (CSRF). Vui lòng thử lại.") {
      return "Invalid session (CSRF). Please try again.";
    }

    // ── Dashboard / History / Analytics ──
    if (text === "Vui lòng đăng nhập để truy cập dashboard.") {
      return "Please log in to access dashboard.";
    }
    if (text === "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.") {
      return "Invalid login session. Please log in again.";
    }
    if (text === "Không thể tải dashboard. Vui lòng thử lại.") {
      return "Could not load dashboard. Please try again.";
    }
    if (text === "Vui lòng đăng nhập để xem lịch sử.") {
      return "Please log in to view history.";
    }
    if (text === "Không thể tải lịch sử. Vui lòng thử lại.") {
      return "Could not load history. Please try again.";
    }
    if (text === "Vui lòng đăng nhập để xem thống kê.") {
      return "Please log in to view statistics.";
    }
    if (text === "Không thể tải thống kê. Vui lòng thử lại.") {
      return "Could not load statistics. Please try again.";
    }

    // ── Upload / Predict ──
    if (text === "Vui lòng đăng nhập để sử dụng chức năng này.") {
      return "Please log in to use this feature.";
    }
    if (text === "Vui lòng đăng nhập để truy cập chức năng này.") {
      return "Please log in to access this feature.";
    }
    if (text === "Vui lòng chọn ảnh trước khi bấm phân tích.") {
      return "Please select an image before analyzing.";
    }
    if (text === "Bạn chưa chọn ảnh. Vui lòng tải ảnh lên rồi thử lại.") {
      return "No image selected. Please upload an image and try again.";
    }
    if (text === "Bạn đã dùng hết 10 lượt miễn phí và 3 lượt xem quảng cáo. Vui lòng mua gói để tiếp tục.") {
      return "You have used all 10 free uses and 3 ad views. Please purchase a plan to continue.";
    }
    if (text === "Bạn đã dùng hết 10 lượt miễn phí. Vui lòng xem quảng cáo để mở khóa thêm.") {
      return "You have used all 10 free uses. Please watch an ad to unlock more.";
    }
    if (text === "Vui lòng xem quảng cáo để mở khóa thêm lượt nhận diện.") {
      return "Please watch an ad to unlock more recognitions.";
    }
    if (text === "Gói của bạn đã hết hạn. Vui lòng gia hạn để tiếp tục.") {
      return "Your plan has expired. Please renew to continue.";
    }
    if (text === "Bạn đã hết lượt sử dụng của gói hiện tại. Vui lòng gia hạn để tiếp tục.") {
      return "You have used all uses in your current plan. Please renew to continue.";
    }
    if (text === "Bạn đã hết lượt sử dụng. Vui lòng gia hạn để tiếp tục.") {
      return "You are out of uses. Please renew to continue.";
    }
    if (text === "Không thể lưu ảnh tải lên. Vui lòng thử lại với ảnh khác.") {
      return "Could not save uploaded image. Please try again with another image.";
    }
    if (text === "Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, JPEG, PNG.") {
      return "File format not supported. Only JPG, JPEG, PNG are accepted.";
    }
    if (text === "Bạn đã xem đủ 3 lần quảng cáo. Vui lòng mua gói để tiếp tục.") {
      return "You have watched all 3 ads. Please purchase a plan to continue.";
    }
    if (text === "Đã mở khóa thêm 3 lượt nhận diện. Bạn có thể tiếp tục!") {
      return "Unlocked 3 more recognitions. You can continue!";
    }
    if (text === "Không thể ghi nhận quảng cáo. Vui lòng thử lại.") {
      return "Could not record ad view. Please try again.";
    }
    if (text === "Đã xảy ra lỗi khi phân tích ảnh") {
      return "An error occurred while analyzing the image";
    }
    if (text === "Đã xảy ra lỗi kết nối") {
      return "A connection error occurred";
    }
    if (text === "Đã xảy ra lỗi") {
      return "An error occurred";
    }

    // ── Payment / Upgrade ──
    if (text === "Bạn đang có gói cao hơn còn hiệu lực. Không thể mua gói thấp hơn.") {
      return "You have an active higher plan. Cannot purchase a lower plan.";
    }
    if (text === "Gói hiện tại của bạn vẫn còn lượt sử dụng. Chỉ có thể gia hạn khi hết hạn hoặc đã hết lượt.") {
      return "Your current plan still has remaining uses. You can only renew when expired or out of uses.";
    }
    if (text === "Vui lòng thực hiện thanh toán trực tiếp trên trang nâng cấp.") {
      return "Please make payment directly on the upgrade page.";
    }
    if (text === "Đơn thanh toán không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.") {
      return "Payment order is invalid or expired. Please try again.";
    }
    if (text === "Hệ thống đang dùng xác nhận tự động. Vui lòng chờ hệ thống ghi nhận giao dịch.") {
      return "System uses auto-confirmation. Please wait for the system to record your transaction.";
    }
    if (text === "Luồng thanh toán đã thay đổi. Hãy tạo đơn ở trang nâng cấp trước.") {
      return "Payment flow has changed. Please create an order on the upgrade page first.";
    }
    if (text === "Đơn thanh toán không tồn tại hoặc không hợp lệ.") {
      return "Payment order does not exist or is invalid.";
    }
    if (text === "Đã xác nhận thanh toán và kích hoạt gói của bạn.") {
      return "Payment confirmed and your plan has been activated.";
    }
    if (text === "Đã ghi nhận bạn đã chuyển tiền. Đơn hàng đang chờ admin xác nhận.") {
      return "Transfer recorded. Order is pending admin confirmation.";
    }
    if (text === "Không thể ghi nhận (đơn có thể đã được báo/đã xác nhận).") {
      return "Could not record (order may already be reported/confirmed).";
    }
    if (text === "Không thể ghi nhận thanh toán. Vui lòng thử lại.") {
      return "Could not record payment. Please try again.";
    }
    if (text === "Không thể ghi nhận chuyển tiền. Vui lòng thử lại.") {
      return "Could not record transfer. Please try again.";
    }
    if (text === "Vui lòng đăng nhập để xem lịch sử thanh toán.") {
      return "Please log in to view payment history.";
    }
    if (text === "Trang này chỉ dành cho tài khoản người dùng.") {
      return "This page is for user accounts only.";
    }
    if (text === "Thiếu mã đơn thanh toán.") {
      return "Missing payment order code.";
    }
    if (text === "Đơn thanh toán không tồn tại hoặc không thuộc tài khoản của bạn.") {
      return "Payment order does not exist or does not belong to your account.";
    }
    if (text === "Bạn chưa thanh toán.") {
      return "You have not made payment yet.";
    }
    if (text === "Hệ thống sẽ tự xác nhận khi nhận được giao dịch. Bạn không cần bấm xác nhận thủ công.") {
      return "System will auto-confirm when payment is received. No manual confirmation needed.";
    }
    if (text === "Đã xảy ra lỗi hệ thống") {
      return "A system error occurred";
    }
    if (text === "Không thể tạo hóa đơn") {
      return "Failed to create order";
    }

    // ── Admin: Users ──
    if (text === "Không thể tải danh sách người dùng.") {
      return "Could not load user list.";
    }
    if (text === "Không thể tải chi tiết người dùng.") {
      return "Could not load user details.";
    }
    if (text === "Đã khởi tạo bảng ứng dụng thành công.") {
      return "Application tables initialized successfully.";
    }
    if (text === "Không thể khởi tạo DB. Vui lòng thử lại.") {
      return "Could not initialize DB. Please try again.";
    }
    if (text === "Thiếu mã đơn.") {
      return "Missing order code.";
    }
    if (text === "Không thể từ chối đơn (có thể đã xử lý hoặc không tồn tại).") {
      return "Could not reject order (may already be processed or does not exist).";
    }
    if (text === "Lỗi từ chối đơn.") {
      return "Error rejecting order.";
    }
    if (text === "Không thể xác nhận đơn (có thể đã xác nhận hoặc không tồn tại).") {
      return "Could not confirm order (may already be confirmed or does not exist).";
    }
    if (text === "Lỗi xác nhận đơn.") {
      return "Error confirming order.";
    }
    if (text === "User ID không hợp lệ.") {
      return "Invalid User ID.";
    }
    if (text === "Không thể cấp gói cho user. Vui lòng thử lại.") {
      return "Could not assign plan to user. Please try again.";
    }
    if (text === "Không thể tải cấu hình hệ thống.") {
      return "Could not load system configuration.";
    }
    if (text === "Cập nhật cấu hình hệ thống thành công.") {
      return "System configuration updated successfully.";
    }
    if (text === "Lỗi lưu cấu hình hệ thống.") {
      return "Error saving system configuration.";
    }
    if (text === "Trang pháp lý không hợp lệ.") {
      return "Invalid legal page.";
    }
    if (text === "Lỗi cập nhật nội dung trang pháp lý.") {
      return "Error updating legal page content.";
    }

    // ── Admin: Logo / Favicon ──
    if (text === "Chưa chọn file upload.") {
      return "No file selected for upload.";
    }
    if (text === "Định dạng file logo không hỗ trợ. Chỉ cho phép PNG, JPG, JPEG, SVG, WEBP.") {
      return "Logo file format not supported. Only PNG, JPG, JPEG, SVG, WEBP allowed.";
    }
    if (text === "Thay đổi logo trang web thành công.") {
      return "Website logo changed successfully.";
    }
    if (text === "Định dạng file favicon không hỗ trợ. Chỉ cho phép ICO, PNG, JPG, JPEG, SVG, WEBP.") {
      return "Favicon file format not supported. Only ICO, PNG, JPG, JPEG, SVG, WEBP allowed.";
    }
    if (text === "Thay đổi favicon trang web thành công.") {
      return "Website favicon changed successfully.";
    }

    // ── Client Editor ──
    if (text === "Đang tự động dịch các mục chưa có bản dịch...") {
      return "Auto-translating items without translations...";
    }
    if (text === "Đã tự động dịch thành công!") {
      return "Auto-translation completed successfully!";
    }
    if (text === "Đã lưu nội dung trang thành công!") {
      return "Page content saved successfully!";
    }
    if (text === "Lưu trang thành công!") {
      return "Page saved successfully!";
    }
    if (text === "Đã khôi phục nội dung gốc!") {
      return "Original content restored!";
    }
    if (text === "Không thể khôi phục") {
      return "Could not restore";
    }
    if (text === "Đã khôi phục phiên bản thành công!") {
      return "Version restored successfully!";
    }
    if (text === "Đã lưu nội dung thành công!") {
      return "Content saved successfully!";
    }
    if (text === "Lưu nội dung thành công!") {
      return "Content saved successfully!";
    }
    if (text === "Lỗi khi lưu nội dung.") {
      return "Error saving content.";
    }

    // ── Account Delete ──
    if (text === "Tài khoản của bạn đã bị xóa vĩnh viễn.") {
      return "Your account has been permanently deleted.";
    }

    // ── Payment confirmation (dynamic patterns) ──
    // Đã từ chối thanh toán cho đơn {order_id}.
    if (text.startsWith("Đã từ chối thanh toán cho đơn ") && text.endsWith(".")) {
      const oid = text.substring("Đã từ chối thanh toán cho đơn ".length, text.length - 1);
      return "Payment rejected for order " + oid + ".";
    }
    // Thanh toán thành công cho đơn {order_id}.
    if (text.startsWith("Thanh toán thành công cho đơn ") && text.endsWith(".")) {
      const oid = text.substring("Thanh toán thành công cho đơn ".length, text.length - 1);
      return "Payment successful for order " + oid + ".";
    }

    // ── Dynamic: Lỗi tải lên logo/favicon ──
    if (text.startsWith("Lỗi tải lên logo: ")) {
      return "Logo upload error: " + text.substring("Lỗi tải lên logo: ".length);
    }
    if (text.startsWith("Lỗi tải lên favicon: ")) {
      return "Favicon upload error: " + text.substring("Lỗi tải lên favicon: ".length);
    }

    // ── Dynamic: Lỗi khi lưu trang: / Lỗi kết nối: ──
    if (text.startsWith("Lỗi khi lưu trang: ")) {
      return "Error saving page: " + text.substring("Lỗi khi lưu trang: ".length);
    }
    if (text.startsWith("Lỗi kết nối: ")) {
      return "Connection error: " + text.substring("Lỗi kết nối: ".length);
    }
    if (text.startsWith("Lỗi lưu cấu hình: ")) {
      return "Error saving configuration: " + text.substring("Lỗi lưu cấu hình: ".length);
    }

    // 11. Lỗi: {error}
    if (text.startsWith("Lỗi: ")) {
      const errMsg = text.substring("Lỗi: ".length);
      return "Error: " + errMsg;
    }

    return text;
  }

  var STORAGE_KEY = "siteLanguage";
  var DEFAULT_LANG = "vi";
  var currentLang = DEFAULT_LANG;

  var VI_TO_EN_BREEDS = {
    "Không xác định": "Not determined",
    "Chó Không xác định": "Unknown",
    "Shiba": "Shiba Dog",
    "Chó Shiba": "Shiba Dog",
    "Bulldog Pháp": "French Bulldog",
    "Chó Bulldog Pháp": "French Bulldog",
    "Husky Siberia": "Siberian Husky",
    "Chó Husky Siberia": "Siberian Husky",
    "Alaska Malamute": "Malamute",
    "Chó Alaska Malamute": "Malamute",
    "Phốc sóc": "Pomeranian",
    "Corgi Pembroke": "Pembroke",
    "Chó Corgi Pembroke": "Pembroke",
    "Corgi Cardigan": "Cardigan",
    "Chó Corgi Cardigan": "Cardigan",
    "Béc-giê Đức": "German Shepherd",
    "Labrador": "Labrador Retriever",
    "Chó Labrador": "Labrador Retriever",
    "Golden": "Golden Retriever",
    "Chó Golden": "Golden Retriever",
    "Chihuahua": "Chihuahua",
    "Chó Chihuahua": "Chihuahua",
    "Pug": "Pug",
    "Chó Pug": "Pug",
    "Shih Tzu": "Shih Tzu",
    "Chó Shih Tzu": "Shih Tzu",
    "Maltese": "Maltese Dog",
    "Chó Maltese": "Maltese Dog",
    "Bắc Kinh": "Pekinese",
    "Chó Bắc Kinh": "Pekinese",
    "Papillon": "Papillon",
    "Chó Papillon": "Papillon",
    "Phốc hươu": "Miniature Pinscher",
    "Boston Terrier": "Boston Bull",
    "Chó Boston Terrier": "Boston Bull",
    "Boxer": "Boxer",
    "Chó Boxer": "Boxer",
    "Bichon Frise": "Bichon Frise",
    "Chó Bichon Frise": "Bichon Frise",
    "Chow Chow": "Chow",
    "Chó Chow Chow": "Chow",
    "Rottweiler": "Rottweiler",
    "Chó Rottweiler": "Rottweiler",
    "Doberman": "Doberman",
    "Chó Doberman": "Doberman",
    "Saint Bernard": "Saint Bernard",
    "Chó Saint Bernard": "Saint Bernard",
    "Samoyed": "Samoyed",
    "Chó Samoyed": "Samoyed",
    "Ngao Tây Tạng": "Tibetan Mastiff",
    "Ngao Đức": "Great Dane",
    "Great Pyrenees": "Great Pyrenees",
    "Chó Great Pyrenees": "Great Pyrenees",
    "Bullmastiff": "Bull Mastiff",
    "Chó Bullmastiff": "Bull Mastiff",
    "Poodle Mini": "Miniature Poodle",
    "Chó Poodle Mini": "Miniature Poodle",
    "Poodle Toy": "Toy Poodle",
    "Chó Poodle Toy": "Toy Poodle",
    "Poodle Standard": "Standard Poodle",
    "Chó Poodle Standard": "Standard Poodle",
    "Schnauzer Mini": "Miniature Schnauzer",
    "Chó Schnauzer Mini": "Miniature Schnauzer",
    "Schnauzer Standard": "Standard Schnauzer",
    "Chó Schnauzer Standard": "Standard Schnauzer",
    "Schnauzer Giant": "Giant Schnauzer",
    "Chó Schnauzer Giant": "Giant Schnauzer",
    "Westie": "West Highland White Terrier",
    "Chó Westie": "West Highland White Terrier",
    "Amstaff": "American Staffordshire Terrier",
    "Chó Amstaff": "American Staffordshire Terrier",
    "Staffordshire Bull Terrier": "Staffordshire Bullterrier",
    "Chó Staffordshire Bull Terrier": "Staffordshire Bullterrier",
    "Scottie": "Scotch Terrier",
    "Chó Scottie": "Scotch Terrier",
    "Yorkshire Terrier": "Yorkshire Terrier",
    "Chó Yorkshire Terrier": "Yorkshire Terrier",
    "Basset Hound": "Basset",
    "Chó Basset Hound": "Basset",
    "Beagle": "Beagle",
    "Chó Beagle": "Beagle",
    "Cocker": "Cocker Spaniel",
    "Chó Cocker": "Cocker Spaniel",
    "Cavalier King Charles (Blenheim)": "Blenheim Spaniel",
    "Chó Cavalier King Charles (Blenheim)": "Blenheim Spaniel",
    "Springer Anh": "English Springer",
    "Chó Springer Anh": "English Springer",
    "Springer xứ Wales": "Welsh Springer Spaniel",
    "Chó Springer xứ Wales": "Welsh Springer Spaniel",
    "Irish Setter": "Irish Setter",
    "Chó Irish Setter": "Irish Setter",
    "Setter Anh": "English Setter",
    "Chó Setter Anh": "English Setter",
    "Irish Terrier": "Irish Terrier",
    "Chó Irish Terrier": "Irish Terrier",
    "Gordon Setter": "Gordon Setter",
    "Chó Gordon Setter": "Gordon Setter",
    "Pointer Đức": "German Short Haired Pointer",
    "Chó Pointer Đức": "German Short Haired Pointer",
    "Chesapeake Retriever": "Chesapeake Bay Retriever",
    "Chó Chesapeake Retriever": "Chesapeake Bay Retriever",
    "Curly-coated Retriever": "Curly Coated Retriever",
    "Chó Curly-coated Retriever": "Curly Coated Retriever",
    "Flat-coated Retriever": "Flat Coated Retriever",
    "Chó Flat-coated Retriever": "Flat Coated Retriever",
    "Sheltie": "Shetland Sheepdog",
    "Chó Sheltie": "Shetland Sheepdog",
    "Border Collie": "Border Collie",
    "Chó Border Collie": "Border Collie",
    "Bobtail": "Old English Sheepdog",
    "Chó Bobtail": "Old English Sheepdog",
    "Béc-giê Bỉ Malinois": "Malinois",
    "Béc-giê Bỉ Groenendael": "Groenendael",
    "Cane Corso": "Cane Corso",
    "Chó Cane Corso": "Cane Corso",
    "Fila Brasileiro": "Fila Brasileiro",
    "Chó Fila Brasileiro": "Fila Brasileiro",
    "Chó mào Trung Quốc": "Chinese Crested Dog",
    "Chó cỏ Trung Quốc": "Chinese Rural Dog",
    "Mexican Hairless": "Mexican Hairless",
    "Chó Mexican Hairless": "Mexican Hairless",
    "Chó ta Việt Nam": "Vietnamese Native Dog",
    "Chó Bắc Hà": "Bac Ha Dog",
    "Chó H'Mông cộc đuôi": "Hmong Bobtail Dog",
    "Teddy": "Teddy",
    "Chó Teddy": "Teddy",
    "Black and Tan Coonhound": "Black and Tan Coonhound",
    "Chó Black and Tan Coonhound": "Black and Tan Coonhound",
    "Bluetick Coonhound": "Bluetick",
    "Chó Bluetick Coonhound": "Bluetick",
    "Redbone Coonhound": "Redbone",
    "Chó Redbone Coonhound": "Redbone",
    "Treeing Walker Coonhound": "Walker Hound",
    "Chó Treeing Walker Coonhound": "Walker Hound",
    "Airedale Terrier": "Airedale",
    "Chó Airedale Terrier": "Airedale",
    "Border Terrier": "Border Terrier",
    "Chó Border Terrier": "Border Terrier",
    "Norwich Terrier": "Norwich Terrier",
    "Chó Norwich Terrier": "Norwich Terrier",
    "Norfolk Terrier": "Norfolk Terrier",
    "Chó Norfolk Terrier": "Norfolk Terrier",
    "Lakeland Terrier": "Lakeland Terrier",
    "Chó Lakeland Terrier": "Lakeland Terrier",
    "Bedlington Terrier": "Bedlington Terrier",
    "Chó Bedlington Terrier": "Bedlington Terrier",
    "Sealyham Terrier": "Sealyham Terrier",
    "Chó Sealyham Terrier": "Sealyham Terrier",
    "Silky Terrier": "Silky Terrier",
    "Chó Silky Terrier": "Silky Terrier",
    "Toy Terrier": "Toy Terrier",
    "Chó Toy Terrier": "Toy Terrier",
    "Kerry Blue Terrier": "Kerry Blue Terrier",
    "Chó Kerry Blue Terrier": "Kerry Blue Terrier",
    "Wire Fox Terrier": "Wire Haired Fox Terrier",
    "Chó Wire Fox Terrier": "Wire Haired Fox Terrier",
    "Wheaten Terrier": "Soft Coated Wheaten Terrier",
    "Chó Wheaten Terrier": "Soft Coated Wheaten Terrier",
    "Elkhound Na Uy": "Norwegian Elkhound",
    "Chó Elkhound Na Uy": "Norwegian Elkhound",
    "Ridgeback Rhodesia": "Rhodesian Ridgeback",
    "Chó Ridgeback Rhodesia": "Rhodesian Ridgeback",
    "Irish Wolfhound": "Irish Wolfhound",
    "Chó Irish Wolfhound": "Irish Wolfhound",
    "Deerhound Scotland": "Scottish Deerhound",
    "Chó Deerhound Scotland": "Scottish Deerhound",
    "Greyhound Ý": "Italian Greyhound",
    "Chó Greyhound Ý": "Italian Greyhound",
    "Whippet": "Whippet",
    "Chó Whippet": "Whippet",
    "Borzoi": "Borzoi",
    "Chó Borzoi": "Borzoi",
    "Afghan Hound": "Afghan Hound",
    "Chó Afghan Hound": "Afghan Hound",
    "Saluki": "Saluki",
    "Chó Saluki": "Saluki",
    "Ibizan Hound": "Ibizan Hound",
    "Chó Ibizan Hound": "Ibizan Hound",
    "Vizsla": "Vizsla",
    "Chó Vizsla": "Vizsla",
    "Weimaraner": "Weimaraner",
    "Chó Weimaraner": "Weimaraner",
    "Otterhound": "Otterhound",
    "Chó Otterhound": "Otterhound",
    "Bloodhound": "Bloodhound",
    "Chó Bloodhound": "Bloodhound",
    "Foxhound Anh": "English Foxhound",
    "Chó Foxhound Anh": "English Foxhound",
    "Chin Nhật": "Japanese Spaniel",
    "Chó Chin Nhật": "Japanese Spaniel",
    "Spitz Nhật": "Japanese Spitz",
    "Chó Spitz Nhật": "Japanese Spitz",
    "Eskimo Mỹ": "Eskimo Dog",
    "Chó Eskimo Mỹ": "Eskimo Dog",
    "Keeshond": "Keeshond",
    "Chó Keeshond": "Keeshond",
    "Newfoundland": "Newfoundland",
    "Chó Newfoundland": "Newfoundland",
    "Bernese Mountain Dog": "Bernese Mountain Dog",
    "Chó Bernese Mountain Dog": "Bernese Mountain Dog",
    "Greater Swiss Mountain Dog": "Greater Swiss Mountain Dog",
    "Chó Greater Swiss Mountain Dog": "Greater Swiss Mountain Dog",
    "Entlebucher": "Entlebucher",
    "Chó Entlebucher": "Entlebucher",
    "Appenzeller": "Appenzeller",
    "Chó Appenzeller": "Appenzeller",
    "Kuvasz": "Kuvasz",
    "Chó Kuvasz": "Kuvasz",
    "Komondor": "Komondor",
    "Chó Komondor": "Komondor",
    "Leonberger": "Leonberg",
    "Chó Leonberger": "Leonberg",
    "Lhasa": "Lhasa",
    "Chó Lhasa": "Lhasa",
    "Dandie Dinmont Terrier": "Dandie Dinmont",
    "Chó Dandie Dinmont Terrier": "Dandie Dinmont",
    "Schipperke": "Schipperke",
    "Chó Schipperke": "Schipperke",
    "Affenpinscher": "Affenpinscher",
    "Chó Affenpinscher": "Affenpinscher",
    "Basenji": "Basenji",
    "Chó Basenji": "Basenji",
    "Dhole": "Dhole",
    "Chó Dhole": "Dhole",
    "Dingo": "Dingo",
    "Chó Dingo": "Dingo",
    "Chó hoang châu Phi": "African Hunting Dog",
    "Briard": "Briard",
    "Chó Briard": "Briard",
    "Collie": "Collie",
    "Chó Collie": "Collie",
    "Shepherd Úc": "Australian Shepherd",
    "Chó Shepherd Úc": "Australian Shepherd",
    "Terrier Úc": "Australian Terrier",
    "Chó Terrier Úc": "Australian Terrier",
    "Bouvier des Flandres": "Bouvier des Flandres",
    "Chó Bouvier des Flandres": "Bouvier des Flandres",
    "Brussels Griffon": "Brabancon Griffon",
    "Chó Brussels Griffon": "Brabancon Griffon",
    "Kelpie": "Kelpie",
    "Chó Kelpie": "Kelpie",
    "Clumber Spaniel": "Clumber",
    "Chó Clumber Spaniel": "Clumber",
    "Irish Water Spaniel": "Irish Water Spaniel",
    "Chó Irish Water Spaniel": "Irish Water Spaniel",
    "Brittany Spaniel": "Brittany Spaniel",
    "Chó Brittany Spaniel": "Brittany Spaniel",
    "Sussex Spaniel": "Sussex Spaniel",
    "Chó Sussex Spaniel": "Sussex Spaniel",
    "Terrier Tây Tạng": "Tibetan Terrier",
    "Chó Terrier Tây Tạng": "Tibetan Terrier",
    "Cairn Terrier": "Cairn",
    "Chó Cairn Terrier": "Cairn",
    "Chưa xác định": "Not determined"
  };

  function translateBreedViToEn(viName) {
    if (!viName) return "Not determined";
    viName = viName.trim();
    if (viName.startsWith("Nghi lai:")) {
      var inner = viName.replace("Nghi lai:", "").trim();
      var parts = inner.split("x");
      var translatedParts = parts.map(function (p) {
        return translateBreedViToEn(p.trim());
      });
      return "Crossbreed: " + translatedParts.join(" x ");
    }
    if (VI_TO_EN_BREEDS[viName] !== undefined) {
      return VI_TO_EN_BREEDS[viName];
    }

    // Try without "Chó " or "chó " prefix
    var cleanName = viName;
    if (cleanName.toLowerCase().startsWith("chó ")) {
      cleanName = cleanName.substring(4).trim();
    }
    if (VI_TO_EN_BREEDS[cleanName] !== undefined) {
      return VI_TO_EN_BREEDS[cleanName];
    }

    // Case-insensitive fallback lookup
    var lowerVi = viName.toLowerCase();
    var lowerClean = cleanName.toLowerCase();
    for (var key in VI_TO_EN_BREEDS) {
      var lowerKey = key.toLowerCase();
      if (lowerKey === lowerVi || lowerKey === lowerClean ||
        lowerKey === "chó " + lowerClean || lowerKey === "chó " + lowerVi) {
        return VI_TO_EN_BREEDS[key];
      }
    }
    return viName;
  }

  function getSavedLang() {
    try {
      // Prioritize cookie to stay in sync with server-side rendering language
      var match = document.cookie.match(new RegExp('(^| )' + STORAGE_KEY + '=([^;]+)'));
      if (match) return match[2];
      
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
      
      var htmlLang = document.documentElement.getAttribute("lang");
      if (htmlLang && (htmlLang === "vi" || htmlLang === "en")) {
        return htmlLang;
      }
      
      return DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.cookie = STORAGE_KEY + "=" + lang + ";path=/;max-age=31536000;SameSite=Lax";
    } catch (e) { }
  }

  function t(key) {
    var dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];
    return dict[key] !== undefined ? dict[key] : key;
  }

  function applyTranslations(lang) {
    console.log("i18n applyTranslations called with lang:", lang);
    if (window.PetAI_DynamicSettings) {
      console.log("i18n window.PetAI_DynamicSettings exists:", JSON.stringify(window.PetAI_DynamicSettings));
      if (window.PetAI_DynamicSettings.vi) {
        for (var k in window.PetAI_DynamicSettings.vi) {
          TRANSLATIONS.vi[k] = window.PetAI_DynamicSettings.vi[k];
        }
      }
      if (window.PetAI_DynamicSettings.en) {
        for (var k in window.PetAI_DynamicSettings.en) {
          TRANSLATIONS.en[k] = window.PetAI_DynamicSettings.en[k];
        }
      }
    } else {
      console.log("i18n window.PetAI_DynamicSettings is missing!");
    }
    var dict = TRANSLATIONS[lang];
    if (!dict) return;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      // Avoid translating if this element is nested inside another translated element
      var ancestor = el.parentElement ? el.parentElement.closest("[data-i18n], [data-i18n-html]") : null;
      if (ancestor) {
        var ancestorKey = ancestor.getAttribute("data-i18n") || ancestor.getAttribute("data-i18n-html");
        if (dict[ancestorKey] !== undefined) {
          return;
        }
      }
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        var val = dict[key];
        var code = el.getAttribute("data-code");
        if (code !== null) {
          val = val.replace("{{ code }}", code);
        }
        if (el.textContent !== val) {
          el.textContent = val;
        }
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined && el.getAttribute("placeholder") !== dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined && el.getAttribute("aria-label") !== dict[key]) {
        el.setAttribute("aria-label", dict[key]);
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (dict[key] !== undefined && el.getAttribute("title") !== dict[key]) {
        el.setAttribute("title", dict[key]);
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      // Avoid translating if this element is nested inside another translated element
      var ancestor = el.parentElement ? el.parentElement.closest("[data-i18n], [data-i18n-html]") : null;
      if (ancestor) {
        var ancestorKey = ancestor.getAttribute("data-i18n") || ancestor.getAttribute("data-i18n-html");
        if (dict[ancestorKey] !== undefined) {
          return;
        }
      }
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined && el.innerHTML !== dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Auto-translate toast titles and messages from Flask by auto-matching
    document
      .querySelectorAll(".toast__message, .toast__title")
      .forEach(function (el) {
        var text = el.textContent.trim();
        if (!text) return;

        var viDict = TRANSLATIONS.vi;
        var matched = false;
        for (var key in viDict) {
          if (viDict[key] === text) {
            if (dict[key] !== undefined) {
              el.textContent = dict[key];
            }
            matched = true;
            break;
          }
        }
        if (!matched && lang === "en" && el.classList.contains("toast__message")) {
          el.textContent = translateDynamicToast(text, lang);
        }
      });

    // Auto-translate paragraphs/elements with dynamic server-rendered text
    document.querySelectorAll("[data-i18n-auto]").forEach(function (el) {
      var original =
        el.getAttribute("data-original-text") || el.textContent.trim();
      if (!el.getAttribute("data-original-text")) {
        el.setAttribute("data-original-text", original);
      }

      var viDict = TRANSLATIONS.vi;
      var foundKey = null;
      for (var key in viDict) {
        if (viDict[key] === original) {
          foundKey = key;
          break;
        }
      }

      if (foundKey && dict[foundKey] !== undefined) {
        el.innerHTML = dict[foundKey];
      } else {
        el.innerHTML = original;
      }
    });

    // Translate dynamic breed names (like crossbreed prefixes)
    document.querySelectorAll("[data-i18n-breed]").forEach(function (el) {
      var vi = el.getAttribute("data-i18n-breed") || el.getAttribute("data-i18n-breed-vi");
      var en = el.getAttribute("data-i18n-breed-en");
      if (lang === "en") {
        el.textContent = en || translateBreedViToEn(vi);
      } else {
        el.textContent = vi || "Chưa xác định";
      }
    });

    // Auto-translate warning notes containing dynamic percentage numbers or breed names
    document.querySelectorAll(".p-3.bg-error-container\\/40 p, .warning-note").forEach(function (el) {
      var original = el.getAttribute("data-original-text") || el.textContent.trim();
      if (!el.getAttribute("data-original-text")) {
        el.setAttribute("data-original-text", original);
      }
      var text = original;
      if (lang === "en") {
        if (text.startsWith("Ứng viên thuần chủng/chiếm ưu thế:")) {
          var breedVi = text.replace("Ứng viên thuần chủng/chiếm ưu thế:", "").replace(".", "").trim();
          var breedEn = translateBreedViToEn(breedVi);
          text = "Purebred/dominant candidate: " + breedEn + ".";
        } else {
          text = text
            .replace("Độ tin cậy CHÓ từ YOLO chỉ", "YOLO dog confidence is only")
            .replace("Kết quả giống dưới đây chỉ mang tính tham khảo.", "Breed results below are for reference only.")
            .replace("AI giống đang nghiêng về chó", "AI is leaning towards dog")
            .replace("nhưng chưa đủ ngưỡng xác nhận.", "but verification threshold is not met.")
            .replace("Ảnh này chưa được nhận diện chắc chắn là CHÓ.", "This photo is not confidently identified as a DOG.");
        }
        el.textContent = text;
      } else {
        el.textContent = original;
      }
    });
  }

  function updateSwitcherUI(lang) {
    // CSS-based segmented control handles state updates via html[lang] selector
  }

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = DEFAULT_LANG;
    var oldLang = currentLang;
    currentLang = lang;
    saveLang(lang);
    applyTranslations(lang);
    
    // Sync lang attribute on HTML element to trigger CSS state changes instantly
    try {
      document.documentElement.setAttribute("lang", lang);
    } catch (err) { }
    
    updateSwitcherUI(lang);

    // Sync trigger texts and dropdowns as well
    try {
      var triggerText = document.querySelector("#sidebarLangTrigger .current-lang-text");
      if (triggerText) {
        triggerText.textContent = lang.toUpperCase();
      }
      document.querySelectorAll(".sidebar-lang-option").forEach(function (opt) {
        if (opt.getAttribute("data-value") === lang) {
          opt.classList.add("is-active");
        } else {
          opt.classList.remove("is-active");
        }
      });
    } catch (err) { }

    try {
      document.dispatchEvent(
        new CustomEvent("i18nChanged", { detail: { lang: lang } }),
      );
    } catch (e) { }

    if (oldLang !== lang) {
      var isEditing = false;
      try {
        isEditing = window.location.search.indexOf("edit=true") !== -1 || 
                    window.location.search.indexOf("preview=true") !== -1 || 
                    document.getElementById("admin-float-editor-bar") !== null ||
                    document.getElementById("inplace-preview-bar") !== null;
      } catch (err) { }
      
      var csrfToken = "";
      try {
        var csrfMeta = document.querySelector('meta[name="csrf-token"]');
        if (csrfMeta) csrfToken = csrfMeta.getAttribute("content") || "";
      } catch (err) { }

      fetch("/settings/change-language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ language: lang })
      })
      .then(function () {
        if (!isEditing) {
          window.location.reload();
        }
      })
      .catch(function (err) {
        console.warn("Failed to save language to DB:", err);
        if (!isEditing) {
          window.location.reload();
        }
      });
    }
  }

  function loadRemoteTranslations(lang, callback) {
    fetch("/static/locales/translations.json?v=" + new Date().getTime())
      .then(function (res) {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then(function (data) {
        if (data) {
          if (data.vi) {
            for (var key in data.vi) {
              TRANSLATIONS.vi[key] = data.vi[key];
            }
          }
          if (data.en) {
            for (var key in data.en) {
              TRANSLATIONS.en[key] = data.en[key];
            }
          }
          // Re-apply PetAI_DynamicSettings (DB data) AFTER merging static file
          // so that user-edited content always takes priority over translations.json
          if (window.PetAI_DynamicSettings) {
            if (window.PetAI_DynamicSettings.vi) {
              for (var k in window.PetAI_DynamicSettings.vi) {
                TRANSLATIONS.vi[k] = window.PetAI_DynamicSettings.vi[k];
              }
            }
            if (window.PetAI_DynamicSettings.en) {
              for (var k in window.PetAI_DynamicSettings.en) {
                TRANSLATIONS.en[k] = window.PetAI_DynamicSettings.en[k];
              }
            }
          }
          console.log("i18n successfully merged remote translations!");
          // NOTE: Do NOT call applyTranslations here.
          // Bootstrap already applied correct translations (including PetAI_DynamicSettings/DB data).
          // Calling applyTranslations again causes a visible text flash on F5.
          // The merged data is available for future setLanguage() calls.
        }
        if (callback) callback();
      })
      .catch(function (err) {
        console.warn("Failed to load remote translations, using local fallback:", err);
        if (callback) callback();
      });
  }

  function bootstrap() {
    console.log(
      "i18n bootstrap called! Document readyState:",
      document.readyState,
    );

    document.addEventListener("click", function (e) {
      var switcher = e.target.closest(".language-switcher");
      if (switcher) {
        console.log("i18n clicked language switcher! Toggling language...");
        e.stopPropagation();
        var nextLang = currentLang === "vi" ? "en" : "vi";
        setLanguage(nextLang);
        return;
      }

      var langOpt = e.target.closest(".language-option");
      if (langOpt) {
        var lang = langOpt.getAttribute("data-lang");
        if (lang) {
          console.log("i18n clicked language option: " + lang);
          e.stopPropagation();
          setLanguage(lang);
          return;
        }
      }

      var logoutBtn = e.target.closest(".logout-btn-link");
      if (logoutBtn) {
        e.preventDefault();
        var url = logoutBtn.getAttribute("href");
        if (url) {
          window.PetAI_confirm({
            text: TRANSLATIONS[currentLang || "vi"].confirmLogoutText || "Bạn có chắc chắn muốn đăng xuất tài khoản?",
            type: "warning"
          }).then(function (confirmed) {
            if (confirmed) {
              window.location.href = url;
            }
          });
        }
        return;
      }
    });

    // Custom language dropdown logic
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("#sidebarLangTrigger");
      var menu = document.getElementById("sidebarLangMenu");
      
      if (trigger) {
        e.stopPropagation();
        if (menu) {
          var isExpanded = menu.classList.contains("show");
          if (isExpanded) {
            menu.classList.remove("show");
            trigger.classList.remove("is-active");
            trigger.setAttribute("aria-expanded", "false");
          } else {
            menu.classList.add("show");
            trigger.classList.add("is-active");
            trigger.setAttribute("aria-expanded", "true");
          }
        }
        return;
      }

      var option = e.target.closest(".sidebar-lang-option");
      if (option) {
        e.stopPropagation();
        var lang = option.getAttribute("data-value");
        if (lang) {
          console.log("i18n custom sidebar option clicked: " + lang);
          setLanguage(lang);
        }
        if (menu) {
          menu.classList.remove("show");
        }
        var trig = document.getElementById("sidebarLangTrigger");
        if (trig) {
          trig.classList.remove("is-active");
          trig.setAttribute("aria-expanded", "false");
        }
        return;
      }

      // Click outside -> close menu
      if (menu && menu.classList.contains("show")) {
        menu.classList.remove("show");
        var trig = document.getElementById("sidebarLangTrigger");
        if (trig) {
          trig.classList.remove("is-active");
          trig.setAttribute("aria-expanded", "false");
        }
      }
    });

    try {
      var saved = getSavedLang();
      console.log("i18n bootstrap: saved language is:", saved);
      currentLang = saved;
      console.log("i18n bootstrap: TRANSLATIONS.vi before applyTranslations:", JSON.stringify({
        predict: TRANSLATIONS.vi.predict,
        dogBreedsNav: TRANSLATIONS.vi.dogBreedsNav
      }));
      applyTranslations(saved);
      console.log("i18n bootstrap: TRANSLATIONS.vi after applyTranslations:", JSON.stringify({
        predict: TRANSLATIONS.vi.predict,
        dogBreedsNav: TRANSLATIONS.vi.dogBreedsNav
      }));
      // Instantly sync dynamic elements visibility before unhiding the body
      updateDynamicContentVisibility(saved);
      updateSwitcherUI(saved);
      // Ensure cookie is synced on initialization (e.g. if cookie was cleared/expired but localStorage exists)
      // to prevent FOUC / translation flash on subsequent page reloads (F5) or PJAX request triggers.
      saveLang(saved);
      loadRemoteTranslations(saved, function () {
        try {
          document.dispatchEvent(
            new CustomEvent("i18nReady", { detail: { lang: saved } }),
          );
        } catch (e) { }
      });

      // Sync custom sidebar dropdown values
      var triggerText = document.querySelector("#sidebarLangTrigger .current-lang-text");
      if (triggerText) {
        triggerText.textContent = saved.toUpperCase();
      }
      document.querySelectorAll(".sidebar-lang-option").forEach(function (opt) {
        if (opt.getAttribute("data-value") === saved) {
          opt.classList.add("is-active");
        } else {
          opt.classList.remove("is-active");
        }
      });
    } catch (err) {
      console.error("i18n initialization error:", err);
    } finally {
      // Delay displaying the body until all fonts (like Google Fonts Inter) are loaded to prevent font layout shifts (FOUT)
      if (document.fonts && typeof document.fonts.ready.then === "function") {
        document.fonts.ready.then(function () {
          document.documentElement.classList.remove("i18n-loading");
          document.documentElement.classList.add("ready");
        });
      } else {
        document.documentElement.classList.remove("i18n-loading");
        document.documentElement.classList.add("ready");
      }
    }

    try {
      document.dispatchEvent(
        new CustomEvent("i18nReady", { detail: { lang: saved } }),
      );
    } catch (e) { }
  }

  // Apply translations to any DOM subtree (works on detached/off-DOM elements too)
  function applyToElement(root, lang) {
    var dict = TRANSLATIONS[lang];
    if (!dict || !root) return;

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var ancestor = el.parentElement ? el.parentElement.closest("[data-i18n], [data-i18n-html]") : null;
      if (ancestor) {
        var ancestorKey = ancestor.getAttribute("data-i18n") || ancestor.getAttribute("data-i18n-html");
        if (dict[ancestorKey] !== undefined) {
          return;
        }
      }
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        var val = dict[key];
        var code = el.getAttribute("data-code");
        if (code !== null) {
          val = val.replace("{{ code }}", code);
        }
        if (el.textContent !== val) {
          el.textContent = val;
        }
      }
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined && el.getAttribute("placeholder") !== dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined && el.getAttribute("aria-label") !== dict[key]) {
        el.setAttribute("aria-label", dict[key]);
      }
    });

    root.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (dict[key] !== undefined && el.getAttribute("title") !== dict[key]) {
        el.setAttribute("title", dict[key]);
      }
    });

    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var ancestor = el.parentElement ? el.parentElement.closest("[data-i18n], [data-i18n-html]") : null;
      if (ancestor) {
        var ancestorKey = ancestor.getAttribute("data-i18n") || ancestor.getAttribute("data-i18n-html");
        if (dict[ancestorKey] !== undefined) {
          return;
        }
      }
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined && el.innerHTML !== dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    root.querySelectorAll("[data-i18n-breed]").forEach(function (el) {
      var vi = el.getAttribute("data-i18n-breed") || el.getAttribute("data-i18n-breed-vi");
      var en = el.getAttribute("data-i18n-breed-en");
      if (lang === "en") {
        var valEn = en || translateBreedViToEn(vi);
        if (el.textContent !== valEn) el.textContent = valEn;
      } else {
        var valVi = vi || "Chưa xác định";
        if (el.textContent !== valVi) el.textContent = valVi;
      }
    });
  }

  // Listen for language change to toggle custom database contents instantly without F5
  function updateDynamicContentVisibility(lang) {
    var viDiv = document.getElementById("dynamic-content-vi");
    var enDiv = document.getElementById("dynamic-content-en");
    if (viDiv && enDiv) {
      if (lang === "en") {
        viDiv.style.display = "none";
        viDiv.classList.add("hidden");
        enDiv.style.display = "";
        enDiv.classList.remove("hidden");
      } else {
        enDiv.style.display = "none";
        enDiv.classList.add("hidden");
        viDiv.style.display = "";
        viDiv.classList.remove("hidden");
      }
    }

    // Toggle footer bilingual address elements
    var viAddresses = document.querySelectorAll(".footer-address-vi, .contact-address-vi");
    var enAddresses = document.querySelectorAll(".footer-address-en, .contact-address-en");
    if (lang === "en") {
      viAddresses.forEach(function(el) { el.classList.add("hidden"); });
      enAddresses.forEach(function(el) { el.classList.remove("hidden"); });
    } else {
      enAddresses.forEach(function(el) { el.classList.add("hidden"); });
      viAddresses.forEach(function(el) { el.classList.remove("hidden"); });
    }

    // Toggle bilingual support hours
    var viHours = document.querySelectorAll(".contact-hours-vi");
    var enHours = document.querySelectorAll(".contact-hours-en");
    if (lang === "en") {
      viHours.forEach(function(el) { el.classList.add("hidden"); });
      enHours.forEach(function(el) { el.classList.remove("hidden"); });
    } else {
      enHours.forEach(function(el) { el.classList.add("hidden"); });
      viHours.forEach(function(el) { el.classList.remove("hidden"); });
    }
  }

  document.addEventListener("i18nChanged", function (e) {
    updateDynamicContentVisibility(e.detail.lang);
  });
  document.addEventListener("i18nReady", function (e) {
    updateDynamicContentVisibility(e.detail.lang);
  });

  function createDynamicModal(options, isConfirm) {
    var lang = currentLang || "vi";
    var tDict = TRANSLATIONS[lang] || TRANSLATIONS.vi;

    var type = options.type || "warning"; // warning, danger, success, info
    var title = options.title || "";
    if (!title) {
      if (type === "danger") title = tDict.dangerTitle || (lang === "en" ? "Danger Alert" : "Cảnh báo nguy hiểm");
      else if (type === "success") title = tDict.successTitle || (lang === "en" ? "Success" : "Thành công");
      else if (type === "info") title = tDict.infoTitle || (lang === "en" ? "Information" : "Thông tin");
      else title = tDict.warningTitle || (lang === "en" ? "Confirmation" : "Xác nhận");
    }

    var text = options.text || "";
    // Auto-translate text when not in Vietnamese
    if (lang !== "vi" && text) {
      text = translateDynamicToast(text, lang);
    }
    var confirmText = options.confirmText || tDict.confirm || (lang === "en" ? "Confirm" : "Xác nhận");
    var cancelText = options.cancelText || tDict.cancel || (lang === "en" ? "Cancel" : "Hủy");

    // Icon & colors mapping
    var iconName = "warning";
    var iconClass = "text-amber-500 dark:text-amber-450";
    var btnClass = "bg-primary hover:bg-primary/95 text-on-primary";
    
    if (type === "danger") {
      iconName = "error";
      iconClass = "text-red-500 dark:text-red-450";
      btnClass = "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white";
    } else if (type === "success") {
      iconName = "check_circle";
      iconClass = "text-emerald-500 dark:text-emerald-450";
      btnClass = "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white";
    } else if (type === "info") {
      iconName = "info";
      iconClass = "text-blue-500 dark:text-blue-450";
      btnClass = "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white";
    }

    var modalId = "petai-global-modal-" + Date.now();
    var modalDiv = document.createElement("div");
    modalDiv.id = modalId;
    modalDiv.className = "fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 transition-opacity duration-300 opacity-0 pointer-events-none";
    modalDiv.setAttribute("role", "dialog");
    modalDiv.setAttribute("aria-modal", "true");

    var inputHtml = "";
    if (options.showInput) {
      var placeholder = options.inputPlaceholder || "";
      inputHtml = 
        '<div class="mt-4">' +
          '<input type="text" id="global-modal-input" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-outline-variant/60 dark:border-slate-800 rounded-lg text-sm text-on-surface dark:text-slate-100 placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors" placeholder="' + placeholder + '" autocomplete="off">' +
        '</div>';
    }

    var modalContent = 
      '<div class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl transform scale-95 transition-transform duration-300">' +
        '<h3 class="headline-md font-semibold text-on-surface dark:text-slate-100 flex items-center gap-2">' +
          '<span class="material-symbols-outlined ' + iconClass + '">' + iconName + '</span>' +
          '<span>' + title + '</span>' +
        '</h3>' +
        '<div class="body-md text-on-surface-variant dark:text-slate-300 mt-3 whitespace-pre-line">' + text + '</div>' +
        inputHtml +
        '<div class="mt-6 flex items-center justify-end gap-3">';
    
    if (isConfirm) {
      modalContent += 
          '<button class="px-4 py-2 rounded-lg border border-outline-variant/45 dark:border-slate-700 text-on-surface dark:text-slate-300 label-sm font-semibold hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors" type="button" id="global-modal-cancel">' + cancelText + '</button>' +
          '<button class="px-4 py-2 rounded-lg ' + btnClass + ' label-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2" type="button" id="global-modal-confirm">' +
            '<span class="btn-spinner hidden w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>' +
            '<span class="btn-text">' + confirmText + '</span>' +
          '</button>';
    } else {
      modalContent += 
          '<button class="px-5 py-2 rounded-lg ' + btnClass + ' label-sm font-semibold shadow-sm hover:shadow-md transition-all" type="button" id="global-modal-ok">' + confirmText + '</button>';
    }

    modalContent += '</div></div>';
    modalDiv.innerHTML = modalContent;
    document.body.appendChild(modalDiv);

    // Fade in
    setTimeout(function() {
      modalDiv.classList.remove("opacity-0", "pointer-events-none");
      modalDiv.querySelector("div").classList.remove("scale-95");
    }, 10);

    return {
      element: modalDiv,
      close: function() {
        modalDiv.classList.add("opacity-0", "pointer-events-none");
        modalDiv.querySelector("div").classList.add("scale-95");
        setTimeout(function() {
          if (modalDiv.parentNode) modalDiv.parentNode.removeChild(modalDiv);
        }, 300);
      }
    };
  }

  window.PetAI_confirm = function (options) {
    if (typeof options === "string") {
      options = { text: options };
    }
    return new Promise(function (resolve) {
      var modal = createDynamicModal(options, true);
      var confirmBtn = modal.element.querySelector("#global-modal-confirm");
      var cancelBtn = modal.element.querySelector("#global-modal-cancel");
      var spinner = confirmBtn.querySelector(".btn-spinner");
      var inputEl = modal.element.querySelector("#global-modal-input");

      if (options.showInput && options.requiredInput) {
        confirmBtn.disabled = true;
        confirmBtn.classList.add("opacity-50", "cursor-not-allowed");
        
        inputEl.addEventListener("input", function () {
          var val = inputEl.value.trim().toLowerCase();
          var match = false;
          if (Array.isArray(options.requiredInput)) {
            match = options.requiredInput.some(function (item) {
              return String(item).trim().toLowerCase() === val;
            });
          } else {
            match = (val === String(options.requiredInput).trim().toLowerCase());
          }
          if (match) {
            confirmBtn.disabled = false;
            confirmBtn.classList.remove("opacity-50", "cursor-not-allowed");
          } else {
            confirmBtn.disabled = true;
            confirmBtn.classList.add("opacity-50", "cursor-not-allowed");
          }
        });
      }

      function handleCancel() {
        modal.close();
        resolve(false);
      }

      cancelBtn.addEventListener("click", handleCancel);

      confirmBtn.addEventListener("click", function () {
        var resultValue = true;
        if (options.showInput && inputEl) {
          resultValue = inputEl.value.trim();
        }
        
        if (options.onConfirm) {
          // Show spinner, disable buttons
          confirmBtn.disabled = true;
          cancelBtn.disabled = true;
          if (spinner) spinner.classList.remove("hidden");
          
          Promise.resolve(options.onConfirm(resultValue))
            .then(function (res) {
              modal.close();
              resolve(res !== false ? resultValue : false);
            })
            .catch(function (err) {
              console.error("onConfirm error:", err);
              confirmBtn.disabled = false;
              cancelBtn.disabled = false;
              if (spinner) spinner.classList.add("hidden");
            });
        } else {
          modal.close();
          resolve(resultValue);
        }
      });

      // Close on clicking backdrop
      modal.element.addEventListener("click", function (e) {
        if (e.target === modal.element && !cancelBtn.disabled) {
          handleCancel();
        }
      });

      // Auto-focus input if shown
      if (options.showInput && inputEl) {
        setTimeout(function () {
          inputEl.focus();
        }, 50);
      }
    });
  };

  window.PetAI_alert = function (options) {
    if (typeof options === "string") {
      options = { text: options };
    }
    return new Promise(function (resolve) {
      var modal = createDynamicModal(options, false);
      var okBtn = modal.element.querySelector("#global-modal-ok");

      function handleClose() {
        modal.close();
        resolve(true);
        if (options.onClose) {
          try { options.onClose(); } catch (e) { console.error(e); }
        }
      }

      okBtn.addEventListener("click", handleClose);

      // Close on clicking backdrop
      modal.element.addEventListener("click", function (e) {
        if (e.target === modal.element) {
          handleClose();
        }
      });
    });
  };

  window.PetAI_i18n = {
    t: t,
    setLanguage: setLanguage,
    getCurrentLang: function () {
      return currentLang;
    },
    getTranslations: function () {
      return TRANSLATIONS;
    },
    applyToElement: applyToElement,
    translateBreed: translateBreedViToEn,
    translateDynamicToast: translateDynamicToast,
    updateDynamicContentVisibility: updateDynamicContentVisibility,
    viToEnBreeds: VI_TO_EN_BREEDS
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bootstrap();
      try {
        updateDynamicContentVisibility(currentLang);
      } catch (e) { }
    });
  } else {
    bootstrap();
    try {
      updateDynamicContentVisibility(currentLang);
    } catch (e) { }
  }
})();
