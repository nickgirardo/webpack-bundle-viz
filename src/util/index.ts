import { StackFrame } from 'd3-flame-graph';

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

    // Add any text after the space to the last part of the path
    if (extra.length) {
      path[path.length-1] += ' ' + extra.join(' ');
    }

    return path;
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

export function bundleToStacks(bundle: Bundle): Map<string, StackFrame> {
  const ret = new Map<string, StackFrame>();
  ret.set('All Chunks', modulesToStacks(bundle.allModules, 'All Chunks'));

  for (const chunk of bundle.chunks) {
    ret.set(chunk.name, modulesToStacks(chunk.modules, chunk.name));
  }

  return ret;
}

// TODO might want a more expressive return type
export function modulesToStacks(modules: Module[], name: string): StackFrame {
  return {
    name,
    value: modules.reduce((acc, mod) => acc + mod.size, 0),
    children: _modulesToStacks(modules, 0)
  };
}

type GroupedModules = { [key in string]: Module[] };

function groupByPath(modules: Module[], depth: number): GroupedModules {
  const result: GroupedModules = {};
  for (const mod of modules) {
    if (depth >= mod.path.length)
      continue;

    // This check is a bit more verbose and less performant than I'd like
    // I took this approach because if there were keys like 'hasOwnProperty'
    // things would break :(
    if (Object.keys(result).includes(mod.path[depth])) {
      result[mod.path[depth]].push(mod);
    } else {
      result[mod.path[depth]] = [mod];
    }
  }
  return result;
}

function _modulesToStacks(modules: Module[], depth: number): StackFrame[] {
  const groupedChildren = groupByPath(modules, depth);
  if (Object.keys(groupedChildren).length === 0)
    return [];

  return Object.entries(groupedChildren).map(([name, modules]) => ({
    name,
    value: modules.reduce((acc: number, mod: Module) => acc + mod.size, 0),
    children: _modulesToStacks(modules, depth + 1),
  }));
}
