import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:file_selector/file_selector.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Thiết lập giao diện hệ thống (Status Bar)
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  // Lấy token đã lưu (nếu có)
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('access_token');

  runApp(PetAIApp(initialToken: token));
}

class PetAIApp extends StatelessWidget {
  final String? initialToken;

  static final List<Color> _brandColors = [
    const Color(0xFFB7791F), // Vàng Phật Giáo
    const Color(0xFF1565C0),
    const Color(0xFF2E7D32),
    const Color(0xFFC62828),
    const Color(0xFF6A1B9A),
    const Color(0xFF37474F),
  ];

  PetAIApp({super.key, this.initialToken});

  final Color _primaryColor =
      _brandColors[Random().nextInt(_brandColors.length)];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: _primaryColor),
        useMaterial3: true,
      ),
      home: WebViewScreen(token: initialToken),
    );
  }
}

// ============================================================
// MAIN WEBVIEW SCREEN
// ============================================================
class WebViewScreen extends StatefulWidget {
  final String? token;
  const WebViewScreen({super.key, required this.token});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;
  bool _hasError = false;
  double _loadingProgress = 0;
  String? _activeToken;
  bool _isAuthenticating = false;
  Color _scaffoldBgColor = const Color(0xFFFCFAF7);
  Brightness _iconBrightness = Brightness.dark;

  @override
  void initState() {
    super.initState();
    _activeToken = widget.token;
    _initWebView();
  }

  // --- WebView Initialization ---

  void _initWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFFFCFAF7))
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (progress) =>
              setState(() => _loadingProgress = progress / 100),
          onPageStarted: (_) => setState(() {
            _isLoading = true;
            _hasError = false;
          }),
          onPageFinished: (_) {
            setState(() => _isLoading = false);
            if (_activeToken != null) _injectTokenToWeb(_activeToken!);
          },
          onWebResourceError: (_) => setState(() {
            _isLoading = false;
            _hasError = true;
          }),
          onNavigationRequest: _handleNavigation,
        ),
      )
      ..addJavaScriptChannel(
        'FlutterBridge',
        onMessageReceived: _handleWebMessage,
      );

    if (_controller.platform is AndroidWebViewController) {
      final androidController =
          _controller.platform as AndroidWebViewController;
      androidController.setOnShowFileSelector((params) async {
        final files = await openFiles(
          acceptedTypeGroups: _acceptedTypeGroups(params.acceptTypes),
        );

        return files
            .where((file) => file.path.isNotEmpty)
            .map((file) => Uri.file(file.path).toString())
            .toList();
      });
    }

    _setupAppCookie();
    _loadAppUrl(_activeToken);
  }

  List<XTypeGroup> _acceptedTypeGroups(List<String> acceptTypes) {
    if (acceptTypes.isEmpty) {
      return const [];
    }

    final extensions = <String>{};
    final mimeTypes = <String>{};

    for (final rawType in acceptTypes) {
      final type = rawType.trim().toLowerCase();
      if (type.isEmpty || type == '*/*') {
        continue;
      }

      if (type.startsWith('.')) {
        extensions.add(type.substring(1));
        continue;
      }

      if (type == 'image/*') {
        extensions.addAll(const ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']);
        mimeTypes.add(type);
        continue;
      }

      if (type.contains('/')) {
        mimeTypes.add(type);
      }
    }

    if (extensions.isEmpty && mimeTypes.isEmpty) {
      return const [];
    }

    return [
      XTypeGroup(
        label: 'upload',
        extensions: extensions.isEmpty ? null : extensions.toList(),
        mimeTypes: mimeTypes.isEmpty ? null : mimeTypes.toList(),
      ),
    ];
  }

  // --- Helper Methods ---

  /// Thiết lập cookie định danh để Web nhận biết môi trường App
  Future<void> _setupAppCookie() async {
    final domain = Uri.parse(AppConfig.webBaseUrl).host;
    await WebViewCookieManager().setCookie(
      WebViewCookie(
        name: 'viewappmobie',
        value: 'true',
        domain: domain,
        path: '/',
      ),
    );
  }

  /// Load trang web chính với token (nếu có)
  void _loadAppUrl(String? token) {
    final url = token != null
        ? '${AppConfig.webBaseUrl}/?token=$token'
        : AppConfig.webBaseUrl;
    _controller.loadRequest(Uri.parse(url));
  }

  /// Chặn các điều hướng không hợp lệ
  NavigationDecision _handleNavigation(NavigationRequest request) {
    final url = request.url;
    final uri = Uri.tryParse(url);

    bool isGoogleAuthHost(String host) {
      return host == 'accounts.google.com' ||
          host.endsWith('.google.com') ||
          host.endsWith('.googleusercontent.com') ||
          host.endsWith('.gstatic.com');
    }

    bool isBlockedAuthPath(String path) {
      return path == '/authorize/google' ||
          path == '/login/google' ||
          path == '/auth/google/login/flutter';
    }

    // ✅ Cho phép các URL chứa callback hoặc token đi qua bình thường
    if (url.contains('callback') || url.contains('token=')) {
      return NavigationDecision.navigate;
    }

    if (uri != null && uri.hasAuthority) {
      if (isGoogleAuthHost(uri.host) || isBlockedAuthPath(uri.path)) {
        if (!_isAuthenticating) {
          unawaited(_runExternalAuth(url));
        }
        return NavigationDecision.prevent;
      }
    }

    if (url.startsWith(AppConfig.webBaseUrl)) {
      return NavigationDecision.navigate;
    }
    debugPrint('==> Đã chặn điều hướng ngoài: ${request.url}');
    return NavigationDecision.prevent;
  }

  /// Xử lý các thông điệp gửi từ JavaScript
  void _handleWebMessage(JavaScriptMessage message) async {
    final data = message.message;
    debugPrint('==> Bridge received: $data');

    switch (data) {
      case 'LOGOUT':
        _processLogout();
        break;
      default:
        if (data.startsWith('GOOGLE_LOGIN:')) {
          final sessionId = data.split(':')[1];
          _triggerNativeGoogleLogin(sessionId);
        } else if (data.startsWith('THEME:')) {
          final themeMode = data.split(':')[1];
          _updateSystemTheme(themeMode);
        }
        break;
    }
  }

  void _updateSystemTheme(String themeMode) {
    final isDark = themeMode == 'dark';
    setState(() {
      _scaffoldBgColor = isDark ? const Color(0xFF0b1220) : const Color(0xFFFCFAF7);
      _iconBrightness = isDark ? Brightness.light : Brightness.dark;
    });

    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: _iconBrightness,
        systemNavigationBarColor: _scaffoldBgColor,
        systemNavigationBarIconBrightness: _iconBrightness,
      ),
    );
    debugPrint('==> Android system theme updated: $themeMode');
  }

  // --- Core Logic ---

  int _cctOpenCount = 0;

  String _buildFlutterGoogleLoginUrl(String sessionId) {
    final uri = Uri.parse(AppConfig.googleLoginFlutterUrl);
    return uri
        .replace(
          queryParameters: {...uri.queryParameters, 'session_id': sessionId},
        )
        .toString();
  }

  Future<void> _runExternalAuth(
    String loginUrl, {
    bool useAuthGuard = true,
  }) async {
    if (useAuthGuard) {
      if (_isAuthenticating) return;
      _isAuthenticating = true;
    }

    try {
      final result = await FlutterWebAuth2.authenticate(
        url: loginUrl,
        callbackUrlScheme: AppConfig.callbackScheme,
      );

      final resultUri = Uri.tryParse(result);
      if (resultUri != null) {
        final token =
            resultUri.queryParameters['access_token'] ??
            resultUri.queryParameters['token'];
        if (token != null && token.isNotEmpty) {
          await _saveToken(token);
          await _injectTokenToWeb(token);
        }
      }
    } catch (e) {
      debugPrint('==> External auth failed: $e');
    } finally {
      if (useAuthGuard) {
        _isAuthenticating = false;
      }
    }
  }

  Future<void> _triggerNativeGoogleLogin(String sessionId) async {
    if (_isAuthenticating) return;
    _isAuthenticating = true;

    _cctOpenCount++;
    debugPrint(
      '==> 🚀 [CCT] Mở Tab login cho Session: $sessionId - Lần: $_cctOpenCount',
    );

    try {
      // Try native Google Sign-In first (avoids WebView user-agent blocks)
      final google = GoogleSignIn(
        scopes: ['email', 'profile', 'openid'],
        // Use web client id from project credentials so server can exchange codes
        serverClientId:
            '531393801063-u2u5ntopagsiqu4ohn7li5qpsj2cvhv6.apps.googleusercontent.com',
      );

      final account = await google.signIn();
      if (account != null) {
        final auth = await account.authentication;
        final idToken = auth.idToken;
        final serverAuthCode = account.serverAuthCode;

        // Send tokens to backend to finalize login for this session
        try {
          final resp = await http.post(
            Uri.parse(AppConfig.googleLoginFlutterUrl),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'session_id': sessionId,
              'id_token': idToken,
              'server_auth_code': serverAuthCode,
              'source': 'native',
            }),
          );

          if (resp.statusCode == 200) {
            debugPrint('==> Native login token posted to server');
            // Server will attach token and web will pick it up via polling
          } else {
            debugPrint('==> Server responded ${resp.statusCode}: ${resp.body}');
            // Fallback to browser flow
            final loginUrl = _buildFlutterGoogleLoginUrl(sessionId);
            await _runExternalAuth(loginUrl, useAuthGuard: false);
          }
        } catch (e) {
          debugPrint('==> Failed to POST token to server: $e');
          final loginUrl = _buildFlutterGoogleLoginUrl(sessionId);
          await _runExternalAuth(loginUrl, useAuthGuard: false);
        }
      } else {
        // User cancelled native sign-in; fallback to browser flow
        final loginUrl = _buildFlutterGoogleLoginUrl(sessionId);
        await _runExternalAuth(loginUrl, useAuthGuard: false);
      }
    } catch (e) {
      debugPrint('==> Native google sign-in failed, falling back: $e');
      // If native flow fails for any reason, fallback to CCT browser flow
      try {
        final loginUrl = _buildFlutterGoogleLoginUrl(sessionId);
        await _runExternalAuth(loginUrl, useAuthGuard: false);
      } catch (e2) {
        debugPrint('==> CCT fallback also failed: $e2');
      }
    } finally {
      _isAuthenticating = false;
    }
  }

  Future<void> _processLogout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');

    await WebViewCookieManager().clearCookies();
    await _setupAppCookie(); // Re-set mobile identifier after clear

    setState(() => _activeToken = null);
    _loadAppUrl(null);
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', token);
    setState(() => _activeToken = token);
  }

  Future<void> _injectTokenToWeb(String token) async {
    await _controller.runJavaScript('''
      try {
        localStorage.setItem('access_token', '$token');
        window.dispatchEvent(new CustomEvent('flutter_token_ready', { detail: { token: '$token' } }));
        console.log('[Flutter] Token injected');
      } catch(e) {}
    ''');
  }

  @override
  Widget build(BuildContext context) {
    final topInset = MediaQuery.of(context).viewPadding.top;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        if (await _controller.canGoBack()) {
          _controller.goBack();
        } else if (context.mounted) {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: _scaffoldBgColor,
        body: Column(
          children: [
            if (topInset > 0) SizedBox(height: topInset),
            Expanded(
              child: Stack(
                children: [
                  if (!_hasError)
                    WebViewWidget(controller: _controller)
                  else
                    _ErrorView(onRetry: () => _controller.reload()),
                  if (_isLoading && !_hasError) _buildProgressBar(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressBar() {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: LinearProgressIndicator(
        value: _loadingProgress,
        backgroundColor: Colors.transparent,
        color: const Color(0xFFB7791F),
        minHeight: 3,
      ),
    );
  }
}

// ============================================================
// ERROR VIEW - Hiển thị khi mất kết nối
// ============================================================
class _ErrorView extends StatelessWidget {
  final VoidCallback onRetry;
  const _ErrorView({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.cloud_off_rounded,
              size: 80,
              color: colorScheme.primary.withValues(alpha: 0.6),
            ),
            const SizedBox(height: 24),
            Text(
              'Mất kết nối Internet',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Không thể tải nội dung. Vui lòng kiểm tra lại đường truyền và thử lại.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Thử lại'),
              style: ElevatedButton.styleFrom(
                backgroundColor: colorScheme.primary,
                foregroundColor: colorScheme.onPrimary,
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 15,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 0,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
