import React, {
  FunctionComponent,
} from 'react';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import ViewWrapper from './style';
import { SwipeableFlatListProps } from './swipeableFlatListProps';

const styles = StyleSheet.create({
  pagination: {
    width: 5,
    height: 5,
    marginRight: 1,
  },
});

const SwipeableFlatList: FunctionComponent<SwipeableFlatListProps> = (props) => (
  <View>
    <ViewWrapper>
      <Text style={{ marginTop: 15, marginLeft: 15 }}>{props.title}</Text>
      <TouchableOpacity onPress={() => props.navigationProps.navigation.navigate(props.navigationProps.title, {
        screen: props.navigationProps.title,
      })}>
        <Text style={{ marginTop: 15, marginLeft: 195, color: 'grey' }}>See All</Text>
      </TouchableOpacity>
    </ViewWrapper>
    <View style={{ marginLeft: 15, marginRight: 15 }}>
      <SwiperFlatList
        style={{ marginBottom: 25 }}
        showPagination
        paginationActiveColor='black'
        paginationStyleItem={styles.pagination}
        nestedScrollEnabled={true}
        data={props.data}
        renderItem={props.renderItem}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  </View>
);

SwipeableFlatList.defaultProps = {
  title: 'Hello',
  data: undefined,
  renderItem: undefined,
  navigationProps: undefined,
};

export default SwipeableFlatList;
