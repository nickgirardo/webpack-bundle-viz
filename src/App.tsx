import { useState } from 'react';

import { FileInput } from './components/FileInput';
import { Flamegraph } from './components/Flamegraph';

export default () => {
  const [bundle, setBundle] = useState<any | null>(null);

  return (
    <>
      { bundle &&
        <Flamegraph data={ bundle } onClick={ a => console.log(a) } />
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
