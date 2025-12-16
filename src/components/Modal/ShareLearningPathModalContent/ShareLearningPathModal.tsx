import React, { useState, useEffect } from "react";
import AppModal from "../AppModal/AppModal";
import "./ShareLearningPathModal.css";
import { SharePathPermission } from "../../../constants/sharePermission";
import Input from "../../Input/Input";
import Button from "../../Button/Button";
import learningPathService from "../../../services/learningPathService";
import toast from "react-hot-toast";

interface ShareLearningPathModalProps {
    isOpen: boolean;
    onClose: () => void;
    pathId: string;
}

const ShareLearningPathModal: React.FC<ShareLearningPathModalProps> = ({
    isOpen,
    onClose,
    pathId
}) => {
    const [permission, setPermission] = useState<SharePathPermission>(SharePathPermission.VIEW);
    const [shareLink, setShareLink] = useState("");

    const handlePermissionChange = (perm: SharePathPermission) => {
        setPermission(perm);
        getDataShareLink(perm)
            .then(data => {
                if (data?.sharePermission && data.shareUrl) {
                    toast.success("Thay đổi quyền chia sẻ thành công!");
                    setShareLink(data.shareUrl);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        toast.success("Đã copy link!");
    };

    const getDataShareLink = async (perm: SharePathPermission) => {
        if (!pathId) return;

        const res = await learningPathService.
            getLinkToShareLearningPath(pathId, { sharePermission: perm });

        return res.data;
    }

    useEffect(() => {
        if (!isOpen || !pathId) return;

        const fetchShareLink = async () => {
            const data = await getDataShareLink(SharePathPermission.VIEW);
            if (data?.sharePermission && data.shareUrl) {
                setShareLink(data.shareUrl);
                setPermission(data.sharePermission);
            }
        };

        fetchShareLink();
    }, [isOpen, pathId]);

    return (
        <AppModal isOpen={isOpen} onClose={onClose} title="Chia sẻ lộ trình">
            <div className="share-modal">

                <div className="share-section">
                    <label className="label">Quyền chia sẻ:</label>

                    <div className="permission-options">
                        <label>
                            <input
                                type="radio"
                                checked={permission === SharePathPermission.VIEW}
                                onChange={() => handlePermissionChange(SharePathPermission.VIEW)}
                            />
                            <span className="share-per-options">Xem</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                checked={permission === SharePathPermission.CLONE}
                                onChange={() => handlePermissionChange(SharePathPermission.CLONE)}
                            />
                            <span className="share-per-options">Sao chép</span>
                        </label>
                    </div>
                </div>

                <div className="share-section">
                    <label className="label">Link chia sẻ:</label>
                    <div className="share-link-box">
                        <Input
                            value={shareLink}
                            readOnly
                            focusColor="#4361ee"
                            padding="2px 14px"
                        />
                        <Button
                            fullWidth={false}
                            text="Copy"
                            backgroundColor="#4361ee"
                            margin="0"
                            onClick={handleCopy}
                        />
                    </div>
                </div>

            </div>
        </AppModal>
    );
};

export default ShareLearningPathModal;
