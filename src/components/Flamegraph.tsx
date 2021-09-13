import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// TODO ts-ignore here is because the d3-flame-graph library author didn't type
// defaultFlamegraphTooltip, I've sent him an issue on github
//@ts-ignore
import { flamegraph, defaultFlamegraphTooltip, StackFrame } from 'd3-flame-graph';
import 'd3-flame-graph/dist/d3-flamegraph.css';

import { fmtPercent } from '../util';

// TODO type data
interface Props {
  data: any,
  chunkName: string,
  // TODO type here
  onClick?: (arg0: any) => void,
}

export const Flamegraph = (props: Props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // If our ref is ready, attach our d3 rendering to it
    if (chartRef.current) {
      d3.select(chartRef.current)
        .datum(props.data.get(props.chunkName))
        .call(chart);
    }
  }, [chartRef]);

  // TODO using any here for now as the library doesn't give proper types
  const tip = defaultFlamegraphTooltip()
    .html((d: any) => {
      if (!d.parent)
        return `${d.data.name}: ${d.value}`;

      const percentParent = fmtPercent(d.value / d.parent.value);
      const percentChunk = fmtPercent(d.value / props.data.get(props.chunkName).value);
      return `${d.data.name}: ${d.value}, ${percentParent} of Parent, ${percentChunk} of ${props.chunkName}`;
    });

  const chart = flamegraph()
    .width(960)
    .cellHeight(18)
    // TODO prefers reduced motion should be considered here?
    .transitionDuration(50)
    .minFrameSize(5)
    // TODO ts-ignore here is because author doesn't have this overload for sort typed
    // I've sent him a PR to add it to index.d.ts
    //@ts-ignore
    .sort((a, b) => d3.descending(a.value, b.value))
    .title('')
    .selfValue(false)
    .tooltip(tip);

  if (props.onClick)
    chart.onClick(props.onClick);

  return <div ref={ chartRef } />;
};
