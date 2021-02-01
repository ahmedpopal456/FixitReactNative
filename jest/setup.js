/* eslint no-undef: 0 */
/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint global-require: 0 */
/* eslint @typescript-eslint/no-empty-function: 0 */
/* eslint max-len: 0 */

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
