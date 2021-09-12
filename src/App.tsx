import { useState } from 'react';

import { FileInput } from './components/FileInput';

export default () => {
  const [bundle, setBundle] = useState<any | null>(null);

  return (
    <>
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
