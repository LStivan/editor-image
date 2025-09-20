export interface HeaderProps {
	toggleAllColumnsSave?: (shouldSave: boolean) => void;
	areAllColumnsSaved?: boolean;
	onToggleAllChange?: (checked: boolean) => void;
}
