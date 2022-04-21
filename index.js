import { Navigation } from 'react-native-navigation';
import App from './App';

Navigation.registerComponent('com.testRNative.Home', () => App);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'com.testRNative.Home',
      },
    },
  });
});
