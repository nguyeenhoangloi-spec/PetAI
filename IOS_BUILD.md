# iOS .ipa build (CI & local)

This document explains prerequisites and how to produce a signed `.ipa` using the CI workflow added at `.github/workflows/build-ipa.yml`.

Prerequisites

- macOS with Xcode installed (or GitHub Actions `macos-latest` runner).
- Xcode command-line tools.
- If a Flutter app: Flutter SDK installed and `pod` (CocoaPods).
- An Apple Developer account with:
  - iOS Distribution certificate (.p12)
  - Provisioning profile (matching app bundle id)

Repository secrets (add these in your repo Settings → Secrets):

- `IOS_CERT_BASE64` — base64 of the `.p12` certificate file.
- `IOS_CERT_PASSWORD` — password for the `.p12` (empty string if none).
- `IOS_PROVISIONING_PROFILE_BASE64` — base64 of the `.mobileprovision` file.

How to create base64 values

- macOS / Linux:

  ```bash
  base64 -i mycert.p12 > ios_cert.base64
  # then copy contents into the secret value
  base64 myprofile.mobileprovision > profile.base64
  ```

- Windows (Powershell):

  ```powershell
  [Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\path\to\mycert.p12')) > ios_cert.base64
  Get-Content ios_cert.base64 | Set-Clipboard
  ```

Triggering the workflow

- Open the repository Actions tab and run the `Build iOS IPA` workflow (it's `workflow_dispatch`).
- Or trigger via GitHub API using a `workflow_dispatch` event.

Local build (macOS)

- For Flutter:

  ```bash
  cd app_web_view
  flutter pub get
  cd ios
  pod install --repo-update
  cd ..
  flutter build ipa --export-options-plist=../export_options.plist
  ```

- For native Xcode workspace:

  ```bash
  xcodebuild -workspace Runner.xcworkspace -scheme Runner -configuration Release -archivePath build/Runner.xcarchive archive
  xcodebuild -exportArchive -archivePath build/Runner.xcarchive -exportOptionsPlist export_options.plist -exportPath build/ipa
  ```

Export method

- The workflow uses `ad-hoc` by default. To build for App Store release, set `<key>method</key><string>app-store</string>` in the `export_options.plist` (or configure Fastlane).

Notes & troubleshooting

- Ensure the provisioning profile and cert match the app's bundle identifier and entitlements.
- If codesign fails, check that the certificate was correctly imported and key partition list is set (workflow sets this for you).
- For App Store uploads, consider using Fastlane's `match` and `deliver` to manage signing and upload.

If you want, I can:

- Add Fastlane integration and a workflow step to upload to App Store Connect.
- Change the workflow to export `app-store` instead of `ad-hoc`.
- Help create the required base64 secrets from files you provide locally.
