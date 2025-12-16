import React, { useState } from "react";
import "./TagModalContent.css";

import { Tag } from "../../../types/tag";
import Button from "../../Button/Button";
import FormLabel from "../../FormLabel/FormLabel";
import Input from "../../Input/Input";
import tagService from "../../../services/tagService";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { getErroMessageByCode } from "../../../utils/handleError";
import learningPathTagService from "../../../services/learningPathTagService";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ButtonCancel from "../../ButtonCancel/ButtonCancel";
import ButtonSave from "../../ButtonSave/ButtonSave";
import ButtonDelete from "../../ButtonDelete/ButtonDelete";

interface TagModalContentProps {
    mode: "create" | "edit";
    initialTag: Tag | null;
    unusedAvailableTags?: Tag[];
    onSave: (tag: Tag) => void;
    onDelete?: (tag: Tag) => void;
    onSelect?: (tag: Tag) => void;
    onCancel: () => void;
}

const TagModalContent: React.FC<TagModalContentProps> = ({
    mode,
    initialTag,
    unusedAvailableTags = [],
    onSave,
    onDelete,
    onSelect,
    onCancel,
}) => {
    const { pathId } = useParams<{ pathId: string }>();
    const [tagName, setTagName] = useState(initialTag?.tagName ?? "");
    const [textColor, setTextColor] = useState(initialTag?.textColor ?? "#4361ee");
    const [errMessage, setErrMessage] = useState("");

    /** Validate */
    const validate = () => {
        if (!tagName.trim()) {
            setErrMessage("Tên nhãn không được để trống");
            return false;
        }

        return true;
    };

    /** Save handler */
    const handleSave = async () => {
        if (!validate()) return;

        setErrMessage('');

        try {
            if (mode === "create") {
                const res = await tagService.createTag({ tagName, textColor });

                if (res.success && res.data) {
                    onSave({
                        id: res.data.tagId,
                        tagName: res.data.tagName,
                        textColor: res.data.textColor,
                    });
                }
            } else {
                if (!initialTag) return;

                const res = await tagService.updateTag(initialTag.id, { tagName, textColor });

                if (res.success && res.data) {
                    onSave({
                        id: res.data.tagId,
                        tagName: res.data.tagName,
                        textColor: res.data.textColor,
                    });
                }
            }
        } catch (errRes: any) {
            setErrMessage(getErroMessageByCode(errRes.error.code));
        }
    };

    /** Delete */
    const handleDelete = async () => {
        if (!initialTag) return;

        try {
            const res = await tagService.deleteTag(initialTag.id);
            if (res.success) {
                onDelete?.(initialTag);
            }
        } catch (errRes: any) {
            setErrMessage(getErroMessageByCode(errRes.error.code));
        }
    };

    /** Select available tag */
    const handleSelectAvailable = async (tag: Tag) => {
        try {
            if (!tag || !pathId) return;

            const res = await learningPathTagService.createLearningPathTag([{ pathId, tagId: tag.id }]);
            if (res.success) {
                onSelect?.(tag);
            }
        } catch (errRes: any) {
            setErrMessage(getErroMessageByCode(errRes.error.code));
            toast.error("Thêm tag thất bại");
        }
    };

    return (
        <div>
            {mode === "create" && unusedAvailableTags.length > 0 && (
                <>
                    <FormLabel text="Chọn từ nhãn có sẵn" />
                    <div className="available-tags-container">
                        {unusedAvailableTags.map((tag) => (
                            <div
                                key={tag.id}
                                className="available-tag"
                                style={{
                                    backgroundColor: `${tag.textColor}20`,
                                    color: tag.textColor
                                }}
                                onClick={() => handleSelectAvailable(tag)}
                            >
                                <span className="tag-color" style={{ backgroundColor: tag.textColor }} />
                                {tag.tagName}
                            </div>
                        ))}
                    </div>

                    <div className="divider"><span>hoặc tạo mới</span></div>
                </>
            )}

            {errMessage && <ErrorMessage message={errMessage} />}

            {/* NAME */}
            <div className="form-group">
                <FormLabel text="Tên nhãn" required />
                <Input
                    placeholder="Nhập tên nhãn"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    focusColor="#4361ee"
                />
            </div>

            {/* COLOR */}
            <div className="form-group">
                <FormLabel text="Màu sắc" required />
                <div className="color-input-container">
                    <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="color-input"
                    />
                    <span
                        className="color-preview"
                        style={{
                            backgroundColor: textColor,
                            color: "#fff"
                        }}
                    >
                        {textColor}
                    </span>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="modal-actions">
                <ButtonCancel onClick={onCancel} />

                {mode === "edit" && onDelete && (
                    <ButtonDelete
                        onClick={handleDelete}
                    />
                )}

                <ButtonSave
                    text={mode === "create" ? "Tạo nhãn" : "Lưu"}
                    icon={mode === "create" ? "fa-solid fa-plus" : "fa-solid fa-floppy-disk"}
                    onClick={handleSave}
                    fullWidth={false} />
            </div>
        </div>
    );
};

export default TagModalContent;