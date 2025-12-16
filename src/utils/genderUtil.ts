import { Gender } from "../constants/gender";

export const getGenderVIE = (gender: string): string => {
    switch (gender) {
        case Gender.MALE:
            return "Nam";
        case Gender.FEMALE:
            return "Nữ";
        default:
            return "Khác";
    }
};
