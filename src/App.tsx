import { FileInput } from './components/FileInput';

export default () => (
  <FileInput
    onData={ data => console.log(data) }
    onError={ err => console.error(err) }
  />
);
