import React from 'react';
import ButtonCancel from '../../ButtonCancel/ButtonCancel';
import ButtonSave from '../../ButtonSave/ButtonSave';
import AppModal from '../AppModal/AppModal';
import './ConfirmModal.css';

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onCancel,
    onConfirm
}) => {
    return (
        <AppModal isOpen={isOpen} title={title} onClose={onCancel}>
            <div className="confirm-modal-body">
                <p className="confirm-modal-message">{message}</p>

                <div className="confirm-modal-actions">
                    <ButtonCancel onClick={onCancel} />
                    <ButtonSave onClick={onConfirm} text='Xác nhận' icon='' />
                </div>
            </div>
        </AppModal>
    );
};

export default ConfirmModal;
