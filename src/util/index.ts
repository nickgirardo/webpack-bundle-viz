export function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();  
    fr.onload = () => {
      resolve(fr.result as string)
    };
    fr.onerror = reject;
    fr.readAsText(file);
  });
}

export function tryJsonParse(str: string) {
  return new Promise<any>((resolve, reject) => {
    try {
      const obj = JSON.parse(str);
      resolve(obj);
    } catch (err) {
      reject(err);
    }
  });
}


