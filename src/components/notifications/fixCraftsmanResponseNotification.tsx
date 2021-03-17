import React from 'react';
import {
  Modal, StyleSheet, Text, View,
} from 'react-native';
import { Button } from 'fixit-common-ui';
import { NotificationProps } from '../../models/notifications/NotificationProps';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 0,
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
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

// TODO: Refactor this component
export default class FixCraftsmanResponseNotification extends React.Component<NotificationProps> {
  render() {
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
            <Text style={styles.modalText}>FixClientRequestNotification</Text>
            <Text style={styles.modalTextTitle}>
              {this.props.message?.notification?.title}
            </Text>
            <Text style={styles.modalText}>
              {this.props.message?.notification?.body}
            </Text>
            <Button
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
