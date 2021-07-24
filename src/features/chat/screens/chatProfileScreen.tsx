import React, { FunctionComponent } from 'react';
import {
  Text, View, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList,
} from 'react-native';
import { Icon } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  store, FixesService, ConfigFactory, StoreState, useSelector,
} from 'fixit-common-data-store';
import useAsyncEffect from 'use-async-effect';

const fixesService = new FixesService(new ConfigFactory(), store);
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
    color: 'gray',
  },
});

const ChatProfileScreen : FunctionComponent<any> = () => {
  const profilePictureUrl = useSelector((storeState: StoreState) => storeState.profile);
  const pendingFixes = useSelector((storeState: StoreState) => storeState.fixes.pendingFixesState);

  useAsyncEffect(async () => {
    await fixesService.getPendingFixes('8b418766-4a99-42a8-b6d7-9fe52b88ea93');
  }, []);

  const renderItem = ({ item }) : JSX.Element => (
    <TouchableOpacity onPress={() => undefined} style={styles.fixContainer}>
      <View style={{ width: 200, paddingVertical: 5 }}>
        <Text>
          {item.assignedToCraftsman == null
            ? 'Not assigned'
            : `${item.assignedToCraftsman.firstName} ${item.assignedToCraftsman.lastName}`
          }
        </Text>
        <Text style={{ fontWeight: 'bold' }}>{item.details.name}</Text>
        <Text style={{ color: '#8B8B8B' }}>{item.details.category}</Text>
      </View>
      <View style={styles.arrow}>
        <Icon library='AntDesign' name='arrowright' color='accent' />
      </View>
    </TouchableOpacity>
  );

  const render = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <Text style={{
          alignSelf: 'center',
          marginTop: 15,
          color: 'gray',
        }}>last seen today at 10:33</Text>
        {profilePictureUrl
          ? <View style={styles.image}>
            <Image
              style={styles.image}
              source={{ uri: profilePictureUrl }}
            />
          </View>
          : <View style={styles.image}>
            <Text>Image not found</Text>
          </View>
        }
        {/* Rating */}
        <Text style={styles.text}>Andy</Text>
        <Text style={styles.text}>Info</Text>
        <Text style={{
          color: 'gray', marginLeft: 50, alignSelf: 'flex-start', marginTop: 10,
        }}>Your fixes with Andy:</Text>
        <View>
          {/* body of each section */}
          <FlatList
            nestedScrollEnabled={true}
            data={pendingFixes.fixes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        {/* fixes */}
      </View>
    </SafeAreaView>
  );

  return render();
};

export default ChatProfileScreen;
