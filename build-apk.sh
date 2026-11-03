#!/bin/bash
set -e

echo "=========================================="
echo "  Q Fix AI - Android Debug APK Builder"
echo "=========================================="

echo "1. Building web application assets..."
npm run build

echo "2. Syncing web distribution into Android assets..."
mkdir -p app/src/main/assets
cp -r dist/* app/src/main/assets/

echo "3. Preparing directories..."
mkdir -p build_apk/gen build_apk/obj build_apk/bin app/build/outputs/apk/debug dist public ~/.android

echo "4. Generating R.java with AAPT..."
/usr/bin/aapt package -f -m \
  -J build_apk/gen \
  -S app/src/main/res \
  -M app/src/main/AndroidManifest.xml \
  -I /opt/android-sdk/platforms/android-34/android.jar

echo "5. Compiling Java sources..."
/usr/bin/javac -source 8 -target 8 \
  -d build_apk/obj \
  -cp /opt/android-sdk/platforms/android-34/android.jar \
  build_apk/gen/com/qfix/ai/R.java \
  app/src/main/java/com/qfix/ai/MainActivity.java

echo "6. Converting bytecode to Dalvik executable (classes.dex)..."
/usr/bin/dalvik-exchange --dex --output=build_apk/bin/classes.dex build_apk/obj

echo "7. Packaging APK resources and assets..."
/usr/bin/aapt package -f \
  -M app/src/main/AndroidManifest.xml \
  -S app/src/main/res \
  -A app/src/main/assets \
  -I /opt/android-sdk/platforms/android-34/android.jar \
  -F build_apk/bin/app-unsigned.apk

echo "8. Adding classes.dex to APK..."
(cd build_apk/bin && /usr/bin/aapt add app-unsigned.apk classes.dex)

echo "9. Zip-aligning APK..."
/usr/bin/zipalign -v -p -f 4 build_apk/bin/app-unsigned.apk build_apk/bin/app-aligned.apk

echo "10. Signing APK with Android debug keystore..."
if [ ! -f ~/.android/debug.keystore ]; then
  keytool -genkey -v -keystore ~/.android/debug.keystore \
    -storepass android -alias androiddebugkey -keypass android \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=Android Debug,O=Android,C=US"
fi

/usr/bin/apksigner sign \
  --ks ~/.android/debug.keystore \
  --ks-pass pass:android \
  --ks-key-alias androiddebugkey \
  --key-pass pass:android \
  --out app/build/outputs/apk/debug/app-debug.apk \
  build_apk/bin/app-aligned.apk

echo "11. Verifying APK signature..."
/usr/bin/apksigner verify -v app/build/outputs/apk/debug/app-debug.apk

echo "12. Exposing APK for web download..."
cp app/build/outputs/apk/debug/app-debug.apk dist/app-debug.apk
cp app/build/outputs/apk/debug/app-debug.apk public/app-debug.apk

echo "=========================================="
echo "  APK Build Complete!"
echo "  Location: app/build/outputs/apk/debug/app-debug.apk"
echo "  Web Download: /app-debug.apk"
echo "=========================================="
ls -lh app/build/outputs/apk/debug/app-debug.apk
