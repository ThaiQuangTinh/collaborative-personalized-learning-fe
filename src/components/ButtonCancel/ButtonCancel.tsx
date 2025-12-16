import Button from "../Button/Button";

interface ButtonCancelProps {
    text?: any,
    size?: "small" | "medium" | "large" | undefined,
    fullWidth?: boolean,
    icon?: string,
    onClick: () => void
}

const ButtonCancel = ({
    text = "Hủy",
    size = "small",
    fullWidth = false,
    icon = "fa-solid fa-xmark",
    onClick
}: ButtonCancelProps) => {

    return (
        <Button
            text={text}
            variant='secondary'
            type='button'
            icon={icon}
            size={size}
            fullWidth={fullWidth}
            onClick={onClick}
            border='1px solid #ccc'
            backgroundColor='#f8f9fa'
            textColor='#514848'
        />
    )
};

export default ButtonCancel;