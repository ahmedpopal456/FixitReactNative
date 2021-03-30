import React from 'react';
import { Text, View, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList } from 'react-native';
import { Button, Icon, NotificationBell } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store, FixesService, ConfigFactory } from 'fixit-common-data-store';

const fixesService = new FixesService(new ConfigFactory());

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: Dimensions.get('window').height - 95,
      width: '100%',
      backgroundColor: '#FFD14A',
    },
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  
    bodyContainer: {
      flex: 1,
      backgroundColor: 'white',
      flexGrow: 100,
      flexDirection: 'column',
      alignContent: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  
    fixContainer: {
    flexDirection: 'row',
    marginLeft: 50,
    marginRight: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    paddingRight: 10,
    elevation: 3,
    },
  
    image: {
      width: 200,
      height: 200,
      marginTop: 50,
      marginBottom: 30,
      borderWidth: 1,
      borderRadius: 200 / 2,
      overflow: 'hidden',
      justifyContent: 'center',
      alignSelf: 'center',
    },

    arrow: {
        backgroundColor: '#1D1F2A',
        paddingHorizontal: 5,
        borderWidth: 1,
        borderRadius: 5,
    },

    text: {
        alignSelf: 'center', 
        marginBottom: 10,
        color: 'gray'
    }
  });

export default class ChatProfileScreen extends React.Component
<any, {
  profilePictureUrl: string,
  pendingFixes: [],
}> 

{
  constructor(props: any) {
    super(props);
    this.state = {
      profilePictureUrl: store.getState().profile.profile.profilePictureUrl,
      pendingFixes: store.getState().fixes.pendingFixes.pendingFixes
    };
  }

  async componentDidMount() {
    const pendingFixResponse = await fixesService.getPendingFixes('8b418766-4a99-42a8-b6d7-9fe52b88ea93');
    this.setState({
      pendingFixes: pendingFixResponse,
    });
  }

renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => undefined} style={styles.fixContainer}>
      <View style={{ width: 200, paddingVertical: 5 }}>
        <Text>
          {item.assignedToCraftsman == null
            ? 'Not assigned'
            : `${item.assignedToCraftsman.firstName} ${item.assignedToCraftsman.lastName}`
          }
        </Text>
        <Text style={{ fontWeight: 'bold' }}>{item.details[0].name}</Text>
        <Text style={{ color: '#8B8B8B' }}>{item.details[0].category}</Text>
      </View>
      <View style={styles.arrow}>
        <Icon library='AntDesign' name='arrowright' color='accent' />
      </View>
    </TouchableOpacity>
  );

render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topContainer}>
          <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
            <Icon library='AntDesign' name='back' size={30} />
          </Button>
          <NotificationBell notifications={0} onPress={() => undefined} />
        </View>
        <View style={styles.bodyContainer}>
            <Text style={{alignSelf: 'center', marginTop: 15, color:'gray'}}>last seen today at 10:33</Text>
            {this.state.profilePictureUrl
                ? <View style={styles.image}>
                    <Image
                    style={styles.image}
                    source={{ uri: this.state.profilePictureUrl }}
                    />
                </View>
                : 
                <View style={styles.image}>
                    <Text>Image not found</Text>
                </View>
            }
            {/* Rating */}
            <Text style={styles.text}>Andy</Text>
            <Text style={styles.text}>Info</Text>
            <Text style={{ color:'gray', marginLeft:50 ,alignSelf: 'flex-start', marginTop: 10}}>Your fixes with Andy:</Text>
            <View>
                {/* body of each section */}
                <FlatList
                  nestedScrollEnabled={true}
                  data={this.state.pendingFixes}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                />
              </View>
            {/* fixes */}
        </View>
      </SafeAreaView>
    );
  }
}