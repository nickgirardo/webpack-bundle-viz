import { useState } from 'react';

import { StackFrame } from 'd3-flame-graph';

import { FileInput } from './components/FileInput';
import { Flamegraph } from './components/Flamegraph';

export default () => {
  const [bundle, setBundle] = useState<Map<string, StackFrame> | null>(null);

  return (
    <>
      { bundle &&
        <Flamegraph
          data={ bundle }
          chunkName='All Chunks'
          onClick={ a => console.log(a) }
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
