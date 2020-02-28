import React from 'react';
import { ResponsiveBubble } from '@nivo/circle-packing';

const BubbleBuilder = ({ root, value, enableLabel }) => {
  return (
    <ResponsiveBubble
      root={root}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      identity="name"
      value={value}
      colors={{ scheme: 'nivo' }}
      padding={6}
      enableLabel={enableLabel}
      labelTextColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
      labelSkipRadius={0}
      borderWidth={2}
      borderColor={{ from: 'color' }}
      defs={[
        {
          id: 'lines',
          type: 'patternLines',
          background: 'none',
          color: 'inherit',
          rotation: -45,
          lineWidth: 5,
          spacing: 8
        }
      ]}
      fill={[{ match: { depth: 1 }, id: 'lines' }]}
      animate={true}
      motionStiffness={90}
      motionDamping={12}
    />
  );
};

export default BubbleBuilder;
