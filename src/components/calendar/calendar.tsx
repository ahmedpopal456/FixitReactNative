import { Schedule } from '../../store';
import { colors, Icon } from 'fixit-common-ui';
import React, { FunctionComponent, useState, useEffect } from 'react';

import { Text, View, TouchableOpacity } from 'react-native';

interface Item {
  label: string;
  type: string;
  date: Date;
}

interface RowColumn {
  label: string;
  type: string;
  date: Date;
}
type Matrix = Array<Array<RowColumn>>;

interface Props {
  parentSchedules: Array<Schedule>;
  parentSetSchedules?: React.Dispatch<React.SetStateAction<Schedule[]>>;
  canUpdate?: boolean;
}

const Calendar: FunctionComponent<Props> = ({ parentSchedules, parentSetSchedules, canUpdate }: Props): JSX.Element => {
  const [schedules, setSchedules] = useState(parentSchedules);
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<number>();
  const [startDates, setStartDates] = useState<Array<number>>([]);
  const [endDates, setEndDates] = useState<Array<number>>([]);

  useEffect(() => {
    if (!startDates.length && !endDates.length) {
      const updateStartDates = [...startDates];
      const updateEndDates = [...endDates];
      setSchedules(parentSchedules);
      parentSchedules.forEach((schedule) => {
        updateStartDates.push(schedule.startTimestampUtc);
        updateEndDates.push(schedule.endTimestampUtc);
      });
      setStartDates(updateStartDates);
      setEndDates(updateEndDates);
    }
  }, [parentSchedules]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = [
    {
      label: 'SUN',
      type: 'header',
      date: new Date(),
    },
    {
      label: 'MON',
      type: 'header',
      date: new Date(),
    },
    {
      label: 'TUE',
      type: 'header',
      date: new Date(),
    },
    {
      label: 'WED',
      type: 'header',
      date: new Date(),
    },
    {
      label: 'THU',
      type: 'header',
      date: new Date(),
    },
    {
      label: 'FRI',
      type: 'header',
      date: new Date(),
    },
    {
      label: 'SAT',
      type: 'header',
      date: new Date(),
    },
  ];

  const numberOfDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const generateMatrix = (): Matrix => {
    const matrix = [];
    // Create header
    matrix[0] = weekDays;

    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();

    const prevMonth = month === 0 ? 11 : month - 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    let prevMonthYear = year;
    let nextMonthYear = year;
    if (month === 0) {
      prevMonthYear = year - 1;
    } else if (month === 11) {
      nextMonthYear = year + 1;
    }
    let prevMonthMaxDays = numberOfDaysPerMonth[prevMonth];
    let maxDays = numberOfDaysPerMonth[month];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      if (month === 1) {
        maxDays += 1;
      }
      if (prevMonth === 1) {
        prevMonthMaxDays += 1;
      }
    }
    let counter = -firstDay;
    const numberOfDaysPerWeek = 7;
    for (let row = 1; row < numberOfDaysPerWeek; row += 1) {
      matrix[row] = [];
      for (let col = 0; col < numberOfDaysPerWeek; col += 1) {
        if (counter <= 0) {
          matrix[row][col] = {
            label: `${prevMonthMaxDays + counter}`,
            type: 'overflow',
            date: new Date(prevMonthYear, prevMonth, prevMonthMaxDays + counter),
          };
        } else if (counter <= maxDays) {
          matrix[row][col] = {
            label: `${counter}`,
            type: 'normal',
            date: new Date(year, month, counter),
          };
        } else {
          matrix[row][col] = {
            label: `${counter - maxDays}`,
            type: 'overflow',
            date: new Date(nextMonthYear, nextMonth, counter - maxDays),
          };
        }
        counter += 1;
      }
    }

    return matrix;
  };

  const updateStates = (
    schedule: Schedule,
    updateSchedules: Array<Schedule>,
    updateStartDates: Array<number>,
    updateEndDates: Array<number>,
    index: number,
    removeStartTime = false,
  ) => {
    if (startDate && removeStartTime) {
      const toRemove = updateStartDates.indexOf(startDate);
      if (toRemove > -1) {
        updateStartDates.splice(toRemove, 1);
      }
    }
    const startDateToRemove = updateStartDates.indexOf(schedule.startTimestampUtc);
    if (startDateToRemove > -1) {
      updateStartDates.splice(startDateToRemove, 1);
    }
    setStartDates(updateStartDates);

    const endDateToRemove = updateEndDates.indexOf(schedule.endTimestampUtc);
    if (endDateToRemove > -1) {
      updateEndDates.splice(endDateToRemove, 1);
      setEndDates(updateEndDates);
    }

    if (index > -1) {
      updateSchedules.splice(index, 1);
      setSchedules(updateSchedules);
      if (parentSetSchedules) parentSetSchedules(updateSchedules);
    }
  };

  const onPress = (item: Item): void => {
    if (item.type === 'normal') {
      const utcTimestamp = Math.floor(item.date.getTime() / 1000);
      const updateSchedules = [...schedules];
      const updateStartDates = [...startDates];
      const updateEndDates = [...endDates];

      let isNotInBetweenRange = true;
      let isNotOverLapping = true;
      schedules.forEach((schedule, index) => {
        // if chosen time is in between a pre existing range, delete the pre existing range
        if (schedule && utcTimestamp >= schedule.startTimestampUtc && utcTimestamp <= schedule.endTimestampUtc) {
          isNotInBetweenRange = false;
          updateStates(schedule, updateSchedules, updateStartDates, updateEndDates, index, true);
          setStartDate(undefined);
        }
        // if chosen time overlaps another range
        if (
          schedule &&
          startDate &&
          schedule.startTimestampUtc > startDate &&
          schedule.endTimestampUtc < utcTimestamp
        ) {
          isNotOverLapping = false;
          updateStates(schedule, updateSchedules, updateStartDates, updateEndDates, index);

          updateSchedules.push({ startTimestampUtc: startDate, endTimestampUtc: utcTimestamp });
          setSchedules(updateSchedules);
          if (parentSetSchedules) parentSetSchedules(updateSchedules);
          updateEndDates.push(utcTimestamp);
          setEndDates(updateEndDates);

          setStartDate(undefined);
        }
      });
      if (isNotOverLapping && isNotInBetweenRange && !startDate) {
        setStartDate(utcTimestamp);
        updateStartDates.push(utcTimestamp);
        setStartDates(updateStartDates);
      } else if (isNotOverLapping && isNotInBetweenRange && startDate && utcTimestamp > startDate) {
        updateSchedules.push({ startTimestampUtc: startDate, endTimestampUtc: utcTimestamp });
        updateEndDates.push(utcTimestamp);
        setSchedules(updateSchedules);
        if (parentSetSchedules) parentSetSchedules(updateSchedules);
        setStartDate(undefined);
        setEndDates(updateEndDates);
      }
    }
  };

  const changeMonth = (goTo: number): void => {
    activeDate.setMonth(activeDate.getMonth() + goTo);
    setActiveDate(new Date(activeDate));
  };

  const isNameOfWeekDays = (item: Item) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].includes(item.label);

  const dateIsHighlighted = (item: Item): boolean => {
    if (isNameOfWeekDays(item)) return false;
    let isHighlighted = false;
    if (item.type !== 'header') {
      const isoDateSplit = item.date.toISOString().split('T')[0];
      const utcTimestamp = Math.floor(item.date.getTime() / 1000);
      schedules.forEach((schedule) => {
        const isSDateFound = new Date(schedule.startTimestampUtc * 1000).toISOString().split('T')[0] === isoDateSplit;
        const isEDateFound = new Date(schedule.endTimestampUtc * 1000).toISOString().split('T')[0] === isoDateSplit;
        if (
          schedule &&
          (utcTimestamp >= schedule.startTimestampUtc || isSDateFound) &&
          (utcTimestamp <= schedule.endTimestampUtc || isEDateFound)
        ) {
          isHighlighted = true;
        }
      });
    }
    return isHighlighted;
  };

  const dateIsStartDate = (item: Item): boolean => {
    if (isNameOfWeekDays(item)) return false;
    const utcTimestamp = Math.floor(item.date.getTime() / 1000);
    const isFound = startDates.find(
      (sDate) => new Date(sDate * 1000).toISOString().split('T')[0] === item.date.toISOString().split('T')[0],
    );
    const isStartDate = startDates.includes(utcTimestamp) || isFound;
    if (utcTimestamp && isStartDate) {
      return true;
    }
    return false;
  };

  const dateIsEndDate = (item: Item): boolean => {
    if (isNameOfWeekDays(item)) return false;
    const utcTimestamp = Math.floor(item.date.getTime() / 1000);
    const isFound = endDates.find(
      (eDate) => new Date(eDate * 1000).toISOString().split('T')[0] === item.date.toISOString().split('T')[0],
    );
    const isEndDate = endDates.includes(utcTimestamp) || isFound;
    if (utcTimestamp && isEndDate) {
      return true;
    }
    return false;
  };

  const render = (): JSX.Element => {
    const matrix = generateMatrix();
    const rows = matrix.map((row, rowIndex) => {
      const rowItems = row.map((item, colIndex) => {
        return (
          <TouchableOpacity
            key={`${rowIndex}_${colIndex}`}
            style={{
              flex: 1,
              flexGrow: 1,
              backgroundColor: dateIsHighlighted(item) ? 'rgba(255,209,74,0.17)' : 'transparent',
              borderTopLeftRadius: dateIsStartDate(item) ? 100 : 0,
              borderBottomLeftRadius: dateIsStartDate(item) ? 100 : 0,
              borderTopRightRadius: dateIsEndDate(item) ? 100 : 0,
              borderBottomRightRadius: dateIsEndDate(item) ? 100 : 0,
            }}
            onPress={() => canUpdate && onPress(item)}>
            <Text
              style={{
                textAlign: 'center',
                height: 34,
                paddingTop: 6,
                paddingBottom: 8,
                fontSize: rowIndex === 0 ? 12 : 15,
                fontWeight: rowIndex === 0 ? '700' : '400',
                color: dateIsHighlighted(item) || dateIsStartDate(item) || dateIsEndDate(item) ? colors.accent : '#fff',
                opacity: item.type === 'overflow' ? 0.2 : 1,
                borderStyle: 'solid',
                borderWidth: dateIsStartDate(item) || dateIsEndDate(item) ? 2 : 0,
                borderRadius: 100,
                borderColor: colors.accent,
              }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      });
      return (
        <View
          key={rowIndex}
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 7,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {rowItems}
        </View>
      );
    });
    return (
      <>
        <View
          style={{
            backgroundColor: colors.dark,
            borderRadius: 8,
            padding: 5,
            paddingTop: 20,
            paddingBottom: 10,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            {/* Go back a month */}
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Icon library="FontAwesome5" name="chevron-left" color={'accent'} size={15} />
            </TouchableOpacity>
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                marginLeft: 15,
                marginRight: 15,
              }}>
              {/* Get current month */}
              {months[activeDate.getMonth()]} &nbsp;
              {activeDate.getFullYear()}
            </Text>
            {/* Go forward a month */}
            <TouchableOpacity onPress={() => changeMonth(+1)}>
              <Icon library="FontAwesome5" name="chevron-right" color={'accent'} size={15} />
            </TouchableOpacity>
          </View>
          {rows}
        </View>
      </>
    );
  };
  return render();
};

export default Calendar;
