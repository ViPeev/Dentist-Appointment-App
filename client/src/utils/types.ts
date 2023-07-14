export interface childrenType {
  children: React.ReactNode;
}

export interface tabType {
  name: string;
  href: string;
}

export interface fieldType {
  name: string;
  title: string;
  type: string;
}

export interface roles {
  1: "admin";
  2: "dentist";
  3: "patient";
}

export interface registerRole {
  id: number;
  name: string;
};

export interface selectProps {
  selectHandler: (value: registerRole) => void;
  selected: registerRole;
  values:registerRole[]
}
