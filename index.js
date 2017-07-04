import React from 'react'
import { Dimensions, View } from 'react-native'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { compose, pure, withState, withProps } from 'recompose'

const { width: windowWidth } = Dimensions.get('window')

const TooltipWrapper = styled.View.attrs({
  style: {
    shadowOffset: { height: 1.8 },
  },
})`
  width: ${props => props.width};
  position: absolute;
  shadowRadius: 1.62;
  shadowOpacity: 0.1845;
  bottom: ${props => props.bottom};
  background-color: ${props => props.backgroundColor || '#fff'};
`

const Triangle = styled.View`
  position: absolute;
  shadowRadius: 5;
  shadowOpacity: 0.1845;
  left: 20;
  top: -10;
  width: ${props => props.size};
  height: ${props => props.size};
  background-color: transparent;
  border-style: solid;
  border-top-width: ${props => props.size};
  border-right-width: ${props => props.size};
  border-bottom-width: 0;
  border-left-width: ${props => props.size};
  border-top-color: ${props => props.backgroundColor || '#fff'};
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
`

function TooltipOptionsMenu({
  isMenuActive,
  setMenuVisibility,
  children,
  trigger,
  onLayout,
  tooltipCoords,
  initPositioning,
  triangleProps,
  ...props,
}){
  return (
    <View style={{position: 'relative'}} onLayout={initPositioning}>
      {trigger(() => setMenuVisibility(!isMenuActive))}
      {
        isMenuActive ? ([
          <Triangle size={10} elevetion={2} backgroundColor={props.backgroundColor} {...triangleProps}/>,
          <TooltipWrapper elevation={3} {...tooltipCoords} {...props}>
            {children}
          </TooltipWrapper>,
        ]) : null
      }
    </View>
  )
}

TooltipOptionsMenu.propTypes = {
  isMenuActive: PropTypes.bool.isRequired,
  tooltipCoords: PropTypes.object.isRequired,
  initPositioning: PropTypes.func.isRequired,
  setMenuVisibility: PropTypes.func.isRequired,
  trigger: PropTypes.func.isRequired,
  triangleProps: PropTypes.object,
  children: PropTypes.oneOf(PropTypes.element, PropTypes.arrayOf(PropTypes.element)),
}

TooltipOptionsMenu.defaultProps = {
  triangleProps: {},
}

export default compose(
  withState('isMenuActive', 'setMenuVisibility', false),
  withState('layout', 'setLayout', {}),
  withState('tooltipCoords', 'setTooltipCoords', {}),
  withProps(props => ({
    initPositioning(layoutEvent){
      const layout = layoutEvent.nativeEvent.layout

      props.setTooltipCoords({
        bottom: layout.height + 10,
        width: windowWidth - layout.x - 10,
      })
    },
  })),
  pure,
)(TooltipOptionsMenu)
