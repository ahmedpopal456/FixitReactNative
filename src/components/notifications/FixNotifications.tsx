/* eslint-disable max-len */
import React, { FunctionComponent, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, colors, H1, Icon, Tag } from 'fixit-common-ui';
import { ScrollView } from 'react-native-gesture-handler';
import { FixesModel, FixesService, Schedule, store } from 'fixit-common-data-store';
import { StackActions } from '@react-navigation/native';
import useAsyncEffect from 'use-async-effect';
import { NotificationProps } from '../../common/models/notifications/NotificationProps';
import NavigationEnum from '../../common/enums/navigationEnum';
import config from '../../core/config/appConfig';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '98%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 15,
    paddingTop: 20,
    marginTop: '15%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 100,
      height: -10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: 'red',
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'left',
    fontWeight: 'bold',
    paddingRight: 5,
  },
  modalTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  smallerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'left',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.5)',
    paddingBottom: 10,
    width: '100%',
  },
});

const fixesService = new FixesService(config, store);

const FixNotifications: FunctionComponent<NotificationProps> = (props: NotificationProps): JSX.Element => {
  const [isRightAway, setIsRightAway] = useState<boolean>(false);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>('');
  const [expectedStartDate, setExpectedStartDate] = useState<string>('');
  // TODO: fixFromDatabase is to see if a fix has been assigned to a craftsman
  const [fixFromDatabase, setFixFromDatabase] = useState<FixesModel | undefined>();
  const [fix, setFix] = useState<FixesModel | undefined>();
  const isFixClientRequest = props?.message?.data?.action === 'FixClientRequest';

  useAsyncEffect(async () => {
    if (props.message.data?.fixitdata) {
      const parsedFixtData: FixesModel = JSON.parse(props.message.data.fixitdata);
      setFix(parsedFixtData);
      const returnedFixResponse = await fixesService.getFix(parsedFixtData.id);
      setFixFromDatabase(returnedFixResponse);
      const { schedule } = parsedFixtData;
      if (schedule.length === 1 && schedule[0].startTimestampUtc === schedule[0].endTimestampUtc) {
        setIsRightAway(true);
      } else if (schedule.length >= 1) {
        let tempExpectedDeliveryDate = 0;
        let tempExpectedStartDate = schedule[0].startTimestampUtc;
        schedule.forEach((s: Schedule) => {
          if (s.startTimestampUtc < tempExpectedStartDate) {
            tempExpectedStartDate = s.startTimestampUtc;
          }
          if (s.endTimestampUtc > tempExpectedDeliveryDate) {
            tempExpectedDeliveryDate = s.endTimestampUtc;
          }
        });

        setExpectedStartDate(new Date(tempExpectedStartDate * 1000).toISOString().split('T')[0]);
        setExpectedDeliveryDate(new Date(tempExpectedDeliveryDate * 1000).toISOString().split('T')[0]);
      }
    }
  }, [props.message]);

  const handleViewDetails = (): void => {
    props.onDismissNotification(props.message?.messageId);
    if (fix && props.navRef) {
      if (isFixClientRequest) {
        props.navRef.current?.dispatch(
          StackActions.push(NavigationEnum.FIX, {
            fix,
            id: 'fix_client_request',
            title: 'Fix client request',
          }),
        );
      } else if (!isFixClientRequest) {
        props.navRef.current?.dispatch(
          StackActions.push(NavigationEnum.FIX, {
            fix,
            id: 'fix_craftsman_response',
            title: 'Fix craftsman response',
          }),
        );
      }
    }
  };

  const Header = () => {
    const name = isFixClientRequest
      ? `Incoming fix request from  ${fix?.createdByClient.firstName} ${fix?.createdByClient.lastName}`
      : `Incoming craftsman response from ${fix?.assignedToCraftsman.firstName} ${fix?.assignedToCraftsman.lastName}`;
    return (
      <>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <H1>{name}</H1>
          <Icon
            library={'MaterialIcons'}
            name={'notifications'}
            style={{
              color: '#D4675A',
              transform: [{ rotate: '25deg' }],
              marginRight: 20,
            }}
          />
        </View>
        <Text style={styles.modalTextTitle}>{fix?.details.name}</Text>
      </>
    );
  };

  const Description = () => {
    return (
      <>
        <Text style={styles.smallerTitle}>Description</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              flex: 1,
              flexWrap: 'wrap',
            }}>
            {fix?.details.description}
          </Text>
        </View>
      </>
    );
  };

  const ExpectedDeliveryDate = () => {
    return (
      <>
        <Text style={styles.smallerTitle}>Expected start and end date</Text>
        {isRightAway ? (
          <Tag backgroundColor={'orange'} textColor={'light'}>
            {'Right away'}
          </Tag>
        ) : (
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Icon
                library={'FontAwesome5'}
                name={'calendar'}
                size={25}
                style={{
                  marginRight: 10,
                  marginTop: -5,
                }}
              />
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{expectedStartDate}</Text> and{' '}
                <Text style={{ fontWeight: 'bold' }}>{expectedDeliveryDate}</Text>
              </Text>
            </View>
          </>
        )}
      </>
    );
  };

  const Budget = () => {
    return (
      <>
        <Text style={styles.smallerTitle}>{`${isFixClientRequest ? 'Budget' : 'Estimated cost'}`}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>
          <Icon
            library="FontAwesome5"
            name="dollar-sign"
            color={'dark'}
            size={20}
            style={{
              marginRight: 5,
            }}
          />
          {isFixClientRequest ? (
            <>
              <Text>{fix?.clientEstimatedCost.minimumCost}</Text>
              <Text
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                {' '}
                -{' '}
              </Text>
              <Icon
                library="FontAwesome5"
                name="dollar-sign"
                color={'dark'}
                size={20}
                style={{
                  marginRight: 5,
                }}
              />
              <Text>{fix?.clientEstimatedCost.maximumCost}</Text>
            </>
          ) : (
            <>
              <Text>{fix?.craftsmanEstimatedCost.cost}</Text>
            </>
          )}
        </View>
      </>
    );
  };

  const Location = () => {
    return (
      <>
        <Text style={styles.smallerTitle}>Location</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              flex: 1,
              flexWrap: 'wrap',
            }}>
            {fix?.location?.formattedAddress}
          </Text>
        </View>
      </>
    );
  };

  const Choices = () => {
    return (
      <>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'flex-start',
            padding: 10,
            marginTop: 20,
            borderRadius: 8,
            backgroundColor: colors.dark,
          }}>
          <Button
            width={150}
            onPress={() => {
              props.onDismissNotification(props.message?.messageId);
            }}
            color="accent"
            outline>
            Dismiss
          </Button>
          <Button
            width={150}
            onPress={() => {
              handleViewDetails();
            }}
            color="accent">
            View Details
          </Button>
        </View>
      </>
    );
  };

  const Comments = () => {
    return (
      <>
        <Text style={styles.smallerTitle}>Comments</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              flex: 1,
              flexWrap: 'wrap',
            }}>
            {fix?.craftsmanEstimatedCost.comment ? fix?.craftsmanEstimatedCost.comment : 'No comments from craftsman'}
          </Text>
        </View>
      </>
    );
  };
  const render = (): JSX.Element => {
    const isVisible = props.message !== undefined;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          props.onDismissNotification(props.message?.messageId);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView style={{ width: '100%' }}>
              <Header />
              <Description />
              <Budget />
              <ExpectedDeliveryDate />
              <Location />
              {isFixClientRequest ? <></> : <Comments />}
              <Choices />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  return render();
};

export default FixNotifications;
