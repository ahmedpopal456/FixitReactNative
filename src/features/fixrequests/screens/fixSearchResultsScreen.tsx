import React, { FunctionComponent, useState } from 'react';
import {
  Button, Divider, H1, H3, Icon, P, Tag,
} from 'fixit-common-ui';
import {
  TouchableOpacity, View, Text, Image,
} from 'react-native';
import {
  fixRequestActions, FixRequestService, store, useDispatch,
} from 'fixit-common-data-store';
import { useNavigation } from '@react-navigation/native';
import useAsyncEffect from 'use-async-effect';
import { SearchTextInput } from '../../../components/index';
import GlobalStyles from '../../../common/styles/globalStyles';
import FixRequestStyles from '../styles/fixRequestStyles';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import backArrowIcon from '../../../common/assets/back-icon.png';
import FixManagementService from '../../../core/services/search/fixManagementService';

const FixSearchResultsScreen: FunctionComponent<any> = (props) : JSX.Element => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [fixes, setFixes] = useState<Array<any>>([]);
  const [tags, setTags] = useState<Array<string>>(props.route.params.tags);
  const [tagInput, setTagInput] = useState<string>('');

  useAsyncEffect(async () => {
    const joinedTags = props.route.params.tags?.join() || undefined;
    await search(joinedTags);
  }, []);

  const search = async (keywords : string) : Promise<void> => {
    let searchTerms = keywords;
    if (keywords[0] === ',') {
      searchTerms = searchTerms.substring(1);
    }
    const data = await FixManagementService.searchByTags(searchTerms);
    setFixes(data);
  };

  const handleSelectFixTemplate = (id:string) : void => {
    const serv = new FixRequestService(store);
    serv.getFixTemplateById(id);

    navigation.navigate('FixRequestMetaStep');
  };

  const handleBlankFixTemplate = () : void => {
    dispatch(fixRequestActions.clearData());
    navigation.navigate('FixRequestMetaStep');
  };

  const handleGoBack = () : void => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const addTag = (): void => {
    const currentText = tagInput;
    if (currentText && tags.indexOf(currentText) === -1) {
      setTagInput('');
      setTags([...tags, currentText]);
    }
  };

  const removeTag = (tag: string): void => {
    const tagArr = [...tags];
    const index = tagArr.indexOf(tag);
    if (index > -1) {
      tagArr.splice(index, 1);
      setTags(tagArr);
    }
  };

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
        onPress={handleGoBack}>
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
                onChange={(text: string) => setTagInput(text)}
                value={tagInput}
                placeholder="What needs Fixing?"
                onFocus={() => null}
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
                onPress={() => search(tags.join())}
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
            {tags ? tags.map((tag: any) => (tag ? (
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
            ) : null)) : <></>}
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
          {fixes.map((fix:any) => (
            fix
              ? <View key={fix.Id} style={{
                padding: 0,
                paddingLeft: 20,
                paddingRight: 20,
              }}>
                <TouchableOpacity
                  onPress={() => handleSelectFixTemplate(fix.Id)}
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
          {fixes.length < 1
              && <Text style={{
                marginTop: 20,
                textAlign: 'center',
              }}>No fixes match your search terms, please try again.</Text>}
        </StyledScrollView>
      </StyledPageWrapper>
      <Button
        testID='startBlankFixTemplateBtn'
        onPress={() => handleBlankFixTemplate()}
        style={FixRequestStyles.searchResultsContinueBtn}>
            Start with a blank fix template
      </Button>
    </>
  );
};

export default FixSearchResultsScreen;
