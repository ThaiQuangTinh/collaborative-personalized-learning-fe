import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useForm from "../../../hooks/useForm";
import learningPathService from "../../../services/learningPathService";
import { LearningPath, mapLearningPathResponseToLearningPath } from "../../../types/learningPath";
import { getErroMessageByCode } from "../../../utils/handleError";
import { createLearningPathValidation } from "../../../utils/validation";
import ButtonCancel from "../../ButtonCancel/ButtonCancel";
import ButtonSave from "../../ButtonSave/ButtonSave";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import FormLabel from "../../FormLabel/FormLabel";
import Input from "../../Input/Input";
import TextArea from "../../TextArea/TextArea";
import AppModal from "../AppModal/AppModal";
import "./CreateLearningPathModalContent.css";

interface CreateLearningPathModalContentProps {
    isOpen: boolean,
    onCreateLearningPath: (data: LearningPath) => void;
    onClose: () => void;
}

const CreateLearningPathModalContent: React.FC<CreateLearningPathModalContentProps> = ({
    isOpen = false,
    onCreateLearningPath,
    onClose,
}) => {
    const { formData, errors, handleChange, handleBlur, setFormErrors } = useForm({
        title: '',
        description: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const handleClearForm = () => {
        formData.title = '';
        formData.description = '';
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const { title, description } = formData;
            const response = await learningPathService.createLearningPath({
                title, description
            });

            if (response.success && response.data) {
                onCreateLearningPath(mapLearningPathResponseToLearningPath(response.data));
                handleClearForm();
                onClose();
                toast.success("Tạo lộ trình thành công!");
            }
        }
        catch (errRes: any) {
            setErrMessage(getErroMessageByCode(errRes.error.code));
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            handleClearForm();
            setErrMessage('');
            setFormErrors({});
        }
    }, [isOpen]);

    return (
        <AppModal isOpen={isOpen} title='Tạo lộ trình học tập' onClose={onClose}>
            <div className="create-path-wrapper">
                <form className="create-path-form">
                    {errMessage && (<ErrorMessage message={errMessage} />)}

                    <FormLabel text="Tên lộ trình" required />
                    <Input
                        placeholder="Nhập tên lộ trình..."
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={(e) => {
                            handleBlur(e, createLearningPathValidation)
                        }}
                        error={errors.title}
                        focusColor="#4361ee"
                        padding="10px 14px"
                    />

                    <FormLabel text="Mô tả" />
                    <TextArea
                        placeholder="Nhập mô tả cho lộ trình..."
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        height="120px"
                        border="1px solid #ddd"
                        focusColor="#4361ee"
                    />

                    <div className="modal-actions">
                        <ButtonCancel onClick={onClose} />

                        <ButtonSave
                            onClick={handleSubmit}
                            disabled={!formData.title.trim()}
                            text='Tạo'
                            icon='fa-solid fa-plus'
                        />
                    </div>
                </form>
            </div>
        </AppModal>
    );
};

export default CreateLearningPathModalContent;