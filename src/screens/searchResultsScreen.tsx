import React from 'react';
import {
  Button, Divider, H1, H3, Icon, P, Tag,
} from 'fixit-common-ui';
import {
  TouchableOpacity, View, Text, Image,
} from 'react-native';
import axios from 'axios';
import {
  connect, fixRequestActions, FixRequestService, store, StoreState, rootContext,
} from 'fixit-common-data-store';
import GlobalStyles from '../components/styles/fixRequests/globalStyles';
import FixRequestStyles from '../components/styles/fixRequests/fixRequestStyles';
import { SearchResultsScreenProps } from '../models/screens/searchResultsScreenModel';
import FixSearchHeader from '../components/fixSearchHeader';
import StyledScrollView from '../components/styledElements/styledScrollView';
import StyledPageWrapper from '../components/styledElements/styledPageWrapper';
import SearchTextInput from '../components/searchTextInput';
import backArrowIcon from '../assets/back-icon.png';

class SearchResultsScreen extends
  React.Component<SearchResultsScreenProps> {
    state={
      mockfixes: [],
      fixes: [],
      tags: [''],
      tagInputText: '',
    }

    componentDidMount = () : void => {
      if (this.props.tags) {
        this.setState({ tags: [...this.props.tags] });
        this.search(this.props.tags.join());
      }
    }

    search = (keywords : string) : void => {
      let searchTearms = keywords;
      if (keywords[0] === ',') {
        searchTearms = searchTearms.substring(1);
      }
      axios.get(`https://fixit-dev-fms-search.azurewebsites.net/api/search-template?keywords=${searchTearms}`)
        .then((response) => this.setState({ fixes: response.data }))
        .catch(() => this.setState({ fixes: [] }));
    }

    handleSelectFixTemplate = (id:string) : void => {
      const serv = new FixRequestService(store);
      serv.setFixTemplateId(id);

      this.props.navigation.navigate('FixRequestMetaStep');
    }

    handleBlankFixTemplate = () : void => {
      store.dispatch(fixRequestActions.clearData());
      this.props.navigation.navigate('FixRequestMetaStep');
    }

    handleGoBack = () : void => {
      if (this.props.navigation.canGoBack()) {
        this.props.navigation.goBack();
      }
    }

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

    render() : JSX.Element {
      return (
        <>
          <View style={{
            backgroundColor: '#EEEEEE',
            padding: 10,
            paddingTop: 60,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            flex: 0,
            flexDirection: 'column',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.20,
            shadowRadius: 1.41,
            elevation: 2,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              top: 20,
              left: 20,
            }}
            onPress={this.handleGoBack}>
              <Image source={backArrowIcon} />
            </TouchableOpacity>
            <View style={{
              margin: 10,
              borderRadius: 8,
            }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{ position: 'absolute', zIndex: -1, paddingTop: 10 }}
                >
                  <SearchTextInput
                    onChange={(text: string) => this.setTagInputText(text)}
                    value={this.state.tagInputText}
                    placeholder="What needs Fixing?"
                    onFocus={() => null}
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
                    onPress={() => this.search(this.state.tags.join())}
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
              height: 40,
            }}>
              <H1>Start from a Fixit Template</H1>
            </View>
          </View>
          <StyledPageWrapper>
            <StyledScrollView>
              {this.state.fixes.map((fix:any) => (
                fix
                  ? <View key={fix.Id} style={{
                    padding: 0,
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}>
                    <TouchableOpacity
                      onPress={() => this.handleSelectFixTemplate(fix.Id)}
                      style={FixRequestStyles.searchResultsTouchableWrapper}>
                      <View style={FixRequestStyles.searchResultsMockImage}>
                      </View>
                      <View style={{
                        flexWrap: 'wrap',
                        marginRight: 60,
                      }}>
                        <H3 style={GlobalStyles.boldTitle}>{fix.TemplateName}</H3>
                        <P>{fix.WorkCategory}</P>
                        <P>{fix.FixUnit}</P>
                        <View style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                          {fix.Tags.split(', ').map((tag:string) => (
                            <Tag key={tag} backgroundColor={'accent'} textColor={'dark'}>{tag}</Tag>
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                    <Divider faded/>
                  </View>
                  : null
              ))}
              {this.state.fixes.length < 1
              && <Text style={{
                marginTop: 20,
                textAlign: 'center',
              }}>No fixes match your search terms, please try again.</Text>}
            </StyledScrollView>
          </StyledPageWrapper>
          <Button
            onPress={() => this.handleBlankFixTemplate()}
            style={FixRequestStyles.searchResultsContinueBtn}>
            Start with a blank fix template
          </Button>
        </>
      );
    }
}

function mapStateToProps(state : StoreState, ownProps : any) {
  return {
    fixRequest: state.fixRequest.fixRequestObj,
    tags: ownProps.route.params ? ownProps.route.params.tags : undefined,
  };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(SearchResultsScreen);
