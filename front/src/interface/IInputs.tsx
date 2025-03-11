export interface IInputProps {
  label?: string;
  id?: string;
  type?: string;
  value: string;
  placeholder?: string;
  className?: String;
  disabled?: boolean;
  onChange: (value: string) => void;
}
