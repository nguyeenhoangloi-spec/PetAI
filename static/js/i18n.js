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
    vi: {
      homePageTitle: "PetAI | Nhận diện giống chó thông minh",
      homeHeroTag: "ĐỀ TÀI: NHẬN DIỆN GIỐNG CHÓ",
      homeHeroTitle: "NHẬN DIỆN GIỐNG CHÓ",
      homeHeroDesc:
        "Xác định chó thuần chủng và chó lai từ ảnh đầu vào, trả về Top-3 giống cùng độ tin cậy và giải thích trực quan.",
      homeStartBtn: "Bắt đầu nhận diện",
      homeHowItWorks: "Cách hoạt động",
      homeAccuracy: "ĐỘ CHÍNH XÁC",
      homeTryNow: "Thử ngay",
      homeFeaturesTitle: "Điều gì làm PetAI nổi bật?",
      homeFeaturesSub: "Trải nghiệm nhận diện nhanh, rõ ràng và dễ hiểu.",
      homeFeature1Title: "Nhận diện nhanh",
      homeFeature2Title: "Top-3 giống",
      homeFeature3Title: "Giải thích trực quan",
      homeFeature4Title: "Lưu lịch sử",
      homeDetail1Title: "Nhận diện nhanh, rõ trong vài giây",
      homeDetail1Desc:
        "PetAI phân tích ảnh và trả về kết quả rõ ràng, giúp bạn nhận diện giống chó nhanh chóng.",
      homeDetail1Point1: "Xử lý ảnh nhanh, không chờ lâu",
      homeDetail1Point2: "Top-3 kết quả kèm độ tin cậy",
      homeDetail1Point3: "Gợi ý vùng đặc trưng dễ hiểu",
      homeDemoTitle: "MINH HỌA KẾT QUẢ",
      homeViewHistory: "Xem lịch sử nhận diện",
      homeDetail2Title: "Top-3 giống để dễ so sánh",
      homeDetail2Desc:
        "Hệ thống trả về 3 giống có khả năng xuất hiện cao nhất, hữu ích cho trường hợp chó lai.",
      homeDetail2Point1: "Kết quả sắp xếp theo độ tin cậy",
      homeDetail2Point2: "So sánh nhanh giữa các giống gần nhau",
      homeDetail2Point3: "Gợi ý phù hợp cho chó lai",
      homeTop3Title: "TOP-3 GỢI Ý",
      homeDemoDisclaimer: "Kết quả minh họa, tỷ lệ có thể thay đổi.",
      homeDetail3Title: "Giải thích trực quan, dễ hiểu",
      homeDetail3Desc:
        "Làm nổi bật vùng đặc trưng giúp bạn hiểu vì sao AI đưa ra kết quả.",
      homeDetail3Point1: "Highlight vùng tai, mắt, mõm",
      homeDetail3Point2: "Hình ảnh trực quan, dễ theo dõi",
      homeDetail3Point3: "Tăng độ tin cậy khi tham khảo",
      homeHighlightedRegions: "VÙNG NỔI BẬT",
      homeDemoRegionDesc: "Vùng tai và mắt được đánh dấu rõ ràng.",
      homeDemoHeatmapDesc: "Mô phỏng minh họa heatmap.",
      homeDetail4Title: "Lưu lịch sử để tra cứu lại",
      homeDetail4Desc:
        "Xem lại các lần nhận diện trước đó, tiện so sánh và chia sẻ.",
      homeDetail4Point1: "Lưu kết quả tự động theo thời gian",
      homeDetail4Point2: "Lọc nhanh theo giống hoặc ngày",
      homeDetail4Point3: "Chia sẻ kết quả với bạn bè",
      homeRecentHistoryTitle: "LỊCH SỬ GẦN NHẤT",
      homeOpenHistoryBtn: "Mở lịch sử",
      homeCommunityTitle: "ĐƯỢC TIN DÙNG BỞI CỘNG ĐỒNG YÊU THÚ CƯNG",
      homeCommunitySub:
        "PetAI hỗ trợ người nuôi chó, cửa hàng thú cưng và phòng khám thú y ra quyết định nhanh hơn từ ảnh chụp thực tế.",
      homeStatsUsers: "NGƯỜI DÙNG",
      homeStatsUsersDesc: "Tài khoản đã đăng ký",
      homeStatsPredictions: "DỰ ĐOÁN",
      homeStatsPredictionsDesc: "Lượt nhận diện đã xử lý",
      homeStatsAccuracyDesc: "Tối ưu cho chó thuần và chó lai",
      homeStatsSupport: "HỖ TRỢ",
      homeStatsSupportDesc: "Hỗ trợ trong quá trình sử dụng",
      homeCoreValuesTitle: "GIÁ TRỊ CỐT LÕI",
      homeCoreValuesSub:
        "Nhận diện nhanh, rõ ràng, dễ hiểu với công nghệ học sâu tiên tiến.",
      homeCoreValue1Tag: "01 / DỮ LIỆU",
      homeCoreValue1Title: "120+ giống chó",
      homeCoreValue1Desc:
        "Phân loại đầy đủ các giống phổ biến và nhận diện chó lai với kho dữ liệu khổng lồ.",
      homeCoreValue2Tag: "02 / KẾT QUẢ",
      homeCoreValue2Title: "Top-3 kết quả",
      homeCoreValue2Desc:
        "Trả về 3 giống có khả năng cao nhất, tối ưu cho chó lai.",
      homeCoreValue3Tag: "03 / TRỰC QUAN",
      homeCoreValue3Desc:
        "Làm nổi bật các vùng đặc trưng (tai, mắt, mõm) giúp AI nhận diện giống chó chính xác.",
      homeCoreValue4Tag: "04 / BẢO MẬT",
      homeCoreValue4Title: "Bảo vệ dữ liệu",
      homeCoreValue4Desc:
        "Ảnh tải lên được xử lý an toàn và chỉ dùng cho mục đích nhận diện.",
      homeCoreValue5Tag: "05 / HIỆU NĂNG",
      homeCoreValue5Title: "Xử lý tức thì",
      homeCoreValue5Desc:
        "Kết quả rõ trong vài giây nhờ hệ thống tối ưu hóa hiệu năng cao.",
      homePricingTitle: "BẢNG GIÁ MINH BẠCH",
      homePricingSub: "Chọn gói phù hợp với nhu cầu nhận diện của bạn.",
      homeForever: "vĩnh viễn",
      homePlanFreeScans: "10 lượt nhận diện",
      homePlanFreeAds: "Tối đa 3 lần xem QC",
      homePlanFreeSuit: "Phù hợp dùng thử",
      homePlanFreeBtn: "Bắt đầu",
      homePricing7Days: "7 ngày",
      homePricing30Days: "30 ngày",
      homePricing90Days: "90 ngày",
      homePlanEntScans: "Không giới hạn lượt",
      homePlanChooseBtn: "Chọn gói",
      homePlanProBtn: "Chọn Pro",
      homeWorkflowTitle: "Quy trình nhận diện",
      homeWorkflowSub:
        "Từ ảnh đầu vào đến kết quả cuối cùng chỉ trong vài giây.",
      homeStep1Tag: "BƯỚC 1 - TẢI ẢNH",
      homeStep1Title: "Tải ảnh rõ nét",
      homeStep1Desc: "Chụp ảnh chính diện, ánh sáng tốt để tăng độ chính xác.",
      homeStep1Status: "SẴN SÀNG",
      homeStep2Tag: "BƯỚC 2 - AI PHÂN TÍCH",
      homeStep2Title: "Mô hình YOLOv8 + phân loại",
      homeStep2Desc:
        "Phát hiện chó và phân loại giống theo đặc trưng khuôn mặt.",
      homeStep2Status: "Xử lý tức thì",
      homeStep3Tag: "BƯỚC 3 - TRẢ KẾT QUẢ",
      homeStep3Title: "Top-3 giống & độ tin cậy",
      homeStep3Status: "Hoàn thành",
      homeAudienceTitle: "Phù hợp cho nhiều nhóm người dùng",
      homeAudience1Title: "Người nuôi thú cưng",
      homeAudience1Desc:
        "Kiểm tra nhanh giống chó để theo dõi chăm sóc và định hướng huấn luyện.",
      homeAudience2Title: "Cửa hàng thú cưng",
      homeAudience2Desc:
        "Hỗ trợ tư vấn cho khách dựa trên kết quả AI rõ ràng và dễ hiểu.",
      homeAudience3Title: "Phòng khám thú y",
      homeAudience3Desc:
        "Có thêm dữ liệu tham khảo ban đầu trước khi tiếp nhận và đánh giá.",
      homeFaqTitle: "CÂU HỎI THƯỜNG GẶP",
      homeFaqSub: "Giải đáp nhanh các thắc mắc về PetAI.",
      homeFaq1Q: "Kết quả có chính xác 100% không?",
      homeFaq1A:
        "Không. Hệ thống AI trả về kết quả dựa trên xác suất từ kho dữ liệu huấn luyện. Chúng tôi cung cấp Top-3 giống có độ tin cậy cao nhất để người dùng có cái nhìn khách quan và tham khảo tốt hơn, đặc biệt hữu ích với trường hợp chó lai.",
      homeFaq2Q: "Mất bao lâu để có kết quả?",
      homeFaq2A:
        "Hệ thống được tối ưu hóa để trả về kết quả chỉ trong vòng vài giây (thường từ 2-5 giây) sau khi ảnh được tải lên thành công. Tốc độ này có thể thay đổi nhẹ tùy thuộc vào tốc độ mạng của bạn và kích thước file ảnh.",
      homeFaq3Q: "Ảnh tải lên được xử lý như thế nào?",
      homeFaq3A:
        "Mỗi hình ảnh bạn tải lên đều được mã hóa và truyền tải qua giao thức bảo mật. PetAI cam kết chỉ sử dụng ảnh cho mục đích nhận diện giống chó và không chia sẻ dữ liệu cá nhân của bạn với bất kỳ bên thứ ba nào khi chưa có sự đồng ý.",
      homeFaq4Q: "PetAI có hỗ trợ chó lai không?",
      homeFaq4A:
        "Có, PetAI được thiết kế đặc biệt để xử lý cả chó thuần chủng và chó lai. Với chó lai, hệ thống sẽ phân tích các đặc điểm hình thái và hiển thị Top-3 giống chó có đặc điểm tương đồng nhất kèm theo tỷ lệ phần trăm tin cậy cho mỗi giống.",
      homeCtaSub: "Rõ trong vài giây",
      homeCtaDesc:
        "Top-3 giống, độ tin cậy rõ ràng. Tham gia cùng cộng đồng hàng ngàn người yêu thú cưng đang sử dụng PetAI mỗi ngày.",
      homeStartFreeBtn: "Bắt đầu miễn phí",
      homeGuideBtn: "Hướng dẫn sử dụng",
      lockAccountBtn: "Khoá tài khoản",
      unlockAccountBtn: "Mở khoá tài khoản",
      deleteUserBtn: "Xoá người dùng",
      reportedTransfer: "Đã báo chuyển",
      pendingConfirmOrders: "Đơn chờ duyệt",
      confirmPaymentTitle: "Xác nhận thanh toán",
      confirmPaymentSub: "Vui lòng kiểm tra gói dịch vụ đã chọn và tiếp tục",
      adUnlockRemaining: "Unlock còn",
      adViewsUsed: "Ads đã xem",
      adsWatchedLabel: "Quảng cáo đã xem",

      /* ── Language switcher ── */
      success: "Thành công",
      error: "Lỗi",
      warning: "Cảnh báo",
      info: "Thông tin",
      close: "Đóng",
      languageLabel: "Tiếng Việt",
      languageFlag: "🇻🇳",
      shortLabel: "VN",

      /* ── Nav top-level ── */
      home: "Trang chủ",
      product: "Sản phẩm",
      features: "Tính năng",
      pricing: "Bảng giá",
      about: "Giới thiệu",
      login: "Đăng nhập",
      register: "Đăng ký",
      logout: "Đăng xuất",
      dashboard: "Bảng điều khiển",
      predict: "Nhận diện",
      history: "Lịch sử",
      statistics: "Thống kê",
      upgrade: "Nâng cấp",
      payments: "Lịch sử thanh toán",
      manageUsers: "Người dùng",
      approveOrders: "Đơn duyệt",
      systemConfig: "Cấu hình",
      sysConfigTitle: "Cấu hình hệ thống",
      sysConfigPageTitle: "Cấu hình hệ thống - PetAI",
      sysConfigDesc: "Quản lý cài đặt logo, email liên hệ, gói cước dịch vụ và nội dung các trang điều khoản pháp lý.",
      sysTabGeneral: "Cấu hình chung",
      sysTabPlans: "Gói cước dịch vụ",
      sysTabLegal: "Các trang chính sách & điều khoản",
      sysLogoTitle: "Logo website",
      sysLogoDesc: "Thay đổi hình ảnh logo hiển thị trên thanh tiêu đề và chân trang website.",
      sysLogoCurrent: "Logo hiện hành",
      sysLogoUploadNew: "Tải lên logo mới",
      sysLogoUpdateBtn: "Cập nhật logo",
      sysContactTitle: "Cấu hình liên lạc",
      sysContactDesc: "Thiết lập các thông tin liên lạc chính của website hiển thị tới người dùng.",
      sysContactEmailLabel: "Email liên hệ / hỗ trợ",
      sysSaveSettingsBtn: "Lưu cài đặt",
      sysPlansTitle: "Gói cước dịch vụ",
      sysPlansDesc: "Thay đổi đơn giá, số ngày sử dụng và hạn mức lượt quét cho từng gói thành viên đăng ký.",
      sysPlanPriceVnd: "Giá gói (VNĐ)",
      sysPlanDurationDays: "Thời gian dùng (Ngày)",
      sysPlanScanLimit: "Hạn mức quét (Lượt)",
      sysPlanEntScanNote: "Hạn mức quét (Gõ 'unlimited' nếu không giới hạn)",
      sysPlanBasic: "Gói Cơ Bản (Basic)",
      sysPlanPro: "Gói Chuyên Nghiệp (Pro)",
      sysPlanEnterprise: "Gói Doanh nghiệp (Enterprise)",
      sysSavePlansBtn: "Lưu cấu hình gói",
      sysLegalTitle: "Nội dung trang pháp lý & điều khoản",
      sysLegalDesc: "Biên soạn nội dung trực tiếp cho các trang pháp luật của hệ thống bằng mã HTML/Văn bản.",
      sysLegalSelectLabel: "Chọn trang cần soạn thảo:",
      sysLegalOptPrivacy: "Chính sách quyền riêng tư",
      sysLegalOptTerms: "Điều khoản sử dụng",
      sysLegalOptPayment: "Chính sách thanh toán",
      sysLegalOptDeletion: "Chính sách xóa dữ liệu",
      sysLegalOptSupport: "Trang Hỗ trợ",
      sysLegalOptContact: "Trang Liên hệ",
      sysLegalOptUserGuide: "Hướng dẫn sử dụng",
      sysDescPrivacy: "Quy định cách thu thập, bảo mật và sử dụng thông tin cá nhân của người dùng.",
      sysDescTerms: "Các điều khoản và quy định pháp lý ràng buộc giữa người dùng và ứng dụng PetAI.",
      sysDescPayment: "Quy trình thanh toán, nâng cấp tài khoản và chính sách hoàn tiền.",
      sysDescDeletion: "Quy trình và chính sách hỗ trợ người dùng xóa tài khoản cùng dữ liệu lưu trữ.",
      sysDescUserGuide: "Cung cấp cẩm nang chi tiết cách sử dụng các chức năng phân tích và chẩn đoán.",
      sysDescSupport: "Giải đáp các thắc mắc thường gặp và hỗ trợ kỹ thuật cho người dùng.",
      sysDescContact: "Thông tin liên lạc chính thức, địa chỉ và kênh hỗ trợ trực tiếp của PetAI.",
      sysViewPage: "Xem trang",
      sysEditPage: "Chỉnh sửa",
      sysLangVi: "Tiếng Việt (VI)",
      sysLangEn: "English (EN)",
      sysAutoTranslateBtn: "Dịch tự động sang tiếng Anh",
      sysLegalContentLabel: "Nội dung HTML / Văn bản",
      sysLegalNote: "Lưu ý: Để trống sẽ tự phục hồi theo bản dịch mặc định trong i18n.js",
      sysSaveLegalBtn: "Lưu nội dung trang",
      adminGroupTitle: "QUẢN TRỊ",

      /* ── Sidebar ── */
      quickAccess: "Truy cập nhanh",
      uploadAnalyze: "Phân tích",
      predictionHistory: "Lịch sử",
      personalStats: "Thống kê",
      upgradePlan: "Nâng cấp",
      personalInfo: "Thông tin cá nhân",
      accountSettings: "Cài đặt",
      sidebarPreferencesTitle: "TÙY CHỌN",
      sidebarLanguageLabel: "Ngôn ngữ",
      sidebarNightModeLabel: "Chế độ tối",

      /* ── Header ── */
      searchPlaceholder: "Tìm kiếm...",
      uploadPhotoBtn: "Nhận diện",

      /* ── Avatar dropdown ── */
      role: "Vai trò:",
      plan: "Gói:",

      /* ── Footer ── */
      aboutPetAI: "Về PetAI",
      connect: "Kết nối",
      identifyNow: "Nhận diện ngay",
      collection: "Bộ sưu tập",
      privacy: "Chính sách quyền riêng tư",
      terms: "Điều khoản sử dụng",
      paymentPolicy: "Chính sách thanh toán",
      dataDeletion: "Chính sách xóa dữ liệu",
      support: "Hỗ trợ",
      contact: "Liên hệ",
      userGuide: "Hướng dẫn sử dụng",
      copyright: "Bản quyền © 2026 PetAI. Mọi quyền được bảo lưu",
      footerUserGuide: "HƯỚNG DẪN SỬ DỤNG",
      footerTerms: "ĐIỀU KHOẢN",
      footerPrivacy: "BẢO MẬT",
      footerPayment: "THANH TOÁN",
      footerDataDeletion: "CHÍNH SÁCH XÓA DỮ LIỆU",
      footerSupport: "HỖ TRỢ",
      footerContact: "LIÊN HỆ",
      footerDesc:
        "Ứng dụng nhận diện giống chó bằng AI dành cho người yêu thú cưng. Kết quả chính xác, nhanh chóng.",
      historyScan: "Lịch sử nhận dạng",
      servicePlans: "Gói dịch vụ",
      contactInfoTitle: "Thông tin liên hệ",
      contactEmail: "Email: support@tienphongtech.vn",
      contactPhone: "Điện thoại: 0916 416 409",
      contactAddress: "Địa chỉ: P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, Phường Cái Răng, TP. Cần Thơ",
      paymentPolicyPageTitle: "Chính sách thanh toán | PetAI",
      paymentUpdateDatePrefix: "Ngày cập nhật: 20/06/2026",
      paymentSection1Title: "1. Phương thức thanh toán",
      paymentSection1Desc: "Hệ thống hỗ trợ thanh toán qua hình thức chuyển khoản ngân hàng bằng mã VietQR tự động hoặc chuyển khoản trực tiếp với thông tin được hiển thị chi tiết khi nâng cấp gói.",
      paymentSection2Title: "2. Quy trình xử lý giao dịch",
      paymentSection2Desc: "Sau khi chuyển khoản đúng số tiền và nội dung ghi chú theo hướng dẫn, hệ thống VietQR tự động sẽ ghi nhận và kích hoạt gói dịch vụ trong vòng từ 1 đến 5 phút. Trong trường hợp giao dịch cần duyệt thủ công từ quản trị viên, thời gian xử lý có thể kéo dài tối đa 24 giờ làm việc.",
      paymentSection3Title: "3. Chính sách hoàn tiền",
      paymentSection3Desc: "Chúng tôi thực hiện hoàn tiền trong các trường hợp sau: (a) Lỗi hệ thống phát sinh khiến giao dịch bị trừ tiền nhưng tài khoản không được kích hoạt gói dịch vụ và không thể khắc phục kỹ thuật; (b) Người dùng chuyển khoản thừa tiền so với giá trị gói dịch vụ đăng ký. Mọi yêu cầu hoàn trả vui lòng gửi về email support@pet.ai kèm theo ảnh chụp biên lai giao dịch để được đối soát và xử lý trong vòng 3-5 ngày làm việc.",
      paymentSection4Title: "4. Bảo mật giao dịch",
      paymentSection4Desc: "Mọi giao dịch thanh toán được thực hiện an toàn qua cổng tích hợp, thông tin tài khoản ngân hàng và nội dung giao dịch được xử lý bảo mật theo tiêu chuẩn mã hóa SSL/TLS, cam kết không lưu giữ thông tin nhạy cảm của khách hàng.",
      paymentSection5Title: "5. Giải quyết tranh chấp và khiếu nại",
      paymentSection5Desc: "Mọi vấn đề khiếu nại liên quan đến thanh toán, vui lòng cung cấp mã đơn hàng (Order Code) và minh chứng chuyển khoản gửi tới bộ phận hỗ trợ khách hàng để được giải quyết nhanh nhất.",

      /* ── Dashboard ── */
      dashWelcomeDesc:
        "Theo dõi nhanh hoạt động nhận diện, lịch sử và hiệu suất dự đoán của bạn.",
      uploadNew: "Tải ảnh mới",
      viewHistory: "Xem lịch sử",

      /* Dashboard admin stat cards */
      totalRevenue: "Tổng doanh thu",
      revenueFromPaid: "Từ các gói đã thanh toán",
      totalUsers: "Tổng người dùng",
      registeredAccounts: "Tài khoản đã đăng ký",
      newThisWeek: "mới tuần này",
      pendingOrders: "Đơn chờ duyệt",
      viewPendingList: "Xem danh sách chờ duyệt",
      todayNew: "hôm nay",
      totalSystemPredictions: "Tổng dự đoán hệ thống",
      allSystemScans: "Toàn bộ lượt quét của hệ thống",
      todayCount: "hôm nay",

      /* Dashboard user stat cards */
      totalPredictions: "Tổng dự đoán",
      yourScans: "Lượt quét của riêng bạn",
      avgConfidence: "Độ tin cậy TB",
      avgAccuracy: "Độ chính xác trung bình",
      breedsAnalyzed: "Giống đã phân tích",
      uniqueBreedsFound: "Giống chó khác nhau bạn nhận diện",
      viewReport: "Xem báo cáo",
      detailedStats: "Thống kê chi tiết",
      deepAnalysis: "Phân tích sâu về lịch sử quét của bạn",

      /* Dashboard charts */
      financialAnalytics: "Phân tích Tài chính",
      revenueAndPlans: "Doanh thu & phân bổ gói dịch vụ",
      revenueTrend: "Xu hướng Doanh thu",
      revenueTrendSubtitle: "Tổng tiền từ đơn đã thanh toán (VND)",
      days7: "7 ngày",
      days30: "30 ngày",
      days90: "90 ngày",
      months12: "12 tháng",
      custom: "Tùy chọn",
      selectDateRange: "Chọn khoảng thời gian",
      fromDate: "Từ ngày",
      toDate: "Đến ngày",
      apply: "Áp dụng",
      subscriptionDistribution: "Phân bổ Gói đăng ký",
      subscriptionByUser: "Tỷ lệ người dùng theo từng gói",
      planDetails: "Chi tiết gói dịch vụ",
      activityCharts: "Biểu đồ hoạt động",
      liveUpdate: "Cập nhật trực tiếp",
      predTrend7: "Xu hướng dự đoán 7 ngày gần đây",
      predTrendSubtitle: "Số lượng ảnh đã nhận diện mỗi ngày",
      last7days: "7 ngày qua",
      top5Breeds: "Top 5 giống phổ biến nhất",
      top5BreedsSubtitle: "Các giống chó được nhận diện nhiều nhất",
      confidenceDist: "Phân bố độ tin cậy",
      confidenceDistSubtitle: "Mức độ tin cậy của thuật toán phân loại",
      recentResults: "Kết quả gần đây",
      viewAll: "Xem tất cả",
      today: "Hôm nay",
      yesterday: "Hôm qua",
      last7daysTab: "7 ngày gần đây",
      emptyDashboard:
        "Bạn chưa có lịch sử nhận diện nào. Hãy bắt đầu bằng cách tải ảnh mới.",
      predictionLabel: "Dự đoán:",

      /* ── History page ── */
      historyTitle: "Lịch sử nhận diện",
      totalPredictionsLabel: "Tổng nhận diện",
      imageScanCount: "Lượt phân tích ảnh",
      pureDog: "Chó thuần",
      pureBreed: "Giống thuần",
      hybridDog: "Chó lai",
      hybridBreed: "Giống nghi lai phối",
      avgConfidenceLabel: "Độ tin cậy TB",
      avgAccuracyLabel: "Độ chính xác trung bình",
      identificationList: "Danh sách nhận diện",
      newIdentification: "Nhận diện mới",
      all: "Tất cả",
      searchBreed: "Tìm kiếm giống...",
      clearSearch: "Xoá tìm kiếm",
      viewDetail: "Xem chi tiết",
      emptyHistory: "Chưa có lịch sử nhận diện",
      emptyHistoryDesc:
        "Hãy tải ảnh đầu tiên để bắt đầu hành trình dự đoán giống chó.",
      startNow: "Bắt đầu ngay",

      /* History modal */
      modalBreedLabel: "Giống:",
      modalConfLabel: "Độ tin cậy:",
      modalDateLabel: "Ngày:",
      modalSpeciesLabel: "Loài:",
      close: "Đóng",
      deleteBtn: "Xóa",
      deleteConfirm: "Bạn có chắc muốn xóa bản ghi nhận diện này không?",

      /* ── Statistics page ── */
      statsTitle: "Thống kê nhận diện của bạn",
      statsSubtitle:
        "Tổng quan số lần dự đoán, độ tin cậy và top giống chó phổ biến.",
      exportReport: "Xuất báo cáo",
      totalScans: "Tổng lượt nhận diện",
      totalScansLabel: "Tổng số lần nhận diện",
      avgConfStat: "Độ tin cậy TB",
      avgAccStat: "Độ chính xác trung bình",
      breedsExplored: "Giống đã khám phá",
      uniqueBreeds: "Giống chó khác nhau",
      recentActivity: "Hoạt động gần đây",
      recentActivityLabel: "Lượt nhận diện gần nhất",
      activityChart: "Biểu đồ hoạt động",
      trendTitle: "Xu hướng nhận diện",
      trendSubtitle: "Số lượng ảnh đã nhận diện mỗi ngày",
      noDataInRange: "Chưa có dữ liệu trong khoảng thời gian này.",
      top5BreedsTitle: "Top 5 giống phổ biến nhất",
      top5BreedsDesc: "Các giống chó được nhận diện nhiều nhất",
      noTopBreedData: "Chưa có đủ dữ liệu để hiển thị top giống.",
      confidenceDistTitle: "Phân bố độ tin cậy",
      confidenceDistDesc: "Mức độ tin cậy của thuật toán phân loại",
      breedDistTitle: "Phân bố giống chó",
      breedDistDesc: "Tỉ lệ các giống chó được nhận diện",
      noDataChart: "Chưa có dữ liệu",
      recentResultsTitle: "Kết quả gần đây",
      noActivity: "Chưa có hoạt động nào!",
      noActivityDesc:
        "Hãy tải ảnh thú cưng lên để bắt đầu nhận diện giống chó.",
      timesCount: "lần",

      /* ── Settings page ── */
      settingsTitle: "Cài đặt tài khoản",
      profileSection: "Thông tin cá nhân",
      fullnameLabel: "Họ và tên",
      fullnameHint: "Tên này hiển thị trên hồ sơ và thanh điều hướng.",
      usernameLabel: "Tên đăng nhập",
      usernameLocked: "Không thể thay đổi tên đăng nhập.",
      emailLabel: "Email",
      appearanceSection: "Giao diện",
      themeLabel: "Chủ đề",
      themeLight: "Sáng",
      themeDark: "Tối",
      themeAuto: "Tự động",
      privacySection: "Quyền riêng tư",
      historyStorage: "Lưu trữ lịch sử",
      historyStorageDesc:
        "Dữ liệu ảnh và kết quả dự đoán được lưu trong lịch sử. Bạn có thể xóa toàn bộ bất cứ lúc nào.",
      viewHistoryLink: "Xem lịch sử",
      clearAllHistory: "Xóa toàn bộ lịch sử",
      cancel: "Hủy",
      saveChanges: "Lưu thay đổi",
      saving: "Đang lưu...",
      deleting: "Đang xóa...",
      clearHistoryConfirm:
        "Bạn có chắc muốn xóa toàn bộ lịch sử nhận diện? Hành động này không thể hoàn tác.",
      infoSidebarLink: "Thông tin",
      appearanceSidebarLink: "Giao diện",
      privacySidebarLink: "Quyền riêng tư",
      changePasswordTitle: "Thay đổi mật khẩu",
      currentPasswordLabel: "Mật khẩu hiện tại",
      currentPasswordPlaceholder: "Nhập mật khẩu hiện tại",
      newPasswordLabel: "Mật khẩu mới",
      newPasswordPlaceholder: "Nhập mật khẩu mới (>= 6 ký tự)",
      confirmNewPasswordLabel: "Xác nhận mật khẩu mới",
      confirmNewPasswordPlaceholder: "Xác nhận mật khẩu mới",
      notificationsSection: "Cài đặt thông báo",
      systemNotificationsLabel: "Thông báo hệ thống",
      systemNotificationsDesc: "Nhận thông báo trực tiếp trên giao diện khi có hoạt động mới.",
      emailNotificationsLabel: "Thông báo qua Email",
      emailNotificationsDesc: "Nhận các báo cáo thống kê và cập nhật tài khoản qua thư điện tử.",
      subscriptionUpgradeBtn: "Nâng cấp gói",

      /* ── Login page ── */
      loginTitle: "Đăng nhập tài khoản",
      loginSubtitle: "Chào mừng bạn quay lại! Vui lòng nhập thông tin.",
      usernameOrEmail: "Tên đăng nhập hoặc email",
      usernamePlaceholder: "vd: username hoặc email@example.com",
      passwordLabel: "Mật khẩu",
      passwordPlaceholder: "Nhập mật khẩu",
      forgotPassword: "Quên mật khẩu?",
      rememberLogin: "Ghi nhớ đăng nhập",
      loginBtn: "Đăng nhập",
      orContinueWith: "hoặc tiếp tục với",
      loginWithGoogle: "Đăng nhập bằng Google",
      noAccount: "Chưa có tài khoản?",
      registerNow: "Đăng ký ngay",

      /* Login - left panel */
      loginLeftTitle: "Nhận diện giống chó nhanh và chính xác",
      loginLeftSubtitle:
        "Trợ lý thông minh giúp bạn nhận diện và hiểu hơn về thú cưng của mình.",
      loginFeature1Title: "Điểm tin cậy rõ ràng",
      loginFeature1Desc: "Phân tích chi tiết từ AI",
      loginFeature2Title: "Lịch sử quét",
      loginFeature2Desc: "Lưu lại các kết quả nhận diện",

      /* Login validation */
      usernameShort: "Tên đăng nhập/email cần ít nhất 3 ký tự.",
      passwordShort: "Mật khẩu cần ít nhất 6 ký tự.",

      /* ── Register page ── */
      registerTitle: "Tạo tài khoản mới",
      registerSubtitle:
        "Điền thông tin bên dưới để bắt đầu nhận diện giống chó.",
      fullnameLabelReg: "Họ và tên",
      fullnamePlaceholder: "Nguyễn Văn A",
      usernameLabelReg: "Tên đăng nhập",
      usernamePlaceholderReg: "3-20 ký tự, chữ/số/_",
      passwordLabelReg: "Mật khẩu",
      passwordPlaceholderReg: "Ít nhất 6 ký tự",
      confirmPassword: "Xác nhận mật khẩu",
      confirmPasswordPlaceholder: "Nhập lại mật khẩu",
      agreeTerms: "Tôi đồng ý với điều khoản dịch vụ và chính sách bảo mật.",
      createAccount: "Tạo tài khoản",
      registerWithGoogle: "Đăng ký bằng Google",
      alreadyHaveAccount: "Đã có tài khoản?",
      loginNow: "Đăng nhập ngay",

      /* Register left panel */
      regLeftTitle: "Tham gia cộng đồng yêu chó cùng AI",
      regLeftSubtitle:
        "Lưu lịch sử nhận diện, phân tích thói quen và nhận cảnh báo sức khỏe thông minh cho cún cưng của bạn.",
      regFeature1Title: "Chào mừng thành viên mới",
      regFeature1Desc: "Bắt đầu với gói Free ngay hôm nay",
      regFeature2Title: "10 lượt miễn phí",
      regFeature2Desc: "Mỗi tài khoản có sẵn lượt trải nghiệm ban đầu",
      regFeature3Title: "Bảo mật tài khoản",
      regFeature3Desc: "Thông tin cá nhân được bảo vệ an toàn",

      /* Register validation */
      fullnameTooShort: "Họ tên cần ít nhất 2 ký tự.",
      invalidEmail: "Email không hợp lệ.",
      usernameInvalid: "Tên đăng nhập phải 3-20 ký tự (chữ, số, _).",
      passwordTooShort: "Mật khẩu cần ít nhất 6 ký tự.",
      passwordMismatch: "Mật khẩu xác nhận chưa khớp.",

      /* ── Upgrade / Pricing page ── */
      upgradeTitle: "Nâng cấp gói sử dụng",
      upgradeSubtitle: "Chọn gói phù hợp để trải nghiệm đầy đủ tính năng PetAI",
      planFree: "Free",
      planBasic: "Basic",
      planPremium: "Premium",
      planEnterprise: "Enterprise",
      currentPlan: "Gói hiện tại",
      choosePlan: "Chọn gói này",
      perMonth: "/tháng",
      forever: "Mãi mãi",
      mostPopular: "Phổ biến nhất",
      bestValue: "Giá trị nhất",
      upgradePlanBtn: "Nâng cấp",
      buyNow: "Mua ngay",
      contactSales: "Liên hệ mua",

      /* ── Payments / Orders page ── */
      paymentsTitle: "Lịch sử thanh toán",
      paymentsSubtitle: "Danh sách các giao dịch nâng cấp gói của bạn",
      orderCode: "Mã đơn",
      planName: "Gói",
      amount: "Số tiền",
      status: "Trạng thái",
      paymentDate: "Ngày thanh toán",
      action: "Hành động",
      statusPending: "Chờ duyệt",
      statusApproved: "Đã duyệt",
      statusRejected: "Từ chối",
      statusPaid: "Đã thanh toán",
      statusCancelled: "Đã hủy",
      noPayments: "Chưa có giao dịch nào",
      noPaymentsDesc:
        "Bạn chưa thực hiện nâng cấp gói nào. Hãy khám phá các gói dịch vụ.",
      viewPlans: "Xem các gói",
      uploadProof: "Tải minh chứng",
      viewProof: "Xem minh chứng",
      cancelOrder: "Hủy đơn",
      cancelConfirm: "Bạn có chắc muốn hủy đơn hàng này không?",

      /* ── Admin: Manage Users ── */
      usersTitle: "Quản lý người dùng",
      usersSubtitle: "Danh sách tất cả người dùng trong hệ thống",
      searchUser: "Tìm kiếm người dùng...",
      filterAll: "Tất cả",
      filterAdmin: "Admin",
      filterUser: "Người dùng",
      userId: "ID",
      userName: "Tên",
      userEmail: "Email",
      userRole: "Vai trò",
      userPlan: "Gói",
      userScanCount: "Số lượt quét",
      userJoined: "Ngày tham gia",
      userActions: "Hành động",
      viewUser: "Xem chi tiết",
      editUser: "Chỉnh sửa",
      deleteUser: "Xóa người dùng",
      deleteUserConfirm: "Bạn có chắc muốn xóa người dùng này không?",
      noUsers: "Không có người dùng nào",

      /* ── Admin: Confirmations / Approve Orders ── */
      confirmationsTitle: "Duyệt đơn nâng cấp",
      confirmationsSubtitle: "Các đơn hàng đang chờ phê duyệt",
      approve: "Duyệt",
      reject: "Từ chối",
      approveConfirm: "Duyệt đơn này?",
      rejectConfirm: "Từ chối đơn này?",
      noPendingOrders: "Không có đơn nào chờ duyệt",

      /* ── Upload / Predict page ── */
      uploadTitle: "Nhận diện giống chó",
      uploadSubtitle: "Tải ảnh lên để AI phân tích và nhận diện giống chó",
      dragDropHere: "Kéo thả ảnh vào đây",
      orClickToSelect: "hoặc click để chọn ảnh",
      supportedFormats: "Hỗ trợ: JPG, PNG, WEBP. Tối đa 10MB.",
      analyzeBtn: "Phân tích",
      analyzing: "Đang phân tích...",
      resultTitle: "Kết quả nhận diện",
      confidence: "Độ tin cậy",
      breedLabel: "Giống",
      speciesLabel: "Loài",
      analyzeAnother: "Nhận diện ảnh khác",
      saveToHistory: "Lưu vào lịch sử",
      noImageSelected: "Chưa chọn ảnh",
      uploadError: "Có lỗi xảy ra khi tải ảnh lên.",

      /* ── Checkout page ── */
      checkoutTitle: "Thanh toán",
      orderSummary: "Thông tin đơn hàng",
      paymentMethod: "Phương thức thanh toán",
      bankTransfer: "Chuyển khoản ngân hàng",
      uploadTransferProof: "Tải minh chứng chuyển khoản",
      submitOrder: "Gửi đơn hàng",
      processingOrder: "Đang xử lý...",

      /* ── Common ── */
      loading: "Đang tải...",
      error: "Có lỗi xảy ra",
      success: "Thành công",
      retry: "Thử lại",
      back: "Quay lại",
      next: "Tiếp theo",
      confirm: "Xác nhận",
      yes: "Có",
      no: "Không",
      search: "Tìm kiếm",
      filter: "Lọc",
      export: "Xuất",
      share: "Chia sẻ",
      copy: "Sao chép",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      save: "Lưu",
      notDetermined: "Chưa xác định",

      /* ── Forgot password page ── */
      forgotLeftTitle: "Khôi phục mật khẩu",
      forgotLeftSubtitle:
        "Bảo mật tài khoản là ưu tiên hàng đầu. Chúng tôi sẽ hỗ trợ bạn khôi phục nhanh chóng và an toàn.",
      forgotFeature1Title: "Xác thực an toàn",
      forgotFeature1Desc: "Dữ liệu được mã hóa theo tiêu chuẩn bảo mật",
      forgotFeature2Title: "Email khôi phục tức thì",
      forgotFeature2Desc: "Nhận liên kết đặt lại chỉ sau vài giây",
      forgotFeature3Title: "Hỗ trợ 24/7",
      forgotFeature3Desc: "Đội ngũ luôn sẵn sàng khi bạn cần",
      forgotTitle: "Quên mật khẩu",
      forgotSubtitle: "Nhập email để nhận hướng dẫn đặt lại mật khẩu.",
      registeredEmail: "Email đã đăng ký",
      sendInstructions: "Gửi hướng dẫn",
      backToLogin: "Quay lại",
      loginLink: "đăng nhập",

      /* ── Error page ── */
      errorPageTitle: "PetAI - Lỗi",
      errorLabel: "Lỗi",
      errorTitle: "Đã có sự cố",
      errorDefaultDesc:
        "Chúng tôi đang gặp sự cố khi truy xuất dữ liệu. Tài nguyên bạn tìm kiếm có thể đã được chuyển hoặc tạm thời không khả dụng.",
      backToHome: "Quay lại trang chủ",
      checkSystem: "Kiểm tra hệ thống",
      errorRetryLater: "Nếu lỗi vẫn tiếp diễn, vui lòng thử lại sau.",

      /* ── Simulated ad modal ── */
      adUnlockTitle: "Xem quảng cáo để mở khóa lượt nhận diện",
      adUnlockDesc:
        "Bạn đã sử dụng hết 10 lượt miễn phí. Xem một đoạn quảng cáo ngắn để nhận thêm 3 lượt nhận diện AI. (Tối đa 3 lần).",
      adScanned: "Đã nhận diện",
      adUnlockRemaining: "Lần mở khóa còn lại",
      adViewsUsed: "Quảng cáo đã xem",
      adSponsor: "Nhà Tài Trợ PetAI",
      adRemaining: "Còn",
      adPlaying: "Đang phát quảng cáo mô phỏng",
      adWarningDesc:
        "Vui lòng không đóng cửa sổ này. Lượt nhận diện sẽ được cộng vào tài khoản sau khi video kết thúc.",
      adWatchedComplete: "Tôi đã xem xong",
      adLimitReachedDesc:
        "Nếu đã xem đủ 3 lần, bạn cần nâng cấp gói để tiếp tục.",

      /* ── Flask dynamic messages ── */
      msgPleaseLogin: "Vui lòng đăng nhập để sử dụng chức năng này.",
      msgAdLimitReached:
        "Bạn đã xem đủ 3 lần quảng cáo. Vui lòng mua gói để tiếp tục.",
      msgAdUnlocked: "Đã mở khóa thêm 3 lượt nhận diện. Bạn có thể tiếp tục!",
      msgAdError: "Không thể ghi nhận quảng cáo. Vui lòng thử lại.",
      msgHigherPlanActive:
        "Bạn đang có gói cao hơn còn hiệu lực. Không thể mua gói thấp hơn.",
      msgPlanStillHasScans:
        "Gói hiện tại của bạn vẫn còn lượt sử dụng. Chỉ có thể gia hạn khi hết hạn hoặc đã hết lượt.",
      msgInvalidOrder:
        "Đơn thanh toán không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.",
      msgAutoConfirm:
        "Hệ thống đang dùng xác nhận tự động. Vui lòng chờ hệ thống ghi nhận giao dịch.",
      msgFlowChanged:
        "Luồng thanh toán đã thay đổi. Hãy tạo đơn ở trang nâng cấp trước.",
      msgOrderNotFound: "Đơn thanh toán không tồn tại hoặc không hợp lệ.",
      msgPlanActivated: "Đã xác nhận thanh toán và kích hoạt gói của bạn.",
      msgPaymentPending:
        "Đã ghi nhận bạn đã chuyển tiền. Đơn hàng đang chờ admin xác nhận.",
      msgCannotConfirm:
        "Không thể ghi nhận (đơn có thể đã được báo/đã xác nhận).",
      msgPaymentError: "Không thể ghi nhận thanh toán. Vui lòng thử lại.",
      msgMissingOrderId: "Thiếu mã đơn thanh toán.",
      msgOrderNotYours:
        "Đơn thanh toán không tồn tại hoặc không thuộc tài khoản của bạn.",
      msgNotPaid: "Bạn chưa thanh toán.",
      msgAutoConfirmDesc:
        "Hệ thống sẽ tự xác nhận khi nhận được giao dịch. Bạn không cần bấm xác nhận thủ công.",
      msgLoginToPayHistory: "Vui lòng đăng nhập để xem lịch sử thanh toán.",
      msgUserOnlyPage: "Trang này chỉ dành cho tài khoản người dùng.",
      msgSelectImageFirst: "Vui lòng chọn ảnh trước khi bấm phân tích.",
      msgNoImageSelected:
        "Bạn chưa chọn ảnh. Vui lòng tải ảnh lên rồi thử lại.",
      msgOutofQuota:
        "Bạn đã dùng hết 10 lượt miễn phí và 3 lượt xem quảng cáo. Vui lòng mua gói để tiếp tục.",
      msgOutofFreeScans:
        "Bạn đã dùng hết 10 lượt miễn phí. Vui lòng xem quảng cáo để mở khóa thêm.",
      msgWatchAdToUnlock:
        "Vui lòng xem quảng cáo để mở khóa thêm lượt nhận diện.",
      msgAccountLocked:
        "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
      msgGoogleEmailFailed: "Không lấy được email từ Google. Vui lòng thử lại.",
      msgGoogleLoginFailed: "Đăng nhập Google thất bại. Vui lòng thử lại.",

      /* ── Admin: Page titles ── */
      adminConfirmationsTitle: "Duyệt đơn nâng cấp - PetAI",
      adminUsersTitle: "Quản lý người dùng - PetAI",
      dashboardTitle: "Bảng điều khiển - PetAI",
      historyPageTitle: "Lịch sử nhận diện - PetAI",
      statisticsPageTitle: "Thống kê - PetAI",
      upgradePageTitle: "Nâng cấp gói - PetAI",
      paymentsPageTitle: "Lịch sử thanh toán - PetAI",
      settingsPageTitle: "Cài đặt tài khoản - PetAI",
      predictPageTitle: "Nhận diện giống chó - PetAI",
      checkoutPageTitle: "Thanh toán - PetAI",

      /* ── Admin: Confirmations stat cards ── */
      confirmedRevenue: "Doanh thu đã xác nhận",
      totalRealRevenue: "Tổng doanh thu thực tế",
      paidOrders: "Đơn đã thanh toán",
      approvedOrders: "Các đơn đã được duyệt",
      latestPayment: "Thanh toán gần nhất",
      lastOrderTime: "Thời gian đơn cuối",
      pendingConfirmOrders: "Đơn chờ duyệt",
      needsAdminAction: "Cần admin xử lý",

      /* ── Admin: Confirmations filters & table ── */
      searchConfirmationsPlaceholder: "Tìm mã đơn, username, email...",
      allPlans: "Tất cả gói",
      clearFilters: "Xoá bộ lọc",
      recentPaidOrders: "Đơn đã thanh toán gần đây",
      pendingApprovalsTitle: "Đơn chờ admin xác nhận",
      userCol: "Người dùng",
      confirmedAt: "Xác nhận lúc",
      createdAt: "Tạo lúc",
      orderIdCol: "Mã đơn",
      amountCol: "Số tiền",
      noPaidOrders: "Chưa có đơn hàng nào đã thanh toán.",
      noPendingApprovals: "Không có đơn chờ xác nhận.",
      reportedTransfer: "Đã báo chuyển",
      autoConfirmBtn: "Tự động",
      confirmActionTitle: "Xác nhận thao tác",
      confirmActionText: "Bạn có chắc muốn thực hiện hành động này?",
      cancelBtn: "Huỷ",
      confirmBtn: "Xác nhận",
      paymentMethodCol: "Phương thức",

      /* ── Admin: Users page ── */
      userListTitle: "Danh sách người dùng",
      userListSubtitle:
        "Quản lý trạng thái tài khoản, gói dịch vụ và quyền truy cập.",
      approveOrdersBtn: "Duyệt đơn",
      totalUsersCard: "Tổng người dùng",
      registeredAccountsLabel: "Tài khoản đã đăng ký",
      totalAdminsCard: "Tổng quản trị",
      systemAdmins: "Quản trị viên hệ thống",
      activeLabel: "Hoạt động",
      activeAccounts: "Tài khoản hoạt động",
      lockedLabel: "Đã khóa",
      lockedAccounts: "Tài khoản bị khóa",
      searchUserPlaceholder: "Tìm username, email, họ tên...",
      allRoles: "Tất cả vai trò",
      allStatuses: "Tất cả trạng thái",
      filterUser: "Người dùng",
      statusActive: "Hoạt động",
      statusLocked: "Đã khóa",
      userColHeader: "Người dùng",
      roleColHeader: "Vai trò",
      statusColHeader: "Trạng thái",
      createdAtColHeader: "Ngày tạo",
      planColHeader: "Cấp gói",
      actionColHeader: "Thao tác",
      detailBtn: "Chi tiết",
      noUserData: "Chưa có dữ liệu người dùng.",
      savePlanLabel: "Lưu gói",
      updatePlanLabel: "Cập nhật gói",

      /* ── Pagination ── */
      prevPage: "Trang trước",
      nextPage: "Trang sau",

      /* ── Footer ── */
      footerDescText:
        "Ứng dụng nhận diện giống chó bằng AI dành cho người yêu thú cưng. Kết quả chính xác, nhanh chóng.",

      /* ── Mobile menu ── */
      openMenu: "Mở menu",
      closeMenu: "Đóng menu",

      /* ── Custom pagination ── */
      showingText: "Hiển thị",
      ofText: "trên",
      usersText: "người dùng",
      pendingConfirmOrdersText: "đơn chờ xác nhận",

      /* ── Upgrade Plan Page ── */
      upgradeTitle: "Nâng cấp gói sử dụng",
      upgradeDescFree:
        'Bạn đang sử dụng gói <strong class="text-slate-700 dark:text-slate-300">MIỄN PHÍ (FREE)</strong>. Nâng cấp để tăng lượt nhận diện và trải nghiệm mượt mà không quảng cáo.',
      upgradeDescPaidPrefix: "Tài khoản của bạn đang sử dụng gói",
      upgradeDescPaidSuffix: ". Bạn có thể nâng cấp hoặc gia hạn bên dưới.",
      choosePlanPay: "Chọn gói & Thanh toán",
      planFreeTitle: "Miễn phí",
      planFreeSub: "Gói khởi đầu mặc định",
      planFreePrice: "0đ",
      planFreePriceSub: "Luôn miễn phí",
      scanLimit10: "10 lượt nhận diện miễn phí",
      watchAdsMore: "Xem quảng cáo để thêm lượt",
      suitableTrial: "Phù hợp để dùng thử",
      currentPlan: "Gói hiện tại",
      freePlanActive: "Gói FREE đang hoạt động",
      cannotDowngrade: "Không thể hạ cấp",
      planBasicTitle: "Cơ bản",
      planBasicSub: "Dành cho nhu cầu nhẹ",
      planBasicPrice: "1.000đ",
      planBasicPriceSub: "/ 7 ngày sử dụng",
      scanLimit50: "50 lượt nhận diện",
      noAds: "Không có quảng cáo",
      suitableLight: "Phù hợp nhu cầu nhẹ",
      registerBtn: "Đăng ký",
      basicPlanActive: "Gói Basic đang hoạt động",
      usingHigherPlan: "Đang dùng gói cấp cao hơn",
      planProTitle: "Chuyên nghiệp",
      planProSub: "Tối ưu & phổ biến nhất",
      planProPrice: "5.000đ",
      planProPriceSub: "/ 30 ngày sử dụng",
      scanLimit200: "200 lượt nhận diện",
      prioritySpeed: "Ưu tiên tốc độ xử lý",
      adFreeComfort: "Không quảng cáo, dùng thoải mái",
      recommended: "Khuyên dùng",
      proPlanActive: "Gói Pro đang hoạt động",
      planEntTitle: "Doanh nghiệp",
      planEntSub: "Nhu cầu cực lớn",
      planEntPrice: "15.000đ",
      planEntPriceSub: "/ 90 ngày sử dụng",
      scanLimitUnlimit: "Không giới hạn nhận diện",
      vipBandwidth: "Tối ưu hóa băng thông & VIP",
      prioritySupport: "Hỗ trợ ưu tiên hàng đầu",
      entPlanActive: "Gói Enterprise đang hoạt động",
      confirmPaymentTitle: "Xác nhận thanh toán",
      confirmPaymentSub: "Vui lòng kiểm tra gói dịch vụ đã chọn và tiếp tục",
      upgradeLabel: "Gói nâng cấp đăng ký",
      optPro: "Chuyên nghiệp (Pro) — 5.000đ / 30 ngày / 200 lượt",
      optBasic: "Cơ bản (Basic) — 1.000đ / 7 ngày / 50 lượt",
      optEnterprise:
        "Doanh nghiệp (Enterprise) — 15.000đ / 90 ngày / Không giới hạn",
      gatewayInfo:
        "Cổng <strong>VietQR tự động</strong>. Bạn chỉ cần quét mã QR được hiển thị và chuyển đúng số tiền cùng nội dung chuyển khoản để hệ thống tự động duyệt.",
      orderSummary: "Tóm tắt đơn hàng",
      planLabel: "Gói đăng ký:",
      durationLabel: "Thời hạn:",
      scanLimitLabel: "Lượt nhận diện:",
      totalPayLabel: "Tổng thanh toán:",
      backBtn: "Quay lại",
      usingHighestPlan: "Đang dùng gói cao nhất",
      continuePayBtn: "Tiếp tục thanh toán",
      creatingInvoice: "Đang tạo hóa đơn...",
      planBasicName: "Cơ bản (Basic)",
      planBasicDuration: "7 ngày",
      planBasicLimit: "50 lượt",
      planProName: "Chuyên nghiệp (Pro)",
      planProDuration: "30 ngày",
      planProLimit: "200 lượt",
      planEntName: "Doanh nghiệp (Enterprise)",
      planEntDuration: "90 ngày",
      planEntLimit: "Không giới hạn",
      upgradeBillingHistoryBtn: "Lịch sử thanh toán",
      currentPlanTitle: "Gói hiện tại của bạn",
      activeStatus: "Đang hoạt động",
      expiredStatus: "Đã hết hạn",
      highestPlanMsg: "Bạn đang sử dụng gói cao nhất",
      renewPlanBtn: "Gia hạn gói",
      comparisonTableTitle: "So sánh các gói dịch vụ",
      compFeature: "Tính năng",
      compAIModel: "Lượt nhận diện AI",
      compDuration: "Thời hạn sử dụng",
      compAds: "Quảng cáo",
      compSpeed: "Tốc độ xử lý",
      compSupport: "Hỗ trợ",
      compAdvancedFeatures: "Tính năng nâng cao",
      compSuitability: "Phù hợp với",
      compYes: "Có",
      compNo: "Không",
      compUnlimited: "Không giới hạn",
      compBasic: "Cơ bản",
      compPriority: "Ưu tiên",
      compVip: "VIP",
      compEmail: "Email",
      compHighestSupport: "Ưu tiên cao nhất",
      compLimited: "Giới hạn",
      compSomeFeatures: "Một số tính năng",
      compFullFeatures: "Đầy đủ tính năng",
      compFullAdvancedFeatures: "Đầy đủ + nâng cao",
      compTrial: "Trải nghiệm",
      compPersonal: "Người dùng cá nhân",
      compPowerUser: "Người dùng thường xuyên",
      compEnterprise: "Doanh nghiệp / Chuyên sâu",
      faqTitle: "Câu hỏi thường gặp",
      faq1Q: "Thanh toán xong bao lâu được kích hoạt?",
      faq1A: "Hệ thống tự động kích hoạt thông qua cổng VietQR trong vòng 1-3 phút ngay khi nhận được giao dịch chuyển khoản chính xác nội dung.",
      faq2Q: "Có thể nâng cấp khi đang dùng gói cũ không?",
      faq2A: "Có, bạn có thể nâng cấp lên gói cao hơn bất kỳ lúc nào. Lượt quét và thời hạn của gói mới sẽ được áp dụng ngay lập tức.",
      faq3Q: "Có thể hủy hoặc hoàn tiền không?",
      faq3A: "Các giao dịch thanh toán gói dịch vụ là không hoàn lại. Vui lòng kiểm tra kỹ thông tin trước khi thực hiện giao dịch.",
      faq4Q: "Gói có tự gia hạn không?",
      faq4A: "Không, hệ thống không tự động gia hạn hoặc trừ tiền tài khoản của bạn. Bạn chủ động gia hạn thủ công khi có nhu cầu.",
      faq5Q: "Tôi có thể thay đổi gói sau khi nâng cấp không?",
      faq5A: "Bạn có thể nâng cấp lên gói cao hơn. Việc hạ cấp xuống gói thấp hơn chỉ được thực hiện sau khi gói hiện tại hết hạn sử dụng.",
      helpCardTitle: "Bạn cần hỗ trợ thêm?",
      helpCardDesc: "Liên hệ đội ngũ hỗ trợ của chúng tôi qua email hoặc chat trực tuyến.",
      helpCardBtn: "Liên hệ hỗ trợ",
      paymentSecurityNote: "Thanh toán được bảo mật và xử lý thông qua hệ thống VietQR.",
      policyLink: "Chính sách thanh toán",
      termsLink: "Điều khoản sử dụng",
      cannotDowngradeBtn: "Không thể hạ gói",
      upgradeBtn: "Nâng cấp",
      renewBtn: "Gia hạn",
      currentPlanBtn: "Gói hiện tại",
      selectedPlanLabel: "Bạn đã chọn gói",


      /* ── Checkout Page ── */
      checkoutPageTitle: "Thanh toán - PetAI",
      checkoutTitle: "Thanh toán gói",
      checkoutDesc:
        "Quét mã QR để chuyển khoản, sau đó xác nhận để hệ thống kích hoạt gói.",
      orderIdLabel: "Mã đơn hàng",
      paymentMethodLabel: "Phương thức",
      paymentMethodQR: "Chuyển khoản QR",
      paymentInstructionsTitle: "Hướng dẫn chuyển khoản",
      instructionStep1: "Mở ứng dụng Ngân hàng trên điện thoại của bạn.",
      instructionStep2:
        "Sử dụng tính năng Quét mã QR để thanh toán nhanh nhất.",
      instructionStep3:
        "Kiểm tra thông tin số tiền và nội dung chuyển khoản trước khi xác nhận.",
      accountDetailsTitle: "Chi tiết tài khoản",
      bankLabel: "Ngân hàng",
      accountNumberLabel: "Số tài khoản",
      accountNameLabel: "Chủ tài khoản",
      memoLabel: "Nội dung",
      paymentQrTitle: "Mã QR thanh toán",
      qrMissingLib: "Thiếu thư viện tạo QR. Cài thêm qrcode để hiển thị QR.",
      checkingStatus: "Đang kiểm tra",
      checkingStatusDesc: "Hệ thống đang tự động kiểm tra thanh toán...",
      autoActivationNote:
        "Hệ thống sẽ tự động kích hoạt sau 1-5 phút khi nhận được tiền. Nếu quá lâu, vui lòng gửi hỗ trợ.",
      submitSupportLink: "Gửi hỗ trợ",
      safeTransactionTitle: "Giao dịch an toàn",
      safeTransactionDesc:
        "Thông tin thanh toán của bạn được mã hóa và xử lý tự động bởi hệ thống AI.",
      invoiceModalTitle: "Hóa Đơn Thanh Toán",
      invoiceSuccess: "Thanh toán thành công!",
      invoiceThankYou: "Cảm ơn bạn đã sử dụng dịch vụ của PetAI",
      customerLabel: "Khách hàng",
      emailLabel: "Email",
      createdTimeLabel: "Thời gian tạo",
      confirmedTimeLabel: "Thời gian xác nhận",
      printInvoiceBtn: "In hóa đơn",

      /* ── Dashboard & Welcome ── */
      welcomeUser: "Xin chào",
      welcomeUserGuest: "Xin chào, bạn!",
      thisMonth: "tháng này",
      newThisWeek: "mới tuần này",
      todayCount: "hôm nay",

      /* ── History ── */
      predictionsCountPrefix: "Bạn có tổng cộng",
      predictionsCountSuffix: "bản ghi dự đoán.",
      hybridRatioExpected: "Tỷ lệ lai dự kiến",
      identificationTimeLabel: "Thời gian nhận diện:",
      closeWindowBtn: "Đóng cửa sổ",

      /* ── Predict Result ── */
      predResultTitle: "Kết quả nhận diện giống chó",
      predResultDesc:
        "Hệ thống AI đã hoàn tất phân tích hình ảnh với độ chính xác cao.",
      backToDashboard: "Về bảng điều khiển",
      analyzeAnotherImg: "Phân tích ảnh khác",
      mainObjectAnalysis: "Phân tích vùng đối tượng chính",
      analyzingText: "Đang phân tích",
      mainObjectIdentify: "Nhận diện đối tượng chính",
      bestPrediction: "Dự đoán tốt nhất",
      hybridWarningText:
        "Đây là gợi ý ứng viên lai dựa trên tương đồng hình thái, không phải kết luận di truyền.",
      hybridRatioTitle: "Phân tích tỷ lệ lai dự tính",
      dominantGenExpected: "Gen trội dự kiến",
      similarityText: "Độ tương đồng",
      recessiveGenExpected: "Gen ẩn dự kiến",
      visualProofTitle: "Grad-CAM động (Visual Proof)",
      visualProofRefTitle: "Grad-CAM tham khảo (Visual Proof)",
      visualProofDesc: "Bản đồ nhiệt theo đúng ảnh bạn vừa tải lên.",
      visualProofRefDesc: "Bản đồ nhiệt theo giống tham khảo.",
      aiHighlightArea: "Vùng nổi bật AI tập trung",
      modelLogicAnalysis: "Phân tích Logic từ Model",
      decisionHybridText: "Mức tin cậy đủ cho gợi ý ứng viên lai.",
      decisionPureText: "Mức tin cậy đủ để kết luận giống.",
      decisionRefText: "Mức tin cậy tham khảo, chưa đủ để kết luận giống.",
      modelArchitecture: "Kiến trúc mô hình",
      inferenceOptimization: "Tối ưu suy luận",

      /* ── Payments User ── */
      ordersCreated: "Đơn hàng đã tạo",
      totalAmountPaid: "Tổng tiền thanh toán",
      awaitingConfirm: "Đang chờ xác nhận",
      planExpireLabel: "Hạn",
      freeLimitPlan: "Gói miễn phí giới hạn",
      recentOrders: "Đơn hàng gần đây",
      ordersCount: "đơn",
      planExpired: "Hết hạn",

      /* ── Settings ── */
      personalInfoTab: "Thông tin",
      appearanceTab: "Giao diện",
      privacyTab: "Quyền riêng tư",
      personalInfoTitle: "Thông tin cá nhân",
      saveChangesBtn: "Lưu thay đổi",

      /* ── Admin: User Detail ── */
      manageUserRole: "Quản lý và cấp quyền thành viên cho tài khoản",
      activeStatus: "Hoạt động",
      lockedStatus: "Đã khóa",
      sensitiveArea: "Khu vực nhạy cảm",
      sensitiveAreaDesc:
        "Các thao tác dưới đây tác động trực tiếp đến quyền truy cập và dữ liệu của tài khoản này. Hãy chắc chắn trước khi tiếp tục.",
      lockAccountBtn: "Khoá tài khoản",
      unlockAccountBtn: "Mở khoá tài khoản",
      deleteUserBtn: "Xoá người dùng",
      quotaSettings: "Gói dịch vụ & Hạn mức sử dụng",
      currentPlanLabel: "Gói hiện tại",
      adsWatchedLabel: "Quảng cáo đã xem",
      unlockRemainingLabel: "Lần mở khóa còn lại",
      planExpireDateLabel: "Ngày hết hạn gói",
      freeUnlimited: "Không giới hạn (Miễn phí)",
      changePlanLabel: "Thay đổi gói thành viên",
      assignPlanBtn: "Cấp gói mới",
      registeredTimeLabel: "Thời gian đăng ký hệ thống",
      confirmDialogTitle: "Xác nhận",
      confirmDialogText: "Bạn có chắc?",
      confirmInputPlaceholder: "Nhập email hoặc tên đăng nhập để xác nhận",
      similarityTop3: "Tương đồng hình thái (Top 3)",
      top3Probability: "Top 3 xác suất softmax",
      welcomeFriend: "bạn",
      uploadAreaTitle: "Khu vực tải ảnh",
      changeImageBtn: "Đổi ảnh",
      freeScansLeft: "Lượt miễn phí còn lại",
      unlockedFromAds: "Mở khóa từ quảng cáo",
      adsWatched: "Quảng cáo đã xem",
      watchAdBtn: "Xem quảng cáo để thêm lượt",
      yourPaidPlan: "Gói trả phí của bạn",
      unlimitedScans: "Không giới hạn lượt nhận diện",
      loadingQuota: "Đang tải thông tin...",
      predictionExperience: "Trải nghiệm dự đoán",
      featureIdentifyConfidence: "Nhận diện giống chó với độ tin cậy %",
      featureYoloBoundingBox: "Hỗ trợ ảnh có bounding box YOLO",
      featureAutoSaveHistory: "Lưu lịch sử dự đoán tự động",
      featureResponsiveLayout: "Tối ưu cho cả Mobile/Tablet/Desktop",
      noEmailUpdated: "Chưa cập nhật email",
      enterWord: "Nhập",
      confirmInputPlaceholderSuffix: "hoặc tên đăng nhập để xác nhận",
      checkingStatusWait:
        "Vui lòng không tắt trang cho đến khi giao dịch được xác nhận.",
      ifTooLong: "Nếu quá lâu, vui lòng",
      welcomePrefix: "Xin chào",
      visualAIInsights: "Thông tin phân tích AI",
      /* ── Data Deletion Policy Page ── */
      dataDeletionPageTitle: "Xóa dữ liệu cá nhân - PetAI",
      dataDeletionHeaderTitle: "Xóa dữ liệu cá nhân",
      dataDeletionSection1Title: "1. Quyền yêu cầu xóa tài khoản và dữ liệu",
      dataDeletionSection1Desc:
        "Người dùng luôn có quyền yêu cầu xóa bỏ tài khoản cũng như tất cả dữ liệu cá nhân (tên, email, hình ảnh) đã tích lũy trong quá trình sử dụng hệ thống.",
      dataDeletionSection2Title: "2. Hướng dẫn xóa tài khoản trong ứng dụng",
      dataDeletionSection2Desc:
        "Nếu ứng dụng đã cập nhật chức năng này, vui lòng đi tới phần <strong>Thiết lập / Settings</strong> &gt; Chọn <strong>Quản lý tài khoản</strong> &gt; Nhấn <strong>Xóa tài khoản</strong> để hệ thống tự động loại bỏ thông tin của bạn.",
      dataDeletionSection3Title: "3. Gửi email yêu cầu",
      dataDeletionSection3Desc:
        "Trong trường hợp hệ thống chưa có chức năng xóa trực tiếp, bạn hoàn toàn có thể yêu cầu xóa bằng cách gửi thư. Hãy làm theo hướng dẫn sau:",
      dataDeletionEmailLabel: "Email nhận yêu cầu:",
      dataDeletionSubjectLabel: "Tiêu đề email:",
      dataDeletionSubjectValue: "Yêu cầu xóa dữ liệu/tài khoản",
      dataDeletionVerificationHint:
        "Hãy nêu rõ địa chỉ Email bạn dùng để đăng ký để chúng tôi đối chiếu.",
      dataDeletionSection4Title: "4. Quá trình xử lý",
      dataDeletionSection4Desc:
        "Tất cả các định dạng dữ liệu, hình ảnh, tài khoản của bạn sẽ được xử lý và xóa vĩnh viễn trong vòng <strong>30 ngày</strong> kể từ khi có yêu cầu.",
      dataDeletionSection5Title: "5. Một số dữ liệu có thể được giữ lại",
      dataDeletionSection5Desc:
        "Một số dữ liệu thuộc về báo cáo thanh toán, giao dịch hóa đơn hoặc các chi tiết nhằm phục vụ tranh chấp có thể sẽ được tiếp tục lưu giữ tùy thuộc vào quy định pháp luật sở tại yêu cầu.",
      dataDeletionSection6Title: "6. Thông tin liên hệ",
      dataDeletionSection6Desc: "Mọi khó khăn vui lòng liên lạc:",

      /* ── Terms of Service Page ── */
      termsPageTitle: "Điều khoản dịch vụ - PetAI",
      termsHeaderTitle: "Điều khoản dịch vụ",
      termsSection1Title: "1. Điều kiện sử dụng ứng dụng/website",
      termsSection1Desc:
        "Việc bạn truy cập và sử dụng dịch vụ đồng nghĩa với việc bạn xác nhận đã đọc, hiểu và chấp thuận toàn bộ các điều khoản được quy định tại văn bản này.",
      termsSection2Title: "2. Quyền và trách nhiệm của người dùng",
      termsSection2Desc:
        "Người dùng cam kết cung cấp thông tin chân thực khi tạo tài khoản, và tự chịu trách nhiệm bảo mật thông tin đăng nhập của chính bản thân.",
      termsSection3Title: "3. Quy định về tài khoản",
      termsSection3Desc:
        "Việc sử dụng các tính năng cao cấp có thể yêu cầu đăng nhập. Mỗi tài khoản cá nhân chỉ được ủy quyền cho một người, cấm việc mua bán tài khoản.",
      termsSection4Title: "4. Nội dung hoặc hành vi bị cấm",
      termsSection4Desc:
        "Bạn không được phép: (a) sử dụng ứng dụng vào các mục đích phi pháp; (b) khai thác lạm dụng hệ thống API của chúng tôi; (c) can thiệp, sao chép hay dịch ngược phần mềm cũng như mô hình AI mà chúng tôi cung cấp.",
      termsSection5Title: "5. Giới hạn trách nhiệm của nhà phát triển",
      termsSection5Desc:
        "Các phân tích và nhận diện dựa trên AI chỉ mang tính tham khảo và có thể xuất hiện xác suất sai lệch. Chúng tôi không nhận trách nhiệm cho các hậu quả gián tiếp gây ra từ tư vấn kết quả của phần mềm.",
      termsSection6Title: "6. Chấm dứt tài khoản khi vi phạm",
      termsSection6Desc:
        "Chúng tôi bảo lưu toàn quyền đơn phương khóa hoặc xóa sạch tài khoản và dữ liệu liên quan nếu phát hiện người dùng vi phạm nghiêm trọng những điều kiện đã nêu.",
      termsSection7Title: "7. Thông tin liên hệ",
      termsSection7Desc: "Mọi thắc mắc và góp ý vui lòng gửi về:",

      /* ── Support Page ── */
      supportPageTitle: "Hỗ trợ - PetAI",
      supportHeaderTitle: "Hỗ trợ",
      supportSubtitle:
        "Chúng tôi luôn sẵn sàng lắng nghe mọi phản hồi từ phía bạn.",
      supportQuickInfoTitle: "Thông tin nhanh",
      supportEmailLabel: "Email hỗ trợ:",
      supportResponseTimeLabel: "Thời gian phản hồi dự kiến:",
      supportResponseTimeValue: "Từ 1–3 ngày làm việc",
      supportBasicGuideTitle: "Hướng dẫn sử dụng cơ bản",
      supportStep1:
        "1. Tại giao diện chính, chọn <strong>Đăng Nhập</strong> hoặc tạo tài khoản mới.",
      supportStep2:
        "2. Vào trang Nhận Diện, cho quyền máy ảnh hoặc tải lên hình.",
      supportStep3:
        "3. Chờ từ 2 - 4 giây và AI sẽ trả về kết quả 3 giống chó tiềm năng nhất cùng với lịch sử thống kê.",
      supportFaqTitle: "Các câu hỏi thường gặp (FAQ)",
      supportFaq1Q: "Làm sao để đăng nhập?",
      supportFaq1A:
        "Bạn nhấp vào nút Đăng nhập ở góc trên cùng của Website hoặc qua menu di động để sử dụng Email/Google.",
      supportFaq2Q: "Làm sao để xóa tài khoản?",
      supportFaq2A:
        "Gửi thư theo <strong>Chính sách xóa dữ liệu</strong> của chúng tôi để được trợ giúp.",
      supportFaq3Q: "Làm sao để liên hệ hỗ trợ?",
      supportFaq3A:
        "Bạn có thể sử dụng biểu mẫu phía dưới mục <strong>Liên Hệ</strong> hoặc gửi thư về support@pet.ai.",
      supportFaq4Q: "Tôi gặp lỗi trong ứng dụng thì phải làm gì?",
      supportFaq4A:
        "Rất mong bạn thông cảm, hãy chụp lại lỗi đó (screenshot), ghi rõ hành động dẫn tới lỗi và gửi email về cho chúng tôi sớm nhất!",
      thisMonth: "tháng này",
      revenue: "Doanh thu",
      usersCountSuffix: "người",
      noSubscriptionData: "Chưa có dữ liệu gói đăng ký.",
      scansCount: "Số lượt",
      pleaseSelectDates: "Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!",
      startDateAfterEndDate: "Ngày bắt đầu không được lớn hơn ngày kết thúc!",
      customRange: "Tùy chỉnh",
      customRangeSubtitle: "Từ ngày {start} đến ngày {end}",
      revenueTrendSubtitleDefault: "Tổng tiền từ đơn đã thanh toán (VND)",
      revenueTrendSubtitle7: "Tổng tiền từ đơn đã thanh toán (7 ngày gần đây)",
      revenueTrendSubtitle30:
        "Tổng tiền từ đơn đã thanh toán (30 ngày gần đây)",
      revenueTrendSubtitle90:
        "Tổng tiền từ đơn đã thanh toán (90 ngày gần đây)",
      revenueTrendSubtitle12:
        "Tổng tiền từ đơn đã thanh toán (12 tháng gần đây)",
      predTrendSubtitleDefault: "Số lượng ảnh đã nhận diện mỗi ngày",
      predTrendTitle7: "Xu hướng dự đoán 7 ngày gần đây",
      predTrendTitle30: "Xu hướng dự đoán 30 ngày gần đây",
      predTrendTitle90: "Xu hướng dự đoán 90 ngày gần đây",
      predTrendTitle12: "Xu hướng dự đoán 12 tháng gần đây",
      predTrendTitleCustom: "Xu hướng dự đoán tùy chỉnh",
      predTrendSubtitleMonth: "Số lượng ảnh đã nhận diện theo tháng",
      revenueThisMonthTooltip: "Doanh thu được ghi nhận trong tháng này",
      newUsersThisWeekTooltip: "Số tài khoản mới đăng ký trong 7 ngày qua",
      newOrdersTodayTooltip: "Các đơn hàng mới tạo ngày hôm nay",
      predictionsTodayTooltip: "Số lượt dự đoán thực hiện hôm nay",
      upgradeAccount: "Nâng cấp tài khoản",
      orderInfo: "Thông tin đơn hàng",
      servicePlan: "Gói dịch vụ",
      missingQrLibPrefix: "Thiếu thư viện tạo QR. Cài thêm",
      missingQrLibSuffix: "để hiển thị QR.",
      autoActivationDesc:
        "Hệ thống sẽ tự động kích hoạt sau 1-5 phút khi nhận được tiền.",
      printInvoice: "In hóa đơn",
      adminConfirmationsPageTitle: "Quản trị Duyệt thanh toán - PetAI",
      approveBankTransfers: "Duyệt đơn chuyển khoản",
      approveBankTransfersDesc:
        "Hiển thị các đơn người dùng đã báo chuyển khoản để admin duyệt nâng cấp gói.",
      manageUsersTitle: "Quản lý người dùng",
      reportedTransferStatus: "Đã báo chuyển",
      confirmAction: "Xác nhận thao tác",
      contactPageTitle: "Liên hệ | PetAI",
      contactInfoTitle: "Thông tin liên lạc",
      legalInfoTitle: "Thông tin pháp lý",
      companyNameLabel: "TÊN CÔNG TY",
      taxIdLabel: "MÃ SỐ THUẾ",
      representativeLabel: "NGƯỜI ĐẠI DIỆN",
      licenseDateLabel: "NGÀY CẤP PHÉP",
      headquartersLabel: "TRỤ SỞ CHÍNH",
      hotlineLabel: "HOTLINE",
      emailLabel: "EMAIL",
      appNameLabel: "Tên ứng dụng/website:",
      appNamePlaceholder: "PetAI",
      devNameLabel: "Tên nhà phát triển/công ty:",
      devNamePlaceholder: "CÔNG TY TNHH MỘT THÀNH VIÊN CÔNG NGHỆ KỸ THUẬT TIÊN PHONG",
      contactEmailLabel: "Email liên hệ:",
      addressLabel: "Địa chỉ:",
      addressPlaceholder: "P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ",
      processingTimeNote: "Lưu ý thời gian xử lý:",
      responseTimeDesc:
        "Thường trong 1-3 ngày làm việc. Cảm ơn sự hỗ trợ thiết thực\n                    của bạn!",
      sendMessageOnline: "Gửi tin nhắn trực tuyến",
      submitForm: "Gửi biểu mẫu",
      yourNamePlaceholder: "Tên của bạn...",
      emailAddressPlaceholder: "Địa chỉ email...",
      supportQuestionPlaceholder: "Bạn cần hỗ trợ gì?",
      additionalNotesPlaceholder: "Ghi chú chi tiết thêm...",
      uploadNewPhoto: "Tải ảnh mới",
      revenueThisMonthSuffix: "tháng này",
      newUsersThisWeekSuffix: "mới tuần này",
      newOrdersTodaySuffix: "hôm nay",
      predictionsTodaySuffix: "hôm nay",
      dataDeletionPolicyPageTitle: "Chính sách xóa dữ liệu | PetAI",
      settingsLabel: "Thiết lập / Settings",
      arrowSelect: "&gt; Chọn",
      accountManagement: "Quản lý tài khoản",
      arrowClick: "&gt; Nhấn",
      deleteAccount: "Xóa tài khoản",
      autoDeleteInfoDesc: "để hệ thống tự động loại bỏ thông tin của bạn.",
      deleteDataRequestSubject: "Yêu cầu xóa dữ liệu/tài khoản",
      fromRequestTime: "kể từ khi có yêu cầu.",
      retainedDataDesc:
        "Một số dữ liệu thuộc về báo cáo thanh toán, giao dịch hoá đơn hoặc\n              các chi tiết nhằm phục vụ tranh chấp có thể sẽ được tiếp tục lưu\n              giữ tùy thuộc vào quy định pháp luật sở tại yêu cầu.",
      petaiErrorTitle: "PetAI - Lỗi {{ code }}",
      errorCodeTitle: "Lỗi {{ code }}",
      forgotPasswordPageTitle: "Quên mật khẩu - PetAI",
      newScan: "Nhận diện mới",
      viewDetails: "Xem chi tiết",
      speciesDog: "Chó",
      historyPaginationAria: "Phân trang lịch sử",
      identifyNav: "NHẬN DIỆN",
      dogBreedsNav: "GIỐNG CHÓ",
      howItWorks: "Cách hoạt động",
      resultDemoSh: "MINH_HỌA_KẾT_QUẢ.SH",
      inputLabel: "Đầu vào:",
      analyzingImageDemo: '"Đang phân tích đặc trưng giống từ image_01.jpg..."',
      analysisResultsDemo: "Kết quả phân tích...",
      shibaDemoResult: "[1] Shiba Inu: 82% độ tin cậy.",
      akitaDemoResult: "[2] Akita: 11% độ tin cậy.",
      basenjiDemoResult: "[3] Basenji: 7% độ tin cậy.",
      priceFree: "0đ",
      foreverSuffix: "/ vĩnh viễn",
      freeScans10: "10 lượt nhận diện",
      max3Ads: "Tối đa 3 lần xem QC",
      days7Suffix: "/ 7 ngày",
      scans50: "50 lượt nhận diện",
      days30Suffix: "/ 30 ngày",
      scans200: "200 lượt nhận diện",
      days90Suffix: "/ 90 ngày",
      loginPageTitle: "Đăng nhập - PetAI",
      paymentsUserDesc: "Các đơn bạn đã tạo và trạng thái xử lý hiện tại.",
      upgradePlanTitle: "Nâng cấp gói",
      totalOrdersCard: "Tổng đơn hàng",
      pendingOrdersCard: "Đơn đang chờ",
      paidStatus: "Đã thanh toán",
      cancelledStatus: "Đã hủy",
      expiredStatus: "Hết hạn",
      pendingStatus: "Đang chờ",
      invoiceBtn: "Hóa đơn",
      continuePay: "Tiếp tục thanh toán",
      noPaymentsMessage:
        "Bạn chưa thực hiện giao dịch nâng cấp tài khoản nào trên PetAI.",
      upgradeNowBtn: "Nâng cấp gói ngay",
      orderPaginationAria: "Phân trang đơn hàng",
      predictResultPageTitle: "Kết quả dự đoán | PetAI",
      mainObjectDetection: "Nhận diện đối tượng chính",
      hybridRatioAnalysis: "Phân tích tỷ lệ lai dự tính",
      similarityPrefix: "Độ tương đồng: ",
      privacyPolicyPageTitle: "Chính sách quyền riêng tư | PetAI",
      updateDatePrefix: "Ngày cập nhật: 16/06/2026",
      privacySection1Title: "1. Thông tin nhà phát triển/công ty",
      devIntroText: "Dịch vụ được phát triển và thiết kế bởi",
      companyNamePlaceholder: "CÔNG TY TNHH MỘT THÀNH VIÊN CÔNG NGHỆ KỸ THUẬT TIÊN PHONG",
      devIntroTextSuffix:
        ". Chúng tôi cam kết bảo\n              vệ thông tin cá nhân và quyền riêng tư của bạn an toàn nhất có\n              thể.",
      privacySection2Title: "2. Dữ liệu nào được thu thập",
      privacySection2Desc:
        "Chúng tôi có thể thu thập các loại dữ liệu bao gồm: Tên tài khoản,\n              Email, Mật khẩu (đã mã hóa an toàn), hình ảnh chó bạn tải về hệ\n              thống nhận diện, cũng như các hành vi tương tác trên ứng dụng.",
      privacySection3Title: "3. Mục đích sử dụng dữ liệu",
      privacySection3Desc:
        "Dữ liệu được dùng để cung cấp quyền truy cập, xác thực bảo mật,\n              tối ưu hóa các mẫu nhận dạng AI qua thời gian, và hỗ trợ kĩ thuật\n              cần thiết.",
      privacySection4Title: "4. Có chia sẻ dữ liệu với bên thứ ba hay không",
      privacySection4Desc:
        "Tuyệt đối không, trừ các hệ thống hạ tầng lõi cần thiết (Firebase,\n              Google Analytics) hoặc nếu có yêu cầu chặt chẽ từ cơ quan có thẩm\n              quyền theo pháp luật.",
      privacySection5Title: "5. Cookies, Firebase, Analytics",
      privacySection5Desc:
        "Ứng dụng có thể sử dụng Cookies, Google Analytics để đo đạc và\n              Crashlytics để thu thập lỗi giúp chúng tôi hoàn thiện chất lượng\n              nhanh chóng hơn.",
      privacySection6Title: "6. Quyền của người dùng",
      privacySection6Desc:
        "Bạn luôn có quyền kiểm soát nội dung cá nhân của mình, yêu cầu\n              xem, chỉnh sửa, trích xuất dữ liệu, hoặc yêu cầu dừng xử lý tại\n              bất kỳ thời điểm nào.",
      privacySection7Title: "7. Cách yêu cầu xóa dữ liệu",
      privacySection7Desc:
        "Bạn có thể chủ động vào Cài đặt -> Xóa tài khoản, hoặc xem\n              hướng dẫn chi tiết tại",
      privacySection8Title: "8. Thông tin liên hệ",
      addressLabelPlaceholder: "Địa chỉ: P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ",
      registerPageTitle: "Tạo tài khoản - PetAI",
      planPrefix: "GÓI",
      infoTab: "Thông tin",
      fromLabel: "Từ",
      businessDaysCount: "1–3 ngày làm việc",
      orCreateAccount: "hoặc tạo tài khoản mới.",
      sendMailUnder: "Gửi thư theo",
      ourHelpSupport: "của chúng tôi để được trợ giúp.",
      useFormBelow: "Bạn có thể sử dụng biểu mẫu phía dưới mục",
      orSendSupportEmail: "hoặc gửi thư về support@pet.ai.",
      planFreeLabel: "MIỄN PHÍ (FREE)",
      upgradePromptPrefix:
        ". Nâng cấp để tăng lượt nhận diện và trải nghiệm mượt mà không quảng cáo.\n                {% else %}\n                  Tài khoản của bạn đang sử dụng gói",
      upgradePromptSuffix:
        ". Bạn có thể nâng cấp hoặc gia hạn bên dưới.\n                {% endif %}",
      scansUnit: "nhận diện",
      enterprisePlanActive: "Gói Enterprise đang hoạt động",
      autoVietQR: "VietQR tự động",
      vietQrInstructions:
        ". Bạn chỉ cần quét mã QR được hiển thị và chuyển đúng số tiền cùng nội dung chuyển khoản để hệ thống tự động duyệt.",
      freePlanBenefits: "Quyền lợi gói Miễn phí",
      basicPlanBenefits: "Quyền lợi gói Cơ bản",
      proPlanBenefits: "Quyền lợi gói Pro",
      enterprisePlanBenefits: "Quyền lợi gói Doanh nghiệp",
      uploadPageTitle: "Tải ảnh & Phân tích - PetAI",
      uploadHeaderTitle: "Tải ảnh để nhận diện giống chó",
      uploadHeaderDesc:
        "Kéo thả ảnh chó của bạn để AI phân tích và dự đoán giống với độ tin cậy chi tiết.",
      clickToSelectPhoto: "hoặc bấm để chọn ảnh từ máy tính",
      supportedFormatsDesc: "Hỗ trợ JPG, JPEG, PNG • Tối đa 10MB",
      analyzeNowBtn: "Phân tích ngay",
      quotaPlanPrefix: "Gói: ",
      quotaLimitLabel: "Hạn mức",
      watchAdToUnlock: "Xem quảng cáo để thêm lượt",
      adminUsersPageTitle: "Quản trị Người dùng - PetAI",
      adminUsersDesc:
        "Quản lý trạng thái tài khoản, gói dịch vụ và quyền truy cập của hệ thống.",
      showingUsers:
        "Hiển thị {{ start_index }} - {{ end_index }} trên {{ total_users }} người dùng",
      assignPlanHeader: "Cấp gói",
      adminUserDetailPageTitle: "Quản trị Người dùng #{{ user.id }} - PetAI",
      sensitiveAreaTitle: "Khu vực nhạy cảm",
      quotaSettingsTitle: "Gói dịch vụ & Hạn mức sử dụng",
      remainingSuffix: "lại",
      userIdLabel: "Mã số tài khoản (User ID)",
      orUsernameToConfirm: "hoặc tên đăng nhập để xác nhận",
      deleteOrUsernamePlaceholder: "DELETE hoặc username",
      backToList: "Quay lại danh sách",
      selectPlanToAssign: "Chọn gói cấp",
      adLimitReachedPrompt:
        "Bạn đã sử dụng hết 10 lượt miễn phí. Xem một đoạn quảng cáo\n            ngắn để nhận thêm",
      threeScans: "3 lượt",
      adLimitLimitPrompt: "nhận diện AI. (Tối đa 3 lần).",
      upgradeAccount: "Nâng cấp tài khoản",
      orderInfo: "Thông tin đơn hàng",
      servicePlan: "Gói dịch vụ",
      missingQrLibPrefix: "Thiếu thư viện tạo QR. Cài thêm",
      missingQrLibSuffix: "để hiển thị QR.",
      checkingStatusWait:
        "Vui lòng không tắt trang cho đến khi giao dịch được xác nhận.",
      autoActivationDesc:
        "Hệ thống sẽ tự động kích hoạt sau 1-5 phút khi nhận được tiền.",
      printInvoice: "In hóa đơn",
      openMenu: "Mở menu",
      close: "Đóng",
      adminConfirmationsPageTitle: "Quản trị Duyệt thanh toán - PetAI",
      approveBankTransfers: "Duyệt đơn chuyển khoản",
      approveBankTransfersDesc:
        "Hiển thị các đơn người dùng đã báo chuyển khoản để admin duyệt nâng cấp gói.",
      manageUsersTitle: "Quản lý người dùng",
      clearFilters: "Xoá lọc",
      reportedTransferStatus: "Đã báo chuyển",
      confirmAction: "Xác nhận thao tác",
      searchConfirmationsPlaceholder: "Tìm mã đơn/username/email/họ tên...",
      contactPageTitle: "Liên hệ | PetAI",
      contactInfoTitle: "Thông tin liên lạc",
      legalInfoTitle: "Thông tin pháp lý",
      companyNameLabel: "TÊN CÔNG TY",
      taxIdLabel: "MÃ SỐ THUẾ",
      representativeLabel: "NGƯỜI ĐẠI DIỆN",
      licenseDateLabel: "NGÀY CẤP PHÉP",
      headquartersLabel: "TRỤ SỞ CHÍNH",
      hotlineLabel: "HOTLINE",
      emailLabel: "EMAIL",
      appNameLabel: "Tên ứng dụng/website:",
      appNamePlaceholder: "PetAI",
      devNameLabel: "Tên nhà phát triển/công ty:",
      devNamePlaceholder: "CÔNG TY TNHH MỘT THÀNH VIÊN CÔNG NGHỆ KỸ THUẬT TIÊN PHONG",
      contactEmailLabel: "Email liên hệ:",
      addressLabel: "Địa chỉ:",
      addressPlaceholder: "P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ",
      processingTimeNote: "Lưu ý thời gian xử lý:",
      responseTimeDesc:
        "Thường trong 1-3 ngày làm việc. Cảm ơn sự hỗ trợ thiết thực\n                    của bạn!",
      sendMessageOnline: "Gửi tin nhắn trực tuyến",
      fullnameLabel: "Họ tên",
      submitForm: "Gửi biểu mẫu",
      yourNamePlaceholder: "Tên của bạn...",
      emailAddressPlaceholder: "Địa chỉ email...",
      supportQuestionPlaceholder: "Bạn cần hỗ trợ gì?",
      additionalNotesPlaceholder: "Ghi chú chi tiết thêm...",
      uploadNewPhoto: "Tải ảnh mới",
      viewHistory: "Xem lịch sử",
      revenueThisMonthSuffix: "tháng này",
      newUsersThisWeekSuffix: "mới tuần này",
      newOrdersTodaySuffix: "hôm nay",
      predictionsTodaySuffix: "hôm nay",
      dataDeletionPolicyPageTitle: "Chính sách xóa dữ liệu | PetAI",
      settingsLabel: "Thiết lập / Settings",
      arrowSelect: "&gt; Chọn",
      accountManagement: "Quản lý tài khoản",
      arrowClick: "&gt; Nhấn",
      deleteAccount: "Xóa tài khoản",
      autoDeleteInfoDesc: "để hệ thống tự động loại bỏ thông tin của bạn.",
      deleteDataRequestSubject: "Yêu cầu xóa dữ liệu/tài khoản",
      dataDeletionVerificationHint:
        "Hãy nêu rõ địa chỉ Email bạn dùng để đăng ký để chúng tôi đối\n                chứng.",
      fromRequestTime: "kể từ khi có yêu cầu.",
      retainedDataDesc:
        "Một số dữ liệu thuộc về báo cáo thanh toán, giao dịch hoá đơn hoặc\n              các chi tiết nhằm phục vụ tranh chấp có thể sẽ được tiếp tục lưu\n              giữ tùy thuộc vào quy định pháp luật sở tại yêu cầu.",
      petaiErrorTitle: "PetAI - Lỗi {{ code }}",
      errorCodeTitle: "Lỗi {{ code }}",
      backToHome: "Quay lại trang chủ",
      checkSystem: "Kiểm tra hệ thống",
      forgotPasswordPageTitle: "Quên mật khẩu - PetAI",
      historyPageTitle: "Lịch sử - PetAI",
      predictionsCountSuffix: "bản ghi dự đoán.",
      newScan: "Nhận diện mới",
      viewDetails: "Xem chi tiết",
      startNow: "Bắt đầu ngay",
      speciesDog: "Chó",
      historyPaginationAria: "Phân trang lịch sử",
      identifyNav: "NHẬN DIỆN",
      dogBreedsNav: "GIỐNG CHÓ",
      howItWorks: "Cách hoạt động",
      resultDemoSh: "MINH_HỌA_KẾT_QUẢ.SH",
      inputLabel: "Đầu vào:",
      analyzingImageDemo: '"Đang phân tích đặc trưng giống từ image_01.jpg..."',
      analysisResultsDemo: "Kết quả phân tích...",
      shibaDemoResult: "[1] Shiba Inu: 82% độ tin cậy.",
      akitaDemoResult: "[2] Akita: 11% độ tin cậy.",
      basenjiDemoResult: "[3] Basenji: 7% độ tin cậy.",
      priceFree: "0đ",
      foreverSuffix: "/ vĩnh viễn",
      freeScans10: "10 lượt nhận diện",
      max3Ads: "Tối đa 3 lần xem QC",
      suitableTrial: "Phù hợp dùng thử",
      days7Suffix: "/ 7 ngày",
      scans50: "50 lượt nhận diện",
      noAds: "Không quảng cáo",
      days30Suffix: "/ 30 ngày",
      scans200: "200 lượt nhận diện",
      prioritySpeed: "Ưu tiên tốc độ",
      days90Suffix: "/ 90 ngày",
      unlimitedScans: "Không giới hạn lượt",
      loginPageTitle: "Đăng nhập - PetAI",
      loginWithGoogle: "Đăng nhập bằng Google",
      paymentsUserDesc: "Các đơn bạn đã tạo và trạng thái xử lý hiện tại.",
      upgradePlanTitle: "Nâng cấp gói",
      totalOrdersCard: "Tổng đơn hàng",
      pendingOrdersCard: "Đơn đang chờ",
      paidStatus: "Đã thanh toán",
      cancelledStatus: "Đã hủy",
      expiredStatus: "Hết hạn",
      pendingStatus: "Đang chờ",
      invoiceBtn: "Hóa đơn",
      continuePay: "Tiếp tục thanh toán",
      noPaymentsMessage:
        "Bạn chưa thực hiện giao dịch nâng cấp tài khoản nào trên PetAI.",
      upgradeNowBtn: "Nâng cấp gói ngay",
      orderPaginationAria: "Phân trang đơn hàng",
      predictResultPageTitle: "Kết quả dự đoán | PetAI",
      backToDashboard: "Về bảng điều khiển",
      analyzeAnother: "Phân tích ảnh khác",
      mainObjectDetection: "Nhận diện đối tượng chính",
      hybridRatioAnalysis: "Phân tích tỷ lệ lai dự tính",
      similarityPrefix: "Độ tương đồng: ",
      privacyPolicyPageTitle: "Chính sách quyền riêng tư | PetAI",
      updateDatePrefix: "Ngày cập nhật: 16/06/2026",
      privacySection1Title: "1. Thông tin nhà phát triển/công ty",
      devIntroText: "Dịch vụ được phát triển và thiết kế bởi",
      companyNamePlaceholder: "CÔNG TY TNHH MỘT THÀNH VIÊN CÔNG NGHỆ KỸ THUẬT TIÊN PHONG",
      devIntroTextSuffix:
        ". Chúng tôi cam kết bảo\n              vệ thông tin cá nhân và quyền riêng tư của bạn an toàn nhất có\n              thể.",
      privacySection2Title: "2. Dữ liệu nào được thu thập",
      privacySection2Desc:
        "Chúng tôi có thể thu thập các loại dữ liệu bao gồm: Tên tài khoản,\n              Email, Mật khẩu (đã mã hóa an toàn), hình ảnh chó bạn tải về hệ\n              thống nhận diện, cũng như các hành vi tương tác trên ứng dụng.",
      privacySection3Title: "3. Mục đích sử dụng dữ liệu",
      privacySection3Desc:
        "Dữ liệu được dùng để cung cấp quyền truy cập, xác thực bảo mật,\n              tối ưu hóa các mẫu nhận dạng AI qua thời gian, và hỗ trợ kĩ thuật\n              cần thiết.",
      privacySection4Title: "4. Có chia sẻ dữ liệu với bên thứ ba hay không",
      privacySection4Desc:
        "Tuyệt đối không, trừ các hệ thống hạ tầng lõi cần thiết (Firebase,\n              Google Analytics) hoặc nếu có yêu cầu chặt chẽ từ cơ quan có thẩm\n              quyền theo pháp luật.",
      privacySection5Title: "5. Cookies, Firebase, Analytics",
      privacySection5Desc:
        "Ứng dụng có thể sử dụng Cookies, Google Analytics để đo đạc và\n              Crashlytics để thu thập lỗi giúp chúng tôi hoàn thiện chất lượng\n              nhanh chóng hơn.",
      privacySection6Title: "6. Quyền của người dùng",
      privacySection6Desc:
        "Bạn luôn có quyền kiểm soát nội dung cá nhân của mình, yêu cầu\n              xem, chỉnh sửa, trích xuất dữ liệu, hoặc yêu cầu dừng xử lý tại\n              bất kỳ thời điểm nào.",
      privacySection7Title: "7. Cách yêu cầu xóa dữ liệu",
      privacySection7Desc:
        "Bạn có thể chủ động vào Cài đặt -> Xóa tài khoản, hoặc xem\n              hướng dẫn chi tiết tại",
      privacySection8Title: "8. Thông tin liên hệ",
      addressLabelPlaceholder: "Địa chỉ: P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ",
      registerPageTitle: "Tạo tài khoản - PetAI",
      registerWithGoogle: "Đăng ký bằng Google",
      planPrefix: "GÓI",
      infoTab: "Thông tin",
      appearanceTab: "Giao diện",
      privacyTab: "Quyền riêng tư",
      fullnameHint: "Tên này hiển thị trên hồ sơ và thanh điều hướng.",
      clearAllHistory: "Xóa toàn bộ lịch sử",
      exportReport: "Xuất báo cáo",
      identifyNow: "Nhận diện ngay",
      supportPageTitle: "Hỗ trợ | PetAI",
      fromLabel: "Từ",
      businessDaysCount: "1–3 ngày làm việc",
      orCreateAccount: "hoặc tạo tài khoản mới.",
      sendMailUnder: "Gửi thư theo",
      ourHelpSupport: "của chúng tôi để được trợ giúp.",
      useFormBelow: "Bạn có thể sử dụng biểu mẫu phía dưới mục",
      orSendSupportEmail: "hoặc gửi thư về support@pet.ai.",
      termsPageTitle: "Điều khoản sử dụng | PetAI",
      planFreeLabel: "MIỄN PHÍ (FREE)",
      upgradePromptPrefix:
        ". Nâng cấp để tăng lượt nhận diện và trải nghiệm mượt mà không quảng cáo.\n                {% else %}\n                  Tài khoản của bạn đang sử dụng gói",
      upgradePromptSuffix:
        ". Bạn có thể nâng cấp hoặc gia hạn bên dưới.\n                {% endif %}",
      choosePlanPay: "Chọn gói & Thanh toán",
      freePlanActive: "Gói FREE đang hoạt động",
      scansUnit: "nhận diện",
      basicPlanActive: "Gói Basic đang hoạt động",
      usingHigherPlan: "Đang dùng gói cấp cao hơn",
      proPlanActive: "Gói Pro đang hoạt động",
      enterprisePlanActive: "Gói Enterprise đang hoạt động",
      autoVietQR: "VietQR tự động",
      vietQrInstructions:
        ". Bạn chỉ cần quét mã QR được hiển thị và chuyển đúng số tiền cùng nội dung chuyển khoản để hệ thống tự động duyệt.",
      usingHighestPlan: "Đang dùng gói cao nhất",
      freePlanBenefits: "Quyền lợi gói Miễn phí",
      basicPlanBenefits: "Quyền lợi gói Cơ bản",
      proPlanBenefits: "Quyền lợi gói Pro",
      enterprisePlanBenefits: "Quyền lợi gói Doanh nghiệp",
      uploadPageTitle: "Tải ảnh & Phân tích - PetAI",
      uploadHeaderTitle: "Tải ảnh để nhận diện giống chó",
      uploadHeaderDesc:
        "Kéo thả ảnh chó của bạn để AI phân tích và dự đoán giống với độ tin cậy chi tiết.",
      dragDropHere: "Kéo & thả ảnh vào đây",
      clickToSelectPhoto: "hoặc bấm để chọn ảnh từ máy tính",
      supportedFormatsDesc: "Hỗ trợ JPG, JPEG, PNG • Tối đa 10MB",
      analyzeNowBtn: "Phân tích ngay",
      quotaPlanPrefix: "Gói: ",
      quotaLimitLabel: "Hạn mức",
      watchAdToUnlock: "Xem quảng cáo để thêm lượt",
      predictionExperience: "Trải nghiệm dự đoán",
      featureIdentifyConfidence: "Nhận diện giống chó với độ tin cậy %",
      featureYoloBoundingBox: "Hỗ trợ ảnh có bounding box YOLO",
      featureAutoSaveHistory: "Lưu lịch sử dự đoán tự động",
      featureResponsiveLayout: "Tối ưu cho cả Mobile/Tablet/Desktop",
      adminUsersPageTitle: "Quản trị Người dùng - PetAI",
      adminUsersDesc:
        "Quản lý trạng thái tài khoản, gói dịch vụ và quyền truy cập của hệ thống.",
      approveOrdersBtn: "Duyệt đơn",
      statusLocked: "Khóa",
      showingUsers:
        "Hiển thị {{ start_index }} - {{ end_index }} trên {{ total_users }} người dùng",
      searchUserPlaceholder: "Tìm username/email/họ tên...",
      assignPlanHeader: "Cấp gói",
      savePlanLabel: "Lưu gói",
      adminUserDetailPageTitle: "Quản trị Người dùng #{{ user.id }} - PetAI",
      sensitiveAreaTitle: "Khu vực nhạy cảm",
      deleteUserBtn: "Xoá người dùng",
      quotaSettingsTitle: "Gói dịch vụ & Hạn mức sử dụng",
      remainingSuffix: "lại",
      assignPlanBtn: "Cấp gói mới",
      accountDetailsTitle: "Thông tin chi tiết tài khoản",
      usernameLabel: "Tên tài khoản (Username)",
      emailLabel: "Địa chỉ Email",
      userIdLabel: "Mã số tài khoản (User ID)",
      confirmBtn: "Xác nhận",
      orUsernameToConfirm: "hoặc tên đăng nhập để xác nhận",
      deleteOrUsernamePlaceholder: "DELETE hoặc username",
      backToList: "Quay lại danh sách",
      selectPlanToAssign: "Chọn gói cấp",
      adLimitReachedPrompt:
        "Bạn đã sử dụng hết 10 lượt miễn phí. Xem một đoạn quảng cáo\n            ngắn để nhận thêm",
      threeScans: "3 lượt",
      adLimitLimitPrompt: "nhận diện AI. (Tối đa 3 lần).",
      invoiceSuccessDesc:
        "Thanh toán thành công!<br>Hóa đơn của bạn đang được hiển thị.",
      confirmPaymentText:
        "Xác nhận đã nhận tiền cho đơn {orderId} ({user} - {plan})?",
      confirmAssignPlanText: "Cấp gói {plan} cho {username}?",
      confirmLockUser: "Khoá tài khoản {username}?",
      confirmUnlockUser: "Mở khoá tài khoản {username}?",
      actionFailed: "Thao tác thất bại.",
      deleteFailed: "Xóa thất bại.",
      invalidConfirmation: "Xác nhận không đúng.",
      confirming: "Đang xác nhận...",
      avatarAlt: "Ảnh đại diện",
      chuyenKhoanShort: "Chuyển khoản",
      contactShort: "Liên hệ",
      onlySupportJpgPng: "Chỉ hỗ trợ ảnh JPG, JPEG hoặc PNG.",
      waitingPaymentDesc:
        "Đang chờ thanh toán...<br>Hệ thống sẽ tự động kiểm tra lại sau vài giây.",
      mixLai: "Mix Lai:",
      predictedBreed: "Giống dự đoán",
      referenceBreed: "Giống tham khảo",
      confirmDeleteUserText:
        "Xóa người dùng {username}? Hành động không thể hoàn tác.",
      msgSendSuccessDemo: "Bạn đã bấm Gửi thành công! (Dữ liệu Demo)",
      reasonPurebredDominant: "Ứng viên thuần chủng/chiếm ưu thế.",
      reasonPurebredMorphology: "Ứng viên thuần chủng/chiếm ưu thế theo tương đồng hình thái.",
      reasonHybridCandidate: "Ứng viên nghi lai.",
      reasonHybridClose: "Ứng viên nghi lai (Top-1 và Top-2 rất sát nhau).",
      reasonBreedShownTop1: "Giống hiển thị theo Top-1 dự đoán.",
      reasonNoDetail: "Chưa có diễn giải chi tiết cho lần dự đoán này.",
      top3NoteSoftmax: "Top 3 theo xác suất softmax.",
      top3NoteSimilarity: "Top 3 theo tương đồng hình thái (similarity).",
      notConfigured: "Chưa cấu hình",
      noSubscriptionData: "Chưa có dữ liệu gói đăng ký.",
      userGuidePageTitle: "Hướng dẫn sử dụng | PetAI",
      userGuideHeaderTitle: "Hướng dẫn sử dụng",
      userGuideSubtitle: "Tìm hiểu cách sử dụng PetAI để nhận diện giống chó nhanh chóng và chính xác nhất.",
      guideStepsTitle: "Các bước nhận diện",
      guideStep1Title: "Bước 1: Đăng nhập/Đăng ký",
      guideStep1Desc: "Truy cập vào tài khoản để lưu lịch sử nhận diện và quản lý hạn mức.",
      guideStep2Title: "Bước 2: Tải lên hình ảnh",
      guideStep2Desc: "Kéo thả ảnh hoặc chọn tệp JPG, JPEG, PNG của cún cưng để tải lên hệ thống.",
      guideStep3Title: "Bước 3: AI phân tích",
      guideStep3Desc: "Hệ thống học sâu của PetAI sẽ phân tích các đặc trưng khuôn mặt chó và xử lý trong 2-4 giây.",
      guideStep4Title: "Bước 4: Xem kết quả chi tiết",
      guideStep4Desc: "Hiển thị Top 3 giống chó kèm độ tin cậy và bản đồ nhiệt Grad-CAM trực quan.",
      guideTipsTitle: "Mẹo chụp ảnh để có kết quả chính xác nhất",
      guideTip1: "Chụp ảnh cận cảnh, rõ nét khuôn mặt của chó.",
      guideTip2: "Đảm bảo điều kiện ánh sáng tốt, tránh ngược sáng hoặc quá tối.",
      guideTip3: "Tránh chụp ảnh có nhiều con chó cùng lúc hoặc quá nhiều vật thể gây nhiễu xung quanh.",
      guideTip4: "Góc chụp chính diện khuôn mặt chó luôn mang lại kết quả tối ưu từ mô hình AI.",
      guideIntroTitle: "1. Giới thiệu về PetAI",
      guideIntroDesc: "PetAI là hệ thống nhận diện giống chó thông minh sử dụng trí tuệ nhân tạo (AI). Khi bạn tải ảnh lên, hệ thống sẽ thực hiện quy trình xử lý tự động như sau:<br><br><strong>1. Phát hiện & Khoanh vùng (YOLOv8):</strong> Mô hình YOLOv8 quét toàn bộ ảnh để xác định vị trí chú chó, vẽ khung bao (bounding box) quanh cơ thể và tự động cắt (crop) vùng chứa chú chó nhằm tối ưu hóa đầu vào, loại bỏ nhiễu từ bối cảnh.<br><strong>2. Phân tích & Phân loại giống:</strong> Vùng ảnh cắt được đưa qua mạng nơ-ron chuyên sâu để phân loại, phân tích các đặc trưng hình thái đặc thù của hơn 120 giống chó phổ biến.<br><strong>3. Xác định Thuần chủng hay Chó lai:</strong> Nếu giống chó đứng đầu đạt độ tin cậy vượt trội (thường trên 80%), hệ thống sẽ kết luận giống thuần chủng. Trường hợp các giống đứng đầu có tỷ lệ sát nhau, hệ thống sẽ hiển thị Top 3 giống chó tương đồng nhất kèm theo biểu đồ ước tính tỷ lệ lai.<br><strong>4. Giải thích trực quan (Grad-CAM):</strong> Hiển thị bản đồ nhiệt làm nổi bật các vùng đặc trưng (tai, mắt, mõm...) giúp bạn hiểu rõ lý do AI đưa ra dự đoán.",
      guideRegisterTitle: "2. Hướng dẫn đăng ký tài khoản",
      guideRegisterDesc: "Để bắt đầu lưu lịch sử nhận diện và quản lý hạn mức, bạn cần tạo tài khoản mới:",
      guideRegisterStep1: "Truy cập trang đăng ký từ menu góc trên bên phải hoặc vào route /register.",
      guideRegisterStep2: "Nhập đầy đủ thông tin cá nhân: Họ tên, Tên đăng nhập (username), Email hợp lệ và Mật khẩu bảo mật.",
      guideRegisterStep3: "Xác nhận đồng ý điều khoản dịch vụ và nhấp nút 'Tạo tài khoản' để hoàn tất.",
      guideLoginTitle: "3. Hướng dẫn đăng nhập",
      guideLoginDesc: "Sau khi đăng ký thành công, bạn có thể đăng nhập vào hệ thống bằng hai cách:",
      guideLoginMethod1: "Đăng nhập thông thường: Sử dụng Tên đăng nhập hoặc Email cùng Mật khẩu đã đăng ký.",
      guideLoginMethod2: "Đăng nhập nhanh: Chọn 'Đăng nhập bằng Google' để liên kết và đăng nhập nhanh bằng tài khoản Google cá nhân.",
      guideFreePlanTitle: "4. Giới thiệu Gói Miễn Phí (Free Plan)",
      guideFreePlanDesc: "Mỗi người dùng mới đăng ký sẽ tự động được gán gói dịch vụ Miễn phí:",
      guideFreePlanLimit: "Hạn mức mặc định: Bạn nhận được 10 lượt nhận diện giống chó miễn phí vĩnh viễn.",
      guideFreePlanAds: "Xem quảng cáo để nhận thêm lượt: Khi sử dụng hết 10 lượt mặc định, bạn có thể xem quảng cáo ngắn (tối đa 3 lần) để nhận thêm 3 lượt quét mỗi lần.",
      guideFreePlanOut: "Khi hết lượt: Khi đã sử dụng hết cả lượt miễn phí và lượt từ quảng cáo, bạn cần nâng cấp gói dịch vụ để tiếp tục sử dụng hệ thống.",
      guideIdentifyTitle: "5. Hướng dẫn cách nhận diện",
      guideIdentifyDesc: "Để thực hiện quét hình ảnh nhận diện giống chó, hãy làm theo quy trình dưới đây:",
      guideIdentifyStep1: "Tải ảnh lên: Nhấp vào khu vực tải ảnh hoặc kéo thả tệp ảnh vào khung tải lên tại trang Nhận diện.",
      guideIdentifyStep2: "Chọn ảnh phù hợp: Hệ thống chỉ hỗ trợ định dạng JPG, JPEG hoặc PNG với dung lượng tối đa 10MB.",
      guideIdentifyStep3: "Chờ AI xử lý: Nhấn nút 'Phân tích ngay' và đợi từ 2 đến 4 giây để hệ thống AI nhận diện đối tượng và chạy mô hình phân loại.",
      guideIdentifyStep4: "Xem kết quả: Giao diện sẽ tự động chuyển sang trang hiển thị kết quả chi tiết.",
      guideResultTitle: "6. Giải thích kết quả nhận diện",
      guideResultDesc: "Trang kết quả phân tích chứa nhiều thông tin chi tiết giúp bạn hiểu rõ về cún cưng của mình:",
      guideResultItem1: "Tên giống chó: Giống chó được nhận diện có độ tương đồng cao nhất.",
      guideResultItem2: "Độ chính xác (Độ tin cậy): Thể hiện tỷ lệ phần trăm chắc chắn của AI đối với giống chó đó.",
      guideResultItem3: "Thông tin giống chó: Các thông tin bách khoa toàn thư bao gồm: Nguồn gốc xuất xứ, Đặc điểm ngoại hình, Tính cách đặc trưng và Hướng dẫn chăm sóc sức khỏe.",
      guideResultItem4: "Bản đồ nhiệt Grad-CAM: Vùng màu sáng (đỏ/vàng) trên ảnh thể hiện vị trí đặc trưng (như tai, mắt, mõm...) mà AI tập trung phân tích để đưa ra quyết định.",
      guideModesTitle: "7. Giải thích các chế độ nhận diện",
      guideModesDesc: "Hệ thống tự động phân loại kết quả nhận diện dựa trên độ tin cậy của mô hình:",
      guideModesPure: "Kết luận Thuần chủng: Khi giống chó có tỷ lệ tin cậy vượt trội (thường trên 80%), hệ thống sẽ đưa ra kết quả kết luận giống chó thuần chủng.",
      guideModesHybrid: "Phân tích Tỷ lệ Lai dự tính: Trường hợp giống chó lai (hoặc khi Top-1 và Top-2 có xác suất gần sát nhau), hệ thống hiển thị Top 3 giống chó tương đồng nhất kèm theo biểu đồ ước tính tỷ lệ lai dựa trên phân tích hình thái học.",
      guideUpgradeTitle: "8. Hướng dẫn nâng cấp gói dịch vụ",
      guideUpgradeDesc: "Khi cần mở rộng giới hạn sử dụng, bạn có thể nâng cấp tài khoản của mình:",
      guideUpgradeWhen: "Khi nào cần nâng cấp: Khi đã dùng hết hạn mức miễn phí hoặc muốn trải nghiệm tốc độ ưu tiên và không có quảng cáo.",
      guideUpgradeChoose: "Cách chọn gói: Truy cập trang 'Nâng cấp gói' và chọn một trong ba gói: Basic (50 lượt/7 ngày/1,000đ), Pro (200 lượt/30 ngày/5,000đ) hoặc Enterprise (Không giới hạn/90 ngày/15,000đ).",
      guideUpgradePay: "Cách thanh toán (VietQR): Hệ thống tạo mã thanh toán QR tự động. Hãy mở ứng dụng ngân hàng và quét mã để chuyển khoản chính xác số tiền cùng nội dung chuyển khoản được hiển thị.",
      guideUpgradeProcess: "Hệ thống xử lý: Sau khi chuyển khoản thành công, hệ thống VietQR tự động ghi nhận và kích hoạt gói nâng cấp cho tài khoản của bạn sau 1-5 phút mà không cần admin duyệt thủ công.",
      guideHistoryTitle: "9. Hướng dẫn xem lịch sử nhận diện",
      guideHistoryDesc: "Tất cả kết quả quét ảnh được lưu tự động để tra cứu lại bất cứ lúc nào:",
      guideHistoryList: "Truy cập trang 'Lịch sử' từ thanh bên trái để xem danh sách toàn bộ các lượt nhận diện đã thực hiện.",
      guideHistoryAction: "Bạn có thể tìm kiếm nhanh theo giống chó, xem chi tiết từng lượt quét hoặc chọn xóa các bản ghi không cần thiết.",
      guideStatsTitle: "10. Hướng dẫn xem thống kê cá nhân",
      guideStatsDesc: "Trang thống kê giúp bạn có cái nhìn tổng quan về lịch sử sử dụng của mình:",
      guideStatsOverview: "Xem tổng số lượt quét, độ tin cậy trung bình của các lần nhận diện và số lượng giống chó khác nhau bạn từng phát hiện.",
      guideStatsCharts: "Biểu đồ trực quan: Biểu đồ xu hướng nhận diện theo thời gian, biểu đồ Top 5 giống chó bạn quét nhiều nhất và biểu đồ phân bổ mức độ tin cậy của phân loại AI.",
      guideFaqTitle: "11. Các câu hỏi thường gặp (FAQ)",
      guideFaqQ1: "AI nhận diện có chính xác không?",
      guideFaqA1: "Mô hình AI nhận diện dựa trên đặc trưng hình thái học bên ngoài từ tập dữ liệu huấn luyện. Kết quả chỉ mang tính tham khảo khách quan, không thể thay thế cho các kiểm tra xét nghiệm di truyền (DNA).",
      guideFaqQ2: "Làm sao để có kết quả tốt nhất?",
      guideFaqA2: "Nên chụp ảnh cún cưng ở góc chính diện khuôn mặt, ánh sáng rõ ràng, ảnh không bị rung mờ và chỉ có duy nhất khuôn mặt của một chú chó trong khung hình.",
      guideFaqQ3: "Hết lượt miễn phí tôi phải làm gì?",
      guideFaqA3: "Bạn có thể chọn 'Xem quảng cáo' ở khung cảnh báo để nhận thêm lượt nhận diện hoặc tiến hành nâng cấp gói dịch vụ trả phí phù hợp.",
      guideFaqQ4: "Thanh toán không thành công thì phải làm sao?",
      guideFaqA4: "Giao dịch tự động có thể mất từ 1-5 phút để xử lý. Nếu quá thời gian trên tài khoản vẫn chưa được kích hoạt, vui lòng gửi yêu cầu hỗ trợ đính kèm mã đơn hàng hoặc ảnh chụp biên lai chuyển khoản.",
      guideFaqQ5: "Làm thế nào để liên hệ hỗ trợ?",
      guideFaqA5: "Bạn có thể gửi email trực tiếp tới support@pet.ai hoặc điền biểu mẫu liên hệ tại trang 'Liên hệ' của website.",
      guideContactTitle: "12. Thông tin liên hệ hỗ trợ",
      guideContactDesc: "Nếu gặp bất kỳ khó khăn hay sự cố nào trong quá trình sử dụng hệ thống PetAI, vui lòng liên hệ:",
      guideContactEmail: "Email: support@pet.ai (Hỗ trợ 24/7)",
      guideContactPhone: "Hotline: 0916 416 409",
      guideContactAddress: "Địa chỉ: P16, Đường số 8, KDC lô 49, Khu đô thị Nam Cần Thơ, P. Cái Răng, TP. Cần Thơ",
      currencySuffix: "đ",
      speciesDog: "Chó",
      dangerZoneTitle: "Vùng nguy hiểm",
      dangerZoneDesc: "Hành động không thể hoàn tác nếu quá thời hạn",
      deleteAccountTitle: "Yêu cầu xóa tài khoản",
      deleteAccountDesc: "Tài khoản sẽ không bị xóa ngay mà chuyển sang <b>trạng thái chờ xóa trong 30 ngày</b>. Trong thời gian này bạn có thể đăng nhập lại để khôi phục.",
      deleteModalConfirmTitle: "Xác nhận yêu cầu xóa tài khoản",
      deleteModalConfirmDesc: "Tài khoản sẽ chuyển sang <b>trạng thái chờ xóa 30 ngày</b>.<br>Trong thời gian này bạn vẫn có thể đăng nhập và khôi phục.",
      deleteModalWarning1: "⚠️ <b>Sau 30 ngày</b>, tất cả dữ liệu, lịch sử và quyền truy cập sẽ bị <b>vô hiệu hóa vĩnh viễn</b>.",
      deleteModalWarning2: "⚠️ Quá trình này <b>yêu cầu xác nhận qua email</b> (OTP).",
      deleteReasonLabel: "Lý do xóa (tùy chọn)",
      deleteReasonPlaceholder: "Ví dụ: Tôi không còn sử dụng dịch vụ nữa...",
      sendOtpBtn: "Gửi mã xác nhận",
      deleteModalOtpTitle: "Nhập mã OTP xác nhận",
      deleteModalOtpDesc: "Mã đã được gửi đến",
      deleteModalOtpCountdown: "Mã có hiệu lực trong",
      deleteConfirmBtn: "Xác nhận xóa tài khoản",
      deleteResendBtn: "Gửi lại mã OTP",
      deleteSuccessTitle: "Yêu cầu đã được ghi nhận",
      deleteSuccessDesc: "Tài khoản của bạn đã được chuyển sang <b>trạng thái chờ xóa</b>.<br>Kiểm tra email để biết thêm chi tiết.",
      sendingStatus: "Đang gửi...",
      confirmingStatus: "Đang xác nhận...",
      otpSentSuccess: "Mã OTP mới đã được gửi.",
      deletePendingPageTitle: "Tài khoản đang chờ xóa - PetAI",
      deletePendingHeaderTitle: "Tài khoản đang chờ xóa",
      deletePendingHeaderDesc: "Yêu cầu xóa tài khoản đã được ghi nhận",
      deletePendingUserLabel: "Tài khoản:",
      deletePendingDateLabel: "Tài khoản sẽ bị xóa vĩnh viễn vào",
      daysLabel: "ngày",
      hoursLabel: "giờ",
      minsLabel: "phút",
      deletePendingWarningTitle: "Bạn vẫn có thể đăng nhập nhưng mọi tính năng sẽ bị tạm khóa.",
      deletePendingWarningDesc: "Nếu bạn <b>không muốn xóa tài khoản</b>, hãy nhấn nút khôi phục bên dưới.",
      deletePendingWarningPermanently: "Sau 30 ngày, tất cả dữ liệu sẽ bị vô hiệu hóa vĩnh viễn.",
      restoreAccountBtn: "Khôi phục tài khoản",
      logoutBtn: "Đăng xuất",
      needSupportPrefix: "Cần hỗ trợ? Liên hệ",
      restoreConfirmTitle: "Xác nhận khôi phục",
      restoreConfirmDesc: "Mã OTP đã được gửi đến",
      otpCountdownLabel: "Mã có hiệu lực trong",
      restoreConfirmBtn: "Xác nhận khôi phục",
      resendOtpBtn: "Gửi lại mã OTP",
      sendingOtp: "Đang gửi OTP...",
      otpSendFailedError: "Không thể gửi lại OTP.",
      connectionFailedError: "Lỗi kết nối.",
      sysPagesUnit: "Trang",
      otpInvalidError: "Vui lòng nhập mã OTP gồm đúng 6 chữ số.",
      userPlanLabel: "Gói {{ code }}",
      identifyCompleted: "Nhận diện hoàn tất!",
      top1Conclusion: "Top-1 (kết luận)",
      days7Ago: "7 ngày qua",
      days30Ago: "30 ngày qua",
      timesLabel: "{{ code }} lần",
      sysLogoUploadDrag: "Kéo thả logo vào đây hoặc nhấp để chọn",
      sysLogoUploadHelp: "PNG, JPG, JPEG, SVG hoặc WEBP (Tối đa 2MB)",
      sysPlanBasicDesc: "Dành cho cá nhân dùng thử",
      scansLabel: "lượt",
      sysRecommended: "Khuyên dùng",
      sysPlanProDesc: "Lựa chọn phổ biến nhất",
      sysPlanEntDesc: "Không giới hạn cho tổ chức",
      sysTotalPages: "Tổng số trang",
      sysStatus: "Trạng thái",
      sysOnline: "Trực tuyến",
      sysHistory: "Lịch sử",
      sysAutoSave: "Tự động lưu",
      sysPermission: "Quyền hạn",
      sysFilterPolicy: "Chính sách",
      sysFilterSupport: "Hỗ trợ & HD",
      planBasicLimitDesc: "<strong>50 lượt</strong> nhận diện",
      planProLimitDesc: "<strong>200 lượt</strong> nhận diện",
      planEntLimitDesc: "<strong>Không giới hạn</strong> nhận diện",
      adUnlockPrompt: "Bạn đã sử dụng hết 10 lượt miễn phí. Xem một đoạn quảng cáo ngắn để nhận thêm",
      otpVerifyPageTitle: "Xác thực OTP - PetAI",
      forgotPasswordHeader: "Khôi phục mật khẩu",
      forgotOtpDesc: "Nếu thông tin bạn nhập là chính xác, mã OTP 6 số đã được gửi đến email khôi phục của tài khoản.",
      otpCodeLabel: "Mã xác thực OTP",
      otpExpiryLabel: "Mã OTP sẽ hết hạn sau:",
      confirmOtpBtn: "Xác nhận OTP",
      orLabel: "hoặc",
      reenterEmailLink: "Nhập lại email",
      resendOtpLink: "Gửi lại mã OTP",
      emailVerifyHeader: "Xác thực Email",
      registerOtpDesc: "Chúng tôi đã gửi mã xác thực OTP 6 số đến Gmail của bạn:",
      confirmAccountBtn: "Xác nhận tài khoản",
      reregisterLink: "Đăng ký lại",
      toastDbConnectionError: "Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.",
      toastEmailOrUsernameNotExist: "Email hoặc tên đăng nhập này không tồn tại trong hệ thống. Vui lòng kiểm tra lại.",
      toastAccountNotVerified: "Tài khoản này chưa được xác thực email. Vui lòng liên hệ hỗ trợ.",
      toastMailSystemError: "Hệ thống gửi thư gặp sự cố. Vui lòng thử lại sau.",
      toastOtpSentGmail: "Mã OTP đã được gửi về Gmail của bạn. Vui lòng xác thực.",
      toastPleaseEnterOtp: "Vui lòng nhập mã OTP",
      toastOtpIncorrectOrExpired: "Mã OTP không chính xác hoặc đã hết hạn.",
      toastOtpFailed5Times: "Bạn đã nhập sai OTP quá 5 lần. Vui lòng yêu cầu khôi phục lại mật khẩu.",
      toastOtpExpiredResend: "Mã OTP đã hết hạn. Vui lòng bấm gửi lại mã.",
      toastAccountNotFoundOrLocked: "Tài khoản không tồn tại hoặc đã bị khóa.",
      toastOtpVerifySuccess: "Xác thực OTP thành công. Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.",
      toastLoginFailedSystemError: "Không thể thiết lập đăng nhập do lỗi hệ thống. Vui lòng thử lại sau.",
      toastOtpResendLimit: "Bạn đã yêu cầu gửi lại mã OTP quá 3 lần trong vòng 10 phút. Vui lòng thử lại sau.",
      toastSendEmailFailed: "Không thể gửi email OTP. Vui lòng thử lại sau.",
      toastOtpNewSentGmail: "Mã OTP mới đã được gửi thành công về Gmail của bạn.",
      toastAccountPermanentlyDeleted: "Tài khoản của bạn đã bị xóa vĩnh viễn.",
      toastAccountUnverifiedLogin: "Tài khoản chưa được xác thực email. Vui lòng xác thực email trước khi đăng nhập.",
      toastAccountDeletedSupport: "Tài khoản này đã bị xóa vĩnh viễn. Vui lòng liên hệ hỗ trợ nếu cần được giúp đỡ.",
      toastAccountLockedOrDeleted: "Tài khoản đã bị khóa hoặc đã xóa. Vui lòng liên hệ hỗ trợ.",
      toastTemporaryPasswordWarning: "Bạn đang sử dụng mật khẩu tạm thời. Vui lòng đổi mật khẩu mới để tiếp tục sử dụng hệ thống.",
      toastMustAgreeTerms: "Bạn phải đồng ý với điều khoản dịch vụ và chính sách bảo mật",
      toastGmailOnly: "Chỉ chấp nhận email đăng ký có đuôi @gmail.com",
      toastSendEmailRegisterFailed: "Không thể gửi email OTP. Vui lòng kiểm tra lại cấu hình email hoặc thử lại sau.",
      toastRegisterOtpSent: "Mã OTP đã được gửi về Gmail của bạn. Vui lòng xác thực.",
      toastRegisterInfoNotFound: "Không tìm thấy thông tin đăng ký. Vui lòng thực hiện đăng ký lại.",
      toastRegisterOtpFailed5Times: "Bạn đã nhập sai OTP quá 5 lần. Vui lòng đăng ký lại từ đầu.",
      toastRegisterSystemError: "Không thể tạo tài khoản do lỗi hệ thống. Vui lòng thử lại.",
      toastRegisterResendLimit: "Bạn đã yêu cầu gửi lại mã OTP quá 3 lần trong vòng 10 phút. Vui lòng đợi thêm trước khi thử lại.",
      toastEnterNewPassword: "Vui lòng điền mật khẩu mới và xác nhận mật khẩu.",
      toastFillAllPasswordInfo: "Vui lòng điền đầy đủ thông tin để thay đổi mật khẩu.",
      toastPasswordMinLength: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      toastPasswordsDoNotMatch: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
      toastUserNotFound: "Không tìm thấy người dùng.",
      toastCurrentPasswordIncorrect: "Mật khẩu hiện tại không chính xác.",
      toastSettingsSaved: "Cài đặt và mật khẩu đã được thay đổi thành công!",
      toastPleaseLogin: "Vui lòng đăng nhập để thực hiện.",
      toastInvalidSession: "Phiên đăng nhập không hợp lệ.",
      toastNoImageUpload: "Không tìm thấy file ảnh tải lên.",
      toastFilenameEmpty: "Tên file rỗng.",
      toastNotPaidYet: "Bạn chưa thanh toán.",
      toastAutoConfirmInfo: "Hệ thống sẽ tự xác nhận khi nhận được giao dịch. Bạn không cần bấm xác nhận thủ công.",
      toastPlanActivated: "Đã xác nhận thanh toán và kích hoạt gói của bạn.",
      toastTransferRecordedPending: "Đã ghi nhận bạn đã chuyển tiền. Đơn hàng đang chờ admin xác nhận.",
      toastTransferRecordFailed: "Không thể ghi nhận (đơn có thể đã được báo/đã xác nhận).",
      toastConfirmTransferFailed: "Không thể ghi nhận chuyển tiền. Vui lòng thử lại.",
      toastLoginToViewPayments: "Vui lòng đăng nhập để xem lịch sử thanh toán.",
      toastUsersOnlyPage: "Trang này chỉ dành cho tài khoản người dùng.",
      toastInvalidUserId: "User ID không hợp lệ.",
      toastLoadConfigFailed: "Không thể tải cấu hình hệ thống.",
      toastSaveConfigSuccess: "Cập nhật cấu hình hệ thống thành công.",
      toastSaveConfigFailed: "Lỗi lưu cấu hình hệ thống.",
      toastInvalidLegalPage: "Trang pháp lý không hợp lệ.",
      toastSaveLegalFailed: "Lỗi cập nhật nội dung trang pháp lý.",
      toastLogoNotFound: "Không tìm thấy file logo.",
      toastNoFileSelected: "Chưa chọn file upload.",
      toastLogoUnsupportedFormat: "Định dạng file không hỗ trợ. Chỉ cho phép PNG, JPG, JPEG, SVG, WEBP.",
      toastLogoSaveSuccess: "Thay đổi logo trang web thành công.",
      toastSetPlanFailed: "Lỗi cấp gói cho người dùng.",
      toastEnterLockReason: "Vui lòng nhập lý do khóa.",
      toastLockUserSuccess: "Đã khóa người dùng thành công.",
      toastLockUserFailed: "Lỗi khóa người dùng.",
      toastUnlockUserSuccess: "Đã mở khóa người dùng thành công.",
      toastUnlockUserFailed: "Lỗi mở khóa người dùng.",
      toastDeleteUserFailed: "Lỗi xóa người dùng.",
      toastErrorOccurred: "Đã xảy ra lỗi",
      toastUnsupportedFormat: "Định dạng file không được hỗ trợ.",
      toastUploadImageFailed: "Không thể tải ảnh lên. Vui lòng thử lại.",
      toastAnalyzeImageFailed: "Đã xảy ra lỗi khi phân tích ảnh",
      toastConnectionFailed: "Đã xảy ra lỗi kết nối",
      toastAutoTranslating: "Đang tự động dịch các mục chưa có bản dịch...",
      toastAutoTranslateSuccess: "Đã tự động dịch thành công!",
      toastSavePageSuccess: "Đã lưu nội dung trang thành công!",
      toastRestoreOriginalSuccess: "Đã khôi phục nội dung gốc!",
      toastRestoreVersionSuccess: "Đã khôi phục phiên bản thành công!",
      confirmTitle: "Xác nhận",
      alertTitle: "Thông báo",
      warningTitle: "Cảnh báo",
      dangerTitle: "Cảnh báo nguy hiểm",
      successTitle: "Thành công",
      infoTitle: "Thông tin",
      confirm: "Xác nhận",
      cancel: "Hủy",
      loading: "Đang xử lý...",
      confirmLogoutText: "Bạn có chắc chắn muốn đăng xuất tài khoản?",
      confirmRestoreAccountText: "Khôi phục tài khoản này sẽ hủy bỏ yêu cầu xóa. Bạn có chắc chắn không?",
      confirmClearHistoryText: "Bạn có chắc muốn xóa toàn bộ lịch sử nhận diện? Hành động này không thể hoàn tác.",
      confirmSaveConfigText: "Thay đổi cấu hình có thể ảnh hưởng đến hoạt động của toàn hệ thống. Bạn có chắc muốn lưu?",
      settingsTabProfile: "Hồ sơ",
      settingsTabSecurity: "Bảo mật",
      settingsTabNotifications: "Thông báo",
      settingsTabAppearance: "Giao diện",
      settingsTabPrivacy: "Quyền riêng tư",
      editBtn: "Chỉnh sửa",
      cancelBtn: "Hủy",
      saveChangesBtn: "Lưu thay đổi",
      clearHistoryConfirmTitle: "Xác nhận xóa lịch sử",
      clearHistoryConfirmText: "Bạn có chắc muốn xóa toàn bộ lịch sử nhận diện? Hành động này sẽ xóa tất cả dữ liệu dự đoán và tệp ảnh liên quan trên máy chủ. Hành động này không thể hoàn tác.",
      confirmDelete: "Xác nhận xóa",
      changePasswordDesc: "Mật khẩu mới (tối thiểu 6 ký tự)",
      personalInfoTitle: "Thông tin cá nhân",
      notificationsTitle: "Cài đặt thông báo",
      appearanceTitle: "Giao diện",
      privacyTitle: "Quyền riêng tư",
      dangerZoneTitle: "Vùng nguy hiểm",
      dangerZoneDesc: "Hành động không thể hoàn tác nếu quá thời hạn",
      deleteAccountTitle: "Yêu cầu xóa tài khoản",
      sendingStatus: "Đang gửi...",
      confirmingStatus: "Đang xác nhận...",
      deleting: "Đang xóa...",
      securityGuideTitle: "Hướng dẫn bảo mật",
      pwdGuideLen: "Độ dài mật khẩu",
      pwdGuideLenDesc: "Mật khẩu phải chứa ít nhất 6 ký tự. Nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.",
      pwdGuideUnique: "Không dùng lại mật khẩu cũ",
      pwdGuideUniqueDesc: "Tránh sử dụng chung một mật khẩu cho nhiều tài khoản khác nhau trên Internet.",
      pwdGuideOtp: "Bảo mật hai lớp",
      pwdGuideOtpDesc: "Các hành động nhạy cảm như xóa tài khoản đều yêu cầu xác thực bằng mã OTP gửi về email đăng ký.",
      notificationGuideTitle: "Thông tin gửi nhận",
      emailActivityTitle: "Email thông báo bảo mật",
      emailActivityDesc: "Gửi cảnh báo tức thì qua email khi có thay đổi mật khẩu hoặc yêu cầu xóa tài khoản.",
      systemActivityTitle: "Thông báo trên trình duyệt",
      systemActivityDesc: "Hiển thị thông báo nổi (toasts) trực quan khi AI hoàn thành phân tích hoặc khi hệ thống được nâng cấp."
    },

    en: {
      homePageTitle: "PetAI | Intelligent Dog Breed Identification",
      homeHeroTag: "PROJECT: DOG BREED IDENTIFICATION",
      homeHeroTitle: "DOG BREED IDENTIFICATION",
      homeHeroDesc:
        "Identify purebred and mixed breed dogs from input photos, returning Top-3 breeds with confidence scores and visual explanations.",
      homeStartBtn: "Start Identifying",
      homeHowItWorks: "How It Works",
      homeAccuracy: "ACCURACY",
      homeTryNow: "Try Now",
      homeFeaturesTitle: "What Makes PetAI Stand Out?",
      homeFeaturesSub:
        "Experience fast, clear, and explainable identification.",
      homeFeature1Title: "Fast Identification",
      homeFeature2Title: "Top-3 Breeds",
      homeFeature3Title: "Visual Explanations",
      homeFeature4Title: "Save History",
      homeDetail1Title: "Fast, clear results in seconds",
      homeDetail1Desc:
        "PetAI analyzes photos and returns clear results, helping you identify dog breeds quickly.",
      homeDetail1Point1: "Fast image processing without waiting",
      homeDetail1Point2: "Top-3 results with confidence levels",
      homeDetail1Point3: "Easy-to-understand highlighted regions",
      homeDemoTitle: "RESULT ILLUSTRATION",
      homeViewHistory: "View identification history",
      homeDetail2Title: "Top-3 breeds for easy comparison",
      homeDetail2Desc:
        "The system returns the 3 most likely breeds, useful for mixed breed dogs.",
      homeDetail2Point1: "Results sorted by confidence scores",
      homeDetail2Point2: "Quick comparison between close breeds",
      homeDetail2Point3: "Suitable recommendations for mixed breeds",
      homeTop3Title: "TOP-3 RECOMMENDATIONS",
      homeDemoDisclaimer: "Illustrative results, percentages may vary.",
      homeDetail3Title: "Visual, easy-to-understand explanations",
      homeDetail3Desc:
        "Highlights key visual features to explain how the AI makes decisions.",
      homeDetail3Point1: "Highlights ears, eyes, and snout regions",
      homeDetail3Point2: "Intuitive and easy-to-track visuals",
      homeDetail3Point3: "Increases confidence for reference use",
      homeHighlightedRegions: "HIGHLIGHTED REGIONS",
      homeDemoRegionDesc: "Ears and eyes regions are clearly highlighted.",
      homeDemoHeatmapDesc: "Simulated heatmap illustration.",
      homeDetail4Title: "Save history for future retrieval",
      homeDetail4Desc:
        "Review previous scan results for easy comparison and sharing.",
      homeDetail4Point1: "Saves results automatically over time",
      homeDetail4Point2: "Quick filter by breed or date",
      homeDetail4Point3: "Share results with friends",
      homeRecentHistoryTitle: "RECENT HISTORY",
      homeOpenHistoryBtn: "Open History",
      homeCommunityTitle: "TRUSTED BY PET LOVERS",
      homeCommunitySub:
        "PetAI helps dog owners, pet shops, and vet clinics make faster decisions from real photos.",
      homeStatsUsers: "USERS",
      homeStatsUsersDesc: "Registered accounts",
      homeStatsPredictions: "PREDICTIONS",
      homeStatsPredictionsDesc: "Processed scans",
      homeStatsAccuracyDesc: "Optimized for purebred and mixed breeds",
      homeStatsSupport: "SUPPORT",
      homeStatsSupportDesc: "Customer support during usage",
      homeCoreValuesTitle: "CORE VALUES",
      homeCoreValuesSub:
        "Fast, clear, and explainable identification using advanced deep learning.",
      homeCoreValue1Tag: "01 / DATA",
      homeCoreValue1Title: "120+ Dog Breeds",
      homeCoreValue1Desc:
        "Comprehensive classification of popular breeds and hybrid detection with a huge database.",
      homeCoreValue2Tag: "02 / RESULTS",
      homeCoreValue2Title: "Top-3 Results",
      homeCoreValue2Desc:
        "Returns the 3 most likely breeds, optimized for mixed breeds.",
      homeCoreValue3Tag: "03 / VISUALIZATION",
      homeCoreValue3Desc:
        "Highlights key visual features (ears, eyes, snout) to show how AI identifies the dog.",
      homeCoreValue4Tag: "04 / SECURITY",
      homeCoreValue4Title: "Data Protection",
      homeCoreValue4Desc:
        "Uploaded photos are processed securely and used only for identification purposes.",
      homeCoreValue5Tag: "05 / PERFORMANCE",
      homeCoreValue5Title: "Instant Processing",
      homeCoreValue5Desc:
        "Get clear results in seconds thanks to our high-performance optimized system.",
      homePricingTitle: "TRANSPARENT PRICING",
      homePricingSub:
        "Choose the plan that best fits your identification needs.",
      homeForever: "forever",
      homePlanFreeScans: "10 scans",
      homePlanFreeAds: "Max 3 ad views",
      homePlanFreeSuit: "Suitable for trial",
      homePlanFreeBtn: "Get Started",
      homePricing7Days: "7 days",
      homePricing30Days: "30 days",
      homePricing90Days: "90 days",
      homePlanEntScans: "Unlimited scans",
      homePlanChooseBtn: "Choose Plan",
      homePlanProBtn: "Choose Pro",
      homeWorkflowTitle: "Identification Process",
      homeWorkflowSub:
        "From input photo to final results in just a few seconds.",
      homeStep1Tag: "STEP 1 - UPLOAD",
      homeStep1Title: "Upload clear photo",
      homeStep1Desc:
        "Take a front-facing, well-lit photo to increase accuracy.",
      homeStep1Status: "READY",
      homeStep2Tag: "STEP 2 - AI ANALYSIS",
      homeStep2Title: "YOLOv8 model + classification",
      homeStep2Desc:
        "Detects the dog and classifies the breed based on facial features.",
      homeStep2Status: "INSTANT",
      homeStep3Tag: "STEP 3 - RESULTS",
      homeStep3Title: "Top-3 breeds & confidence",
      homeStep3Status: "COMPLETE",
      homeAudienceTitle: "Suitable for various user groups",
      homeAudience1Title: "Pet Owners",
      homeAudience1Desc:
        "Quickly check dog breed for care tracking and training guidance.",
      homeAudience2Title: "Pet Shops",
      homeAudience2Desc:
        "Support customer consultation based on clear and explainable AI results.",
      homeAudience3Title: "Vet Clinics",
      homeAudience3Desc:
        "Get initial reference data before intake and clinical assessment.",
      homeFaqTitle: "FREQUENTLY ASKED QUESTIONS",
      homeFaqSub: "Quick answers to common questions about PetAI.",
      homeFaq1Q: "Is the result 100% accurate?",
      homeFaq1A:
        "No. The AI system returns results based on probabilities from the training dataset. We provide the Top-3 breeds with the highest confidence scores for better objective reference, which is especially useful for mixed breeds.",
      homeFaq2Q: "How long does it take to get results?",
      homeFaq2A:
        "The system is optimized to return results within seconds (usually 2-5 seconds) after the image is uploaded successfully. This speed may vary slightly depending on your network speed and image file size.",
      homeFaq3Q: "How is the uploaded image processed?",
      homeFaq3A:
        "Each image you upload is encrypted and transmitted via secure protocols. PetAI commits to using the images solely for dog breed identification and will not share your personal data with any third party without your consent.",
      homeFaq4Q: "Does PetAI support mixed breeds?",
      homeFaq4A:
        "Yes, PetAI is specifically designed to handle both purebred and mixed breed dogs. For mixed breeds, the system analyzes morphological features and displays the Top-3 dog breeds with the closest similarity along with confidence percentages for each.",
      homeCtaSub: "Clear results in seconds",
      homeCtaDesc:
        "Top-3 breeds, clear confidence. Join the community of thousands of pet lovers using PetAI every day.",
      homeStartFreeBtn: "Start for Free",
      homeGuideBtn: "User Guide",
      lockAccountBtn: "Lock Account",
      unlockAccountBtn: "Unlock Account",
      deleteUserBtn: "Delete User",
      reportedTransfer: "Transfer Reported",
      pendingConfirmOrders: "Pending Orders",
      confirmPaymentTitle: "Confirm Payment",
      confirmPaymentSub: "Please review selected package and proceed",
      adUnlockRemaining: "Remaining unlocks",
      adViewsUsed: "Ads watched",
      adsWatchedLabel: "Ads watched",

      /* ── Language switcher ── */
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
      close: "Close",
      languageLabel: "English",
      languageFlag: "🇺🇸",
      shortLabel: "US",

      /* ── Nav top-level ── */
      home: "Home",
      product: "Product",
      features: "Features",
      pricing: "Pricing",
      about: "About",
      login: "Login",
      register: "Register",
      logout: "Logout",
      dashboard: "Dashboard",
      predict: "Identify",
      history: "History",
      statistics: "Statistics",
      upgrade: "Upgrade",
      payments: "Payment History",
      manageUsers: "Users",
      approveOrders: "Orders",
      systemConfig: "Configure",
      sysConfigTitle: "System Configuration",
      sysConfigPageTitle: "System Configuration - PetAI",
      sysConfigDesc: "Manage site logo, contact email, pricing subscription plans, and content for legal policy pages.",
      sysTabGeneral: "General Settings",
      sysTabPlans: "Subscription Plans",
      sysTabLegal: "Legal Policies & Terms",
      sysLogoTitle: "Website Logo",
      sysLogoDesc: "Change the logo image displayed on the site header and footer.",
      sysLogoCurrent: "Current Logo",
      sysLogoUploadNew: "Upload New Logo",
      sysLogoUpdateBtn: "Update Logo",
      sysContactTitle: "Contact Configuration",
      sysContactDesc: "Setup main website contact information displayed to users.",
      sysContactEmailLabel: "Contact / Support Email",
      sysSaveSettingsBtn: "Save Settings",
      sysPlansTitle: "Subscription Plans",
      sysPlansDesc: "Modify prices, validity duration, and scan quota limits for each user subscription plan.",
      sysPlanPriceVnd: "Plan Price (VND)",
      sysPlanDurationDays: "Duration (Days)",
      sysPlanScanLimit: "Scan Limit (Times)",
      sysPlanEntScanNote: "Scan Limit (Type 'unlimited' for no limit)",
      sysPlanBasic: "Basic Plan",
      sysPlanPro: "Pro Plan",
      sysPlanEnterprise: "Enterprise Plan",
      sysSavePlansBtn: "Save Plans Configuration",
      sysLegalTitle: "Legal Pages & Terms Content",
      sysLegalDesc: "Compose policies and terms content directly using HTML code or plain text.",
      sysLegalSelectLabel: "Select page to edit:",
      sysLegalOptPrivacy: "Privacy Policy",
      sysLegalOptTerms: "Terms of Service",
      sysLegalOptPayment: "Payment Policy",
      sysLegalOptDeletion: "Data Deletion Policy",
      sysLegalOptSupport: "Support Page",
      sysLegalOptContact: "Contact Page",
      sysLegalOptUserGuide: "User Guide",
      sysDescPrivacy: "Governs how personal information of users is collected, secured, and used.",
      sysDescTerms: "Legal terms and regulations binding between users and the PetAI application.",
      sysDescPayment: "Payment process, account upgrade, and refund policy.",
      sysDescDeletion: "Process and policy supporting users to delete accounts and stored data.",
      sysDescUserGuide: "Provides a detailed manual on how to use analysis and diagnostic features.",
      sysDescSupport: "Answers frequently asked questions and provides technical support to users.",
      sysDescContact: "Official contact details, address, and direct support channels of PetAI.",
      sysViewPage: "View Page",
      sysEditPage: "Edit",
      sysLangVi: "Vietnamese (VI)",
      sysLangEn: "English (EN)",
      sysAutoTranslateBtn: "Auto-translate to English",
      sysLegalContentLabel: "HTML / Text Content",
      sysLegalNote: "Note: Leaving it empty will restore to default translations defined in i18n.js",
      sysSaveLegalBtn: "Save Page Content",
      adminGroupTitle: "ADMIN",

      /* ── Sidebar ── */
      quickAccess: "Quick Access",
      uploadAnalyze: "Analyze",
      predictionHistory: "History",
      personalStats: "Statistics",
      upgradePlan: "Upgrade",
      personalInfo: "Personal Info",
      accountSettings: "Settings",
      sidebarPreferencesTitle: "PREFERENCES",
      sidebarLanguageLabel: "Language",
      sidebarNightModeLabel: "Dark Mode",

      /* ── Header ── */
      searchPlaceholder: "Search...",
      uploadPhotoBtn: "Upload Photo",

      /* ── Avatar dropdown ── */
      role: "Role:",
      plan: "Plan:",

      /* ── Footer ── */
      aboutPetAI: "About PetAI",
      connect: "Connect",
      identifyNow: "Identify Now",
      collection: "Collection",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      paymentPolicy: "Payment Policy",
      dataDeletion: "Data Deletion Policy",
      support: "Support",
      contact: "Contact",
      userGuide: "User Guide",
      copyright: "Copyright © 2026 PetAI. All rights reserved",
      footerUserGuide: "USER GUIDE",
      footerTerms: "TERMS",
      footerPrivacy: "PRIVACY",
      footerPayment: "PAYMENT",
      footerDataDeletion: "DATA DELETION POLICY",
      footerSupport: "SUPPORT",
      footerContact: "CONTACT",
      footerDesc:
        "AI-powered dog breed identification app for pet lovers. Fast and accurate results.",
      historyScan: "Identification History",
      servicePlans: "Service Plans",
      contactInfoTitle: "Contact Information",
      contactEmail: "Email: support@tienphongtech.vn",
      contactPhone: "Phone: 0916 416 409",
      contactAddress: "Address: P16, 8th Street, Nam Can Tho Urban Area, Cai Rang Dist, Can Tho City",
      paymentPolicyPageTitle: "Payment Policy | PetAI",
      paymentUpdateDatePrefix: "Last updated: June 20, 2026",
      paymentSection1Title: "1. Payment Methods",
      paymentSection1Desc: "The system supports bank transfer payment via automatic VietQR code or direct bank transfer with details displayed during the plan upgrade process.",
      paymentSection2Title: "2. Transaction Processing",
      paymentSection2Desc: "After transferring the exact amount and memo matching the instructions, the automatic VietQR gateway will verify and activate your subscription plan within 1 to 5 minutes. If manual review is required, processing may take up to 24 business hours.",
      paymentSection3Title: "3. Refund Policy",
      paymentSection3Desc: "We issue refunds in the following scenarios: (a) A system error occurs where funds are deducted but the subscription plan cannot be activated and technical resolution is impossible; (b) The user transfers an amount exceeding the registered plan price. All refund requests must be sent to support@pet.ai with a transaction receipt screenshot for audit and processing within 3-5 business days.",
      paymentSection4Title: "4. Transaction Security",
      paymentSection4Desc: "All payment transactions are securely routed through our integrated gateway. Bank account details and transaction memos are encrypted using SSL/TLS standards. We commit to never storing sensitive client credentials.",
      paymentSection5Title: "5. Disputes and Complaints",
      paymentSection5Desc: "For any billing complaints or disputes, please provide the Order Code and bank transfer proof to our customer support desk for immediate resolution.",

      /* ── Dashboard ── */
      dashWelcomeDesc:
        "Track your identification activity, history and prediction performance at a glance.",
      uploadNew: "Upload Photo",
      viewHistory: "View History",

      /* Dashboard admin stat cards */
      totalRevenue: "Total Revenue",
      revenueFromPaid: "From paid plans",
      totalUsers: "Total Users",
      registeredAccounts: "Registered accounts",
      newThisWeek: "new this week",
      pendingOrders: "Pending Orders",
      viewPendingList: "View pending list",
      todayNew: "today",
      totalSystemPredictions: "Total System Predictions",
      allSystemScans: "All scans across the system",
      todayCount: "today",

      /* Dashboard user stat cards */
      totalPredictions: "Total Predictions",
      yourScans: "Your personal scans",
      avgConfidence: "Avg. Confidence",
      avgAccuracy: "Average accuracy",
      breedsAnalyzed: "Breeds Analyzed",
      uniqueBreedsFound: "Unique breeds you identified",
      viewReport: "View Report",
      detailedStats: "Detailed Statistics",
      deepAnalysis: "In-depth analysis of your scan history",

      /* Dashboard charts */
      financialAnalytics: "Financial Analytics",
      revenueAndPlans: "Revenue & subscription plan distribution",
      revenueTrend: "Revenue Trend",
      revenueTrendSubtitle: "Total amount from paid orders (VND)",
      days7: "7 days",
      days30: "30 days",
      days90: "90 days",
      months12: "12 months",
      custom: "Custom",
      selectDateRange: "Select date range",
      fromDate: "From date",
      toDate: "To date",
      apply: "Apply",
      subscriptionDistribution: "Subscription Distribution",
      subscriptionByUser: "User percentage per plan",
      planDetails: "Plan Details",
      activityCharts: "Activity Charts",
      liveUpdate: "Live updates",
      predTrend7: "Prediction trend for last 7 days",
      predTrendSubtitle: "Number of images identified per day",
      last7days: "Last 7 days",
      top5Breeds: "Top 5 Most Popular Breeds",
      top5BreedsSubtitle: "Most frequently identified dog breeds",
      confidenceDist: "Confidence Distribution",
      confidenceDistSubtitle: "Classifier confidence level breakdown",
      recentResults: "Recent Results",
      viewAll: "View All",
      today: "Today",
      yesterday: "Yesterday",
      last7daysTab: "Last 7 Days",
      emptyDashboard:
        "You have no identification history. Start by uploading a new photo.",
      predictionLabel: "Prediction:",

      /* ── History page ── */
      historyTitle: "Identification History",
      totalPredictionsLabel: "Total Identifications",
      imageScanCount: "Image scan count",
      pureDog: "Purebred",
      pureBreed: "Pure breed",
      hybridDog: "Mixed Breed",
      hybridBreed: "Suspected hybrid breed",
      avgConfidenceLabel: "Avg. Confidence",
      avgAccuracyLabel: "Average accuracy",
      identificationList: "Identification List",
      newIdentification: "New Identification",
      all: "All",
      searchBreed: "Search breed...",
      clearSearch: "Clear search",
      viewDetail: "View Details",
      emptyHistory: "No identification history",
      emptyHistoryDesc:
        "Upload your first photo to start predicting dog breeds.",
      startNow: "Start Now",

      /* History modal */
      modalBreedLabel: "Breed:",
      modalConfLabel: "Confidence:",
      modalDateLabel: "Date:",
      modalSpeciesLabel: "Species:",
      close: "Close",
      deleteBtn: "Delete",
      deleteConfirm:
        "Are you sure you want to delete this identification record?",

      /* ── Statistics page ── */
      statsTitle: "Your Identification Statistics",
      statsSubtitle:
        "Overview of prediction count, confidence and top dog breeds.",
      exportReport: "Export Report",
      totalScans: "Total Identifications",
      totalScansLabel: "Total identification count",
      avgConfStat: "Avg. Confidence",
      avgAccStat: "Average accuracy",
      breedsExplored: "Breeds Explored",
      uniqueBreeds: "Unique dog breeds",
      recentActivity: "Recent Activity",
      recentActivityLabel: "Most recent identifications",
      activityChart: "Activity Charts",
      trendTitle: "Identification Trend",
      trendSubtitle: "Number of images identified per day",
      noDataInRange: "No data available for this time range.",
      top5BreedsTitle: "Top 5 Most Popular Breeds",
      top5BreedsDesc: "Most frequently identified dog breeds",
      noTopBreedData: "Not enough data to display top breeds.",
      confidenceDistTitle: "Confidence Distribution",
      confidenceDistDesc: "Classifier confidence level breakdown",
      breedDistTitle: "Breed Distribution",
      breedDistDesc: "Proportion of identified dog breeds",
      noDataChart: "No data yet",
      recentResultsTitle: "Recent Results",
      noActivity: "No activity yet!",
      noActivityDesc:
        "Upload a photo of your pet to start identifying dog breeds.",
      timesCount: "times",

      /* ── Settings page ── */
      settingsTitle: "Account Settings",
      profileSection: "Personal Information",
      fullnameLabel: "Full Name",
      fullnameHint: "This name appears on your profile and navigation bar.",
      usernameLabel: "Username",
      usernameLocked: "Username cannot be changed.",
      emailLabel: "Email",
      appearanceSection: "Appearance",
      themeLabel: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      themeAuto: "Auto",
      privacySection: "Privacy",
      historyStorage: "History Storage",
      historyStorageDesc:
        "Image data and prediction results are saved in your history. You can clear them at any time.",
      viewHistoryLink: "View History",
      clearAllHistory: "Clear All History",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      saving: "Saving...",
      deleting: "Deleting...",
      clearHistoryConfirm:
        "Are you sure you want to clear all identification history? This action cannot be undone.",
      infoSidebarLink: "Information",
      appearanceSidebarLink: "Appearance",
      privacySidebarLink: "Privacy",
      changePasswordTitle: "Change Password",
      currentPasswordLabel: "Current Password",
      currentPasswordPlaceholder: "Enter current password",
      newPasswordLabel: "New Password",
      newPasswordPlaceholder: "Enter new password (min 6 characters)",
      confirmNewPasswordLabel: "Confirm New Password",
      confirmNewPasswordPlaceholder: "Confirm new password",
      notificationsSection: "Notification Settings",
      systemNotificationsLabel: "System Notifications",
      systemNotificationsDesc: "Receive instant notifications on the UI when there is new activity.",
      emailNotificationsLabel: "Email Notifications",
      emailNotificationsDesc: "Receive periodic reports and account updates via email.",
      subscriptionUpgradeBtn: "Upgrade Plan",

      /* ── Login page ── */
      loginTitle: "Sign In",
      loginSubtitle: "Welcome back! Please enter your details.",
      usernameOrEmail: "Username or Email",
      usernamePlaceholder: "e.g. username or email@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter password",
      forgotPassword: "Forgot password?",
      rememberLogin: "Remember me",
      loginBtn: "Sign In",
      orContinueWith: "or continue with",
      loginWithGoogle: "Sign in with Google",
      noAccount: "Don't have an account?",
      registerNow: "Register now",

      /* Login - left panel */
      loginLeftTitle: "Fast and accurate dog breed identification",
      loginLeftSubtitle:
        "A smart assistant that helps you identify and understand your pets better.",
      loginFeature1Title: "Clear confidence scores",
      loginFeature1Desc: "Detailed AI analysis",
      loginFeature2Title: "Scan history",
      loginFeature2Desc: "Save all identification results",

      /* Login validation */
      usernameShort: "Username/email must be at least 3 characters.",
      passwordShort: "Password must be at least 6 characters.",

      /* ── Register page ── */
      registerTitle: "Create New Account",
      registerSubtitle:
        "Fill in the details below to start identifying dog breeds.",
      fullnameLabelReg: "Full Name",
      fullnamePlaceholder: "John Doe",
      usernameLabelReg: "Username",
      usernamePlaceholderReg: "3-20 chars, letters/numbers/_",
      passwordLabelReg: "Password",
      passwordPlaceholderReg: "At least 6 characters",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter password",
      agreeTerms: "I agree to the terms of service and privacy policy.",
      createAccount: "Create Account",
      registerWithGoogle: "Sign up with Google",
      alreadyHaveAccount: "Already have an account?",
      loginNow: "Sign in",

      /* Register left panel */
      regLeftTitle: "Join the dog-loving community with AI",
      regLeftSubtitle:
        "Save identification history, analyze habits, and receive smart health alerts for your furry friend.",
      regFeature1Title: "Welcome new member",
      regFeature1Desc: "Start with the Free plan today",
      regFeature2Title: "10 free scans",
      regFeature2Desc: "Each account comes with initial trial scans",
      regFeature3Title: "Account security",
      regFeature3Desc: "Personal information is securely protected",

      /* Register validation */
      fullnameTooShort: "Full name must be at least 2 characters.",
      invalidEmail: "Invalid email address.",
      usernameInvalid:
        "Username must be 3-20 characters (letters, numbers, _).",
      passwordTooShort: "Password must be at least 6 characters.",
      passwordMismatch: "Passwords do not match.",

      /* ── Upgrade / Pricing page ── */
      upgradeTitle: "Upgrade Your Plan",
      upgradeSubtitle:
        "Choose the right plan to experience the full features of PetAI",
      planFree: "Free",
      planBasic: "Basic",
      planPremium: "Premium",
      planEnterprise: "Enterprise",
      currentPlan: "Current Plan",
      choosePlan: "Choose Plan",
      perMonth: "/month",
      forever: "Forever",
      mostPopular: "Most Popular",
      bestValue: "Best Value",
      upgradePlanBtn: "Upgrade",
      buyNow: "Buy Now",
      contactSales: "Contact Sales",

      /* ── Payments / Orders page ── */
      paymentsTitle: "Payment History",
      paymentsSubtitle: "List of your plan upgrade transactions",
      orderCode: "Order Code",
      planName: "Plan",
      amount: "Amount",
      status: "Status",
      paymentDate: "Payment Date",
      action: "Action",
      statusPending: "Pending",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      statusPaid: "Paid",
      statusCancelled: "Cancelled",
      noPayments: "No transactions yet",
      noPaymentsDesc:
        "You haven't upgraded any plans yet. Explore available plans.",
      viewPlans: "View Plans",
      uploadProof: "Upload Proof",
      viewProof: "View Proof",
      cancelOrder: "Cancel Order",
      cancelConfirm: "Are you sure you want to cancel this order?",

      /* ── Admin: Manage Users ── */
      usersTitle: "User Management",
      usersSubtitle: "List of all users in the system",
      searchUser: "Search users...",
      filterAll: "All",
      filterAdmin: "Admin",
      filterUser: "User",
      userId: "ID",
      userName: "Name",
      userEmail: "Email",
      userRole: "Role",
      userPlan: "Plan",
      userScanCount: "Scan Count",
      userJoined: "Joined",
      userActions: "Actions",
      viewUser: "View Details",
      editUser: "Edit",
      deleteUser: "Delete User",
      deleteUserConfirm: "Are you sure you want to delete this user?",
      noUsers: "No users found",

      /* ── Admin: Confirmations / Approve Orders ── */
      confirmationsTitle: "Approve Upgrade Orders",
      confirmationsSubtitle: "Orders awaiting approval",
      approve: "Approve",
      reject: "Reject",
      approveConfirm: "Approve this order?",
      rejectConfirm: "Reject this order?",
      noPendingOrders: "No pending orders",

      /* ── Upload / Predict page ── */
      uploadTitle: "Dog Breed Identification",
      uploadSubtitle:
        "Upload a photo for AI to analyze and identify the dog breed",
      dragDropHere: "Drag and drop image here",
      orClickToSelect: "or click to select image",
      supportedFormats: "Supported: JPG, PNG, WEBP. Max 10MB.",
      analyzeBtn: "Analyze",
      analyzing: "Analyzing...",
      resultTitle: "Identification Results",
      confidence: "Confidence",
      breedLabel: "Breed",
      speciesLabel: "Species",
      analyzeAnother: "Identify Another Image",
      saveToHistory: "Save to History",
      noImageSelected: "No image selected",
      uploadError: "An error occurred while uploading the image.",

      /* ── Checkout page ── */
      checkoutTitle: "Checkout",
      orderSummary: "Order Summary",
      paymentMethod: "Payment Method",
      bankTransfer: "Bank Transfer",
      uploadTransferProof: "Upload Transfer Proof",
      submitOrder: "Submit Order",
      processingOrder: "Processing...",

      /* ── Common ── */
      loading: "Loading...",
      error: "An error occurred",
      success: "Success",
      retry: "Retry",
      back: "Back",
      next: "Next",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      search: "Search",
      filter: "Filter",
      export: "Export",
      share: "Share",
      copy: "Copy",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      notDetermined: "Undetermined",

      /* ── Forgot password page ── */
      forgotLeftTitle: "Password Recovery",
      forgotLeftSubtitle:
        "Account security is our top priority. We will assist you in recovering it quickly and safely.",
      forgotFeature1Title: "Secure Verification",
      forgotFeature1Desc: "Data is encrypted according to security standards",
      forgotFeature2Title: "Instant Recovery Email",
      forgotFeature2Desc: "Receive a reset link in just a few seconds",
      forgotFeature3Title: "24/7 Support",
      forgotFeature3Desc: "Our team is always ready when you need us",
      forgotTitle: "Forgot Password",
      forgotSubtitle:
        "Enter your email to receive instructions to reset your password.",
      registeredEmail: "Registered Email",
      sendInstructions: "Send Instructions",
      backToLogin: "Back to",
      loginLink: "login",

      /* ── Error page ── */
      errorPageTitle: "PetAI - Error",
      errorLabel: "Error",
      errorTitle: "Something went wrong",
      errorDefaultDesc:
        "We are experiencing an issue retrieving data. The resource you are looking for may have been moved or is temporarily unavailable.",
      backToHome: "Back to home page",
      checkSystem: "System check",
      errorRetryLater: "If the issue persists, please try again later.",

      /* ── Simulated ad modal ── */
      adUnlockTitle: "Watch ad to unlock scan limit",
      adUnlockDesc:
        "You have used all 10 free scans. Watch a short advertisement to receive 3 additional AI scans (Maximum 3 times).",
      adScanned: "Scanned",
      adUnlockRemaining: "Unlock left",
      adViewsUsed: "Ads viewed",
      adSponsor: "PetAI Sponsor",
      adRemaining: "Time remaining",
      adPlaying: "Simulated ad playing",
      adWarningDesc:
        "Please do not close this window. AI scan quota will be added to your account after the video finishes.",
      adWatchedComplete: "I have finished watching",
      adLimitReachedDesc:
        "If you have watched 3 times, you need to upgrade your plan to continue.",

      /* ── Flask dynamic messages ── */
      msgPleaseLogin: "Please login to use this feature.",
      msgAdLimitReached:
        "You have watched 3 ads. Please upgrade your plan to continue.",
      msgAdUnlocked: "Unlocked 3 more scans. You can continue!",
      msgAdError: "Failed to record ad view. Please try again.",
      msgHigherPlanActive:
        "You have a higher plan active. Cannot purchase a lower plan.",
      msgPlanStillHasScans:
        "Your current plan still has scans remaining. You can only renew when expired or out of scans.",
      msgInvalidOrder: "Payment order is invalid or expired. Please try again.",
      msgAutoConfirm:
        "The system uses auto-confirmation. Please wait for system to record transaction.",
      msgFlowChanged:
        "Payment flow has changed. Please create an order on the upgrade page first.",
      msgOrderNotFound: "Payment order does not exist or is invalid.",
      msgPlanActivated: "Payment confirmed and your plan has been activated.",
      msgPaymentPending:
        "Payment recorded. Your order is awaiting admin confirmation.",
      msgCannotConfirm:
        "Cannot record (order may have been reported/confirmed).",
      msgPaymentError: "Cannot record payment. Please try again.",
      msgMissingOrderId: "Missing payment order code.",
      msgOrderNotYours:
        "Payment order does not exist or does not belong to your account.",
      msgNotPaid: "You have not paid yet.",
      msgAutoConfirmDesc:
        "The system will auto-confirm when transaction is received. No manual action needed.",
      msgLoginToPayHistory: "Please login to view payment history.",
      msgUserOnlyPage: "This page is only for user accounts.",
      msgSelectImageFirst: "Please select an image before analyzing.",
      msgNoImageSelected:
        "No image selected. Please upload an image and try again.",
      msgOutofQuota:
        "You have used all 10 free scans and 3 ad views. Please purchase a plan to continue.",
      msgOutofFreeScans:
        "You have used all 10 free scans. Please watch an ad to unlock more scans.",
      msgWatchAdToUnlock: "Please watch an ad to unlock more scans.",
      msgAccountLocked:
        "Your account has been locked. Please contact the administrator.",
      msgGoogleEmailFailed:
        "Failed to retrieve email from Google. Please try again.",
      msgGoogleLoginFailed: "Google login failed. Please try again.",

      /* ── Admin: Page titles ── */
      adminConfirmationsTitle: "Approve Upgrade Orders - PetAI",
      adminUsersTitle: "User Management - PetAI",
      dashboardTitle: "Dashboard - PetAI",
      historyPageTitle: "Identification History - PetAI",
      statisticsPageTitle: "Statistics - PetAI",
      upgradePageTitle: "Upgrade Plan - PetAI",
      paymentsPageTitle: "Payment History - PetAI",
      settingsPageTitle: "Account Settings - PetAI",
      predictPageTitle: "Dog Breed Identification - PetAI",
      checkoutPageTitle: "Checkout - PetAI",

      /* ── Admin: Confirmations stat cards ── */
      confirmedRevenue: "Confirmed Revenue",
      totalRealRevenue: "Total Actual Revenue",
      paidOrders: "Paid Orders",
      approvedOrders: "Approved Orders",
      latestPayment: "Latest Payment",
      lastOrderTime: "Last Order Time",
      pendingConfirmOrders: "Pending Orders",
      needsAdminAction: "Needs Admin Action",

      /* ── Admin: Confirmations filters & table ── */
      searchConfirmationsPlaceholder: "Search order code, username, email...",
      allPlans: "All Plans",
      clearFilters: "Clear Filters",
      recentPaidOrders: "Recent Paid Orders",
      pendingApprovalsTitle: "Orders Awaiting Admin Approval",
      userCol: "User",
      confirmedAt: "Confirmed At",
      createdAt: "Created At",
      orderIdCol: "Order ID",
      amountCol: "Amount",
      noPaidOrders: "No paid orders yet.",
      noPendingApprovals: "No orders awaiting confirmation.",
      reportedTransfer: "Transfer Reported",
      autoConfirmBtn: "Auto",
      confirmActionTitle: "Confirm Action",
      confirmActionText: "Are you sure you want to perform this action?",
      cancelBtn: "Cancel",
      confirmBtn: "Confirm",
      paymentMethodCol: "Method",

      /* ── Admin: Users page ── */
      userListTitle: "User List",
      userListSubtitle:
        "Manage account status, service plans, and system access permissions.",
      approveOrdersBtn: "Approve Orders",
      totalUsersCard: "Total Users",
      registeredAccountsLabel: "Registered accounts",
      totalAdminsCard: "Total Admins",
      systemAdmins: "System administrators",
      activeLabel: "Active",
      activeAccounts: "Active accounts",
      lockedLabel: "Locked",
      lockedAccounts: "Locked accounts",
      searchUserPlaceholder: "Search username, email, full name...",
      allRoles: "All Roles",
      allStatuses: "All Statuses",
      filterUser: "User",
      statusActive: "Active",
      statusLocked: "Locked",
      userColHeader: "User",
      roleColHeader: "Role",
      statusColHeader: "Status",
      createdAtColHeader: "Created",
      planColHeader: "Plan",
      actionColHeader: "Actions",
      detailBtn: "Details",
      noUserData: "No user data available.",
      savePlanLabel: "Save Plan",
      updatePlanLabel: "Update Plan",

      /* ── Pagination ── */
      prevPage: "Previous",
      nextPage: "Next",

      /* ── Footer ── */
      footerDescText:
        "AI-powered dog breed identification app for pet lovers. Fast and accurate results.",

      /* ── Mobile menu ── */
      openMenu: "Open menu",
      closeMenu: "Close menu",

      /* ── Custom pagination ── */
      showingText: "Showing",
      ofText: "of",
      usersText: "users",
      pendingConfirmOrdersText: "orders awaiting confirmation",

      /* ── Upgrade Plan Page ── */
      upgradeTitle: "Upgrade Subscription Plan",
      upgradeDescFree:
        'You are using the <strong class="text-slate-300 dark:text-slate-200">FREE</strong> plan. Upgrade to increase scan limits and enjoy an ad-free experience.',
      upgradeDescPaidPrefix: "Your account is on the",
      upgradeDescPaidSuffix: " plan. You can upgrade or renew below.",
      choosePlanPay: "Select Package & Pay",
      planFreeTitle: "Free",
      planFreeSub: "Default starter plan",
      planFreePrice: "0 VND",
      planFreePriceSub: "Free forever",
      scanLimit10: "10 free AI scans",
      watchAdsMore: "Watch ads to get more scans",
      suitableTrial: "Suitable for trial use",
      currentPlan: "Current Plan",
      freePlanActive: "FREE plan active",
      cannotDowngrade: "Cannot downgrade",
      planBasicTitle: "Basic",
      planBasicSub: "For light usage",
      planBasicPrice: "1,000 VND",
      planBasicPriceSub: "/ 7 days usage",
      scanLimit50: "50 AI scans",
      noAds: "No ads",
      suitableLight: "Suitable for light usage",
      registerBtn: "Subscribe",
      basicPlanActive: "Basic plan active",
      usingHigherPlan: "Higher plan active",
      planProTitle: "Pro",
      planProSub: "Optimal & most popular",
      planProPrice: "5,000 VND",
      planProPriceSub: "/ 30 days usage",
      scanLimit200: "200 AI scans",
      prioritySpeed: "Priority processing speed",
      adFreeComfort: "Ad-free, usage without limits",
      recommended: "Recommended",
      proPlanActive: "Pro plan active",
      planEntTitle: "Enterprise",
      planEntSub: "Extremely high usage",
      planEntPrice: "15,000 VND",
      planEntPriceSub: "/ 90 days usage",
      scanLimitUnlimit: "Unlimited AI scans",
      vipBandwidth: "Optimized bandwidth & VIP",
      prioritySupport: "Top priority support",
      entPlanActive: "Enterprise plan active",
      confirmPaymentTitle: "Confirm Payment",
      confirmPaymentSub: "Please review selected package and proceed",
      upgradeLabel: "Select Upgrade Package",
      optPro: "Professional (Pro) — 5,000 VND / 30 days / 200 scans",
      optBasic: "Basic (Basic) — 1,000 VND / 7 days / 50 scans",
      optEnterprise:
        "Enterprise (Enterprise) — 15,000 VND / 90 days / Unlimited",
      gatewayInfo:
        "Automated <strong>VietQR gateway</strong>. Scan the displayed QR code and transfer the exact amount with the exact memo to get approved automatically.",
      orderSummary: "Order Summary",
      planLabel: "Subscription plan:",
      durationLabel: "Duration:",
      scanLimitLabel: "Scan limit:",
      totalPayLabel: "Total payment:",
      backBtn: "Back",
      usingHighestPlan: "Using the highest plan",
      continuePayBtn: "Proceed to Payment",
      creatingInvoice: "Creating invoice...",
      planBasicName: "Basic",
      planBasicDuration: "7 days",
      planBasicLimit: "50 scans",
      planProName: "Professional (Pro)",
      planProDuration: "30 days",
      planProLimit: "200 scans",
      planEntName: "Enterprise",
      planEntDuration: "90 days",
      planEntLimit: "Unlimited",
      upgradeBillingHistoryBtn: "Billing History",
      currentPlanTitle: "Your Current Plan",
      activeStatus: "Active",
      expiredStatus: "Expired",
      highestPlanMsg: "You are using the highest plan",
      renewPlanBtn: "Renew Plan",
      comparisonTableTitle: "Compare Subscription Plans",
      compFeature: "Feature",
      compAIModel: "AI Scans",
      compDuration: "Duration",
      compAds: "Ads",
      compSpeed: "Processing Speed",
      compSupport: "Support",
      compAdvancedFeatures: "Advanced Features",
      compSuitability: "Suitable For",
      compYes: "Yes",
      compNo: "No",
      compUnlimited: "Unlimited",
      compBasic: "Basic",
      compPriority: "Priority",
      compVip: "VIP",
      compEmail: "Email",
      compHighestSupport: "Highest priority",
      compLimited: "Limited",
      compSomeFeatures: "Some features",
      compFullFeatures: "Full features",
      compFullAdvancedFeatures: "Full + advanced",
      compTrial: "Trial",
      compPersonal: "Individual",
      compPowerUser: "Frequent user",
      compEnterprise: "Enterprise / Advanced",
      faqTitle: "Frequently Asked Questions",
      faq1Q: "How long does activation take after payment?",
      faq1A: "The system automatically activates your plan via the VietQR gateway within 1-3 minutes as soon as the correct amount and transfer memo are received.",
      faq2Q: "Can I upgrade while using my old plan?",
      faq2A: "Yes, you can upgrade to a higher plan at any time. The scan limits and duration of the new plan will apply immediately.",
      faq3Q: "Can I cancel or get a refund?",
      faq3A: "Subscription plan payments are non-refundable. Please review all details carefully before making a transaction.",
      faq4Q: "Does the plan auto-renew?",
      faq4A: "No, our system does not automatically renew or charge your account. You manually purchase renewals as needed.",
      faq5Q: "Can I change my plan after upgrading?",
      faq5A: "You can upgrade to a higher plan at any time. Downgrading to a lower plan is only possible after the current plan has expired.",
      helpCardTitle: "Need more support?",
      helpCardDesc: "Contact our support team via email or live chat.",
      helpCardBtn: "Contact Support",
      paymentSecurityNote: "Payments are secured and processed through the VietQR system.",
      policyLink: "Payment Policy",
      termsLink: "Terms of Service",
      cannotDowngradeBtn: "Cannot Downgrade",
      upgradeBtn: "Upgrade",
      renewBtn: "Renew",
      currentPlanBtn: "Current Plan",
      selectedPlanLabel: "You selected plan",


      /* ── Checkout Page ── */
      checkoutPageTitle: "Checkout - PetAI",
      checkoutTitle: "Checkout Plan",
      checkoutDesc:
        "Scan the QR code to transfer, then confirm to activate your plan.",
      orderIdLabel: "Order ID",
      paymentMethodLabel: "Method",
      paymentMethodQR: "QR Transfer",
      paymentInstructionsTitle: "Bank Transfer Instructions",
      instructionStep1: "Open the bank app on your phone.",
      instructionStep2: "Use the Scan QR code feature for the fastest payment.",
      instructionStep3:
        "Verify transfer amount and memo details before confirming.",
      accountDetailsTitle: "Account Details",
      bankLabel: "Bank",
      accountNumberLabel: "Account Number",
      accountNameLabel: "Account Holder",
      memoLabel: "Memo",
      paymentQrTitle: "Payment QR Code",
      qrMissingLib: "Missing QR library. Install qrcode to display QR.",
      checkingStatus: "Checking",
      checkingStatusDesc: "System is automatically checking payment...",
      autoActivationNote:
        "System will automatically activate 1-5 minutes after payment receipt. If it takes too long, please submit support.",
      submitSupportLink: "Submit Support",
      safeTransactionTitle: "Secure Transaction",
      safeTransactionDesc:
        "Your payment info is encrypted and automatically processed by the AI system.",
      invoiceModalTitle: "Payment Invoice",
      invoiceSuccess: "Payment successful!",
      invoiceThankYou: "Thank you for using PetAI services",
      customerLabel: "Customer",
      emailLabel: "Email",
      createdTimeLabel: "Created Time",
      confirmedTimeLabel: "Confirmed Time",
      printInvoiceBtn: "Print Invoice",

      /* ── Dashboard & Welcome ── */
      welcomeUser: "Welcome",
      welcomeUserGuest: "Welcome, guest!",
      thisMonth: "this month",
      newThisWeek: "new this week",
      todayCount: "today",

      /* ── History ── */
      predictionsCountPrefix: "You have a total of",
      predictionsCountSuffix: "prediction records.",
      hybridRatioExpected: "Expected hybrid ratio",
      identificationTimeLabel: "Identification time:",
      closeWindowBtn: "Close window",

      /* ── Predict Result ── */
      predResultTitle: "Dog Breed Identification Results",
      predResultDesc:
        "AI system has completed image analysis with high accuracy.",
      backToDashboard: "Back to Dashboard",
      analyzeAnotherImg: "Analyze another image",
      mainObjectAnalysis: "Main Object Region Analysis",
      analyzingText: "Analyzing",
      mainObjectIdentify: "Main Object Identification",
      bestPrediction: "Best Prediction",
      hybridWarningText:
        "This is a morphological similarity-based hybrid suggestion, not a genetic conclusion.",
      hybridRatioTitle: "Estimated Hybrid Ratio Analysis",
      dominantGenExpected: "Expected dominant gene",
      similarityText: "Similarity",
      recessiveGenExpected: "Expected recessive gene",
      visualProofTitle: "Dynamic Grad-CAM (Visual Proof)",
      visualProofRefTitle: "Reference Grad-CAM (Visual Proof)",
      visualProofDesc: "Heatmap based exactly on the image you just uploaded.",
      visualProofRefDesc: "Heatmap based on reference breed.",
      aiHighlightArea: "Highlighted region AI focused on",
      modelLogicAnalysis: "Logic Analysis from Model",
      decisionHybridText: "Confidence level sufficient for hybrid suggestion.",
      decisionPureText: "Confidence level sufficient for breed conclusion.",
      decisionRefText:
        "Reference confidence level, insufficient for breed conclusion.",
      modelArchitecture: "Model architecture",
      inferenceOptimization: "Inference optimization",

      /* ── Payments User ── */
      ordersCreated: "Created orders",
      totalAmountPaid: "Total amount paid",
      awaitingConfirm: "Awaiting confirmation",
      planExpireLabel: "Expires",
      freeLimitPlan: "Limited free plan",
      recentOrders: "Recent Orders",
      ordersCount: "orders",
      planExpired: "Expired",

      /* ── Settings ── */
      personalInfoTab: "Info",
      appearanceTab: "Appearance",
      privacyTab: "Privacy",
      personalInfoTitle: "Personal Info",
      saveChangesBtn: "Save Changes",

      /* ── Admin: User Detail ── */
      manageUserRole: "Manage and assign user roles for the account",
      activeStatus: "Active",
      lockedStatus: "Locked",
      sensitiveArea: "Sensitive Area",
      sensitiveAreaDesc:
        "The operations below directly affect access permissions and data. Please proceed with caution.",
      lockAccountBtn: "Lock Account",
      unlockAccountBtn: "Unlock Account",
      deleteUserBtn: "Delete User",
      quotaSettings: "Subscription Plan & Usage Quota",
      currentPlanLabel: "Current Plan",
      adsWatchedLabel: "Ads watched",
      unlockRemainingLabel: "Remaining unlocks",
      planExpireDateLabel: "Plan expiration date",
      freeUnlimited: "Unlimited (Free)",
      changePlanLabel: "Change member plan",
      assignPlanBtn: "Assign new plan",
      registeredTimeLabel: "System registration time",
      confirmDialogTitle: "Confirmation",
      confirmDialogText: "Are you sure?",
      confirmInputPlaceholder: "Enter email or username to confirm",
      similarityTop3: "Morphological Similarity (Top 3)",
      top3Probability: "Top 3 Softmax Probability",
      welcomeFriend: "friend",
      uploadAreaTitle: "Upload Area",
      changeImageBtn: "Change Image",
      freeScansLeft: "Free scans remaining",
      unlockedFromAds: "Unlocked from ads",
      adsWatched: "Ads watched",
      watchAdBtn: "Watch ads for more scans",
      yourPaidPlan: "Your paid plan",
      unlimitedScans: "Unlimited scans",
      loadingQuota: "Loading quota info...",
      predictionExperience: "Prediction Experience",
      featureIdentifyConfidence: "Identify dog breed with confidence %",
      featureYoloBoundingBox: "Supports image with YOLO bounding box",
      featureAutoSaveHistory: "Automatically saves prediction history",
      featureResponsiveLayout: "Optimized for Mobile/Tablet/Desktop",
      noEmailUpdated: "No email updated",
      enterWord: "Enter",
      confirmInputPlaceholderSuffix: "or username to confirm",
      checkingStatusWait:
        "Please do not close this page until the transaction is confirmed.",
      ifTooLong: "If it takes too long, please",
      welcomePrefix: "Hello",
      visualAIInsights: "Visual AI Insights",
      /* ── Data Deletion Policy Page ── */
      dataDeletionPageTitle: "Data Deletion - PetAI",
      dataDeletionHeaderTitle: "Data Deletion",
      dataDeletionSection1Title:
        "1. Right to Request Account and Data Deletion",
      dataDeletionSection1Desc:
        "Users always have the right to request the deletion of their account as well as all personal data (name, email, images) accumulated during the usage of the system.",
      dataDeletionSection2Title: "2. Instructions for In-App Account Deletion",
      dataDeletionSection2Desc:
        "If the application has this feature updated, please go to <strong>Settings</strong> &gt; select <strong>Manage Account</strong> &gt; click <strong>Delete Account</strong> to automatically remove your information.",
      dataDeletionSection3Title: "3. Submit Email Request",
      dataDeletionSection3Desc:
        "In case the system does not support direct deletion yet, you can submit a deletion request via email. Please follow the instructions below:",
      dataDeletionEmailLabel: "Request recipient email:",
      dataDeletionSubjectLabel: "Email subject:",
      dataDeletionSubjectValue: "Request for account/data deletion",
      dataDeletionVerificationHint:
        "Please clearly state the email address you registered with for verification purposes.",
      dataDeletionSection4Title: "4. Processing Time",
      dataDeletionSection4Desc:
        "All categories of your data, images, and account will be processed and permanently deleted within <strong>30 days</strong> of request submission.",
      dataDeletionSection5Title: "5. Certain Data May Be Retained",
      dataDeletionSection5Desc:
        "Certain data relating to payment reports, invoice transactions, or dispute details may be retained in compliance with applicable local legal regulations.",
      dataDeletionSection6Title: "6. Contact Information",
      dataDeletionSection6Desc: "For any difficulties, please contact:",

      /* ── Terms of Service Page ── */
      termsPageTitle: "Terms of Service - PetAI",
      termsHeaderTitle: "Terms of Service",
      termsSection1Title: "1. Conditions of Use for App/Website",
      termsSection1Desc:
        "By accessing and using our service, you acknowledge that you have read, understood, and accepted all terms set forth in this document.",
      termsSection2Title: "2. User Rights and Responsibilities",
      termsSection2Desc:
        "Users commit to providing truthful information when creating an account and are solely responsible for maintaining the confidentiality of their login credentials.",
      termsSection3Title: "3. Account Rules",
      termsSection3Desc:
        "Using premium features may require logging in. Each personal account is authorized for one individual only; buying, selling, or transferring accounts is strictly prohibited.",
      termsSection4Title: "4. Prohibited Content and Conduct",
      termsSection4Desc:
        "You are not permitted to: (a) use the application for any unlawful purposes; (b) exploit or abuse our API system; (c) interfere with, copy, or reverse-engineer the software or the AI models we provide.",
      termsSection5Title: "5. Limitation of Liability",
      termsSection5Desc:
        "AI-based analyses and predictions are for reference only and may contain errors. We assume no liability for any indirect consequences resulting from recommendations or software results.",
      termsSection6Title: "6. Account Termination upon Violation",
      termsSection6Desc:
        "We reserve the right to unilaterally lock or permanently delete accounts and associated data if a user is found to have seriously violated any stated conditions.",
      termsSection7Title: "7. Contact Information",
      termsSection7Desc: "For any questions or suggestions, please send to:",

      /* ── Support Page ── */
      supportPageTitle: "Support - PetAI",
      supportHeaderTitle: "Support",
      supportSubtitle: "We are always ready to listen to your feedback.",
      supportQuickInfoTitle: "Quick Info",
      supportEmailLabel: "Support Email:",
      supportResponseTimeLabel: "Expected Response Time:",
      supportResponseTimeValue: "Within 1–3 business days",
      supportBasicGuideTitle: "Basic Usage Guide",
      supportStep1:
        "1. On the main page, select <strong>Login</strong> or create a new account.",
      supportStep2:
        "2. Go to the Identify page, grant camera permissions, or upload an image.",
      supportStep3:
        "3. Wait 2 - 4 seconds, and the AI will return the top 3 potential breeds along with statistical history.",
      supportFaqTitle: "Frequently Asked Questions (FAQ)",
      supportFaq1Q: "How do I login?",
      supportFaq1A:
        "Click the Login button at the top right of the website or via the mobile menu to use Email/Google.",
      supportFaq2Q: "How do I delete my account?",
      supportFaq2A:
        "Submit a request according to our <strong>Data Deletion Policy</strong> for assistance.",
      supportFaq3Q: "How do I contact support?",
      supportFaq3A:
        "You can use the form under the <strong>Contact</strong> section or email support@pet.ai.",
      supportFaq4Q: "What should I do if I encounter an error?",
      supportFaq4A:
        "We apologize for the inconvenience. Please take a screenshot of the error, describe the actions leading up to it, and email it to us as soon as possible!",
      thisMonth: "this month",
      revenue: "Revenue",
      usersCountSuffix: "users",
      noSubscriptionData: "No subscription data available.",
      scansCount: "Scans",
      pleaseSelectDates: "Please select both start and end dates!",
      startDateAfterEndDate: "Start date cannot be after end date!",
      customRange: "Custom",
      customRangeSubtitle: "From {start} to {end}",
      revenueTrendSubtitleDefault: "Total amount from paid orders (VND)",
      revenueTrendSubtitle7: "Total amount from paid orders (last 7 days)",
      revenueTrendSubtitle30: "Total amount from paid orders (last 30 days)",
      revenueTrendSubtitle90: "Total amount from paid orders (last 90 days)",
      revenueTrendSubtitle12: "Total amount from paid orders (last 12 months)",
      predTrendSubtitleDefault: "Number of images identified per day",
      predTrendTitle7: "Prediction trend (last 7 days)",
      predTrendTitle30: "Prediction trend (last 30 days)",
      predTrendTitle90: "Prediction trend (last 90 days)",
      predTrendTitle12: "Prediction trend (last 12 months)",
      predTrendTitleCustom: "Custom prediction trend",
      predTrendSubtitleMonth: "Number of images identified per month",
      revenueThisMonthTooltip: "Revenue recorded in this month",
      newUsersThisWeekTooltip:
        "Number of new accounts registered in the last 7 days",
      newOrdersTodayTooltip: "New orders created today",
      predictionsTodayTooltip: "Number of predictions performed today",
      upgradeAccount: "Upgrade Account",
      orderInfo: "Order Information",
      servicePlan: "Service Package",
      missingQrLibPrefix: "Missing QR library. Please install",
      missingQrLibSuffix: "to display the QR code.",
      checkingStatusWait:
        "Please do not close this page until the transaction is confirmed.",
      autoActivationDesc:
        "The system will automatically activate the package 1-5 minutes after payment is received.",
      printInvoice: "Print Invoice",
      openMenu: "Open Menu",
      close: "Close",
      adminConfirmationsPageTitle: "Admin Payment Approval - PetAI",
      approveBankTransfers: "Approve Bank Transfers",
      approveBankTransfersDesc:
        "Display orders that users have reported as paid for admin approval.",
      manageUsersTitle: "User Management",
      clearFilters: "Clear Filters",
      reportedTransferStatus: "Reported Transfer",
      confirmAction: "Confirm Action",
      searchConfirmationsPlaceholder:
        "Search order code/username/email/fullname...",
      contactPageTitle: "Contact | PetAI",
      contactInfoTitle: "Contact Information",
      legalInfoTitle: "Legal Information",
      companyNameLabel: "COMPANY NAME",
      taxIdLabel: "TAX CODE",
      representativeLabel: "REPRESENTATIVE",
      licenseDateLabel: "LICENSE DATE",
      headquartersLabel: "HEADQUARTERS",
      hotlineLabel: "HOTLINE",
      emailLabel: "EMAIL",
      appNameLabel: "App/website name:",
      appNamePlaceholder: "PetAI",
      devNameLabel: "Developer/company name:",
      devNamePlaceholder: "TIEN PHONG TECHNOLOGY ENGINEERING ONE MEMBER COMPANY LIMITED",
      contactEmailLabel: "Contact email:",
      addressLabel: "Address:",
      addressPlaceholder: "P16, Street 8, Lot 49 residential area, Nam Can Tho Urban Area, Cai Rang District, Can Tho City, Vietnam",
      processingTimeNote: "Note on processing time:",
      responseTimeDesc:
        "Usually within 1-3 business days. Thank you for your support!",
      sendMessageOnline: "Send Message Online",
      fullnameLabel: "Full Name",
      submitForm: "Submit Form",
      yourNamePlaceholder: "Your name...",
      emailAddressPlaceholder: "Email address...",
      supportQuestionPlaceholder: "How can we help you?",
      additionalNotesPlaceholder: "Additional details...",
      uploadNewPhoto: "Upload new photo",
      viewHistory: "View History",
      revenueThisMonthSuffix: "this month",
      newUsersThisWeekSuffix: "new this week",
      newOrdersTodaySuffix: "today",
      predictionsTodaySuffix: "today",
      dataDeletionPolicyPageTitle: "Data Deletion Policy | PetAI",
      settingsLabel: "Settings",
      arrowSelect: "> Select",
      accountManagement: "Account Management",
      arrowClick: "> Click",
      deleteAccount: "Delete Account",
      autoDeleteInfoDesc:
        "to have the system automatically remove your information.",
      deleteDataRequestSubject: "Data/account deletion request",
      dataDeletionVerificationHint:
        "Please specify the email address you registered with for verification.",
      fromRequestTime: "from the time of the request.",
      retainedDataDesc:
        "Some data related to payment reports, invoice transactions, or dispute details may continue to be retained depending on applicable legal regulations.",
      petaiErrorTitle: "PetAI - Error {{ code }}",
      errorCodeTitle: "Error {{ code }}",
      backToHome: "Back to home",
      checkSystem: "Check system",
      forgotPasswordPageTitle: "Forgot Password - PetAI",
      historyPageTitle: "History - PetAI",
      predictionsCountSuffix: "prediction scans.",
      newScan: "New Scan",
      viewDetails: "View Details",
      startNow: "Start Now",
      speciesDog: "Dog",
      historyPaginationAria: "History Pagination",
      identifyNav: "IDENTIFICATION",
      dogBreedsNav: "DOG BREEDS",
      howItWorks: "How it works",
      resultDemoSh: "RESULT_DEMO.SH",
      inputLabel: "Input:",
      analyzingImageDemo: '"Analyzing breed features from image_01.jpg..."',
      analysisResultsDemo: "Analysis results...",
      shibaDemoResult: "[1] Shiba Inu: 82% confidence.",
      akitaDemoResult: "[2] Akita: 11% confidence.",
      basenjiDemoResult: "[3] Basenji: 7% confidence.",
      priceFree: "0đ",
      foreverSuffix: "/ forever",
      freeScans10: "10 scans",
      max3Ads: "Max 3 ad views",
      suitableTrial: "Suitable for trial",
      days7Suffix: "/ 7 days",
      scans50: "50 scans",
      noAds: "No ads",
      days30Suffix: "/ 30 days",
      scans200: "200 scans",
      prioritySpeed: "Priority speed",
      days90Suffix: "/ 90 days",
      unlimitedScans: "Unlimited scans",
      loginPageTitle: "Login - PetAI",
      loginWithGoogle: "Login with Google",
      paymentsUserDesc:
        "Orders you have created and their current processing status.",
      upgradePlanTitle: "Upgrade Package",
      totalOrdersCard: "Total Orders",
      pendingOrdersCard: "Pending Orders",
      paidStatus: "Paid",
      cancelledStatus: "Cancelled",
      expiredStatus: "Expired",
      pendingStatus: "Pending",
      invoiceBtn: "Invoice",
      continuePay: "Continue to pay",
      noPaymentsMessage:
        "You have not made any package upgrade transactions on PetAI.",
      upgradeNowBtn: "Upgrade Now",
      orderPaginationAria: "Order Pagination",
      predictResultPageTitle: "Prediction Result | PetAI",
      backToDashboard: "Back to dashboard",
      analyzeAnother: "Analyze another image",
      mainObjectDetection: "Main Object Detection",
      hybridRatioAnalysis: "Hybrid Ratio Analysis",
      similarityPrefix: "Similarity: ",
      privacyPolicyPageTitle: "Privacy Policy | PetAI",
      updateDatePrefix: "Last updated: 16/06/2026",
      privacySection1Title: "1. Developer/company information",
      devIntroText: "The service is developed and designed by",
      companyNamePlaceholder: "TIEN PHONG TECHNOLOGY ENGINEERING ONE MEMBER COMPANY LIMITED",
      devIntroTextSuffix:
        ". We are committed to protecting your personal information and privacy as securely as possible.",
      privacySection2Title: "2. What data is collected",
      privacySection2Desc:
        "We may collect data including: account name, email, password (securely encrypted), dog images you upload to the identification system, and your usage interactions.",
      privacySection3Title: "3. Purpose of using data",
      privacySection3Desc:
        "Data is used to provide access, verify security, optimize AI models over time, and provide necessary technical support.",
      privacySection4Title: "4. Sharing data with third parties",
      privacySection4Desc:
        "Absolutely not, except for necessary core infrastructure (Firebase, Google Analytics) or strict legal requests from authorized government agencies.",
      privacySection5Title: "5. Cookies, Firebase, Analytics",
      privacySection5Desc:
        "The application may use Cookies, Google Analytics for measurement, and Crashlytics for error collection to help improve our quality.",
      privacySection6Title: "6. User rights",
      privacySection6Desc:
        "You always have control over your personal content, with the right to view, edit, extract, or stop processing data at any time.",
      privacySection7Title: "7. Requesting data deletion",
      privacySection7Desc:
        "You can manually go to Settings -> Delete Account, or see detailed instructions at",
      privacySection8Title: "8. Contact information",
      addressLabelPlaceholder: "Address: P16, Street 8, Lot 49 residential area, Nam Can Tho Urban Area, Cai Rang District, Can Tho City, Vietnam",
      registerPageTitle: "Create Account - PetAI",
      registerWithGoogle: "Register with Google",
      planPrefix: "PACKAGE",
      infoTab: "Information",
      appearanceTab: "Appearance",
      privacyTab: "Privacy",
      fullnameHint: "This name is displayed on profile and navigation bar.",
      clearAllHistory: "Clear all history",
      exportReport: "Export Report",
      identifyNow: "Identify Now",
      supportPageTitle: "Support | PetAI",
      fromLabel: "From",
      businessDaysCount: "1-3 business days",
      orCreateAccount: "or create a new account.",
      sendMailUnder: "Send email according to",
      ourHelpSupport: "of ours for assistance.",
      useFormBelow: "You can use the form below the section",
      orSendSupportEmail: "or send an email to support@pet.ai.",
      termsPageTitle: "Terms of Service | PetAI",
      planFreeLabel: "FREE (FREE)",
      upgradePromptPrefix:
        ". Upgrade to increase scans and enjoy an ad-free experience. {% else %} Your account is currently using package",
      upgradePromptSuffix: ". You can upgrade or renew below. {% endif %}",
      choosePlanPay: "Choose Plan & Pay",
      freePlanActive: "FREE Plan is active",
      scansUnit: "scans",
      basicPlanActive: "Basic Plan is active",
      usingHigherPlan: "Using a higher plan",
      proPlanActive: "Pro Plan is active",
      enterprisePlanActive: "Enterprise Plan is active",
      autoVietQR: "Automatic VietQR",
      vietQrInstructions:
        ". Simply scan the QR code and transfer the exact amount with the matching memo for automatic system approval.",
      usingHighestPlan: "Using the highest plan",
      freePlanBenefits: "Free Plan Benefits",
      basicPlanBenefits: "Basic Plan Benefits",
      proPlanBenefits: "Pro Plan Benefits",
      enterprisePlanBenefits: "Enterprise Plan Benefits",
      uploadPageTitle: "Upload & Analyze - PetAI",
      uploadHeaderTitle: "Upload Photo to Identify Dog Breed",
      uploadHeaderDesc:
        "Drag and drop your dog's photo for AI analysis and detailed breed prediction.",
      dragDropHere: "Drag & drop photo here",
      clickToSelectPhoto: "or click to select photo from computer",
      supportedFormatsDesc: "Supports JPG, JPEG, PNG • Max 10MB",
      analyzeNowBtn: "Analyze Now",
      quotaPlanPrefix: "Plan: ",
      quotaLimitLabel: "Quota limit",
      watchAdToUnlock: "Watch ad to get more scans",
      predictionExperience: "Prediction Experience",
      featureIdentifyConfidence:
        "Identify dog breed with confidence percentage",
      featureYoloBoundingBox: "Supports images with YOLO bounding boxes",
      featureAutoSaveHistory: "Automatically save prediction history",
      featureResponsiveLayout: "Optimized for Mobile/Tablet/Desktop",
      adminUsersPageTitle: "Admin User Management - PetAI",
      adminUsersDesc:
        "Manage account status, service packages, and system access rights.",
      approveOrdersBtn: "Approve Orders",
      statusLocked: "Locked",
      showingUsers:
        "Showing {{ start_index }} - {{ end_index }} of {{ total_users }} users",
      searchUserPlaceholder: "Search username/email/fullname...",
      assignPlanHeader: "Assign Package",
      savePlanLabel: "Save Package",
      adminUserDetailPageTitle: "Admin User #{{ user.id }} - PetAI",
      sensitiveAreaTitle: "Sensitive Area",
      deleteUserBtn: "Delete User",
      quotaSettingsTitle: "Service Package & Quota Settings",
      remainingSuffix: "remaining",
      assignPlanBtn: "Assign New Package",
      accountDetailsTitle: "Account Details",
      usernameLabel: "Username",
      emailLabel: "Email Address",
      userIdLabel: "User ID",
      confirmBtn: "Confirm",
      orUsernameToConfirm: "or username to confirm",
      deleteOrUsernamePlaceholder: "DELETE or username",
      backToList: "Back to list",
      selectPlanToAssign: "Select package to assign",
      adLimitReachedPrompt:
        "You have used all 10 free scans. Watch a short advertisement to receive",
      threeScans: "3 scans",
      adLimitLimitPrompt: "for AI identification. (Max 3 times).",
      invoiceSuccessDesc:
        "Payment successful!<br>Your invoice is displayed below.",
      confirmPaymentText:
        "Confirm payment received for order {orderId} ({user} - {plan})?",
      confirmAssignPlanText: "Assign package {plan} to {username}?",
      confirmLockUser: "Lock account {username}?",
      confirmUnlockUser: "Unlock account {username}?",
      actionFailed: "Action failed.",
      deleteFailed: "Deletion failed.",
      invalidConfirmation: "Invalid confirmation.",
      confirming: "Confirming...",
      avatarAlt: "Avatar",
      chuyenKhoanShort: "Transfer",
      contactShort: "Contact",
      onlySupportJpgPng: "Only JPG, JPEG or PNG images are supported.",
      waitingPaymentDesc:
        "Awaiting payment...<br>The system will automatically recheck in a few seconds.",
      mixLai: "Mix:",
      predictedBreed: "Predicted Breed",
      referenceBreed: "Reference Breed",
      confirmDeleteUserText:
        "Delete user {username}? This action cannot be undone.",
      msgSendSuccessDemo: "You have submitted successfully! (Demo Data)",
      reasonPurebredDominant: "Purebred/dominant candidate.",
      reasonPurebredMorphology: "Purebred/dominant candidate based on morphological similarity.",
      reasonHybridCandidate: "Crossbreed/hybrid candidate.",
      reasonHybridClose:
        "Crossbreed/hybrid candidate (Top-1 and Top-2 are very close).",
      reasonBreedShownTop1: "Breed displayed based on Top-1 prediction.",
      reasonNoDetail: "No detailed explanation available for this prediction.",
      top3NoteSoftmax: "Top 3 by softmax probability.",
      top3NoteSimilarity: "Top 3 by morphological similarity.",
      notConfigured: "Not configured",
      noSubscriptionData: "No subscription plan data available.",
      userGuidePageTitle: "User Guide | PetAI",
      userGuideHeaderTitle: "User Guide",
      userGuideSubtitle: "Learn how to use PetAI to identify dog breeds quickly and accurately.",
      guideStepsTitle: "Identification Steps",
      guideStep1Title: "Step 1: Login/Register",
      guideStep1Desc: "Log into your account to save scan history and manage limits.",
      guideStep2Title: "Step 2: Upload photo",
      guideStep2Desc: "Drag & drop or select a JPG, JPEG, PNG photo of your pet to upload.",
      guideStep3Title: "Step 3: AI Analysis",
      guideStep3Desc: "PetAI's deep learning system will analyze facial features and process it in 2-4 seconds.",
      guideStep4Title: "Step 4: View detailed results",
      guideStep4Desc: "Displays Top 3 breeds with confidence scores and interactive Grad-CAM heatmaps.",
      guideTipsTitle: "Photo Tips for Best Accuracy",
      guideTip1: "Take close-up, clear photos of the dog's face.",
      guideTip2: "Ensure good lighting conditions; avoid backlighting or overly dark settings.",
      guideTip3: "Avoid photos with multiple dogs or cluttered backgrounds.",
      guideTip4: "A straight-on shot of the dog's face always yields optimal AI results.",
      guideIntroTitle: "1. Introduction to PetAI",
      guideIntroDesc: "PetAI is an intelligent dog breed identification system powered by Artificial Intelligence (AI). When you upload an image, the system processes it through the following automated pipeline:<br><br><strong>1. Detection & Bounding Box (YOLOv8):</strong> The YOLOv8 model scans the image to identify the dog, draws a bounding box around its body, and automatically crops the region to focus solely on the dog and eliminate background noise.<br><strong>2. Feature Analysis & Classification:</strong> The cropped image is fed into a custom deep learning classifier to analyze morphological features across 120+ popular dog breeds.<br><strong>3. Purebred vs. Mixed Breed Decision:</strong> If the top breed candidate has a dominant confidence score (typically >80%), the AI concludes a purebred breed. If scores for the top candidates are close or moderate, the system visualizes estimated hybrid ratios using the Top-3 candidates.<br><strong>4. Visual Explanations (Grad-CAM):</strong> Generates a heatmap highlighting key regions (ears, eyes, snout) that the AI focused on to make its decision.",
      guideRegisterTitle: "2. Account Registration Guide",
      guideRegisterDesc: "To save your identification history and manage your usage limits, you need to create an account:",
      guideRegisterStep1: "Access the Registration page from the top-right header menu or navigate directly to /register.",
      guideRegisterStep2: "Fill in your details: Full Name, unique Username, a valid Email address, and a secure Password.",
      guideRegisterStep3: "Accept the Terms of Service and click 'Create Account' to complete the registration.",
      guideLoginTitle: "3. User Sign In Guide",
      guideLoginDesc: "After successful registration, you can log into the system in two ways:",
      guideLoginMethod1: "Standard Login: Enter your registered Username/Email and Password.",
      guideLoginMethod2: "Google Sign-In: Click 'Sign in with Google' to authenticate instantly using your Google account.",
      guideFreePlanTitle: "4. Free Plan Benefits & Limits",
      guideFreePlanDesc: "Every newly registered account starts automatically on the Free plan:",
      guideFreePlanLimit: "Default scan limit: You receive 10 free AI scans forever.",
      guideFreePlanAds: "Ad-supported scanning: Once the 10 free scans run out, you can watch a short simulated ad (up to 3 times) to unlock 3 extra scans per view.",
      guideFreePlanOut: "Quota exhaustion: Once both the default and ad-unlocked limits are exhausted, you must purchase an upgrade package.",
      guideIdentifyTitle: "5. How to Identify Dog Breeds",
      guideIdentifyDesc: "To identify a dog breed, follow this quick procedure:",
      guideIdentifyStep1: "Upload Photo: Drag and drop or click to select a dog image file from your device on the Identify page.",
      guideIdentifyStep2: "Supported Formats: Ensure the file is in JPG, JPEG, or PNG format and does not exceed 10MB.",
      guideIdentifyStep3: "Wait for AI Processing: Click 'Analyze Now' and wait 2-5 seconds for YOLOv8 and classification models to process.",
      guideIdentifyStep4: "View Results: The page will automatically load the detailed prediction results page.",
      guideResultTitle: "6. Understanding Prediction Results",
      guideResultDesc: "The result page is packed with detailed AI insights about your pet:",
      guideResultItem1: "Breed Name: The primary identified breed with the highest confidence level.",
      guideResultItem2: "Confidence Level: Shows the percentage probability computed by the AI model.",
      guideResultItem3: "Breed Information: Encyclopedia facts including Origin, Physical features, Temperament, and Care instructions.",
      guideResultItem4: "Grad-CAM Heatmap: Highlights the visual regions (e.g. ears, eyes, snout) the AI focused on to make its decision.",
      guideModesTitle: "7. AI Recognition Modes",
      guideModesDesc: "The system automatically handles breed classifications based on model probabilities:",
      guideModesPure: "Purebred Classification: If the top breed has a dominant probability (typically >80%), the AI concludes a purebred breed.",
      guideModesHybrid: "Estimated Hybrid Ratio Analysis: For mixed/hybrid dogs, the system displays morphological similarities for the Top-3 breeds and visualizes an estimated hybrid ratio.",
      guideUpgradeTitle: "8. Upgrading Subscription Packages",
      guideUpgradeDesc: "To extend scan limits and experience premium speed, you can upgrade your plan:",
      guideUpgradeWhen: "When to Upgrade: When you run out of free scans, want ad-free usage, or require priority server response.",
      guideUpgradeChoose: "Choose a Plan: Go to the Upgrade page and select a plan: Basic (50 scans / 7 days / 1,000 VND), Pro (200 scans / 30 days / 5,000 VND), or Enterprise (Unlimited scans / 90 days / 15,000 VND).",
      guideUpgradePay: "Payment (VietQR): The system creates a dynamic payment invoice and VietQR code. Open your banking app, scan the code, and transfer the exact amount with the exact memo.",
      guideUpgradeProcess: "Automatic Activation: Once the transfer is completed, the VietQR gateway automatically confirms payment and upgrades your account in 1-5 minutes.",
      guideHistoryTitle: "9. Viewing Scan History",
      guideHistoryDesc: "Every scanned photo is saved automatically to let you query them anytime:",
      guideHistoryList: "Navigate to the 'History' page from the sidebar to view a chronological list of all scans.",
      guideHistoryAction: "You can filter the list by breed name, open details to view the full report, or delete individual records.",
      guideStatsTitle: "10. Exploring Personal Analytics",
      guideStatsDesc: "The statistics page displays high-level trends of your scanning activity:",
      guideStatsOverview: "Overview: Total scans performed, average AI confidence score, and unique breeds discovered.",
      guideStatsCharts: "Charts: Activity trend graph, top 5 identified breeds chart, and probability distribution breakdowns.",
      guideFaqTitle: "11. Frequently Asked Questions (FAQ)",
      guideFaqQ1: "Is the AI prediction 100% accurate?",
      guideFaqA1: "AI models predict based on morphological features learned from training data. The outputs are for objective reference and cannot replace genetic (DNA) tests.",
      guideFaqQ2: "How can I get the best results?",
      guideFaqA2: "Ensure the photo features a straight-on shot of the dog's face, has clear lighting, is not blurry, and contains only one dog.",
      guideFaqQ3: "What should I do when free scans run out?",
      guideFaqA3: "You can click 'Watch Ad' in the pop-up to unlock additional scans or purchase a plan upgrade.",
      guideFaqQ4: "What if my payment is unsuccessful?",
      guideFaqA4: "VietQR transactions take 1-5 minutes to complete. If it takes longer, please open a support ticket or contact us with your order ID or bank receipt.",
      guideFaqQ5: "How do I contact support?",
      guideFaqA5: "You can email us at support@pet.ai or use the contact form under the Contact page.",
      guideContactTitle: "12. Support Contact Information",
      guideContactDesc: "If you encounter any issues while using the PetAI platform, feel free to contact us:",
      guideContactEmail: "Email: support@pet.ai (24/7 Support)",
      guideContactPhone: "Hotline: 0916 416 409",
      guideContactAddress: "Address: P16, Street 8, Lot 49 residential area, Nam Can Tho Urban Area, Cai Rang District, Can Tho City, Vietnam",
      currencySuffix: " VND",
      speciesDog: "Dog",
      dangerZoneTitle: "Danger Zone",
      dangerZoneDesc: "Actions cannot be undone if time limit is exceeded",
      deleteAccountTitle: "Request Account Deletion",
      deleteAccountDesc: "Your account will not be deleted immediately but will be placed in a <b>pending deletion state for 30 days</b>. During this time, you can log in again to restore it.",
      deleteModalConfirmTitle: "Confirm Account Deletion Request",
      deleteModalConfirmDesc: "Your account will be placed in a <b>30-day pending deletion state</b>.<br>During this period, you can still log in and restore it.",
      deleteModalWarning1: "⚠️ <b>After 30 days</b>, all data, history, and access will be <b>permanently disabled</b>.",
      deleteModalWarning2: "⚠️ This process <b>requires verification via email</b> (OTP).",
      deleteReasonLabel: "Reason for deletion (optional)",
      deleteReasonPlaceholder: "E.g., I no longer use the service...",
      sendOtpBtn: "Send Verification Code",
      deleteModalOtpTitle: "Enter Verification OTP",
      deleteModalOtpDesc: "A code has been sent to",
      deleteModalOtpCountdown: "Code is valid for",
      deleteConfirmBtn: "Confirm Account Deletion",
      deleteResendBtn: "Resend OTP Code",
      deleteSuccessTitle: "Request Recorded Successfully",
      deleteSuccessDesc: "Your account has been placed in a <b>pending deletion state</b>.<br>Check your email for more details.",
      sendingStatus: "Sending...",
      confirmingStatus: "Confirming...",
      otpSentSuccess: "New OTP code has been sent.",
      deletePendingPageTitle: "Account Pending Deletion - PetAI",
      deletePendingHeaderTitle: "Account Pending Deletion",
      deletePendingHeaderDesc: "Account deletion request has been recorded",
      deletePendingUserLabel: "Account:",
      deletePendingDateLabel: "Your account will be permanently deleted on",
      daysLabel: "days",
      hoursLabel: "hours",
      minsLabel: "minutes",
      deletePendingWarningTitle: "You can still log in but all features will be temporarily locked.",
      deletePendingWarningDesc: "If you <b>do not want to delete your account</b>, please click the restore button below.",
      deletePendingWarningPermanently: "After 30 days, all data will be permanently disabled.",
      restoreAccountBtn: "Restore Account",
      logoutBtn: "Logout",
      needSupportPrefix: "Need support? Contact",
      restoreConfirmTitle: "Confirm Restoration",
      restoreConfirmDesc: "OTP code has been sent to",
      otpCountdownLabel: "Code is valid for",
      restoreConfirmBtn: "Confirm Restoration",
      resendOtpBtn: "Resend OTP Code",
      sendingOtp: "Sending OTP...",
      otpSendFailedError: "Unable to resend OTP.",
      connectionFailedError: "Connection error.",
      sysPagesUnit: "Pages",
      otpInvalidError: "Please enter a valid 6-digit OTP code.",
      userPlanLabel: "Plan {{ code }}",
      identifyCompleted: "Identification completed!",
      top1Conclusion: "Top-1 (conclusion)",
      days7Ago: "Last 7 days",
      days30Ago: "Last 30 days",
      timesLabel: "{{ code }} times",
      sysLogoUploadDrag: "Drag & drop logo here or click to select",
      sysLogoUploadHelp: "PNG, JPG, JPEG, SVG or WEBP (Max 2MB)",
      sysPlanBasicDesc: "For individual trial",
      scansLabel: "scans",
      sysRecommended: "Recommended",
      sysPlanProDesc: "Most popular choice",
      sysPlanEntDesc: "Unlimited for organizations",
      sysTotalPages: "Total pages",
      sysStatus: "Status",
      sysOnline: "Online",
      sysHistory: "History",
      sysAutoSave: "Auto save",
      sysPermission: "Permission",
      sysFilterPolicy: "Policies",
      sysFilterSupport: "Support & Guides",
      planBasicLimitDesc: "<strong>50 scans</strong>",
      planProLimitDesc: "<strong>200 scans</strong>",
      planEntLimitDesc: "<strong>Unlimited scans</strong>",
      adUnlockPrompt: "You have used all 10 free scans. Watch a short video ad to receive",
      otpVerifyPageTitle: "OTP Verification - PetAI",
      forgotPasswordHeader: "Recover Password",
      forgotOtpDesc: "If the information you entered is correct, a 6-digit OTP code has been sent to the recovery email of the account.",
      otpCodeLabel: "OTP Verification Code",
      otpExpiryLabel: "OTP code will expire in:",
      confirmOtpBtn: "Confirm OTP",
      orLabel: "or",
      reenterEmailLink: "Re-enter email",
      resendOtpLink: "Resend OTP",
      emailVerifyHeader: "Email Verification",
      registerOtpDesc: "We have sent a 6-digit OTP verification code to your Gmail:",
      confirmAccountBtn: "Confirm Account",
      reregisterLink: "Re-register",
      toastDbConnectionError: "Database connection error. Please try again later.",
      toastEmailOrUsernameNotExist: "This email or username does not exist in the system. Please check again.",
      toastAccountNotVerified: "This account has not been email-verified. Please contact support.",
      toastMailSystemError: "The mail system is experiencing issues. Please try again later.",
      toastOtpSentGmail: "An OTP code has been sent to your Gmail. Please verify.",
      toastPleaseEnterOtp: "Please enter the OTP code.",
      toastOtpIncorrectOrExpired: "The OTP code is incorrect or has expired.",
      toastOtpFailed5Times: "You have entered the wrong OTP more than 5 times. Please request a password recovery.",
      toastOtpExpiredResend: "The OTP code has expired. Please click resend code.",
      toastAccountNotFoundOrLocked: "Account does not exist or has been locked.",
      toastOtpVerifySuccess: "OTP verification successful. Please set a new password for your account.",
      toastLoginFailedSystemError: "Could not establish login due to a system error. Please try again later.",
      toastOtpResendLimit: "You have requested to resend OTP more than 3 times within 10 minutes. Please try again later.",
      toastSendEmailFailed: "Could not send OTP email. Please try again later.",
      toastOtpNewSentGmail: "A new OTP code has been successfully sent to your Gmail.",
      toastAccountPermanentlyDeleted: "Your account has been permanently deleted.",
      toastAccountUnverifiedLogin: "This account has not been email-verified. Please verify your email before logging in.",
      toastAccountDeletedSupport: "This account has been permanently deleted. Please contact support if you need assistance.",
      toastAccountLockedOrDeleted: "Account is locked or deleted. Please contact support.",
      toastTemporaryPasswordWarning: "You are using a temporary password. Please change to a new password to continue using the system.",
      toastMustAgreeTerms: "You must agree to the Terms of Service and Privacy Policy.",
      toastGmailOnly: "Only registration emails ending in @gmail.com are accepted.",
      toastSendEmailRegisterFailed: "Could not send OTP email. Please check your email configuration or try again later.",
      toastRegisterOtpSent: "An OTP code has been sent to your Gmail. Please verify.",
      toastRegisterInfoNotFound: "Registration information not found. Please register again.",
      toastRegisterOtpFailed5Times: "You have entered the wrong OTP more than 5 times. Please register again from the beginning.",
      toastRegisterSystemError: "Could not create account due to a system error. Please try again.",
      toastRegisterResendLimit: "You have requested to resend OTP more than 3 times within 10 minutes. Please wait before trying again.",
      toastEnterNewPassword: "Please fill in the new password and confirm password.",
      toastFillAllPasswordInfo: "Please fill in all information to change your password.",
      toastPasswordMinLength: "New password must be at least 6 characters.",
      toastPasswordsDoNotMatch: "New password and confirm password do not match.",
      toastUserNotFound: "User not found.",
      toastCurrentPasswordIncorrect: "Current password is incorrect.",
      toastSettingsSaved: "Settings and password have been changed successfully!",
      toastPleaseLogin: "Please log in to perform this action.",
      toastInvalidSession: "Invalid login session.",
      toastNoImageUpload: "Uploaded image file not found.",
      toastFilenameEmpty: "Filename is empty.",
      toastNotPaidYet: "You have not paid yet.",
      toastAutoConfirmInfo: "The system will automatically confirm upon receiving the transaction. You do not need to confirm manually.",
      toastPlanActivated: "Payment confirmed and your package has been activated.",
      toastTransferRecordedPending: "We have recorded your transfer. The order is pending admin confirmation.",
      toastTransferRecordFailed: "Could not record (order may have already been reported or confirmed).",
      toastConfirmTransferFailed: "Could not record payment. Please try again.",
      toastLoginToViewPayments: "Please log in to view your payment history.",
      toastUsersOnlyPage: "This page is only for user accounts.",
      toastInvalidUserId: "Invalid User ID.",
      toastLoadConfigFailed: "Could not load system configuration.",
      toastSaveConfigSuccess: "System configuration updated successfully.",
      toastSaveConfigFailed: "Error saving system configuration.",
      toastInvalidLegalPage: "Invalid legal page.",
      toastSaveLegalFailed: "Error updating legal page content.",
      toastLogoNotFound: "Logo file not found.",
      toastNoFileSelected: "No upload file selected.",
      toastLogoUnsupportedFormat: "File format not supported. Only PNG, JPG, JPEG, SVG, and WEBP are allowed.",
      toastLogoSaveSuccess: "Website logo changed successfully.",
      toastSetPlanFailed: "Error assigning package to user.",
      toastEnterLockReason: "Please enter the lock reason.",
      toastLockUserSuccess: "User locked successfully.",
      toastLockUserFailed: "Error locking user.",
      toastUnlockUserSuccess: "User unlocked successfully.",
      toastUnlockUserFailed: "Error unlocking user.",
      toastDeleteUserFailed: "Error deleting user.",
      toastErrorOccurred: "An error occurred",
      toastUnsupportedFormat: "File format is not supported.",
      toastUploadImageFailed: "Could not upload image. Please try again.",
      toastAnalyzeImageFailed: "An error occurred while analyzing the image.",
      toastConnectionFailed: "A connection error occurred",
      toastAutoTranslating: "Automatically translating untranslated items...",
      toastAutoTranslateSuccess: "Automatically translated successfully!",
      toastSavePageSuccess: "Page content saved successfully!",
      toastRestoreOriginalSuccess: "Original content restored!",
      toastRestoreVersionSuccess: "Version restored successfully!",
      confirmTitle: "Confirmation",
      alertTitle: "Notification",
      warningTitle: "Warning",
      dangerTitle: "Danger Alert",
      successTitle: "Success",
      infoTitle: "Information",
      confirm: "Confirm",
      cancel: "Cancel",
      loading: "Processing...",
      confirmLogoutText: "Are you sure you want to log out?",
      confirmRestoreAccountText: "Restoring this account will cancel the deletion request. Are you sure?",
      confirmClearHistoryText: "Are you sure you want to clear all identification history? This action cannot be undone.",
      confirmSaveConfigText: "Changing system configurations may affect the entire system operation. Are you sure you want to save?",
      settingsTabProfile: "Profile",
      settingsTabSecurity: "Security",
      settingsTabNotifications: "Notifications",
      settingsTabAppearance: "Appearance",
      settingsTabPrivacy: "Privacy",
      editBtn: "Edit",
      cancelBtn: "Cancel",
      saveChangesBtn: "Save Changes",
      clearHistoryConfirmTitle: "Confirm Clear History",
      clearHistoryConfirmText: "Are you sure you want to clear all prediction history? This will delete all prediction records and associated image files on the server. This action cannot be undone.",
      confirmDelete: "Confirm Delete",
      changePasswordDesc: "New password (minimum 6 characters)",
      personalInfoTitle: "Personal Information",
      notificationsTitle: "Notification Settings",
      appearanceTitle: "Appearance",
      privacyTitle: "Privacy",
      dangerZoneTitle: "Danger Zone",
      dangerZoneDesc: "Actions cannot be undone if past the deadline",
      deleteAccountTitle: "Delete Account Request",
      sendingStatus: "Sending...",
      confirmingStatus: "Confirming...",
      deleting: "Deleting...",
      securityGuideTitle: "Security Guidelines",
      pwdGuideLen: "Password length",
      pwdGuideLenDesc: "Password must be at least 6 characters. Should combine uppercase, lowercase, numbers, and special characters.",
      pwdGuideUnique: "Do not reuse old passwords",
      pwdGuideUniqueDesc: "Avoid using the same password for multiple accounts on the Internet.",
      pwdGuideOtp: "Two-factor security",
      pwdGuideOtpDesc: "Sensitive actions like account deletion require verification with an OTP sent to your registered email.",
      notificationGuideTitle: "Notification Info",
      emailActivityTitle: "Security notification emails",
      emailActivityDesc: "Send instant email alerts when password changes or account deletion is requested.",
      systemActivityTitle: "Browser notifications",
      systemActivityDesc: "Display visual notifications (toasts) when AI analysis completes or when the system updates."
    },
  };


  function translateDynamicToast(text, lang) {
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

    // 10. Mã OTP không chính xác. Bạn còn {attempts} lần nhập.
    const matchOtp = text.match(/Mã OTP không chính xác\.\s*Bạn còn (\d+) lần nhập\./);
    if (matchOtp) {
      return "Incorrect OTP. You have " + matchOtp[1] + " attempts left.";
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
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
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

    try {
      document.dispatchEvent(
        new CustomEvent("i18nChanged", { detail: { lang: lang } }),
      );
    } catch (e) { }

    if (oldLang !== lang) {
      window.location.reload();
    }
  }

  function loadRemoteTranslations(lang, callback) {
    fetch("/static/locales/translations.json")
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
          console.log("i18n successfully merged remote translations!");
          applyTranslations(lang);
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
      console.log("i18n saved language is:", saved);
      currentLang = saved;
      applyTranslations(saved);
      updateSwitcherUI(saved);
      // Ensure cookie is synced on initialization (e.g. if cookie was cleared/expired but localStorage exists)
      // to prevent FOUC / translation flash on subsequent page reloads (F5) or PJAX request triggers.
      saveLang(saved);
      loadRemoteTranslations(saved);

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
      document.documentElement.classList.remove("i18n-loading");
      document.documentElement.classList.add("ready");
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
        el.textContent = val;
      }
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });

    root.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (dict[key] !== undefined) el.setAttribute("title", dict[key]);
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
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    root.querySelectorAll("[data-i18n-breed]").forEach(function (el) {
      var vi = el.getAttribute("data-i18n-breed") || el.getAttribute("data-i18n-breed-vi");
      var en = el.getAttribute("data-i18n-breed-en");
      if (lang === "en") {
        el.textContent = en || translateBreedViToEn(vi);
      } else {
        el.textContent = vi || "Chưa xác định";
      }
    });
  }

  // Listen for language change to toggle custom database contents instantly without F5
  function updateDynamicContentVisibility(lang) {
    var viDiv = document.getElementById("dynamic-content-vi");
    var enDiv = document.getElementById("dynamic-content-en");
    if (viDiv && enDiv) {
      if (lang === "en") {
        viDiv.classList.add("hidden");
        enDiv.classList.remove("hidden");
      } else {
        enDiv.classList.add("hidden");
        viDiv.classList.remove("hidden");
      }
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
    var confirmText = options.confirmText || tDict.confirm || (lang === "en" ? "Confirm" : "Xác nhận");
    var cancelText = options.cancelText || tDict.cancel || (lang === "en" ? "Cancel" : "Hủy");

    // Icon & colors mapping
    var iconName = "warning";
    var iconClass = "text-amber-500 dark:text-amber-450";
    var btnClass = "bg-primary hover:bg-primary/95 text-on-primary";
    
    if (type === "danger") {
      iconName = "error";
      iconClass = "text-red-500 dark:text-red-450";
      btnClass = "bg-red-650 hover:bg-red-750 dark:bg-red-600 dark:hover:bg-red-700 text-white";
    } else if (type === "success") {
      iconName = "check_circle";
      iconClass = "text-emerald-500 dark:text-emerald-450";
      btnClass = "bg-emerald-650 hover:bg-emerald-750 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white";
    } else if (type === "info") {
      iconName = "info";
      iconClass = "text-blue-500 dark:text-blue-450";
      btnClass = "bg-blue-650 hover:bg-blue-755 dark:bg-blue-600 dark:hover:bg-blue-700 text-white";
    }

    var modalId = "petai-global-modal-" + Date.now();
    var modalDiv = document.createElement("div");
    modalDiv.id = modalId;
    modalDiv.className = "fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 transition-opacity duration-300 opacity-0 pointer-events-none";
    modalDiv.setAttribute("role", "dialog");
    modalDiv.setAttribute("aria-modal", "true");

    var modalContent = 
      '<div class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl transform scale-95 transition-transform duration-300">' +
        '<h3 class="headline-md font-semibold text-on-surface dark:text-slate-100 flex items-center gap-2">' +
          '<span class="material-symbols-outlined ' + iconClass + '">' + iconName + '</span>' +
          '<span>' + title + '</span>' +
        '</h3>' +
        '<div class="body-md text-on-surface-variant dark:text-slate-300 mt-3 whitespace-pre-line">' + text + '</div>' +
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

      function handleCancel() {
        modal.close();
        resolve(false);
      }

      cancelBtn.addEventListener("click", handleCancel);

      confirmBtn.addEventListener("click", function () {
        if (options.onConfirm) {
          // Show spinner, disable buttons
          confirmBtn.disabled = true;
          cancelBtn.disabled = true;
          if (spinner) spinner.classList.remove("hidden");
          
          Promise.resolve(options.onConfirm())
            .then(function (res) {
              modal.close();
              resolve(res !== false);
            })
            .catch(function (err) {
              console.error("onConfirm error:", err);
              confirmBtn.disabled = false;
              cancelBtn.disabled = false;
              if (spinner) spinner.classList.add("hidden");
            });
        } else {
          modal.close();
          resolve(true);
        }
      });

      // Close on clicking backdrop
      modal.element.addEventListener("click", function (e) {
        if (e.target === modal.element && !confirmBtn.disabled) {
          handleCancel();
        }
      });
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
    updateDynamicContentVisibility: updateDynamicContentVisibility
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
