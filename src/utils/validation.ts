import { isNumber } from './numberUtils';
import { validateEmail } from './validateEmail';
import VALIDATION_MESSAGES from '../constants/validationMessages';

const validateUsername = (value: string) => {
    if (!value) return VALIDATION_MESSAGES.USERNAME_REQUIRED;
    return '';
};

const validateEmailField = (value: string) => {
    if (!value) return VALIDATION_MESSAGES.EMAIL_REQUIRED;
    if (!validateEmail(value)) return VALIDATION_MESSAGES.EMAIL_INVALID;
    return '';
};

const validatePassword = (value: string) => {
    if (!value) return VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    if (value.length < 8) return VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    if (!/[A-Z]/.test(value)) return VALIDATION_MESSAGES.PASSWORD_UPPERCASE_REQUIRED;
    if (!/[a-z]/.test(value)) return VALIDATION_MESSAGES.PASSWORD_LOWERCASE_REQUIRED;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return VALIDATION_MESSAGES.PASSWORD_SPECIALCHAR_REQUIRED;
    return '';
};

const validateLoginPassword = (value: string) => {
    if (!value) return VALIDATION_MESSAGES.PASSWORD_REQUIRED;
    if (value.length < 8) return VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    return '';
}

const loginValidation = (name: string, value: string): string => {
    if (name === 'usernameOrEmail') {
        return validateUsername(value);
    }

    if (name === 'password') {
        return validateLoginPassword(value);
    }

    return '';
}

const signUpValidation = (name: string, value: string, formData: any): string => {
    if (name === 'username') {
        return validateUsername(value);
    }

    if (name === 'email') {
        return validateEmailField(value);
    }

    if (name === 'password') {
        return validatePassword(value);
    }

    if (name === 'rePassword') {
        const error = validatePassword(value);
        if (error) return error;

        if (value !== formData.password) {
            return VALIDATION_MESSAGES.PASSWORD_MISMATCH;
        }
    }

    return '';
};

const forgotPasswordValidation = (name: string, value: string): string => {
    if (name === 'email') {
        return validateEmailField(value);
    }

    return '';
}

const verifyEmailValidation = (name: string, value: string): string => {
    if (name === 'validationCode') {
        if (!value) {
            return VALIDATION_MESSAGES.VALIDATION_CODE_REQUIRED;
        }

        if (!isNumber(value)) {
            return VALIDATION_MESSAGES.VALIDATION_CODE_INVALID;
        }

        if (value.length < 6) {
            return VALIDATION_MESSAGES.VALIDATION_CODE_MIN_LENGTH;
        }
    }

    return '';
}

const changePasswordValidation = (name: string, value: string, formData: any): string => {
    if (name === 'password') {
        return validatePassword(value);
    }

    if (name === 'rePassword') {
        const error = validatePassword(value);
        if (error) return error;

        if (value !== formData.password) {
            return VALIDATION_MESSAGES.PASSWORD_MISMATCH;
        }
    }

    return '';
}

const createLearningPathValidation = (name: string, value: string) => {
    if (name === 'title') {
        if (!value) {
            return VALIDATION_MESSAGES.LEARNING_PATH_NAME_REQUIRED;
        }
    }

    return '';
}

const tagFormValidation = (name: string, value: string) => {
    if (name === 'tagName') {
        if (!value) {
            return VALIDATION_MESSAGES.TAG_NAME_REQUIRED;
        }
    }

    return '';
}

export {
    loginValidation, signUpValidation, forgotPasswordValidation,
    verifyEmailValidation, changePasswordValidation,

    createLearningPathValidation, tagFormValidation
};