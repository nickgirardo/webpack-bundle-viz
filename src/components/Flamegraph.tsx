import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// TODO ts-ignore here is because the d3-flame-graph library author didn't type
// defaultFlamegraphTooltip, I've sent him an issue on github
//@ts-ignore
import { flamegraph, defaultFlamegraphTooltip, StackFrame } from 'd3-flame-graph';
import 'd3-flame-graph/dist/d3-flamegraph.css';

import { fmtSize, fmtPercent } from '../util/fmt';

interface Props {
  data: Map<string, StackFrame>,
  chunkName: string,
  // TODO type here
  onClick?: (arg0: any) => void,
}

export const Flamegraph = (props: Props) => {
  const chartRef = useRef(null);

  const chunk = props.data.get(props.chunkName);

  useEffect(() => {
    // If our ref is ready, attach our d3 rendering to it
    if (chartRef.current) {
      d3.select(chartRef.current)
        .datum(chunk)
        .call(chart);

      return () => { chart.destroy(); };
    }
  }, [chunk, chartRef]);

  // TODO using any here for now as the library doesn't give proper types
  const tip = defaultFlamegraphTooltip()
    .html((d: any) => {
      const size = fmtSize(d.data.value);

      if (!d.parent)
        return `${d.data.name}: ${size}`;

      const percentParent = fmtPercent(d.data.value / d.parent.data.value);

      if (!chunk)
        return `${d.data.name}: ${size}, ${percentParent} of Parent`;

      const percentChunk = fmtPercent(d.data.value / chunk.value);
      // Showing the whole chunk name can be way too much
      const chunkName = props.chunkName === 'All Chunks' ? 'All Chunks' : 'Chunk';

      return `${d.data.name}: ${size}, ${percentParent} of Parent, ${percentChunk} of ${chunkName}`;
    });

  const chart = flamegraph()
    .width(960)
    .cellHeight(18)
    .inverted(true)
    // TODO prefers reduced motion should be considered here?
    .transitionDuration(50)
    .minFrameSize(5)
    // TODO ts-ignore here is because author doesn't have this overload for sort typed
    // I've sent him a PR to add it to index.d.ts
    //@ts-ignore
    .sort((a, b) => d3.descending(a.value, b.value))
    .selfValue(false)
    .tooltip(tip);

  if (props.onClick)
    chart.onClick(props.onClick);

  return <div ref={ chartRef } />;
};
