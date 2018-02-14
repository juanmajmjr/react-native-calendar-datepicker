/**
* YearSelector pure component.
* @flow
*/

import React, { Component } from 'react'
import { PickerIOS, View, StyleSheet } from 'react-native'
import Moment from 'moment'

let PickerItemIOS = PickerIOS.Item

type Props = {
  focus: Moment,
  onFocus?: (date : Moment) => void,
  minDate: Moment,
  maxDate: Moment,
}

type State = {
  year: Number,
}

export default class YearSelector extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor (props: Object) {
    super(props)
    this.state = {
      years: {},
      selectedYear: props.focus.year()
    }
  }

  componentDidMount () {
    this._generateYears(Number(this.props.minDate.format('YYYY')), Number(this.props.maxDate.format('YYYY')))
  }

  componentWillReceiveProps (nextProps: Object) {
    if (this.props.focus !== nextProps.focus) {
      this.setState({
        selectedYear: nextProps.focus && nextProps.focus.year()
      })
    }
  }
//           itemStyle={(String(this.state.selectedYear === String(this.state.years)) ? styles.pickerItemStyle: styles.pickerItemSelectedStyle}>

  _generateYears (minDate, maxDate) {
    let years = {}
    let yearsDifference = maxDate - minDate
    for (let i = 0; i < yearsDifference; i++) {
      years[minDate + i] = {}
    }
    this.setState({years: years})
  }

  _onFocus (year : number) {
    let dateToShow = Moment(year + '-' + this.props.focus.format('M') + '-' + this.props.focus.format('D'), ['MM-DD-YYYY', 'YYYY-MM-DD'])
    let dateSaved = Moment(year + '-' + this.props.focus.format('M') + '-' + this.props.selected.format('D'), ['MM-DD-YYYY', 'YYYY-MM-DD'])

    if (dateSaved.isValid()) {
      this.props.onFocus && this.props.onFocus(dateToShow)
      this.props.onChange && this.props.onChange(dateSaved)
    }
  }

  render () {
    return (
      <View>
        <PickerIOS
          selectedValue={String(this.state.selectedYear)}
          onValueChange={(selectedYear) => this._onFocus(selectedYear)}
          itemStyle={styles.pickerItemStyle}>
          {Object.keys(this.state.years).slice(0).reverse().map((year) => (
            <PickerItemIOS key={year} color={(String(this.state.selectedYear) === String(year)) ? this.props.colorTheme : 'grey'} value={year} label={year} />
           ))}
        </PickerIOS>
      </View>
    )
  }
}
YearSelector.defaultProps = {
  focus: Moment().startOf('month'),
  minDate: Moment(),
  maxDate: Moment()
}

const styles = StyleSheet.create({
  pickerItemStyle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '800'
  },
  pickerItemSelectedStyle: {
    fontSize: 18,
    color: 'grey',
    textAlign: 'center'
  }
})
