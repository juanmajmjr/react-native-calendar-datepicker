/**
* MonthSelector pure component.
* @flow
*/

import React, { Component } from 'react'
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native'

// Component specific libraries.
import _ from 'lodash'
import Moment from 'moment'

type Props = {
  selected?: Moment,
  // Styling
  style?: View.propTypes.style,
  // Controls the focus of the calendar.
  focus: Moment,
  onFocus?: (date: Moment) => void,
  // Minimum and maximum valid dates.
  minDate: Moment,
  maxDate: Moment,
  // Styling properties.
  monthText?: Text.propTypes.style,
  monthDisabledText?: Text.propTypes.style,
  selectedText?: Text.propTypes.style,
  returnUpperCaseFirstLetter?: () => string
}

type State = {
  months: Array<Array<Object>>,
  selectedMonth?: number,
}

export default class MonthSelector extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor (props: Object) {
    super(props)

    const months = Moment.monthsShort()
    let groups = []
    let group = []
    _.map(months, (month, index) => {
      if (index % 4 === 0) {
        group = []
        groups.push(group)
      }
      // Check if the month is valid.
      let maxChoice = Moment(this.props.focus).month(index).endOf('month')
      let minChoice = Moment(this.props.focus).month(index).startOf('month')
      group.push({
        valid: this.props.maxDate.diff(minChoice, 'seconds') >= 0 &&
               this.props.minDate.diff(maxChoice, 'seconds') <= 0,
        name: month,
        index
      })
    })
    this.state = {
      months: groups,
      selectedMonth: props.focus.month()
    }
  }

  componentWillReceiveProps (nextProps: Object) {
    if (this.props.selected !== nextProps.selected) {
      this.setState({
        selectedMonth: nextProps.selected && nextProps.selected.month()
      })
    }
  }

  _onFocus = (index : number) : void => {
    let dateToShow = Moment(this.props.focus.format('YYYY') + '-' + (index + 1) + '-' + this.props.focus.format('D'), ['MM-DD-YYYY', 'YYYY-MM-DD'])
    let dateSaved = Moment(this.props.focus.format('YYYY') + '-' + (index + 1) + '-' + this.props.selected.format('D'), ['MM-DD-YYYY', 'YYYY-MM-DD'])

    this.setState({selectedMonth: index})

    if (dateSaved.isValid()) {
      this.props.onFocus && this.props.onFocus(dateToShow)
      this.props.onChange && this.props.onChange(dateSaved)
    }
  }

  render () {
    return (
      <View>
        {_.map(this.state.months, (group, i) =>
          <View key={i} style={[styles.group]}>
            {_.map(group, (month, j) =>
              <TouchableHighlight
                key={j}
                style={{flexGrow: 1}}
                activeOpacity={1}
                underlayColor='transparent'
                onPress={() => month.valid && this._onFocus(month.index)}>
                <View >
                  <Text style={[
                    styles.monthText,
                    this.props.monthText,
                    month.index === this.state.selectedMonth ? this.props.selectedDayStyle : null,
                    month.valid ? null : styles.disabledText,
                    month.valid ? null : this.props.monthDisabledText
                  ]} >
                    {this.props.returnUpperCaseFirstLetter(month.name)}
                  </Text>
                </View>
              </TouchableHighlight>
            )}
          </View>
        )}
      </View>
    )
  }
}
MonthSelector.defaultProps = {
  focus: Moment(),
  minDate: Moment(),
  maxDate: Moment()
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    paddingLeft: 22,
    paddingRight: 22

  },
  disabledText: {
    borderColor: 'grey',
    color: 'grey'
  },
  monthText: {
    paddingBottom: 30,
    paddingTop: 30,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: -0.3,
    fontWeight: '600',
    color: 'rgb(128, 128, 128)'
  },
  selectedText: {
    fontWeight: '800'

  }
})
