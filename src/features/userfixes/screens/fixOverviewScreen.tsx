import React, { FunctionComponent, useEffect, useState } from 'react';
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

export interface FixOverviewTask {
  title: string,
  description: string
}

const FixOverviewScreen : FunctionComponent<any> = (props) => {
  const [phase, setPhase] = useState<number>(2);
  const [isPhaseOne, setIsPhaseOne] = useState<boolean>(true);
  const [isPhaseTwo, setIsPhaseTwo] = useState<boolean>(false);
  const [isPhaseThree, setIsPhaseThree] = useState<boolean>(false);
  const [readMore, setReadMore] = useState<boolean>(false);
  const [displayReadMore, setDisplayReadMore] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Array<FixOverviewTask>>([
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
  ]);

  useEffect(() => {
    switch (phase) {
      case 1:
        setIsPhaseOne(true);
        setIsPhaseTwo(false);
        setIsPhaseThree(false);
        break;
      case 2:
        setIsPhaseOne(false);
        setIsPhaseTwo(true);
        setIsPhaseThree(false);
        break;
      case 3:
        setIsPhaseOne(false);
        setIsPhaseTwo(false);
        setIsPhaseThree(true);
        break;
      default:
        break;
    }
  }, []);

  const displayTaskTitle = (phaseNumber: number) : string => {
    switch (phaseNumber) {
      case 1:
        return tasks[phaseNumber - 1].title;
      case 2:
        return tasks[phaseNumber - 1].title;
      case 3:
        return tasks[phaseNumber - 1].title;
      default:
        return 'Some task';
    }
  };

  const render = () => (
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
            <Button onPress={() => props.navigation.goBack()} color='transparent'>
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
              <Text style={styles.title}>{props.route.params.fix.details.name}</Text>
              <View style={styles.descriptionContainer}>
                <Text
                  numberOfLines={readMore ? 0 : 3}
                  onTextLayout={(e: any) => setDisplayReadMore(e.nativeEvent.lines.length >= 3)}
                >
                  {props.route.params.fix.details.description}
                </Text>
                {displayReadMore
                  ? <View style={styles.button}>
                    <TouchableOpacity
                      onPress={() => setReadMore(!readMore)}
                    >
                      <Text style={{ color: 'white', textAlign: 'center' }}>
                        {readMore ? 'Read less' : 'Read more'}
                      </Text>
                    </TouchableOpacity>
                  </View> : null}
              </View>
            </View>
          </View>
          <Text style={[styles.title,
            { alignSelf: 'center', marginTop: 20 }]}>Phase {phase}</Text>
          <View testID='fixOverviewPhase' style={styles.phaseContainer}>
            <View style={{
              backgroundColor: isPhaseOne ? '#DDDDDF' : colors.accent,
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
            }}>
              <TouchableOpacity
                style={phase === 1 ? styles.circleOn : styles.circleOff}
                onPress={() => setPhase(1)}
              >
                <Text style={phase === 1 ? styles.textOn : styles.textOff}>1</Text>
              </TouchableOpacity>
            </View>
            <View style={{
              flex: 1,
              backgroundColor: isPhaseOne ? '#DDDDDF' : colors.accent,
              width: '100%',
              height: '100%',
            }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ backgroundColor: isPhaseOne ? '#DDDDDF' : colors.accent }} />
              <View style={{ backgroundColor: isPhaseTwo ? '#DDDDDF' : colors.accent }} />
              <View style={{
                zIndex: 1,
                position: 'absolute',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
                <TouchableOpacity
                  style={phase === 2 ? styles.circleOn : styles.circleOff}
                  onPress={() => setPhase(2)}
                >
                  <Text style={phase === 2 ? styles.textOn : styles.textOff}>2</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{
              flex: 1,
              backgroundColor: isPhaseThree ? colors.accent : '#DDDDDF',
              width: '100%',
              height: '100%',
            }} />
            <View style={{
              backgroundColor: isPhaseThree ? colors.accent : '#DDDDDF',
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
            }}>
              <TouchableOpacity
                style={phase === 3 ? styles.circleOn : styles.circleOff}
                onPress={() => setPhase(3)}
              >
                <Text style={phase === 3 ? styles.textOn : styles.textOff}>3</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.taskContainer}>
            <View style={styles.tag}>
              <Text style={{ fontSize: 12 }}>NEXT TASK</Text>
            </View>
            <Text style={{ fontSize: 20 }}>{displayTaskTitle(phase)}</Text>
            <Button onPress={() => undefined}>
                See Status
            </Button>
          </View>
          <View style={styles.scheduleContainer}>
            <Text style={[styles.title, { alignSelf: 'center' }]}>Schedule</Text>
            <View testID='calendar'>
              <Calendar
                startDate={
                  new Date(props.route.params.fix.schedule[0].startTimestampUtc * 1000)
                }
                endDate={
                  new Date(props.route.params.fix.schedule[0].endTimestampUtc * 1000)
                }
                canUpdate={false}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
  return render();
};

export default FixOverviewScreen;
