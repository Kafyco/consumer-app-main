Based on [@expo](https://docs.expo.dev/). Before starting any development it's highly suggested to read full documentation of the Expo to get better understanding of development process. Yes, all documentation.

# Development

Once you checked out this repository, install all dependencies:

```bash
$ yarn install
```

To launch the app in simulator for development run:

```bash
$ yarn start
```

Follow instructions provided by the script.

**N.B.** For iOS you should use run on Mac only. For Android you will need to have [Android Studio](https://developer.android.com/studio/install) installed.

When running iOS it may ask you to install latest build of the app. You cas still run the application on Expo Go client, just press `S` key to switch. 

If you still want to run devleopment build on the simulator they all available on https://expo.dev/accounts/supplymeapp/projects/portal/builds. Note that build profile must be `development`. For more information checkout [@expo](https://docs.expo.dev/) documentation.

# Project structure

### src/api
API client. Provides methods to communicate with the server.

### src/assets
Folder with static assets used in the app, i.e. pictures, fonts, animations.

### src/navigation
Project uses [@react-navigation](https://reactnavigation.org/) for navigating between screens. 

This folder defines routes to each applicaiton screen.

### src/screens
Applicaiton screens. Entry points for navigation entry.

### src/components
React component used by screens or other components. Most of the logic and visual elements contained by components.

### src/reducers
Application uses Redux with [Redux Toolkit](https://redux-toolkit.js.org/). Files in this folder represents different stores of the information and the way it processed.

### src/hooks | src/utils
Different helpers in form of hooks and plain funcitons.

### src/utils/environment.ts
This file defines variables depending on current app build, including **API base URLs**!

### src/constants
Different contants used accross the app.

### src/i18n
Translations.

# Building the app

To start building the app you'll need EAS CLI tools installed, and you must be logged in to Expo.

To install EAS:
```bash
$ npm install -g eas-cli
```

To login:
```bash
$ eas login
```

Follow the sintuctions on the screen.

Once logged in, you can start creating development build:

```bash
# For iOS
$ eas build --profile development --platform ios
# For Android
$ eas build --profile development --platform android
```

More info on [expo](https://docs.expo.dev/build/introduction/).

# Building an app for app stores

Building projects for app stores is very similar to building it for the development.

(!) Don't forget to update app and builds versions in `app.json`.

## iOS

You will need to have access to App Store Connect.

```bash
$ eas build --profile production --platform ios
```

Follow instructions on the screen.

## Android

Before proceeding, make sure that you have `portal.jks` file under `credentials/android` folder.

```bash
$ eas build --profile production --platform android
```

# Submitting to App Stores

Read full documentation on [expo](https://docs.expo.dev/deploy/submit-to-app-stores/).

```bash
$ eas submit -p ios --latest
$ eas submit -p android --latest
```

This will upload latest build to your app stores accounts. 

Now you can proceed with application publication from App Store Connect and Google Play Console.

