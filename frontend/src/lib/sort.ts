export type Candidate = {
  label: string;
};

export function getLastName (name: string) {
  const [, ...lastNames] = name.split(' ');
  return lastNames.join(' ');
}

export function sortByLastName (left: Candidate, right: Candidate) {
  return getLastName(left.label).localeCompare(getLastName(right.label));
}
