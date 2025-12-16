import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import TextArea from "../../components/TextArea/TextArea";
import FormLabel from "../../components/FormLabel/FormLabel";
import toast from "react-hot-toast";

import userService from "../../services/userService";
import { Gender } from "../../constants/gender";
import { useAuth } from "../../hooks/useAuth";
import { getGenderVIE } from "../../utils/genderUtil";
import { UserInfo, mapUserInfoResponseToUserInfo, UpdateUserInfoRequest } from "../../types/user";
import { isValidVietnamPhoneNumber } from "../../utils/validatePhoneNumber";
import { validateEmail } from "../../utils/validateEmail";
import ChangePasswordModalContent from "../../components/Modal/ChangePasswordModalContent/ChangePasswordModalContent";
import useRouteNavigation from "../../hooks/useNavigation";
import { Storage } from "../../utils/storage";
import authService from "../../services/authService";
import ButtonCancel from "../../components/ButtonCancel/ButtonCancel";
import ButtonSave from "../../components/ButtonSave/ButtonSave";

const ProfilePage: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    email: "",
    fullname: "",
    avatarUrl: "",
    phone: "",
    address: "",
    gender: Gender.OTHER,
    emailVerified: false,
    createdAt: "",
  });
  const [editForm, setEditForm] = useState<Partial<UserInfo>>({});
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { updateUser, user } = useAuth();

  const { toVerifyEmailProfile } = useRouteNavigation();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userService.getUserInfo();
        if (response.data) {
          const mappedUser = mapUserInfoResponseToUserInfo(response.data);
          setUserInfo(mappedUser);
          setEditForm({
            fullname: mappedUser.fullname,
            email: mappedUser.email,
            phone: mappedUser.phone,
            gender: mappedUser.gender,
            address: mappedUser.address,
          });
        }
      } catch (err) {
        toast.error("Có lỗi khi lấy thông tin người dùng!");
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditField = <K extends keyof UserInfo>(field: K, value: UserInfo[K] | string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));

    // Clear error for field on change
    if (field === "email") setErrors((prev) => ({ ...prev, email: undefined }));
    if (field === "phone") setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  // Validation on blur
  const handleBlur = (field: "email" | "phone") => {
    if (field === "email") {
      if (!editForm.email || !validateEmail(editForm.email)) {
        setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
      }
    }
    if (field === "phone" && editForm.phone) {
      if (!isValidVietnamPhoneNumber(editForm.phone)) {
        setErrors((prev) => ({ ...prev, phone: "Số điện thoại không hợp lệ" }));
      }
    }
  };

  // Avatar handlers
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarError(false);
    const reader = new FileReader();
    reader.onload = () => setPreviewAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };
  const handleAvatarError = () => setAvatarError(true);

  const getGenderToSave = (gender: string | Gender): Gender => {
    if (gender === Gender.MALE || gender === Gender.FEMALE || gender === Gender.OTHER) return gender;
    switch (gender) {
      case "Nam": return Gender.MALE;
      case "Nữ": return Gender.FEMALE;
      default: return Gender.OTHER;
    }
  };

  const hasFormChanged = (): boolean => {
    if (!editForm) return false;
    return (
      editForm.fullname !== userInfo.fullname ||
      editForm.email !== userInfo.email ||
      editForm.phone !== userInfo.phone ||
      editForm.address !== userInfo.address ||
      getGenderToSave(editForm.gender || Gender.OTHER) !== userInfo.gender ||
      !!avatarFile
    );
  };

  const handleSave = async () => {
    // Validate before submit
    const newErrors: typeof errors = {};
    if (!editForm.email || !validateEmail(editForm.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (editForm.phone && !isValidVietnamPhoneNumber(editForm.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!hasFormChanged()) {
      setIsEditMode(false);
      return;
    }

    try {
      // Update avatar if changed
      if (avatarFile) {
        const res = await userService.updateAvatar({ file: avatarFile });
        if (res.success && res.data) {
          updateUser({ avatarUrl: res.data.avatarUrl });
        }
      }

      // Update user info
      const updateData: UpdateUserInfoRequest = {
        fullname: editForm.fullname || "",
        email: editForm.email || "",
        phone: editForm.phone || "",
        address: editForm.address || "",
        gender: getGenderToSave(editForm.gender || Gender.OTHER),
      };

      const response = await userService.updateUserInfo(updateData);
      if (response.success && response.data) {
        const updatedUser = mapUserInfoResponseToUserInfo(response.data);
        setUserInfo(updatedUser);
        setEditForm({
          fullname: updatedUser.fullname,
          email: updatedUser.email,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          address: updatedUser.address,
        });
        updateUser({
          fullName: updatedUser.fullname,
          email: updatedUser.email,
          verifiedEmail: updatedUser.emailVerified
        });

        // Lưu email & userId vào storage để verify email
        Storage.set("email", updatedUser.email);
        Storage.set("userId", updatedUser.userId);
        Storage.set("isSendCodeToverified", true);

        toast.success("Cập nhật thông tin cá nhân thành công!");
        setIsEditMode(false);
        setPreviewAvatar(null);
        setAvatarFile(null);
      }
    } catch {
      toast.error("Có lỗi khi cập nhật thông tin cá nhân!");
    }
  };

  const handleCancel = () => {
    setEditForm({
      fullname: userInfo.fullname,
      email: userInfo.email,
      phone: userInfo.phone,
      gender: userInfo.gender,
      address: userInfo.address,
    });
    setPreviewAvatar(null);
    setAvatarFile(null);
    setAvatarError(false);
    setErrors({});
    setIsEditMode(false);
  };

  const handleVerifyEmail = () => {
    if (!user?.userId) return;

    authService.sendCodeToVerifyEmail({ userId: user?.userId });
    toVerifyEmailProfile();
  };

  const getInitial = (name: string) => (name ? name.charAt(0).toUpperCase() : "U");

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            {(previewAvatar || (userInfo.avatarUrl && !avatarError)) ? (
              <img
                src={previewAvatar || userInfo.avatarUrl}
                alt={userInfo.fullname || "Avatar"}
                className="avatar-image"
                onError={handleAvatarError}
              />
            ) : (
              <div className="avatar-placeholder">{getInitial(userInfo.fullname)}</div>
            )}
            {isEditMode && (
              <label className="edit-avatar-btn">
                <i className="fa-solid fa-pen"></i>
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
              </label>
            )}
          </div>
          <div className="user-info">
            <h2 className="user-full-name">{userInfo.fullname || "Chưa có tên"}</h2>
            <div className="email-container">
              {userInfo.emailVerified ? (
                <span className="email-verified-badge" title="Email đã được xác minh">
                  <i className="fa-solid fa-circle-check"></i>
                </span>
              ) : (
                <span className="email-not-verified-badge" title="Email chưa được xác minh">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </span>
              )}
              <span className="user-email">{userInfo.email}</span>
            </div>
            {!userInfo.emailVerified && (
              <div className="email-verify-prompt">
                <span className="verify-text">Email chưa được xác minh. </span>
                <button className="verify-link" onClick={handleVerifyEmail}>
                  Xác minh ngay
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="section">
            <h3 className="section-title">Thông tin cá nhân</h3>
            <div className="info-grid">
              <div className="info-item">
                <FormLabel text="Họ và tên" className="info-label" />
                <Input
                  value={editForm.fullname || ""}
                  readOnly={!isEditMode}
                  onChange={(e) => handleEditField("fullname", e.target.value)}
                  focusColor="#3498db"
                  placeholder={isEditMode ? "Nhập họ và tên" : ""}
                />
              </div>
              <div className="info-item">
                <FormLabel text="Email" required className="info-label" />
                <Input
                  value={editForm.email || ""}
                  readOnly={!isEditMode}
                  type="email"
                  focusColor="#3498db"
                  onChange={(e) => handleEditField("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  error={errors.email}
                  placeholder={isEditMode ? "Nhập email" : ""}
                />
              </div>
              <div className="info-item">
                <FormLabel text="Số điện thoại" className="info-label" />
                <Input
                  value={editForm.phone || ""}
                  readOnly={!isEditMode}
                  focusColor="#3498db"
                  onChange={(e) => handleEditField("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  error={errors.phone}
                  placeholder={isEditMode ? "Nhập số điện thoại" : ""}
                />
              </div>
              <div className="info-item">
                <FormLabel text="Giới tính" className="info-label" />
                {!isEditMode ? (
                  <Input value={getGenderVIE(editForm.gender || Gender.OTHER)} readOnly focusColor="#3498db" />
                ) : (
                  <select
                    className="form-input form-select"
                    value={editForm.gender || Gender.OTHER}
                    onChange={(e) => handleEditField("gender", e.target.value as Gender)}
                  >
                    <option value={Gender.MALE}>Nam</option>
                    <option value={Gender.FEMALE}>Nữ</option>
                    <option value={Gender.OTHER}>Khác</option>
                  </select>
                )}
              </div>
              <div className="info-item full-width">
                <FormLabel text="Địa chỉ" className="info-label" />
                <TextArea
                  value={editForm.address || ""}
                  readOnly={!isEditMode}
                  rows={3}
                  focusColor="#3498db"
                  onChange={(e) => handleEditField("address", e.target.value)}
                  placeholder={isEditMode ? "Nhập địa chỉ" : ""}
                />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            {!isEditMode ? (
              <>
                <Button
                  text="Chỉnh sửa thông tin"
                  icon="fa-regular fa-pen-to-square"
                  backgroundColor="#3498db"
                  onClick={() => setIsEditMode(true)}
                  fullWidth={false} />

                <Button
                  text="Đổi mật khẩu"
                  icon="fa-solid fa-lock"
                  textColor="#3498db"
                  border="2px solid #3498db"
                  onClick={() => { setIsPasswordModalOpen(true) }}
                  variant="secondary"
                  fullWidth={false} />
              </>
            ) : (
              <>
                <ButtonCancel onClick={handleCancel} />
                <ButtonSave text="Lưu thay đổi" onClick={handleSave} />
              </>
            )}
          </div>
        </div>
      </div>

      <ChangePasswordModalContent
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;