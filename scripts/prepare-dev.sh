set -e

sed -i '' 's/com.youtubeviwer.app/com.youtubeviwer.app_dev/' app.config.ts
sed -i '' 's/NouTube/NouTube-dev/' app.config.ts
yes | bun expo prebuild -p android --clean --no-install
sed -i '' 's/release {/release {\
            signingConfig signingConfigs.debug/' android/app/build.gradle
