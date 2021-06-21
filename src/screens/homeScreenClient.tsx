import React, { useEffect, useState, FunctionComponent } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text, View, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import {
  connect,
  StoreState,
} from 'fixit-common-data-store';
import {
  Button, colors, H1, H2, Icon, Tag,
} from 'fixit-common-ui';
import axios from 'axios';
import SearchTextInput from '../components/searchTextInput';

interface HomeScreenClientState {
  titleFieldVisible: boolean,
  titleFieldTextVisible: boolean,
  tagSuggestionsVisible: boolean,
  suggestedTags: Array<string>,
  tagInputText: string,
  tags: Array<string>,
}

interface HomeScreenClientProps {
  userId: string,
  firstName: string,
  lastName: string,
  role: number,
  unseenNotificationsNumber: number
}

const initialState : HomeScreenClientState = {
  titleFieldVisible: false,
  titleFieldTextVisible: true,
  tagSuggestionsVisible: false,
  suggestedTags: [''],
  tagInputText: '',
  tags: [''],
};

const HomeScreenClient: FunctionComponent<HomeScreenClientProps> = (props) => {
  const [state, setState] = useState<HomeScreenClientState>(initialState);
  const navigation = useNavigation();

  useEffect(() => {
    const suggestedTags = [''];
    axios
      .get('https://fixit-dev-fms-api.azurewebsites.net/api/tags/3')
      .then((res) => {
        let i;
        for (i = 0; i < res.data.length; i += 1) {
          suggestedTags.push(res.data[i].name);
        }
        if (i > -1) {
          suggestedTags.splice(0, 1);
        }

        setState((prevState: HomeScreenClientState) => ({
          ...prevState,
          suggestedTags,
        }));
      });
  }, []);

  const setTagInputText = (text: string): void => {
    setState((prevState: HomeScreenClientState) => ({
      ...prevState,
      tagInputText: text,
    }));
  };

  const addTag = (): void => {
    const currentText = state.tagInputText;
    if (currentText && state.tags.indexOf(currentText) === -1) {
      setState((prevState: HomeScreenClientState) => ({
        ...prevState,
        tagInputText: '',
        tags: [...prevState.tags, currentText],
      }));
    }
  };

  const removeTag = (tag: string): void => {
    const tagArr = state.tags;
    const index = tagArr.indexOf(tag);
    if (index > -1) {
      tagArr.splice(index, 1);
    }
    setState((prevState: HomeScreenClientState) => ({
      ...prevState,
      tags: tagArr,
    }));
  };

  const showTagSuggestions = (): void => {
    setState((prevState: HomeScreenClientState) => (
      {
        ...prevState,
        tagSuggestionsVisible: true,
      }));
  };

  const addSuggestedTagToTagList = (tag: string): void => {
    const suggestedTagArr = state.suggestedTags;
    const index = suggestedTagArr.indexOf(tag);
    if (index > -1) {
      suggestedTagArr.splice(index, 1);
    }

    setState((prevState: HomeScreenClientState) => (
      {
        ...prevState,
        suggestedTags: suggestedTagArr,
      }));
    setState((prevState: HomeScreenClientState) => (
      {
        ...prevState,
        suggestedTags: suggestedTagArr,
        tags: [...prevState.tags, tag],
      }));
  };

  const search = () : void => {
    navigation.navigate('SearchResultsScreen', {
      tags: state.tags,
    });
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          height: 20,
          width: '100%',
          backgroundColor: colors.accent,
        }}>
        </View>
        <View style={{
          paddingLeft: 25,
          borderRadius: 25,
          backgroundColor: '#EEEEEE',
          paddingTop: 20,
          paddingBottom: 20,
          marginTop: -20,
          elevation: 10,
        }}>
          <Text>Most Popular Fixes</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {state.suggestedTags.map((tag: any) => (tag ? (
              <View
                key={tag}
                style={{
                  flexGrow: 0,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => addSuggestedTagToTagList(tag)}
                  style={{
                    flexGrow: 0,
                    marginLeft: 5,
                    marginRight: -15,
                  }}
                >
                  <Tag backgroundColor={'grey'} textColor={'light'}>
                    {tag}
                  </Tag>
                </TouchableOpacity>
              </View>
            ) : null))}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{ position: 'absolute', zIndex: -1, paddingTop: 10 }}
            >
              <SearchTextInput
                onChange={(text: string) => setTagInputText(text)}
                value={state.tagInputText}
                placeholder="What needs Fixing?"
                onFocus={() => showTagSuggestions()}
                onSubmitEditing={addTag}
              />
            </View>
            <View
              style={{
                paddingLeft: 280,
                marginVertical: 13,
                paddingBottom: 10,
              }}
            >
              <Button
                testID='searchBtn'
                onPress={search}
                color="primary"
                width={50}
                padding={0}
              >
                <Icon
                  library="Ionicons"
                  name="hammer-outline"
                  color="accent"
                />
              </Button>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {state.tags.map((tag: any) => (tag ? (
              <View
                key={tag}
                style={{
                  flexGrow: 0,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                  marginTop: 2,
                  marginLeft: 2,
                }}
              >
                <Tag backgroundColor={'accent'} textColor={'dark'}>
                  {tag}
                </Tag>
                <TouchableOpacity
                  style={{ flexGrow: 0, marginLeft: -5 }}
                  onPress={() => removeTag(tag)}
                >
                  <Icon
                    library="FontAwesome5"
                    name="times-circle"
                    color={'dark'}
                  />
                </TouchableOpacity>
              </View>
            ) : null))}
          </View>
        </View>
        <View style={{
          backgroundColor: '#fff',
          height: 300,
          marginTop: -30,
          paddingTop: 60,
        }}>
          <H2
            style={{
              textAlign: 'center',
            }}
          >
                Explore
          </H2>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              padding: 20,
            }}>
            <Image style={{
              height: 150,
              width: 150,
              borderRadius: 15,
              marginRight: 20,
            // eslint-disable-next-line max-len
            }}source={{ uri: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80' }}/>
            <Image style={{
              height: 150,
              width: 150,
              borderRadius: 15,
              marginRight: 20,
            // eslint-disable-next-line max-len
            }}source={{ uri: 'https://images.unsplash.com/photo-1599619585752-c3edb42a414c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}/>
            <Image style={{
              height: 150,
              width: 150,
              borderRadius: 15,
              marginRight: 20,
            // eslint-disable-next-line max-len
            }}source={{ uri: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' }}/>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

function mapStateToProps(state: StoreState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    role: state.user.role,
    unseenNotificationsNumber: state.persist.unseenNotificationsNumber,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps)(HomeScreenClient);
