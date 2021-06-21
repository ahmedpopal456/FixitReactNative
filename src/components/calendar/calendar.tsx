import { fixRequestActions, store } from 'fixit-common-data-store';
import { colors, Icon } from 'fixit-common-ui';
import React from 'react';
import {
  Text, View, TouchableOpacity,
} from 'react-native';

type CalendarStateModel = {
  activeDate: Date,
  startDate: Date | null,
  endDate: Date | null,
}

export default class Calendar extends
  React.Component<{startDate?:Date, endDate?:Date, canUpdate?:boolean}> {
    state : CalendarStateModel = {
      activeDate: new Date(),
      startDate: (this.props.startDate) ? this.props.startDate : null,
      endDate: (this.props.endDate) ? this.props.endDate : null,
    }

    months = ['January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August', 'September', 'October',
      'November', 'December'];

    weekDays = [
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

    nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    generateMatrix = () : {
      label: string,
      type: string,
      date: Date,
    }[][] => {
      const matrix = [];
      // Create header
      matrix[0] = this.weekDays;

      const year = this.state.activeDate.getFullYear();
      const month = this.state.activeDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();

      const prevMonth = (month === 0) ? 11 : month - 1;
      const nextMonth = (month === 11) ? 0 : month + 1;
      let prevMonthYear = year;
      let nextMonthYear = year;
      if (month === 0) {
        prevMonthYear = year - 1;
      } else if (month === 11) {
        nextMonthYear = year + 1;
      }
      let prevMonthMaxDays = this.nDays[prevMonth];
      let maxDays = this.nDays[month];
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        if (month === 1) {
          maxDays += 1;
        }
        if (prevMonth === 1) {
          prevMonthMaxDays += 1;
        }
      }
      let counter = -firstDay;
      for (let row = 1; row < 7; row += 1) {
        matrix[row] = [];
        for (let col = 0; col < 7; col += 1) {
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
    }

    onPress = (item: {
      label: string,
      type: string,
      date: Date,
    }) : void => {
      if (item.type === 'normal') {
        const utcTimestamp = Math.floor((item.date).getTime() / 1000);
        if (!this.state.startDate) {
          this.setState({ startDate: item.date });
          store.dispatch(fixRequestActions.setFixStartDate({ startTimestamp: utcTimestamp }));
        } else if (!this.state.endDate && item.date > this.state.startDate) {
          this.setState({ endDate: item.date });
          store.dispatch(fixRequestActions.setFixEndDate({ endTimestamp: utcTimestamp }));
        } else {
          this.setState({ startDate: item.date, endDate: null });
          store.dispatch(fixRequestActions.setFixStartDate({ startTimestamp: utcTimestamp }));
          store.dispatch(fixRequestActions.setFixEndDate({ endTimestamp: 0 }));
        }
      }
    };

    changeMonth = (n : number) : void => {
      this.setState(() => {
        this.state.activeDate.setMonth(
          this.state.activeDate.getMonth() + n,
        );
        return this.state;
      });
    }

    dateIsHighlighted = (item : {
      label: string,
      type: string,
      date: Date,
    }) : boolean => {
      if (this.state.startDate && this.state.endDate && item.type !== 'header') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (item.date >= this.state.startDate! && item.date <= this.state.endDate!) {
          return true;
        }
      }
      return false;
    }

    dateIsStartDate = (item : {
      label: string,
      type: string,
      date: Date,
    }) : boolean => {
      if (item.date && this.state.startDate) {
        if (item.date.getTime() === this.state.startDate.getTime()) {
          return true;
        }
      }
      return false;
    }

    dateIsEndDate = (item : {
      label: string,
      type: string,
      date: Date,
    }) : boolean => {
      if (item.date && this.state.endDate) {
        if (item.date.getTime() === this.state.endDate.getTime()) {
          return true;
        }
      }
      return false;
    }

    render() : JSX.Element {
      const matrix = this.generateMatrix();
      let rows = [];
      rows = matrix.map((row, rowIndex) => {
        const rowItems = row.map((item, colIndex) => (
          <TouchableOpacity
            key={`${rowIndex}_${colIndex}`}
            style={{
              flex: 1,
              flexGrow: 1,
              backgroundColor: (this.dateIsHighlighted(item)) ? 'rgba(255,209,74,0.17)' : 'transparent',
              borderTopLeftRadius: (this.dateIsStartDate(item)) ? 100 : 0,
              borderBottomLeftRadius: (this.dateIsStartDate(item)) ? 100 : 0,
              borderTopRightRadius: (this.dateIsEndDate(item)) ? 100 : 0,
              borderBottomRightRadius: (this.dateIsEndDate(item)) ? 100 : 0,
            }}
            onPress={() => this.props.canUpdate && this.onPress(item)}>
            <Text style={{
              textAlign: 'center',
              height: 34,
              paddingTop: 6,
              paddingBottom: 8,
              fontSize: rowIndex === 0 ? 12 : 15,
              fontWeight: rowIndex === 0 ? '700' : '400',
              color: (this.dateIsHighlighted(item)
              || this.dateIsStartDate(item)
              || this.dateIsEndDate(item)) ? colors.accent : '#fff',
              opacity: item.type === 'overflow' ? 0.2 : 1,
              borderStyle: 'solid',
              borderWidth: (this.dateIsStartDate(item) || this.dateIsEndDate(item)) ? 2 : 0,
              borderRadius: 100,
              borderColor: colors.accent,
            }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ));
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
          <View style={{
            backgroundColor: colors.dark,
            borderRadius: 8,
            padding: 5,
            paddingTop: 20,
            paddingBottom: 10,
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
              <TouchableOpacity
                onPress={() => this.changeMonth(-1)}>
                <Icon library="FontAwesome5" name="chevron-left" color={'accent'} size={15} />
              </TouchableOpacity>
              <Text style={{
                color: '#fff',
                fontSize: 20,
                marginLeft: 15,
                marginRight: 15,
              }}>
                {this.months[this.state.activeDate.getMonth()]} &nbsp;
                {this.state.activeDate.getFullYear()}
              </Text>
              <TouchableOpacity
                onPress={() => this.changeMonth(+1)}>
                <Icon library="FontAwesome5" name="chevron-right" color={'accent'} size={15} />
              </TouchableOpacity>
            </View>
            { rows }
          </View>
        </>
      );
    }
}
