import React from 'react';
import {
  Button, Divider, H3, P, Tag,
} from 'fixit-common-ui';
import { TouchableOpacity, View } from 'react-native';
import GlobalStyles from '../components/styles/fixRequests/globalStyles';
import FixRequestStyles from '../components/styles/fixRequests/fixRequestStyles';
import { SearchResultsScreenProps } from '../models/screens/searchResultsScreenModel';
import FixSearchHeader from '../components/fixSearchHeader';
import StyledScrollView from '../components/styledElements/styledScrollView';
import StyledPageWrapper from '../components/styledElements/styledPageWrapper';

const mockFixes = [
  {
    title: 'Repair Sink',
    shortDesc: 'Add new sink and sink counter',
    tags: ['Bathroom', 'Tiles', 'Counter'],
  },
  {
    title: 'Redo my kitchen',
    shortDesc: 'Mauris faucibus enim eget blandit vestibulum. Suspendisse augue ipsum, cursus quis dignissim ac, pellentesque sed nunc.',
    tags: ['Kitchen', 'Stove', 'Fridge'],
  },
  {
    title: 'Hammer some nails',
    shortDesc: 'Mauris faucibus enim eget blandit vestibulum. Suspendisse augue ipsum, cursus quis dignissim ac, pellentesque sed nunc.',
    tags: ['dolor', 'sit', 'amet', 'naect', 'sum', 'nam'],
  },
  {
    title: 'Leaky faucet',
    shortDesc: 'Mauris faucibus enim eget blandit vestibulum. Suspendisse augue ipsum, cursus quis dignissim ac, pellentesque sed nunc.',
    tags: ['Water', 'every', 'where'],
  },
  {
    title: 'Repair this thing',
    shortDesc: 'Mauris faucibus enim eget blandit vestibulum. Suspendisse augue ipsum, cursus quis dignissim ac, pellentesque sed nunc.',
    tags: ['Bathroom', 'Tiles', 'Counter'],
  },
  {
    title: 'Repair this other thing',
    shortDesc: 'Mauris faucibus enim eget blandit vestibulum. Suspendisse augue ipsum, cursus quis dignissim ac, pellentesque sed nunc.',
    tags: ['this is a long tag', 'with lots', 'of', 'other', 'small', 'tags', 'this', 'fix', 'has', 'too', 'many'],
  },
];

export default class SearchResultsScreen extends
  React.Component<SearchResultsScreenProps> {
  render() : JSX.Element {
    return (
      <>
        <FixSearchHeader showBackBtn={true} navigation={this.props.navigation} screenTitle="Start from a Fixit Template" />
        <StyledPageWrapper>
          <StyledScrollView>
            {mockFixes.map((fix:{
              title: string,
              shortDesc: string,
              tags: string[],
            }) => (
              fix
                ? <View key={fix.title} style={{
                  padding: 0,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}>
                  <TouchableOpacity style={FixRequestStyles.searchResultsTouchableWrapper}>
                    <View style={FixRequestStyles.searchResultsMockImage}>
                    </View>
                    <View style={{
                      flexWrap: 'wrap',
                      marginRight: 60,
                    }}>
                      <H3 style={GlobalStyles.boldTitle}>{fix.title}</H3>
                      <P>{fix.shortDesc}</P>
                      <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}>
                        {fix.tags.map((tag:string) => (
                          <Tag key={tag} backgroundColor={'accent'} textColor={'dark'}>{tag}</Tag>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Divider faded/>
                </View>
                : null
            ))}
          </StyledScrollView>
        </StyledPageWrapper>
        <Button
          testID='startFixTemplateBtn'
          onPress={() => this.props.navigation.navigate('FixRequestMetaStep')}
          style={FixRequestStyles.searchResultsContinueBtn}>
            Start with a blank fix template
        </Button>
      </>
    );
  }
}
