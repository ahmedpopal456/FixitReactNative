import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import { ListRenderItem } from 'react-native';

export interface SwipeableFlatListProps extends PropsWithChildren<any> {
  /** Title of the Swipeable List */
  title: string;
  /** Navigation Stack */
  navigationProps: SwipeableFlatListNavigationProps;
  /** Data used and passed to the rendering component */
  data: any[];
  /** Rendering component */
  renderItem: ListRenderItem<any>;
}

export interface SwipeableFlatListNavigationProps extends PropsWithChildren<any> {
  /** Title of the Header */
  title: string;
  /** Navigation Stack */
  navigation: NavigationProp<ParamListBase, string>;
}
