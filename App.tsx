import 'react-native-gesture-handler';
import 'intl-pluralrules';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import type { MD2Theme } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from 'sentry-expo';

import 'i18n/config';

import Colors from 'constants/Colors';
import theme from 'constants/theme';
import resources from 'constants/Resources';
import useCachedResources from 'hooks/useCachedResources';
import useColorScheme from 'hooks/useColorScheme';
import useSelector from 'hooks/useSelector';
import useDispatch from 'hooks/useDispatch';
import useAppStartupEffect from 'hooks/useAppStartupEffect';
import {
  restoreAppState,
  selectAuthResolutionFlag,
  selectIsAuthenticated,
  selectCurrentUser,
} from 'reducers/app';
import { fetchAddresses, selectAddressesStatus } from 'reducers/addresses';

import Navigation from 'navigation/index';
import ConnectionListener from 'components/ConnectionListener';
import AnimatedSplash from 'components/AnimatedSplashScreen';
import SplashLogo, {
  defaultWidth as splashLogoWidth,
  defaultHeight as splashLogoHeight,
} from 'components/SplashLogo';

// Redux Store
import store from './src/store';

Sentry.init({
  dsn: 'https://8ded3c522aaa4d01ab65696353058e53@o960976.ingest.sentry.io/5909370',
  enableInExpoDevelopment: true,
  tracesSampleRate: 0.2,
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      tracingOrigins: ['localhost', 'supplyme.ae', 'kafy.co', /^\//],
      // ... other options
    }),
  ],
});

const Main = () => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const isResourcesLoaded = useCachedResources(resources);
  const isAuthStateReloved = useSelector(selectAuthResolutionFlag);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const addressesStatus = useSelector(selectAddressesStatus);
  const [isReady, setIsReady] = React.useState(false);

  const handleRootLayout = async () => {
    await SplashScreen.hideAsync();
  };

  React.useEffect(() => {
    if (!isReady) {
      if (isResourcesLoaded && isAuthStateReloved) {
        if (!isAuthenticated) {
          return setIsReady(true);
        }

        // Wait for loading of mandatory information.
        return setIsReady(Boolean(currentUser && addressesStatus === 'fulfilled'));
      }
    }
  }, [isResourcesLoaded, isAuthStateReloved, isAuthenticated, currentUser, addressesStatus]);

  // Request required information once authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAddresses());
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    dispatch(restoreAppState());
  }, []);

  useAppStartupEffect();

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={isReady}
      backgroundColor={Colors.splash}
      logoHeight={splashLogoWidth}
      logoWidth={splashLogoHeight}
      customComponent={<SplashLogo />}
      onLayout={handleRootLayout}
    >
      <>
        <Navigation colorScheme={colorScheme} />
        <ConnectionListener />
        <StatusBar style="dark" />
      </>
    </AnimatedSplash>
  );
};

export default function App() {
  React.useEffect(() => {
    const holdSplash = async () => await SplashScreen.preventAutoHideAsync();
    holdSplash();
  }, []);

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme as MD2Theme}>
        <SafeAreaProvider>
          <Main />
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
