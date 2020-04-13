export const set = parameter => value => target => { target[parameter] = value; return target };
export const deepGet = (...parameters) => target => {
  const data = parameters.reduce((level, param) => level[param], target)
  return data;
};
export const deepSet = (...parameters) => value => target => {
  const copy = [...parameters];
  const last = copy.pop();  
  let set = target |> deepGet(...copy);
  set[last] = value;
  return target;
};
