import React, { useState, FunctionComponent, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { FixesService, FixRequestService, store, StoreState, useSelector } from 'fixit-common-data-store';
import { Button, colors, Icon, Tag } from 'fixit-common-ui';
import useAsyncEffect from 'use-async-effect';
import Toast from 'react-native-toast-message';
import ProgressIndicatorFactory from '../../components/progressIndicators/progressIndicatorFactory';
import SearchTextInput from '../../components/searchTextInput';
import config from '../../core/config/appConfig';

const fixesService = new FixesService(config, store);

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  baseContainer_View: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    borderRadius: 20,
  },
  baseContainer_View_View: {
    height: '100%',
  },
  baseContainer_View_View_View: {
    padding: 20,
    borderRadius: 25,
    backgroundColor: '#EEEEEE',
    marginTop: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2
  },
  tagsContainer: {
    marginRight: 10,
    justifyContent: 'flex-start',
  },
  tagsContainerView: {
    alignContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedTagsContainer: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
    marginLeft: 2,
  },
  spinner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 30,
  },
  loadingMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 90,
  },
  headers: {
    marginLeft: 15,
    marginTop: 15,
  },
});

const fixRequestService = new FixRequestService(config, store);

const HomeScreenClient: FunctionComponent = () => {
  const maxSelectedTags = 5;

  const navigation = useNavigation();
  const popularFixTags = useSelector((storeState: StoreState) => storeState.fixes.topFixTagsState);

  const [tagInputTextState, setTagInputTextState] = useState<string>('');
  const [selectedTagsState, setSelectedTagsState] = useState<Array<string>>(['']);
  const [suggestedTagsState, setSuggestedTagsState] = useState<Array<string>>(['']);
  const [_tagSuggestionsVisible, setTagSuggestionsVisible] = useState<boolean>(false);

  useAsyncEffect(async () => {
    await onRefresh();
  }, []);

  useEffect(() => {
    if (!popularFixTags.isLoading) {
      const nonSelectedTags = popularFixTags.tags.filter((tag) => !selectedTagsState.includes(tag.name));
      setSuggestedTagsState(nonSelectedTags.map((tag) => tag.name));
    }
  }, [popularFixTags]);

  const onRefresh = async () => {
    await fixesService.getPopularFixTags('5');
    fixRequestService.getCategories();
    fixRequestService.getTypes();
    fixRequestService.getUnits();
  };

  const addTag = (): void => {
    if (selectedTagsState.length > maxSelectedTags) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Exceeded tag limit',
      });
      return;
    }

    if (selectedTagsState.includes(tagInputTextState)) {
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: 'Tag already selected',
      });
      return;
    }

    const updatedTags = [...selectedTagsState];
    updatedTags.push(tagInputTextState);
    setSelectedTagsState(updatedTags);
    setTagInputTextState('');
  };

  const removeTag = (tag: string): void => {
    const updatedTags = [...selectedTagsState];
    const suggestedTags = [...suggestedTagsState];
    const index = updatedTags.indexOf(tag);

    if (index > -1) {
      updatedTags.splice(index, 1);
    }
    if (!suggestedTags.includes(tag)) {
      suggestedTags.push(tag);
    }
    setSuggestedTagsState(suggestedTags);
    setSelectedTagsState(updatedTags);
  };

  const addSuggestedTagToTagList = (tag: string): void => {
    const suggestedTags = [...suggestedTagsState];
    const selectedTags = [...selectedTagsState];

    if (selectedTagsState.includes(tag)) {
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: 'Tag already selected',
      });
      return;
    }

    const index = suggestedTags.indexOf(tag);
    if (index > -1) {
      suggestedTags.splice(index, 1);
    }
    setSuggestedTagsState(suggestedTags);
    setSelectedTagsState([...selectedTags, tag]);
  };

  const search = (): void => {
    navigation.navigate('SearchResultsScreen', {
      tags: selectedTagsState,
    });
  };

  return (
    <SafeAreaView style={styles.baseContainer}>
      <View style={styles.baseContainer_View}>
        <View style={styles.baseContainer_View_View}>
          <View style={styles.baseContainer_View_View_View}>
            {suggestedTagsState.length > 0 ? <Text>Suggested Tags</Text> : <></>}
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                flexGrow: 100,
              }}>
              {popularFixTags.isLoading ? (
                <ProgressIndicatorFactory
                  type="indeterminate"
                  children={{
                    indicatorType: 'circular',
                    color: colors.orange,
                  }}
                />
              ) : suggestedTagsState.length < 0 ? (
                <></>
              ) : (
                <View style={styles.tagsContainerView}>
                  {suggestedTagsState.map((tag: any) =>
                    tag ? (
                      <View key={tag} style={styles.tagsContainer}>
                        <TouchableOpacity
                          onPress={() => addSuggestedTagToTagList(tag)}
                          style={{
                            flexGrow: 0,
                            marginLeft: 5,
                            marginRight: -15,
                          }}>
                          <Tag backgroundColor={'grey'} textColor={'light'}>
                            {tag}
                          </Tag>
                        </TouchableOpacity>
                      </View>
                    ) : null,
                  )}
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <View
                style={{
                  flex: 4,
                }}>
                <SearchTextInput
                  onChange={(text: string) => setTagInputTextState(text)}
                  value={tagInputTextState}
                  placeholder="What needs Fixing?"
                  onFocus={() => setTagSuggestionsVisible(true)}
                  onSubmitEditing={addTag}
                />
              </View>
              <View
                style={{
                  paddingRight: 20,
                  flex: 1,
                }}>
                <Button onPress={search} color="primary" width={50} padding={0}>
                  <Icon library="Ionicons" name="hammer-outline" color="accent" />
                </Button>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {selectedTagsState.map((tag: any) =>
                tag ? (
                  <View key={tag} style={styles.selectedTagsContainer}>
                    <Tag backgroundColor={'accent'} textColor={'dark'}>
                      {tag}
                    </Tag>
                    <TouchableOpacity style={{ flexGrow: 0, marginLeft: -5 }} onPress={() => removeTag(tag)}>
                      <Icon library="FontAwesome5" name="times-circle" color={'dark'} />
                    </TouchableOpacity>
                  </View>
                ) : null,
              )}
            </View>
          </View>
        </View>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default HomeScreenClient;
