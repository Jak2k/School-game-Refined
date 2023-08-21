export type ServerHTML = () => string;

export type Init = () => void;

export type ServerMeta = () => {
  title: string;
  description: string;
};
