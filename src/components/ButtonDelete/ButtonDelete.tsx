import Button from "../Button/Button";

interface ButtonDeleteProps {
    text?: string,
    icon?: string,
    size?: "small" | "medium" | "large" | undefined,
    fullWidth?: boolean,
    disabled?: boolean,
    onClick: () => void
}

const ButtonDelete = ({
    text = "Xóa",
    icon = "fa-solid fa-trash-can",
    size = 'small',
    fullWidth = false,
    disabled = false,
    onClick,
}: ButtonDeleteProps) => {

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
            backgroundColor='#fd6d78'
            disabled={disabled}
        />
    )
}

export default ButtonDelete;