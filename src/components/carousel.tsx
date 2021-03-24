import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useInterval from './useInterval';

type Props = {
  images: string[];
};

const MAX_WIDTH = Dimensions.get('screen').width;

const Carousel: React.FC<Props> = ({images}) => {
  var animation = useRef(new Animated.Value(0));
  var [currentImage, setCurrentImage] = useState(0);
  useInterval(() => handleAnimation(), 5000);

  const handleAnimation = () => {
    let newCurrentImage = currentImage + 1;

    if (newCurrentImage >= images.length) {
      newCurrentImage = 0;
    }

    Animated.spring(animation.current, {
      toValue: -(MAX_WIDTH * newCurrentImage),
      useNativeDriver: true,
    }).start();

    setCurrentImage(newCurrentImage);
  };
  return (
    <React.Fragment>
      <View>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{translateX: animation.current}],
            },
          ]}>
            {/* Change to component */}
          {images.map((image) => (
            <Image key={image} source={{uri: image}} style={styles.image} />
          ))}
        </Animated.View>
        <View style={styles.indicatorContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={`${image}_${index}`}
              style={[
                styles.indicator,
                index === currentImage ? styles.activeIndicator : undefined,
              ]}
              onPress={()=>{
                setCurrentImage(index);
                handleAnimation();
              }}
            />
          ))}
        </View>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height: 200,
    width: MAX_WIDTH,
  },
  container: {
    flexDirection: 'row',
  },
  indicatorContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: MAX_WIDTH,
    bottom: 10,
    zIndex: 2,
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderColor: 'white',
    borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
});

export default Carousel;