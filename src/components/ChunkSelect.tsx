import { StackFrame } from 'd3-flame-graph';

import { fmtSize } from '../util/fmt';

interface Props {
  value: string,
  onChange: (arg0: string) => void,
  bundle: Map<string, StackFrame>,
}

export const ChunkSelect = (props: Props) => {
  return (
    <select
      onChange={ ev => props.onChange(ev.target.value) }
      value={ props.value }
    >
      { Array.from(props.bundle.entries()).map(([name, chunk]) =>
        <option
          value={ name }
          key={ name }
        >
          { name } ({ fmtSize(chunk.value) })
        </option>
      )}
    </select>
  );
};
