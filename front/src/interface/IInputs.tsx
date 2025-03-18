import { Ref } from "react";

export interface IInputProps {
  label?: string;
  id?: string;
  type?: string;
  ref?: Ref<HTMLInputElement>;
  value?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}
