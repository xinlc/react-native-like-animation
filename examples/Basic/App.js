/**
 * Example
 * Created by xinlc on 30/01/2019.
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, PanResponder} from 'react-native';
import AnimHeart from 'react-native-like-animation';

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this._tapStartTime = null;
    this._tapTimeoutId = null;

    this.state = {
      heartList: [],
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: this._onPanResponderGrant
    });
  }

  _onPanResponderGrant = (ev) => {
    if (this._isDoubleTap()) {
      clearTimeout(this._tapTimeoutId);
      this._tapTimeoutId = null;
      this._onDoubleTap(ev);
      return;
    }

    this._tapTimeoutId = setTimeout(() => {
      this._tapTimeoutId = null;
      this._onTap(ev);
    }, 300);
  };

  // 检测是否为双击
  _isDoubleTap = () => {
    const curTime = +new Date();
    if (!this._tapStartTime || curTime - this._tapStartTime > 300) {
      this._tapStartTime = curTime;
      return false;
    }
    this._tapStartTime = null;
    return true;
  }

  _onTap() {
    alert('top');
  }

  _onDoubleTap(ev) {
    const { pageX, pageY } = ev.nativeEvent;
    // 设置位置数据，渲染AnimHeart组件
    this.setState(({ heartList }) => {
      heartList.push({
        x: pageX - 60,
        y: pageY - 60,
        key: this._generateShortId(),
      });
      return {
        heartList
      };
    });
  }

  // 生成短ID
  _generateShortId = () => {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };


  _renderAnimHeart() {
    return this.state.heartList.map(({ x, y, key }, index) => {
      return (
        <AnimHeart
          onEnd={() => {
            // 动画完成后销毁组件
            this.setState(({ heartList }) => {
              heartList.splice(index, 1);
              return {
                heartList
              };
            });
          }}
          key={key} // 不要使用index作为key值
          x={x}
          y={y}
          // heart={img}
        />
      );
    });
  }

  render() {
    return (
      <View 
        {...this._panResponder.panHandlers}
        style={styles.container}
      >
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        {this._renderAnimHeart()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#000'
  },
});
