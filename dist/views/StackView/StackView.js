import React from 'react';
import { NativeModules, Dimensions, ImageBackground  } from 'react-native';

import { StackActions } from 'react-navigation';
import StackViewLayout from './StackViewLayout';
import Transitioner from '../Transitioner';
import TransitionConfigs from './StackViewTransitionConfigs';

const NativeAnimatedModule = NativeModules && NativeModules.NativeAnimatedModule;

class StackView extends React.Component {
  static defaultProps = {
    navigationConfig: {
      mode: 'card'
    }
  };

  render() {
    return (
      <Transitioner render={this._render} configureTransition={this._configureTransition} screenProps={this.props.screenProps} navigation={this.props.navigation} descriptors={this.props.descriptors} onTransitionStart={this.props.onTransitionStart || this.props.navigationConfig.onTransitionStart} onTransitionEnd={(transition, lastTransition) => {
        const { navigationConfig, navigation } = this.props;
        const onTransitionEnd = this.props.onTransitionEnd || navigationConfig.onTransitionEnd;
        if (transition.navigation.state.isTransitioning) {
          navigation.dispatch(StackActions.completeTransition({
            key: navigation.state.key
          }));
        }
        onTransitionEnd && onTransitionEnd(transition, lastTransition);
      }} />
    );
  }

  _configureTransition = (transitionProps, prevTransitionProps) => {
    return {
      ...TransitionConfigs.getTransitionConfig(this.props.navigationConfig.transitionConfig, transitionProps, prevTransitionProps, this.props.navigationConfig.mode === 'modal').transitionSpec,
      useNativeDriver: !!NativeAnimatedModule
    };
  };

  _render = (transitionProps, lastTransitionProps) => {
    const { screenProps, navigationConfig } = this.props;
    console.log("-----ScreenProps------")
    console.log(screenProps)
    console.log("-----navigationConfig------")
    console.log(navigationConfig)
    if(navigationConfig.cardStyle.backgroundColor) {
        navigationConfig.cardStyle.backgroundColor = 'transparent';
    }

    return (
      <ImageBackground style={{height: Dimensions.get('window').height, width: Dimensions.get('window').width}} blurRadius={10} source={require('./_onboardingBgCover.png')}>
        <StackViewLayout {...navigationConfig} onGestureBegin={this.props.onGestureBegin} onGestureCanceled={this.props.onGestureCanceled} onGestureEnd={this.props.onGestureEnd} screenProps={screenProps} descriptors={this.props.descriptors} transitionProps={transitionProps} lastTransitionProps={lastTransitionProps} />
      </ImageBackground>
    );
  };
}

export default StackView;
