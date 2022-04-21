import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import UsersList from './src/components/UsersList';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.root}>
        <UsersList />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({ root: { flex: 1 } });

export default App;
