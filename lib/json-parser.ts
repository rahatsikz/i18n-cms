export interface ParsedField {
  key: string;
  path: string;
  type: "string" | "array" | "object";
  value?: any;
  inputType?: "input" | "textarea";
  children?: ParsedField[];
  arrayItemStructure?: ParsedField[];
}

export function parseJsonToFields(
  obj: any,
  parentPath = "",
  parentKey = ""
): ParsedField[] {
  const fields: ParsedField[] = [];

  const traverse = (current: any, path: string, key: string) => {
    if (typeof current === "string") {
      fields.push({
        key,
        path,
        type: "string",
        value: current,
        inputType: current.length > 50 ? "textarea" : "input",
      });
    } else if (Array.isArray(current)) {
      let arrayItemStructure: ParsedField[] = [];

      if (current.length > 0) {
        const firstItem = current[0];
        if (typeof firstItem === "object" && firstItem !== null) {
          // recursively parse array of objects
          arrayItemStructure = parseJsonToFields(firstItem, `${path}[]`);
        }
      }

      fields.push({
        key,
        path,
        type: "array",
        value: current,
        arrayItemStructure,
      });
    } else if (typeof current === "object" && current !== null) {
      const children: ParsedField[] = [];

      Object.entries(current).forEach(([childKey, childValue]) => {
        const childPath = path ? `${path}.${childKey}` : childKey;
        const childFields = parseJsonToFields(
          { [childKey]: childValue },
          childPath,
          childKey
        );
        children.push(...childFields);
      });

      fields.push({
        key,
        path,
        type: "object",
        children,
      });
    }
  };

  if (parentPath && parentKey) {
    traverse(obj[parentKey], parentPath, parentKey);
  } else {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      traverse(value, currentPath, key);
    });
  }

  return fields;
}

export function flattenJsonToKeyValue(
  obj: any,
  prefix = ""
): Record<string, any> {
  const result: Record<string, any> = {};

  const flatten = (current: any, path: string) => {
    if (typeof current === "string") {
      result[path] = current;
    } else if (Array.isArray(current)) {
      result[path] = current;
    } else if (typeof current === "object" && current !== null) {
      Object.entries(current).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        flatten(value, newPath);
      });
    }
  };

  flatten(obj, prefix);
  return result;
}
