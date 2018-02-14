/**
* DaySelector pure component.
* @flow
*/

import React, { Component } from 'react'
import { TouchableHighlight, LayoutAnimation, View, Text, StyleSheet } from 'react-native'

// Component specific libraries.
import _ from 'lodash'
import Moment from 'moment'
type Props = {
  // Focus and selection control.
  focus: Moment,
  selected?: Moment,
  onChange?: (date: Moment) => void,
  onFocus?: (date: Moment) => void,
  // Minimum and maximum dates.
  minDate: Moment,
  maxDate: Moment,
  // Styling properties.
  dayHeaderView?: View.propTypes.style,
  dayHeaderText?: Text.propTypes.style,
  dayRowView?: View.propTypes.style,
  dayView?: View.propTypes.style,
  daySelectedView?: View.propTypes.style,
  dayText?: Text.propTypes.style,
  dayTodayText?: Text.propTypes.style,
  daySelectedText?: Text.propTypes.style,
  dayDisabledText?: Text.propTypes.style,
  returnUpperCaseFirstLetter?: () => string
}

type State = {
  days: Array<Array<Object>>,
}

export default class DaySelector extends Component {
  props: Props;
  state: State;
  static defaultProps: Props

  constructor (props: Props) {
    super(props)
    this.state = {
      days: this._computeDays(props),
      selectedDay: this.props.focus.format('D')
    }
  }

  _slide = (dx : number) => {
    this.refs.wrapper.setNativeProps({
      style: {
        left: dx
      }
    })
  };

  componentWillReceiveProps (nextProps: Object) {
    if (this.props.focus !== nextProps.focus ||
        this.props.selected !== nextProps.selected) {
      this.setState({
        days: this._computeDays(nextProps),
        selectedDay: nextProps.selected.format('D')
      })

      /* const date = Moment(nextProps.selected.format('YYYY')+'-'+nextProps.selected.format('M')+'-'+nextProps.selected.format('D'))
      console.log('willreceiveprops', date)
      this.props.onFocus && this.props.onFocus(date) */
    }
  }

  _computeDays = (props: Object) : Array<Array<Object>> => {
    let result = []
    const currentMonth = props.focus.month()
    let iterator = Moment(props.focus)
    while (iterator.month() === currentMonth) {
      if (iterator.weekday() === 0 || result.length === 0) {
        result.push(_.times(7, _.constant({})))
      }
      let week = result[result.length - 1]
      week[iterator.weekday()] = {
        valid: this.props.maxDate.diff(iterator, 'seconds') >= 0 &&
               this.props.minDate.diff(iterator, 'seconds') <= 0,
        date: iterator.date(),
        selected: props.selected && iterator.isSame(props.selected, 'day'),
        today: iterator.isSame(Moment(), 'day')
      }
      // Add it to the result here.
      iterator.add(1, 'day')
    }
    LayoutAnimation.easeInEaseOut()
    return result
  };

  _onChange = (day : Object) : void => {
    let date = Moment(this.props.focus).add(day.date - 1, 'day')
    this.props.onChange && this.props.onChange(date)
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={[styles.headerView, this.props.dayHeaderView]}>
          {_.map(Moment.weekdaysShort(true), (day) =>
            <Text key={day} style={[styles.headerText, this.props.dayHeaderText]}>
              {this.props.returnUpperCaseFirstLetter(day)}
            </Text>
          )}
        </View>
        <View ref='wrapper'>
          {_.map(this.state.days, (week, i) =>
            <View key={i} style={[
              styles.rowView,
              this.props.dayRowView,
              i === this.state.days.length - 1
              ? {marginBottom: 30} : null
            ]}>
              {_.map(week, (day, j) =>
                <TouchableHighlight
                  key={j}
                  style={[
                    styles.dayView,
                    this.props.dayView,
                    day.selected ? this.props.daySelectedView : null
                  ]}
                  activeOpacity={day.valid ? 0.8 : 1}
                  underlayColor='transparent'
                  onPress={() => day.valid && this._onChange(day)}>
                  <Text style={[
                    styles.dayText,
                    this.props.dayText,
                    day.today ? this.props.dayTodayText : null,
                    day.selected ? [styles.selectedText, this.props.selectedDayStyle] : null,
                    day.selected ? this.props.daySelectedText : null
                  ]}>
                    {day.date}
                  </Text>
                </TouchableHighlight>
              )}
            </View>
          )}
        </View>
      </View>
    )
  }
}
DaySelector.defaultProps = {
  focus: Moment().startOf('month'),
  minDate: Moment(),
  maxDate: Moment()
}

const styles = StyleSheet.create({
  headerView: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    flexGrow: 1,
    flexDirection: 'row'
  },
  headerText: {
    flexGrow: 1,
    textAlign: 'center',
    minWidth: 30,
    fontSize: 18,
    letterSpacing: -0.4,
    color: 'rgb(128, 128, 128)',
    fontWeight: '600'
  },
  rowView: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10
  },
  dayView: {
    flexGrow: 1,
    margin: 3.5
  },
  dayText: {
    minWidth: 30,
    padding: 5,
    flexGrow: 5,
    fontSize: 18,
    letterSpacing: -0.4,
    textAlign: 'center',
    fontWeight: '600',
    color: 'rgb(128, 128, 128)',
    alignSelf: 'center'
  },
  selectedText: {
    minWidth: 30,
    color: 'orange',
    fontSize: 18,
    letterSpacing: -0.4,
    fontWeight: '800'
  }
})
