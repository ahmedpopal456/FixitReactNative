import React, { FunctionComponent, useState } from 'react';
import {
  Text, TouchableOpacity, View, Image,
} from 'react-native';
import {
  Button,
  colors,
  H1,
  H2, Icon, Spacer,
} from 'fixit-common-ui';
import {
  StoreState, connect, FixesModel, FixRequestModel, store, useSelector,
} from 'fixit-common-data-store';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import FadeInAnimator from '../../../common/animators/fadeInAnimator';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import backArrowIcon from '../../../common/assets/back-icon.png';

type FixSuggestChangesReviewNavigationProps = StackNavigationProp<HomeStackNavigatorProps,
  'FixSuggestChangesReview'
>;

export type FixSuggestChangesReviewProps = {
  navigation: FixSuggestChangesReviewNavigationProps;
  passedFix: FixesModel;
  fixRequestObj: FixRequestModel,
  cost: string,
  comments: string,
};

const FixSuggestChangesReview: FunctionComponent<any> = (props) => {
  const navigation = useNavigation();
  const { passedFix, cost, comments } = props.route.params;
  const fixRequest = useSelector((storeState: StoreState) => storeState.fixRequest.fixRequestObj);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleContinue = () : void => {
    axios.post('https://fixit-dev-nms-api.azurewebsites.net/api/Notifications',
      {
        Message: 'Knock Knock',
        Payload:
          {
            Id: passedFix.id,
            AssignedToCraftsman:
              {
                Id: store.getState().user.userId,
                FirstName: store.getState().user.firstName,
                LastName: store.getState().user.lastName,
              },
            SystemCalculatedCost: passedFix.systemCalculatedCost,
            CraftsmanEstimatedCost:
              {
                Cost: cost,
                Comment: comments,
              },
            Schedule: [
              {
                startTimestampUtc: fixRequest.schedule[0].startTimestampUtc,
                endTimestampUtc: fixRequest.schedule[0].endTimestampUtc,
              },
            ],
            FixCategory: {},
            FixType: {},
            Location: {},
            Images: [],
            FixDetails: {},
          },
        Action: 'FixCraftSmanResponse',
        Recipients:
          [
            {
              Id: passedFix.createdByClient.id,
              FirstName: passedFix.createdByClient.firstName,
              LastName: passedFix.createdByClient.lastName,
            },
          ],
        Silent: false,
      });
    navigation.navigate('HomeScreen');
  };

  return (
    <>
      <View style={{
        backgroundColor: colors.accent,
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
        flex: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
        shadowColor: '#000',
        zIndex: 1,
        elevation: 1,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
      }}>
        <TouchableOpacity style={{
          position: 'absolute',
          top: 20,
          left: 20,
        }}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}>
          <Image source={backArrowIcon} />
        </TouchableOpacity>
        <View style={{
          height: 60,
        }}>
          <H1>Suggest Changes</H1>
        </View>
      </View>
      <StyledPageWrapper>
        <StyledScrollView>
          <StyledContentWrapper>
            <H2>Fix Plan Timeline</H2>
            <View style={{
              height: 50,
              padding: 12,
              paddingLeft: 50,
              borderRadius: 4,
              backgroundColor: colors.primary,
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 18,
              }}>
                {
                  new Date(fixRequest.schedule[0].startTimestampUtc * 1000)
                    .toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric',
                    })
                }
                  &nbsp;-&nbsp;
                {
                  new Date(fixRequest.schedule[0].endTimestampUtc * 1000)
                    .toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric',
                    })
                }
              </Text>
            </View>
            <Icon library="FontAwesome5" name="calendar-week" color={'accent'} size={20} style={{
              marginTop: -35,
              marginLeft: 15,
            }}/>
            <Spacer height={'40px'} />
            <H2>Fix Cost</H2>
            <View style={{
              height: 50,
              padding: 12,
              paddingLeft: 50,
              borderRadius: 4,
              backgroundColor: colors.primary,
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 18,
              }}>
                {cost}
              </Text>
            </View>
            <Icon library="FontAwesome5" name="dollar-sign" color={'accent'} size={20} style={{
              marginTop: -35,
              marginLeft: 20,
              width: 15,
            }}/>
            <Spacer height={'40px'}/>
            <H2>Comments</H2>
            <View style={{
              padding: 12,
              borderRadius: 4,
              backgroundColor: colors.primary,
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 16,
              }}>
                {comments}
              </Text>
            </View>
            <Spacer height={'15px'}/>
            <Text style={{
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 30,
              marginTop: 30,
            }}>
                Are you sure you want to suggest these changes?
                By tapping YES you commit to the Fix.
            </Text>
            <Button onPress={() => setModalOpen(true)} block>YES</Button>
          </StyledContentWrapper>
        </StyledScrollView>
      </StyledPageWrapper>
      <FadeInAnimator visible={modalOpen} style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        elevation: (modalOpen) ? 98 : -1,
        zIndex: (modalOpen) ? 98 : -1,
      }}>
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,1)',
          opacity: 0.5,
        }}>
        </View>
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          backgroundColor: '#fff',
          padding: 15,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}>
          <Text style={{
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 30,
            marginTop: 30,
          }}>
                The client will receive the updated Fix Request based on your suggested changes.
                You will get a notification once the client captures a response.
          </Text>
          <Button onPress={() => {
            handleContinue();
          }} block>Ok</Button>
        </View>
      </FadeInAnimator>
    </>
  );
};

export default FixSuggestChangesReview;
