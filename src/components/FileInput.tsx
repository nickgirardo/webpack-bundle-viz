import { readFile, tryJsonParse } from '../util';

interface Props {
  onData: (arg0: any) => void,
  onError: (arg0: Error) => void,
}

export const FileInput = (props: Props) => {
  const loadFiles = (fl: FileList) => {
    // Right now we're only concerned with the first file
    // TODO consider allowing for multiple upload
    const file = fl[0]
    
    readFile(file)
      .then(tryJsonParse)
      .then(props.onData)
      .catch(props.onError);
  }

  return (
    <input
      type="file"
      onChange={ e => e.target.files && loadFiles(e.target.files) }
    />
  );
};
