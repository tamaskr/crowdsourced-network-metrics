# CMNM - Metrics App

> 📱 The metrics app can be installed by volunteers who wish to share their network metrics.

## Technologies
The metrics app is built with React Native, however currently it only supports Android due to limitations on the iOS platform. The application uses Expo to simplify development and abstract away much of the native code.

## Running the development app locally
1. Get the development app APK from the repository's releases section, or build your own locally or with EAS
2. Install the APK on a real device or emulator
3. Place the the `google-services.json` in the project folder that you download from the Firebase dashboard
4. Run `npm start` in the project folder to launch the expo development server
5. Open the app on the phone and scan the QR code from the terminal, or manually enter the IP address

## Building the development app with EAS
Manual builds of the metrics app can easily be created using [EAS Build](https://docs.expo.dev/build/introduction/). Create an account at https://expo.dev/, then follow along with the steps below.

1. Ensure that you have a clean git status before creating a new build
2. Install the EAS command line interface
   ```bash
   npm install -g eas-cli
   ```
3. Authenticate using your own, personal EAS account, then initialize EAS in the project and configure the build parameters such as supported platforms
   ```bash
   npx eas login
   npx eas init
   npx eas build:configure
   ```
4. Place the the `google-services.json` in the project folder and ensure that it is not in the `.gitignore` file
5. Run a development build for Android
   ```bash
   npx eas build --platform android --profile development
   ```
6. Install the apk from the EAS dashboard on an emulator or a real device
7. Reset the git status, **do not commit** your personal EAS settings to the repository
