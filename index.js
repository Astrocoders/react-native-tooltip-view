import React from 'react'
import { Platform, Dimensions, View, Modal, InteractionManager } from 'react-native'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { compose, pure, withStateHandlers, withHandlers } from 'recompose'

const WINDOW_DIMENSIONS = Dimensions.get('window')

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
  left: ${props => props.left};
  background-color: ${props => props.backgroundColor || '#fff'};
`

const Triangle = styled.View`
  position: absolute;
  bottom: ${props => props.bottom - props.size};
  left: ${props => props.left};
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

const OverlayTouchable = styled.TouchableWithoutFeedback`
  flex: 1;
`

const OverlayContentWrapper = styled.View`flex: 1;`

function TooltipOptionsMenu({
  isMenuActive,
  setMenuVisibility,
  showMenu,
  hideMenu,
  children,
  trigger,
  tooltipCoords,
  initPositioning,
  triangleProps,
  setWrapperRef,
  ...props
}) {
  return (
    <View onLayout={initPositioning} ref={ref => setWrapperRef(ref)}>
      <Modal visible={isMenuActive} onRequestClose={hideMenu} transparent>
        <OverlayTouchable onPress={hideMenu}>
          <OverlayContentWrapper>
            <Triangle size={10} backgroundColor={props.backgroundColor} {...triangleProps} {...tooltipCoords}/>
            <TooltipWrapper elevation={3} {...tooltipCoords} {...props}>
              {children(setMenuVisibility)}
            </TooltipWrapper>
          </OverlayContentWrapper>
        </OverlayTouchable>
      </Modal>
      {trigger(showMenu)}
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
  children: PropTypes.func.isRequired,
}

TooltipOptionsMenu.defaultProps = {
  triangleProps: {},
}

export default compose(
  withStateHandlers({
    isMenuActive: false,
    tooltipCoords: {},
    wrapperRef: {},
  }, {
    setMenuVisibility: () => value => ({ isMenuActive: value }),
    hideMenu: () => () => ({ isMenuActive: false }),
    showMenu: () => () => ({ isMenuActive: true }),
    setTooltipCoords: () => tooltipCoords => ({ tooltipCoords }),
    setWrapperRef: () => wrapperRef => ({ wrapperRef }),
  }),
  withHandlers({
    initPositioning: props => layoutEvent => {
      const { layout } = layoutEvent.nativeEvent

      // If the TooltipView is used within a tabs container or a navigator
      // with transitions we would get different values for pageX and pageY all the time.
      // So here we ensure we are going to get our sweet values only after those transitions have ended.
      InteractionManager.runAfterInteractions(() => {
        props.wrapperRef.measure((x, y, width, height, pageX, pageY) => {
          props.setTooltipCoords({
            bottom: WINDOW_DIMENSIONS.height - (layout.height + pageY) + Platform.select({android: 0, ios: 30}),
            left: pageX + layout.width - 10,
            width: WINDOW_DIMENSIONS.width - layout.x - pageX - 10,
          })
        })
      })
    },
  }),
  pure,
)(TooltipOptionsMenu)
