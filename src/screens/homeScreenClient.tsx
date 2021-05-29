import React from 'react';
import {
  Text, View, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import {
  PersistentState, connect,
} from 'fixit-common-data-store';
import {
  Button, colors, H1, H2, Icon, NotificationBell, Tag,
} from 'fixit-common-ui';
import axios from 'axios';
import SearchTextInput from '../components/searchTextInput';

class HomeScreenClient extends React.Component<any> {
  componentDidMount() {
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
        this.setState({ suggestedTags });
      });
  }

  state = {
    titleFieldVisible: false,
    titleFieldTextVisible: true,
    tagSuggestionsVisible: false,
    suggestedTags: [''],
    tagInputText: '',
    tags: [''],
  };

  setTagInputText = (text: string): void => {
    this.setState({ tagInputText: text });
  };

  addTag = (): void => {
    const currentText = this.state.tagInputText;
    if (currentText && this.state.tags.indexOf(currentText) === -1) {
      this.setState((prevState: any) => ({
        tagInputText: '',
        tags: [...prevState.tags, currentText],
      }));
    }
  };

  removeTag = (tag: string): void => {
    const tagArr = this.state.tags;
    const index = tagArr.indexOf(tag);
    if (index > -1) {
      tagArr.splice(index, 1);
    }

    this.setState({
      tags: tagArr,
    });
  };

  showTagSuggestions = (): void => {
    this.setState({ tagSuggestionsVisible: true });
  };

  hideTagSuggestions = (): void => {
    this.setState({ tagSuggestionsVisible: false });
  };

  addSuggestedTagToTagList = (tag: string): void => {
    const suggestedTagArr = this.state.suggestedTags;
    const index = suggestedTagArr.indexOf(tag);
    if (index > -1) {
      suggestedTagArr.splice(index, 1);
    }

    this.setState({
      suggestedTags: suggestedTagArr,
    });

    this.setState((prevState: any) => ({
      suggestedTags: suggestedTagArr,
      tags: [...prevState.tags, tag],
    }));
  };

  search = () : void => {
    this.props.navigation.navigate('SearchResultsScreen', {
      tags: this.state.tags,
    });
  }

  render(): JSX.Element {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            height: 300,
            width: '100%',
            backgroundColor: colors.accent,
          }}>
            <View style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}>
              <NotificationBell
                notifications={this.props.unseenNotificationsNumber}
                onPress={() => this.props.navigation.navigate('Fixes', {
                  screen: 'Notifications',
                })}
              />
            </View>
            <View style={{
              flexDirection: 'row',
            }}>
              <Image style={{
                height: 150,
                width: 150,
                borderRadius: 15,
                marginTop: -15,
                marginRight: 20,
              }}source={{ uri: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80' }}/>
              <H1 style={{
                marginTop: 10,
              }}>Get the kitchen of your dreams.</H1>
            </View>
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
              {this.state.suggestedTags.map((tag: any) => (tag ? (
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
                    onPress={() => this.addSuggestedTagToTagList(tag)}
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
                  onChange={(text: string) => this.setTagInputText(text)}
                  value={this.state.tagInputText}
                  placeholder="What needs Fixing?"
                  onFocus={() => this.showTagSuggestions()}
                  onSubmitEditing={this.addTag}
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
                  onPress={this.search}
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
              {this.state.tags.map((tag: any) => (tag ? (
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
                    onPress={() => this.removeTag(tag)}
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
              }}source={{ uri: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80' }}/>
              <Image style={{
                height: 150,
                width: 150,
                borderRadius: 15,
                marginRight: 20,
              }}source={{ uri: 'https://images.unsplash.com/photo-1599619585752-c3edb42a414c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}/>
              <Image style={{
                height: 150,
                width: 150,
                borderRadius: 15,
                marginRight: 20,
              }}source={{ uri: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80' }}/>
            </ScrollView>
          </View>
        </ScrollView>
      </>
    );
  }
}

function mapStateToProps(state: PersistentState) {
  return {
    userId: state.user.userId,
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    role: state.user.role,
    unseenNotificationsNumber: state.unseenNotificationsNumber,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default connect(mapStateToProps)(HomeScreenClient);
