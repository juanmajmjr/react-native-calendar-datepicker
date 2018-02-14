/**
* Calendar container component.
* @flow
*/
import React, { Component } from 'react'
import { LayoutAnimation, Slider, View, Text, StyleSheet, Dimensions } from 'react-native'

// Component specific libraries.
import Moment from 'moment'
import TabCalendar from './tabCalendar'
import YearSelector from '../pure/YearSelector'
import MonthSelector from '../pure/MonthSelector'
import DaySelector from '../pure/DaySelector'

type Stage = "day" | "month" | "year"
const DAY_SELECTOR : Stage = 'day'
const MONTH_SELECTOR : Stage = 'month'
const YEAR_SELECTOR : Stage = 'year'
const width = Dimensions.get('window').width

type Props = {
  // The core properties.
  colorTheme?: string,
  selected?: Moment,
  onChange?: (date: Moment) => void,
  // Minimum and maximum date.
  minDate?: Moment,
  maxDate?: Moment,
  // General styling properties.
  style?: View.propTypes.style,
  barText?: Text.propTypes.style,
  // Styling properties for selecting the day.
  dayHeaderView?: View.propTypes.style,
  dayHeaderText?: Text.propTypes.style,
  dayRowView?: View.propTypes.style,
  dayView?: View.propTypes.style,
  daySelectedView?: View.propTypes.style,
  dayText?: Text.propTypes.style,
  dayDisabledText?: Text.propTypes.style,
  // Styling properties for selecting the month.
  monthText?: Text.propTypes.style,
  monthDisabledText?: Text.propTypes.style,
  monthSelectedText?: Text.propTypes.style,
  yearSlider?: Slider.propTypes.style,
  yearText?: Text.propTypes.style,
  selectedDayStyle?: Text.propTypes.style
}

type State = {
  stage: Stage,
  // Focus points to the first day of the month that is in current focus.
  focus: Moment,
  monthOffset?: number,
}

export default class Calendar extends Component {
  props: Props;
  state: State;
  static defaultProps: Props;

  constructor (props: Props) {
    super(props)
    const stage = props.startStage
    this.state = {
      stage: stage,
      focus: Moment(props.selected).startOf('month')
    }
  }

  _dayStage = () : void => {
    this.setState({stage: DAY_SELECTOR})
    LayoutAnimation.easeInEaseOut()
  }

  _monthStage = () : void => {
    this.setState({stage: MONTH_SELECTOR})

    LayoutAnimation.easeInEaseOut()
  }

  _yearStage = () : void => {
    this.setState({stage: YEAR_SELECTOR})

    LayoutAnimation.easeInEaseOut()
  }

  _changeFocus = (focus : Moment) : void => {
    console.log('CHANGE FOCUS', focus)
    this.setState({focus: focus})
  }

  returnUpperCaseFirstLetter = (text) : string => {
    let modifiedText = this.handleTextExceptions(text)
    return modifiedText[0].toUpperCase() + modifiedText.substring(1, modifiedText.length)
  }

  handleTextExceptions = (text) : string => {
    switch (String(text)) {
      case 'tor': return 'tors'
      case 'sep': return 'sept'
      default: return text
    }
  }

  _renderHeaders () {
    return (
      <View style={styles.headerButtons}>
        <View style={styles.tabSeparator} />
        <TabCalendar type={DAY_SELECTOR} focus={this.state.focus} selected={this.props.selected} stage={this._dayStage} currentStage={this.state.stage} colorTheme={this.props.colorTheme} />
        <TabCalendar type={MONTH_SELECTOR} focus={this.state.focus} selected={this.props.selected} stage={this._monthStage} currentStage={this.state.stage} colorTheme={this.props.colorTheme} />
        <TabCalendar type={YEAR_SELECTOR} focus={this.state.focus} selected={this.props.selected} stage={this._yearStage} currentStage={this.state.stage} colorTheme={this.props.colorTheme} />
        <View style={styles.tabSeparator} />
      </View>
    )
  }

  _renderSelector () {
    switch (this.state.stage) {
      case DAY_SELECTOR: return this._renderDaySelector()
      case MONTH_SELECTOR: return this._renderMonthSelector()
      case YEAR_SELECTOR: return this._renderYearSelector()
    }
  }

  _renderDaySelector () {
    return (
      <View style={styles.selector}>
        <DaySelector
          focus={this.state.focus}
          selected={this.props.selected}
          onFocus={this._changeFocus}
          onChange={(date) => this.props.onChange && this.props.onChange(date)}
          monthOffset={this.state.monthOffset}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          dayHeaderView={this.props.dayHeaderView}
          dayHeaderText={this.props.dayHeaderText}
          dayRowView={this.props.dayRowView}
          dayView={this.props.dayView}
          daySelectedView={this.props.daySelectedView}
          dayText={this.props.dayText}
          dayDisabledText={this.props.dayDisabledText}
          returnUpperCaseFirstLetter={this.returnUpperCaseFirstLetter}
          selectedDayStyle={this.props.selectedDayStyle}
            />
      </View>
    )
  }

  _renderMonthSelector () {
    return (
      <View style={styles.selector}>
        <MonthSelector
          focus={this.state.focus}
          selected={this.props.selected}
          onChange={(date) => this.props.onChange && this.props.onChange(date)}
          onFocus={this._changeFocus}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          monthText={this.props.monthText}
          monthDisabledText={this.props.monthDisabledText}
          selectedText={styles.monthText}
          returnUpperCaseFirstLetter={this.returnUpperCaseFirstLetter}
          selectedDayStyle={this.props.selectedDayStyle}
        />
      </View>
    )
  }

  _renderYearSelector () {
    return (
      <View style={styles.selector}>
        <YearSelector
          focus={this.state.focus}
          selected={this.props.selected}
          onChange={(date) => this.props.onChange && this.props.onChange(date)}
          onFocus={this._changeFocus}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          colorTheme={this.props.colorTheme}
          />
      </View>
    )
  }

  render () {
    return (
      <View style={styles.calendar}>
        <View style={styles.separator} />
        {this._renderHeaders()}
        <View style={styles.separator} />
        {this._renderSelector()}
        <View style={styles.separator} />
      </View>
    )
  }
}
Calendar.defaultProps = {
  minDate: Moment(),
  maxDate: Moment().add(10, 'years'),
  startStage: DAY_SELECTOR,
  colorTheme: 'orange'
}

const styles = StyleSheet.create({
  separator: {
    flex: 0.5
  },
  tabSeparator: {
    flex: 2
  },
  selector: {
    flex: 8,
    width: width / 1.8
  },
  calendar: {
    flex: 1,
    width: width / 1.8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  headerButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1.5,
    paddingLeft: 25
  },
  stageWrapper: {
    padding: 5,
    overflow: 'hidden',
    flex: 1,
    width: width / 1.80
  }
})
