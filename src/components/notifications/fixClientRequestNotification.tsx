import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {Button} from 'fixit-common-ui';
import {NotificationProps} from '../../models/notifications/NotificationProps';

// TODO: Refactor this component
export class FixClientRequestNotification extends React.Component<NotificationProps> {
  constructor(props: NotificationProps) {
    super(props);
  }

  render() {
    const isVisible = this.props.message != undefined;
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
            <Text style={styles.modalText}>FixClientRequestNotification</Text>
            <Text style={styles.modalTextTitle}>
              {this.props.message?.notification?.title}
            </Text>
            <Text style={styles.modalText}>
              {this.props.message?.notification?.body}
            </Text>
            <Button
              testID="test-dismiss"
              onPress={() => {
                this.props.onDismissNotification(this.props.message?.messageId);
              }}
              color="accent">
              Dismiss
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
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
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTextTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
    textAlign: 'center',
  },
});
