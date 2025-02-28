export interface IInputProps {
	label: string;
	id?: string;
	type?: string;
	value: string;
	placeholder?: string;
	onChange: (value: string) => void;
  }