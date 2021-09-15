import { useState, useEffect } from 'react';

import { StackFrame } from 'd3-flame-graph';

import { fmtSize } from './util/fmt';

import { FileInput } from './components/FileInput';
import { Flamegraph } from './components/Flamegraph';

export default () => {
  const [isMultiChunk, setIsMultiChunk] = useState<boolean>(false);
  const [bundle, setBundle] = useState<Map<string, StackFrame> | null>(null);
  const [currentChunk, setCurrentChunk] = useState<string | null>(null);

  useEffect(() => {
    if (bundle) {
      // MultiChunk bundles have more than 2 chunks
      // This might sound strange, but if there are 2 chunks'
      // One is "All Chunks" and the other is the same, but by its file name
      const isMultiChunk = bundle.size > 2;
      setIsMultiChunk(isMultiChunk);

      if (isMultiChunk) {
        setCurrentChunk('All Chunks');
      } else {
        // If we only have one chunk, might as well show the chunk name
        const chunkName = Array.from(bundle.keys()).find(n => n !== 'All Chunks');
        setCurrentChunk(chunkName || 'All Chunks');
      }

      return () => { setCurrentChunk(null) };
    }
  }, [bundle]);

  const showFlameGraph = bundle && currentChunk && bundle.has(currentChunk);

  return (
    <>
      { showFlameGraph &&
        <Flamegraph
          data={ bundle }
          chunkName={ currentChunk }
          onClick={ a => console.log(a) }
        />
      }
      { isMultiChunk && bundle && currentChunk &&
        <select
          onChange={ ev => setCurrentChunk(ev.target.value) }
          value={ currentChunk }
        >
          { Array.from(bundle.entries()).map(([name, chunk]) =>
            <option
              value={ name }
              key={ name }
            >
              { name } ({ fmtSize(chunk.value) })
            </option>
          )}
        </select>
      }
      <FileInput
        onData={ data => setBundle(data) }
        onError={ err => console.error(err) }
      />
      { bundle &&
        <pre>{ JSON.stringify(bundle, null, 2) }</pre>
      }
    </>
  );
};
