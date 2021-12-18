const SOMEONE_ELSE = 'Quelqu\'un d\'autre';

export function getLastName(name: string) {
  const [ firstName, ...lastNames ] = name.split(' ');
  return lastNames.join(' ');
}

export function sortByLastName(left, right) {
  if (right.label === SOMEONE_ELSE || left.label == SOMEONE_ELSE) {
    return left.label === right.label ? 0 : 1;
  } else if (left.label === SOMEONE_ELSE) {
    return left.label === right.label ? 0 : -1;
  } else {
    return getLastName(left.label).localeCompare(getLastName(right.label));
  }
}
