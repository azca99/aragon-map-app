import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/theme';

const { width, height } = Dimensions.get('window');

// A simple repeatable topographic-like pattern using SVG paths
const TopoPattern = ({ color = colors.primary, opacity = 0.05 }) => {
  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', opacity }]} pointerEvents="none">
      <Svg width={width * 2} height={height * 2} viewBox="0 0 800 800">
        <Path
          d="M0 100 C150 150, 250 50, 400 100 S650 50, 800 100 
             M0 200 C180 250, 220 150, 400 200 S620 150, 800 200 
             M0 300 C160 350, 260 250, 400 300 S640 250, 800 300 
             M0 400 C140 450, 240 350, 400 400 S660 350, 800 400 
             M0 500 C170 550, 230 450, 400 500 S630 450, 800 500
             M0 600 C150 650, 250 550, 400 600 S650 550, 800 600
             M0 700 C180 750, 220 650, 400 700 S620 650, 800 700
             
             M100 0 C150 150, 50 250, 100 400 S50 650, 100 800
             M200 0 C250 180, 150 220, 200 400 S150 620, 200 800
             M300 0 C350 160, 250 260, 300 400 S250 640, 300 800
             M400 0 C450 140, 350 240, 400 400 S350 660, 400 800
             M500 0 C550 170, 450 230, 500 400 S450 630, 500 800
             M600 0 C650 150, 550 250, 600 400 S550 650, 600 800
             M700 0 C750 180, 650 220, 700 400 S650 620, 700 800"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d="M0 150 C120 180, 280 120, 400 150 S680 120, 800 150 
             M0 250 C190 280, 210 220, 400 250 S610 220, 800 250 
             M0 350 C150 380, 250 320, 400 350 S650 320, 800 350 
             M0 450 C130 480, 270 420, 400 450 S670 420, 800 450 
             M0 550 C180 580, 220 520, 400 550 S620 520, 800 550
             M0 650 C140 680, 260 620, 400 650 S660 620, 800 650
             M0 750 C170 780, 230 720, 400 750 S630 720, 800 750"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
        />
      </Svg>
    </View>
  );
};

export default TopoPattern;