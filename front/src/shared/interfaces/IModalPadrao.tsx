export interface IModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
  }