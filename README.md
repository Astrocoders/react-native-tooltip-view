# react-native-tooltip-view
A dead simple tooltip view that you can populate yourself

## Installation
```
$ yarn add react-native-tooltip-view
```

## Demo
![alt text](https://github.com/Astrocoders/react-native-tooltip-view/raw/master/view.gif "React Native ToolTipView")

## Usage

```js
import TooltipView from 'react-native-tooltip-view'
...

function Foo() {
  return (
    <TooltipView
      // `trigger` is what you want to be tapped by the user to toggle the tooltip visibility
      trigger={onPress => <RoundedIcon name="plus" size={20} roundSize={30} onPress={onPress} />}
      // you can pass an optional width for the tooltip
      width={200}
      // and also an optional background
      backgroundColor="#f9f9f9"
      // `triangleStyle`={{}} to style the little triangle
      // and any valid View props
    >
      {setMenuVisibility => (
        // anything you want in here
      )}
    </TooltipView>
  )
}
```
