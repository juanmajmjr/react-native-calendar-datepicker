'use strict'
import React, { Component } from 'react'
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native'
import Moment from 'moment'
type Stage = "day" | "month" | "year"

type Props ={
  selected?: Moment,
  focus?: Moment,
  stage?: () => Moment,
  type?: string,
  stage?: Stage
}

const DAY_SELECTOR : Stage = 'day'
const MONTH_SELECTOR : Stage = 'month'
const YEAR_SELECTOR : Stage = 'year'

export default class TabCalendar extends Component {
  static defaultProps: Props

  _returnDay = () : string => {
    return Moment(this.props.selected).format('D')
  }

  _returnMonth = () : string => {
    return this.props.focus.format('MMMM')
  }

  _returnYear = () : string => {
    return this.props.focus.format('YYYY')
  }

  _renderType () {
    switch (this.props.type) {
      case DAY_SELECTOR: return this._returnDay()
      case MONTH_SELECTOR: return this._returnMonth()
      case YEAR_SELECTOR: return this._returnYear()
    }
  }

  _styleForSelector (type, colorTheme) {
    switch (type) {
      case DAY_SELECTOR: return styles(this.props.colorTheme, 9, 9)
      case MONTH_SELECTOR: return styles(this.props.colorTheme, 10, 10)
      case YEAR_SELECTOR: return styles(this.props.colorTheme, 23, 23)
    }
  }

  render () {
    const styl = this._styleForSelector(this.props.type, this.props.colorTheme)
    return (
      <View style={styl.tab}>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={this.props.stage}
          style={styl.touchable}
        >
          <Text style={(this.props.type === this.props.currentStage) ? styl.currentTabText : styl.tabText}>
            {this._renderType()}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

TabCalendar.defaultProps = {
  type: DAY_SELECTOR
}

const styles = (colorTheme, paddingLeft, paddingRight) => StyleSheet.create({
  tab: {
    padding: 5
  },
  tabText: {
    borderColor: colorTheme,
    borderWidth: 1.6,
    paddingTop: 5.7,
    paddingBottom: 5.7,
    paddingLeft: paddingLeft,
    paddingRight: paddingRight,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: colorTheme,
    borderRadius: 4
  },
  currentTabText: {
    backgroundColor: colorTheme,
    letterSpacing: -0.4,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    borderColor: colorTheme,
    color: 'white',
    borderWidth: 1.6,
    paddingTop: 5.7,
    paddingBottom: 5.7,
    paddingLeft: paddingLeft,
    paddingRight: paddingRight,
    borderRadius: 4,
    overflow: 'hidden'
  },
  touchable: {
    alignSelf: 'center'
  }
})
