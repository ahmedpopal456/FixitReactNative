import React from 'react';
import {
  SafeAreaView, Text, View, StyleSheet, Dimensions, ScrollView, ImageBackground,
} from 'react-native';
import {
  Button, colors, DonutChart, Icon,
} from 'fixit-common-ui';
import { TouchableOpacity } from 'react-native-gesture-handler';
import bgImage from '../../../common/assets/background-right.png';
import Calendar from '../../../components/calendar/calendar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 95,
    width: '100%',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 25,
    marginVertical: 5,
  },
  descriptionContainer: {
    height: '80%',
    backgroundColor: '#FFE8A4',
    padding: 10,
    marginBottom: 15,
  },
  phaseContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 30,
  },
  taskContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    alignItems: 'flex-start',
    borderRadius: 10,
    elevation: 3,
    // Below is for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 100 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 3,
    backgroundColor: colors.accent,
    borderRadius: 30,
  },
  scheduleContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  textOn: {
    color: colors.primary,
    textAlign: 'center',
  },
  textOff: {
    color: colors.accent,
    textAlign: 'center',
  },
  circleOn: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 30 / 2,
    backgroundColor: colors.accent,
    justifyContent: 'center',
  },
  circleOff: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  button: {
    margin: 5,
    paddingHorizontal: 3,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 3,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
});

export default class FixOverviewScreen extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      phase: 2,
      isPhaseOne: true,
      isPhaseTwo: false,
      isPhaseThree: false,
      readMore: false,
      displayReadMore: false,
      tasks: [
        {
          title: 'Punch wood',
          description: 'Use hand to chop wood',
        },
        {
          title: 'Craft crafting bench',
          description: 'Put wooden planks into 2x2 crafting',
        },
        {
          title: 'Slay the enderdragon',
          description: 'Punch your way to the ender and defeat the enderdragon using beds',
        },
      ],
    };
  }

  componentDidMount(): void {
    switch (this.state.phase) {
      case 1:
        this.setState({
          isPhaseOne: true,
          isPhaseTwo: false,
          isPhaseThree: false,
        });
        break;
      case 2:
        this.setState({
          isPhaseOne: false,
          isPhaseTwo: true,
          isPhaseThree: false,
        });
        break;
      case 3:
        this.setState({
          isPhaseOne: false,
          isPhaseTwo: false,
          isPhaseThree: true,
        });
        break;
      default:
        break;
    }
  }

  displayTaskTitle = (phase: number) : string => {
    switch (phase) {
      case 1:
        return this.state.tasks[phase - 1].title;
      case 2:
        return this.state.tasks[phase - 1].title;
      case 3:
        return this.state.tasks[phase - 1].title;
      default:
        return 'Some task';
    }
  }

  render() : JSX.Element {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={bgImage}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <ScrollView testID='fixOverviewScroll'>
            <View style={styles.topContainer}>
              <Button onPress={() => this.props.navigation.goBack()} color='transparent'>
                <Icon library='AntDesign' name='back' size={30} />
              </Button>
            </View>
            <View testID='fixInfo' style={styles.infoContainer}>
              <DonutChart
                value={75}
                radius={50}
                strokeWidth={7}
                color='primary'
                textColor='white'
              />
              <View style={{ flex: 1, margin: 5 }}>
                <Text style={styles.title}>{this.props.route.params.fix.details.name}</Text>
                <View style={styles.descriptionContainer}>
                  <Text
                    numberOfLines={this.state.readMore ? 0 : 3}
                    onTextLayout={(e: any) => this.setState({
                      displayReadMore: e.nativeEvent.lines.length >= 3,
                    })}
                  >
                    {this.props.route.params.fix.details.description}
                  </Text>
                  {this.state.displayReadMore
                    ? <View style={styles.button}>
                      <TouchableOpacity
                        onPress={() => this.setState({ readMore: !this.state.readMore })}
                      >
                        <Text style={{ color: 'white', textAlign: 'center' }}>
                          {this.state.readMore ? 'Read less' : 'Read more'}
                        </Text>
                      </TouchableOpacity>
                    </View> : null}
                </View>
              </View>
            </View>
            <Text style={[styles.title, { alignSelf: 'center', marginTop: 20 }]}>Phase {this.state.phase}</Text>
            <View testID='fixOverviewPhase' style={styles.phaseContainer}>
              <View style={{
                backgroundColor: this.state.isPhaseOne ? '#DDDDDF' : colors.accent,
                borderTopLeftRadius: 30,
                borderBottomLeftRadius: 30,
              }}>
                <TouchableOpacity
                  style={this.state.phase === 1 ? styles.circleOn : styles.circleOff}
                  onPress={() => this.setState({ phase: 1 })}
                >
                  <Text style={this.state.phase === 1 ? styles.textOn : styles.textOff}>1</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1,
                backgroundColor: this.state.isPhaseOne ? '#DDDDDF' : colors.accent,
                width: '100%',
                height: '100%',
              }} />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ backgroundColor: this.state.isPhaseOne ? '#DDDDDF' : colors.accent }} />
                <View style={{ backgroundColor: this.state.isPhaseTwo ? '#DDDDDF' : colors.accent }} />
                <View style={{
                  zIndex: 1,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                  <TouchableOpacity
                    style={this.state.phase === 2 ? styles.circleOn : styles.circleOff}
                    onPress={() => this.setState({ phase: 2 })}
                  >
                    <Text style={this.state.phase === 2 ? styles.textOn : styles.textOff}>2</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{
                flex: 1,
                backgroundColor: this.state.isPhaseThree ? colors.accent : '#DDDDDF',
                width: '100%',
                height: '100%',
              }} />
              <View style={{
                backgroundColor: this.state.isPhaseThree ? colors.accent : '#DDDDDF',
                borderTopRightRadius: 30,
                borderBottomRightRadius: 30,
              }}>
                <TouchableOpacity
                  style={this.state.phase === 3 ? styles.circleOn : styles.circleOff}
                  onPress={() => this.setState({ phase: 3 })}
                >
                  <Text style={this.state.phase === 3 ? styles.textOn : styles.textOff}>3</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.taskContainer}>
              <View style={styles.tag}>
                <Text style={{ fontSize: 12 }}>NEXT TASK</Text>
              </View>
              <Text style={{ fontSize: 20 }}>{this.displayTaskTitle(this.state.phase)}</Text>
              <Button onPress={() => undefined}>
                See Status
              </Button>
            </View>
            <View style={styles.scheduleContainer}>
              <Text style={[styles.title, { alignSelf: 'center' }]}>Schedule</Text>
              <View testID='calendar'>
                <Calendar
                  startDate={
                    new Date(this.props.route.params.fix.schedule[0].startTimestampUtc * 1000)
                  }
                  endDate={
                    new Date(this.props.route.params.fix.schedule[0].endTimestampUtc * 1000)
                  }
                  canUpdate={false}
                />
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}
