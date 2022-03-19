import React, { FunctionComponent } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
    backgroundColor: '#FFD14A',
  },
});

const SecurityScreen: FunctionComponent<any> = (props) => {
  function render() {
    return (
      <SafeAreaView style={styles.container}>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaView>
    );
  }
  return render();
};

export default SecurityScreen;
