import React from 'react';
import { ResponsivePie } from '@nivo/pie'

const PieBuilder = ({ data, defs, fills, legends }) => {
  return (
  <ResponsivePie
    data={data}
    theme={{
      grid: {
        line: {
          stroke: "#e7e8ec",
          strokeWidth: 2
        }
      },
      legend: {
        text: {
          fontSize: 4,
          color: 'red'
        }
      }
    }}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    colors={{ scheme: 'nivo' }}
    borderWidth={1}
    borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
    radialLabelsSkipAngle={5}
    radialLabelsTextXOffset={6}
    radialLabelsTextColor="#333333"
    radialLabelsLinkOffset={0}
    radialLabelsLinkDiagonalLength={5}
    radialLabelsLinkHorizontalLength={5}
    radialLabelsLinkStrokeWidth={1}
    radialLabelsLinkColor={{ from: 'color' }}
    sortByValue={true}
    slicesLabelsSkipAngle={10}
    slicesLabelsTextColor="#333333"
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    defs={defs ? defs : []}
    fill={fills ? fills : []}
    legends={legends ? [
      {
        anchor: 'bottom',
        direction: 'row',
        translateY: 56,
        itemWidth: 80,
        itemHeight: 18,
        itemTextColor: '#000',
        itemTextSize: 5,
        symbolSize: 16,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#000'
            }
          }
        ]
      }
    ] : []}
  />
)};

export default PieBuilder;
