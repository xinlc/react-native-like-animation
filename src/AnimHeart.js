import React, { PureComponent } from 'react';
import { Animated, ImageSourcePropType } from 'react-native';

const HEART_IMG = require('./Images/heart.png');

const ROTATE_ANGLE = ['-35deg', '-25deg', '0deg', '25deg', '35deg'];

type Props = {
  heart?: ImageSourcePropType
};

type State = {
};

export default class AnimHeart extends PureComponent<Props, State> {
  static defaultProps = {
    heart: null,
  }

  constructor(props) {
    super(props);
    this._anim = new Animated.Value(0);
    this._rotateValue = ROTATE_ANGLE[Math.floor(Math.random() * 4)]; // 设置随机旋转角度
  }

  componentDidMount() {
    /*
      注意:
      动画串行中，如果第一个动画中的useNativeDriver设置为true，
      此时动画便交于原生端进行执行，不可再切换为JS驱动，后续动画的useNativeDriver也必须设置为true
    */
    const { onEnd, } = this.props;
    // 使用顺序执行动画函数
    Animated.sequence([
      // 使用弹簧动画函数
      Animated.spring(
        this._anim,
        {
          toValue: 1,
          useNativeDriver: true, // 使用原生驱动
          bounciness: 5 // 设置弹簧比例
        }
      ),
      // 使用定时动画函数
      Animated.timing(
        this._anim,
        {
          toValue: 2,
          useNativeDriver: true
        }
      )
    ]).start(() => {
      if (onEnd) {
        onEnd();
      }
    });
  }

  render() {
    const { x, y, heart } = this.props;
    const img = heart || HEART_IMG;

    return (
      <Animated.Image
        style={{
          position: 'absolute',
          left: x,
          top: y,
          opacity: this._anim.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [1, 1, 0]
          }),
          transform: [{
            scale: this._anim.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [1, 0.8, 2]
            }),
          }, {
            rotate: this._anim.interpolate({
              inputRange: [0, 1],
              outputRange: [this._rotateValue, this._rotateValue],
            }),
          }]
        }}
        source={img}
      />
    );
  }
}
