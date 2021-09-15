import { useState, useEffect } from 'react';

import { StackFrame } from 'd3-flame-graph';

import { FileInput } from './components/FileInput';
import { Flamegraph } from './components/Flamegraph';
import { ChunkSelect } from './components/ChunkSelect';

export default () => {
  const [bundle, setBundle] = useState<Map<string, StackFrame> | null>(null);
  const [currentChunk, setCurrentChunk] = useState<string | null>(null);

  useEffect(() => {
    if (bundle) {
      // MultiChunk bundles have more than 2 chunks
      // This might sound strange, but if there are 2 chunks'
      // One is "All Chunks" and the other is the same, but by its file name
      const isMultiChunk = bundle.size > 2;

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
  const showChunkSelect = bundle && currentChunk && (bundle.size > 2);

  return (
    <>
      { showFlameGraph &&
        <Flamegraph
          data={ bundle }
          chunkName={ currentChunk }
          onClick={ a => console.log(a) }
        />
      }
      { showChunkSelect &&
        <ChunkSelect
          value={ currentChunk }
          onChange={ setCurrentChunk }
          bundle={ bundle }
        />
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
