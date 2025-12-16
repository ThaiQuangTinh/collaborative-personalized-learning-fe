import ERROR_MESSAGES_VI from "../constants/errorMessages";

export const getErroMessageByCode = (errorCode: string): string => {
    const message =
        ERROR_MESSAGES_VI[errorCode as keyof typeof ERROR_MESSAGES_VI] ||
        ERROR_MESSAGES_VI.DEFAULT;

    return message;
};