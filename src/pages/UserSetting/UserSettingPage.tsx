import React, { useState, useEffect } from 'react';
import './UserSettingPage.css';
import Button from '../../components/Button/Button';
import { Language } from '../../constants/language';
import { Theme } from '../../constants/theme';
import toast from 'react-hot-toast';
import userSettingsService from '../../services/userSettingsService';
import { UpdateUserSettingsRequest, UserSettingsResponse } from '../../types/userSettings';
import ConfirmModal from '../../components/Modal/ConfirmModal/ConfirmModal';
import { TruckOutlined } from '@ant-design/icons';

interface UserSettings {
  theme: Theme;
  language: Language;
  notifications: {
    enabled: boolean;
    lessonReminder: number;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

const UserSettingPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: Theme.LIGHT,
    language: Language.VI,
    notifications: {
      enabled: true,
      lessonReminder: 60,
      emailNotifications: true,
      pushNotifications: true
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [showConfirmDefaultSettings, setShowConfirmDefaultSettings] = useState<boolean>(false);

  // Load user settings on component mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  // Function to load user settings from API
  const loadUserSettings = async () => {
    setLoading(true);
    try {
      const res = await userSettingsService.getUserSettings();
      if (res.success && res.data) {
        const apiSettings = res.data;
        // Map API response to local state
        const mappedSettings: UserSettings = {
          theme: apiSettings.theme,
          language: apiSettings.language,
          notifications: {
            enabled: apiSettings.notificationEnabled,
            lessonReminder: apiSettings.lessonReminderMinutes,
            emailNotifications: apiSettings.emailNotificationEnabled,
            pushNotifications: apiSettings.pushNotificationEnabled
          }
        };
        setSettings(mappedSettings);

        // Apply theme immediately
        applyTheme(apiSettings.theme);
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi tải cài đặt!");
    } finally {
      setLoading(false);
    }
  };

  // Function to apply theme
  const applyTheme = (theme: Theme) => {
    if (theme === Theme.DARK) {
      document.body.classList.add('dark-theme');
    } else if (theme === Theme.LIGHT) {
      document.body.classList.remove('dark-theme');
    } else if (theme === Theme.AUTO) {
      // Auto theme - follow system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  };

  // Map local settings to API request format
  const mapToApiRequest = (): UpdateUserSettingsRequest => {
    return {
      theme: settings.theme,
      language: settings.language,
      notificationEnabled: settings.notifications.enabled,
      lessonReminderMinutes: settings.notifications.lessonReminder,
      emailNotificationEnabled: settings.notifications.emailNotifications,
      pushNotificationEnabled: settings.notifications.pushNotifications
    };
  };

  // Map API response to local settings
  const mapFromApiResponse = (apiSettings: UserSettingsResponse): UserSettings => {
    return {
      theme: apiSettings.theme,
      language: apiSettings.language,
      notifications: {
        enabled: apiSettings.notificationEnabled,
        lessonReminder: apiSettings.lessonReminderMinutes,
        emailNotifications: apiSettings.emailNotificationEnabled,
        pushNotifications: apiSettings.pushNotificationEnabled
      }
    };
  };

  const handleThemeChange = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleLanguageChange = (language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const handleNotificationToggle = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, enabled }
    }));
  };

  const handleLessonReminderChange = (minutes: number) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, lessonReminder: minutes }
    }));
  };

  const handleEmailNotificationsToggle = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, emailNotifications: enabled }
    }));
  };

  const handlePushNotificationsToggle = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, pushNotifications: enabled }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const apiData = mapToApiRequest();
      const res = await userSettingsService.updateUserSettings(apiData);

      if (res.success && res.data) {
        // Update local state with response
        const updatedSettings = mapFromApiResponse(res.data);
        setSettings(updatedSettings);

        // Apply theme
        applyTheme(updatedSettings.theme);

        // Show success message
        toast.success("Cập nhật cài đặt thành công!");
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi lưu cài đặt!");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    try {
      const res = await userSettingsService.setDefaultUserSettings();
      if (res.success && res.data) {
        const defaultSettings = mapFromApiResponse(res.data);
        setSettings(defaultSettings);

        // Apply theme
        applyTheme(defaultSettings.theme);

        setShowConfirmDefaultSettings(false);
        toast.success("Đã đặt lại cài đặt mặc định!");
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi đặt lại mặc định!");
    }
  };

  const lessonReminderOptions = [
    { value: 15, label: '15 phút' },
    { value: 30, label: '30 phút' },
    { value: 60, label: '1 giờ' },
    { value: 120, label: '2 giờ' },
    { value: 1440, label: '1 ngày' },
    { value: 2880, label: '2 ngày' }
  ];

  if (loading) {
    return (
      <div className="settings-container">
        <div className="settings-card">
          <div className="loading-message">Đang tải cài đặt...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-section">
          <h3 className="section-title">Giao Diện</h3>

          <div className="settings-options">
            <div className="option-group">
              <label className="option-label">Chế độ hiển thị</label>
              <div className="theme-options">
                <button
                  className={`theme-option ${settings.theme === Theme.LIGHT ? 'active' : ''}`}
                  onClick={() => handleThemeChange(Theme.LIGHT)}
                >
                  <div className="theme-preview light-theme">
                    <div className="preview-header"></div>
                    <div className="preview-content"></div>
                  </div>
                  <span>Sáng</span>
                </button>

                <button
                  className={`theme-option ${settings.theme === Theme.DARK ? 'active' : ''}`}
                  onClick={() => handleThemeChange(Theme.DARK)}
                >
                  <div className="theme-preview dark-theme">
                    <div className="preview-header"></div>
                    <div className="preview-content"></div>
                  </div>
                  <span>Tối</span>
                </button>

                <button
                  className={`theme-option ${settings.theme === Theme.AUTO ? 'active' : ''}`}
                  onClick={() => handleThemeChange(Theme.AUTO)}
                >
                  <div className="theme-preview auto-theme">
                    <div className="preview-header"></div>
                    <div className="preview-content"></div>
                  </div>
                  <span>Tự động</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="section-title">Ngôn Ngữ</h3>

          <div className="settings-options">
            <div className="option-group">
              <label className="option-label">Ngôn ngữ hiển thị</label>
              <div className="language-options">
                <button
                  className={`language-option ${settings.language === Language.VI ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(Language.VI)}
                >
                  <span className="flag">🇻🇳</span>
                  <span>Tiếng Việt</span>
                </button>

                <button
                  className={`language-option ${settings.language === Language.EN ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(Language.EN)}
                >
                  <span className="flag">🇺🇸</span>
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="section-title">Thông Báo</h3>

          <div className="settings-options">
            <div className="option-group">
              <div className="toggle-option">
                <div className="toggle-label">
                  <span className="label-text">Bật thông báo</span>
                  <span className="label-description">Nhận thông báo về bài học, sự kiện và cập nhật mới</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.enabled}
                    onChange={(e) => handleNotificationToggle(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {settings.notifications.enabled && (
                <>
                  <div className="option-subgroup">
                    <label className="option-label">Nhắc nhở bài học đến hạn</label>
                    <select
                      className="form-select"
                      value={settings.notifications.lessonReminder}
                      onChange={(e) => handleLessonReminderChange(Number(e.target.value))}
                    >
                      {lessonReminderOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="option-description">
                      Gửi thông báo trước khi bài học đến hạn
                    </span>
                  </div>

                  <div className="toggle-option">
                    <div className="toggle-label">
                      <span className="label-text">Thông báo qua email</span>
                      <span className="label-description">Nhận thông báo qua địa chỉ email đã đăng ký</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleEmailNotificationsToggle(e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-option">
                    <div className="toggle-label">
                      <span className="label-text">Thông báo đẩy</span>
                      <span className="label-description">Hiển thị thông báo trên trình duyệt và thiết bị</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handlePushNotificationsToggle(e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <Button
            text="Đặt lại mặc định"
            variant="secondary"
            icon="fa-solid fa-xmark"
            size="medium"
            fullWidth={false}
            onClick={() => { setShowConfirmDefaultSettings(true) }}
            border="1px solid #ccc"
            backgroundColor="#f8f9fa"
            textColor="#514848"
            disabled={loading || saving} />

          <Button
            text={saving ? "Đang lưu..." : "Lưu cài đặt"}
            variant="primary"
            onClick={handleSaveSettings}
            backgroundColor="#3498db"
            fullWidth={false}
            disabled={loading || saving} />
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmDefaultSettings}
        title="Xác nhận đặt lại cài đặt mặc định"
        message="Bạn có chắc chắn muốn đặt lại mặc định tất cả cài đặt?"
        onCancel={() => setShowConfirmDefaultSettings(false)}
        onConfirm={() => {
          handleResetToDefault();
        }}
      />
    </div>
  );
};

export default UserSettingPage;