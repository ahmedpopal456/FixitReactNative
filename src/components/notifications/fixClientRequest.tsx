import React from 'react';
import {
  Modal, StyleSheet, Text, View,
} from 'react-native';
import {
  Button, colors, H1, Icon,
} from 'fixit-common-ui';
import { ScrollView } from 'react-native-gesture-handler';
import { ConfigFactory, FixesService, store } from 'fixit-common-data-store';
import { StackActions } from '@react-navigation/native';
import { NotificationProps } from '../../common/models/notifications/notificationProps';
import RatingsSlider from '../ratings/ratingsSlider';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 15,
    paddingTop: 20,
    marginTop: '15%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: -2,
    },
    shadowOpacity: 0.25,
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
  },
  modalTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
    width: '100%',
  },
});

export default class FixClientRequest extends React.Component<NotificationProps> {
  state = {
    clientName: '',
    expectedDeliveryDate: 0,
    minCost: '',
    maxCost: '',
    location: '',
    systemCalculatedCost: '',
    fix: undefined,
  }

  fixesService = new FixesService(new ConfigFactory(), store);

  async componentDidMount() : Promise<void> {
    this.updateData();
  }

  async componentDidUpdate(prevProps:NotificationProps) : Promise<void> {
    if (prevProps.message !== this.props.message) {
      this.updateData();
    }
  }

  async updateData() : Promise<void> {
    if (this.props.message && this.props.message.data) {
      const decodedMessage = JSON.parse(this.props.message.data.fixitdata);
      const fix = await this.fixesService.getFix(decodedMessage.Id);
      this.setState({
        clientName: `${fix.createdByClient.firstName} ${fix.createdByClient.lastName}`,
        expectedDeliveryDate: fix.schedule[0].endTimestampUtc,
        minCost: decodedMessage.ClientBudget.MinimumCost,
        maxCost: decodedMessage.ClientBudget.MaximumCost,
        location: `${fix.location.address} ${fix.location.city} ${fix.location.province} ${fix.location.postalCode}`,
        systemCalculatedCost: decodedMessage.SystemCalculatedCost,
        fix,
      });
    }
  }

  handleViewDetails() : void {
    this.props.onDismissNotification(this.props.message?.messageId);
    if (this.state.fix && this.props.navRef) {
      this.props.navRef.current?.dispatch(StackActions.push('FixRequestReview', {
        passedFix: this.state.fix,
      }));
    }
  }

  render() : JSX.Element {
    const isVisible = this.props.message !== undefined;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          this.props.onDismissNotification(this.props.message?.messageId);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 15,
              }}>
                <Icon
                  library={'MaterialIcons'}
                  name={'notifications'}
                  style={{
                    color: '#D4675A',
                    transform: [{ rotate: '-25deg' }],
                  }}/>
                <H1>Incoming Fix Request</H1>
              </View>
              <Text style={styles.modalTextTitle}>
                {this.props.message?.notification?.title}
              </Text>
              <Text style={styles.modalText}>
                {this.state.clientName}
              </Text>
              <RatingsSlider score={95} />
              <Text style={styles.smallerTitle}>
                Expected Delivery Date
              </Text>
              <View style={{
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
                  }} />
                <Text>{new Date(this.state.expectedDeliveryDate * 1000).toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}</Text>
              </View>
              <Text style={styles.smallerTitle}>
                Budget
              </Text>
              <View style={{
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
                  }}/>
                <Text>{this.state.minCost}</Text>
                <Text style={{
                  marginLeft: 10,
                  marginRight: 10,
                }}> - </Text>
                <Icon
                  library="FontAwesome5"
                  name="dollar-sign"
                  color={'dark'}
                  size={20}
                  style={{
                    marginRight: 5,
                  }}/>
                <Text>{this.state.maxCost}</Text>
              </View>
              <Text style={styles.smallerTitle}>
                System Cost Estimate
              </Text>
              <View style={{
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
                  }}/>
                <Text>{this.state.systemCalculatedCost}</Text>
              </View>
              <Text style={styles.smallerTitle}>
                Location
              </Text>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
              }}>
                <View style={{
                  backgroundColor: '#333',
                  borderRadius: 8,
                  width: 100,
                  height: 100,
                  marginRight: 20,
                }}></View>
                <Text style={{
                  flex: 1,
                  flexWrap: 'wrap',
                }}>
                  {this.state.location}
                </Text>
              </View>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignSelf: 'center',
                padding: 10,
                marginTop: 20,
                borderRadius: 8,
                backgroundColor: colors.dark,
              }}>
                <Button
                  width={150}
                  onPress={() => {
                    this.props.onDismissNotification(this.props.message?.messageId);
                  }}
                  color="accent"
                  outline>
              Dismiss
                </Button>
                <Button
                  width={150}
                  onPress={() => {
                    this.handleViewDetails();
                  }}
                  color="accent">
              View Details
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}
