import Button from "../Button/Button";

interface ButtonSaveProps {
    text?: string,
    icon?: string,
    size?: "small" | "medium" | "large" | undefined,
    fullWidth?: boolean,
    disabled?: boolean,
    onClick: () => void
}

const ButtonSave = ({
    text = "Lưu",
    icon = "fa-solid fa-floppy-disk",
    size = 'small',
    fullWidth = false,
    disabled = false,
    onClick,
}: ButtonSaveProps) => {

    return (
        <Button
            text={text}
            variant='secondary'
            type='button'
            icon={icon}
            size={size}
            fullWidth={false}
            onClick={onClick}
            border='1px solid #ccc'
            textColor='#fff'
            backgroundColor='#4361ee'
            disabled={disabled}
        />
    )
}

export default ButtonSave;