$file = 'lib\main.dart'
$content = Get-Content $file -Raw -Encoding UTF8

$oldText = "  @override`r`n  Widget build(BuildContext context) {"

$newMethod = @"
  /// Inject CSS to instantly disable all i18n-loading/preload flicker on Android WebView.
  Future<void> _injectNoTransitionCSS() async {
    const js = '''
      (function() {
        var s = document.getElementById('__android_no_flicker__');
        if (!s) {
          s = document.createElement('style');
          s.id = '__android_no_flicker__';
          s.textContent = [
            'html.i18n-loading body { visibility: visible !important; }',
            'html.preload body { visibility: visible !important; }',
            'body { visibility: visible !important; }'
          ].join('\n');
          (document.head || document.documentElement).appendChild(s);
        }
        document.documentElement.classList.remove('i18n-loading');
        document.documentElement.classList.remove('preload');
        document.documentElement.classList.add('ready');
        if (document.body) document.body.style.visibility = 'visible';
      })();
    ''';
    await _controller.runJavaScript(js);
  }

  @override
  Widget build(BuildContext context) {
"@

$newContent = $content.Replace($oldText, $newMethod)

if ($newContent -eq $content) {
    Write-Host "WARNING: No replacement was made. oldText not found!"
} else {
    Set-Content -Path $file -Value $newContent -Encoding UTF8 -NoNewline
    Write-Host "SUCCESS. File updated."
}
