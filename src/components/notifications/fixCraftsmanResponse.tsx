import React from 'react';
import {
  Modal, StyleSheet, Text, View,
} from 'react-native';
import {
  Button, colors, H1, Icon, Tag,
} from 'fixit-common-ui';
import { ScrollView } from 'react-native-gesture-handler';
import base64 from 'react-native-base64';
import { ConfigFactory, FixesService, store } from 'fixit-common-data-store';
import { StackActions } from '@react-navigation/native';
import { NotificationProps } from '../../models/notifications/NotificationProps';

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
    padding: 35,
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

export default class FixCraftsmanResponse extends React.Component<NotificationProps> {
  state={
    craftsmanName: '',
    craftsmanRating: '',
    fixTitle: '',
    tags: [],
    scheduleStart: 0,
    scheduleEnd: 0,
    deliveryDate: '',
    budget: '',
    systemCostEstimate: '',
    craftsmanComments: '',
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
        craftsmanName: `${decodedMessage.AssignedToCraftsman.FirstName} ${decodedMessage.AssignedToCraftsman.LastName}`,
        craftsmanRating: '',
        fixTitle: fix.details[0].name,
        tags: fix.tags,
        scheduleStart: decodedMessage.Schedule[0].startTimestampUtc,
        scheduleEnd: decodedMessage.Schedule[0].endTimestampUtc,
        deliveryDate: new Date(decodedMessage.Schedule[0].startTimestampUtc * 1000)
          .toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          }),
        budget: decodedMessage.CraftsmanEstimatedCost.Cost.toString(),
        systemCostEstimate: fix.systemCalculatedCost,
        craftsmanComments: decodedMessage.CraftsmanEstimatedCost.Comment,
        fix,
      });
    }
  }

  handleViewDetails() : void {
    this.props.onDismissNotification(this.props.message?.messageId);
    if (this.state.fix && this.props.navRef) {
      const fix = { ...this.state.fix };
      fix.schedule[0] = {
        startTimestampUtc: this.state.scheduleStart,
        endTimestampUtc: this.state.scheduleEnd,
      };
      fix.craftsmanEstimatedCost = this.state.budget;
      this.props.navRef.current?.dispatch(StackActions.push('FixRequestReview', {
        passedFix: fix,
        isFixCraftsmanResponseNotification: true,
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
              <Text style={{
                marginBottom: 10,
                fontSize: 13,
                fontStyle: 'italic',
              }}>The information below is based on this craftsman's response to your fix request.
                  Please validate any revision the craftsman may have made before accepting.</Text>
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
                <H1>Craftsman Selection</H1>
              </View>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                borderBottomColor: 'rgba(0,0,0,0.5)',
                alignItems: 'center',
                borderBottomWidth: 1,
                marginBottom: 20,
                paddingBottom: 20,
              }}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                  marginRight: 20,
                  backgroundColor: '#333',
                }}></View>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    marginRight: 10,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}>{this.state.craftsmanName}</Text>
                  <Tag textColor={'accent'}>{this.state.craftsmanRating}</Tag>
                </View>
              </View>
              <Text style={styles.modalTextTitle}>
                {this.state.fixTitle}
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                Tags
              </Text>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                {this.state.tags.map((tag:any) => (
                  <Tag
                    key={`${tag.id}_${tag.name}`}
                    backgroundColor={'accent'}
                    textColor={'dark'}>{tag.name}</Tag>
                ))}
              </View>
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
                <Text>{this.state.deliveryDate}</Text>
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
                <Text>{this.state.budget}</Text>
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
                <Text>{this.state.systemCostEstimate}</Text>
              </View>
              <Text style={styles.smallerTitle}>
                Craftsman Comments
              </Text>
              <Text>{this.state.craftsmanComments}</Text>
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
