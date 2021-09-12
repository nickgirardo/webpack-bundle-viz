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

// TODO will move these types elsewhere
type Module = {
  path: string[],
  name: string,
  size: number,
  type: string,
};

type Chunk = {
  id: number,
  name: string,
  modules: Module[],
};

type Bundle = {
  chunks: Chunk[],
  allModules: Module[],
};

function getModuleInfo(mod: any): Module {
  function makePath(name: string): string[] {
    // Most module names do not have spaces
    // they seem to only be present in dynamic modules
    const [pathPart, ...extra] = name.split(' ');

    // slice(1) discards the './' which prepends every path
    // filtering removes any path parts with terminal /
    const path = pathPart.split('/').slice(1).filter(str => str.length);

    if (extra.length) {
      return path.concat(extra.join(' '));
    } else {
      return path;
    }
  }

  return {
    path: makePath(mod.name),
    name: mod.name,
    type: mod.moduleType,
    size: mod.size,
  };
}

// TODO right now there isn't really any checking for structure going on here
// I should add some checks so that malformed bundles throw
export function parseBundle(rawBundle: any): Bundle {
  const chunks = rawBundle.chunks.map((chunk: any): any => ({
    id: chunk.id,
    name: chunk.files[0],
    modules: chunk.modules.map(getModuleInfo),
  }));

  const bundle: Bundle = {
    chunks,
    allModules: rawBundle.modules.map(getModuleInfo),
  };

  return bundle;
}


