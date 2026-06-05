'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/endpoints';
import styles from './settings.module.css';
import adminStyles from '../admin.module.css';

export default function AdminSettingsPage() {
  const locale = useLocale();
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'telegram'>('profile');

  // Loading & Action states
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Profile fields state
  const [profileForm, setProfileForm] = useState({
    nameAr: '',
    nameEn: '',
    email: '',
    phone: '',
  });

  // Password fields state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  // System Settings state
  const [settingsForm, setSettingsForm] = useState({
    emailProvider: 'none',
    googleClientId: '',
    googleClientSecret: '',
    googleRefreshToken: '',
    gmailUser: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpFromEmail: '',
    smtpFromName: 'NwamCheap',
    telegramBotToken: '',
    telegramChatId: '',
  });

  // Fetch initial profile and configurations
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        setLoading(true);
        // Load admin profile info
        const profile = await api.get<any>(API_ENDPOINTS.users.profile, token);
        if (profile) {
          setProfileForm({
            nameAr: profile.name?.ar || '',
            nameEn: profile.name?.en || '',
            email: profile.email || '',
            phone: profile.phone || '',
          });
        }

        // Load system settings
        const settings = await api.get<any>(API_ENDPOINTS.settings, token);
        if (settings) {
          setSettingsForm({
            emailProvider: settings.emailProvider || 'none',
            googleClientId: settings.googleClientId || '',
            googleClientSecret: settings.googleClientSecret || '',
            googleRefreshToken: settings.googleRefreshToken || '',
            gmailUser: settings.gmailUser || '',
            smtpHost: settings.smtpHost || '',
            smtpPort: settings.smtpPort || 587,
            smtpUsername: settings.smtpUsername || '',
            smtpPassword: settings.smtpPassword || '',
            smtpFromEmail: settings.smtpFromEmail || '',
            smtpFromName: settings.smtpFromName || 'NwamCheap',
            telegramBotToken: settings.telegramBotToken || '',
            telegramChatId: settings.telegramChatId || '',
          });
        }
      } catch (err: any) {
        showToast(err.message || 'Error loading settings', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Submit profile details change
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!profileForm.nameAr || !profileForm.nameEn || !profileForm.email) {
      showToast(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.put(API_ENDPOINTS.users.update, {
        name: { ar: profileForm.nameAr, en: profileForm.nameEn },
        email: profileForm.email,
        phone: profileForm.phone,
      }, token);
      showToast(locale === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Submit password change
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      showToast(locale === 'ar' ? 'يرجى تعبئة حقول كلمة المرور' : 'Please fill in all password fields', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 12) {
      showToast(locale === 'ar' ? 'يجب أن لا تقل كلمة المرور الجديدة عن 12 حرفًا' : 'New password must be at least 12 characters long', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      showToast(locale === 'ar' ? 'كلمتا المرور الجديدتان غير متطابقتين' : 'New passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.put(API_ENDPOINTS.users.changePassword, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }, token);
      showToast(locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully!', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) {
      showToast(err.message || 'Error changing password', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Submit system settings configurations
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      const updated = await api.put<any>(API_ENDPOINTS.settings, settingsForm, token);
      if (updated) {
        setSettingsForm({
          emailProvider: updated.emailProvider || 'none',
          googleClientId: updated.googleClientId || '',
          googleClientSecret: updated.googleClientSecret || '',
          googleRefreshToken: updated.googleRefreshToken || '',
          gmailUser: updated.gmailUser || '',
          smtpHost: updated.smtpHost || '',
          smtpPort: updated.smtpPort || 587,
          smtpUsername: updated.smtpUsername || '',
          smtpPassword: updated.smtpPassword || '',
          smtpFromEmail: updated.smtpFromEmail || '',
          smtpFromName: updated.smtpFromName || 'NwamCheap',
          telegramBotToken: updated.telegramBotToken || '',
          telegramChatId: updated.telegramChatId || '',
        });
      }
      showToast(locale === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error saving settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isAr = locale === 'ar';

  return (
    <div className="page-enter">
      {/* Toast popup */}
      {toast && (
        <div className={`${styles.toast} ${
          toast.type === 'success' ? styles.toastSuccess : toast.type === 'error' ? styles.toastError : styles.toastInfo
        }`}>
          <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className={adminStyles.adminPageHeader}>
        <div className={styles.sectionHeader}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
            {isAr ? 'إعدادات النظام والسرية' : 'Settings & Security'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)', margin: 0 }}>
            {isAr ? 'إدارة الملف الشخصي، خوادم البريد، وإشعارات تيليجرام بنظام آمن' : 'Manage administrative profile, email services, and Telegram notifications securely'}
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className={styles.tabsList}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 {isAr ? 'الملف الشخصي وكلمة المرور' : 'Profile & Password'}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'email' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('email')}
        >
          ✉️ {isAr ? 'خادم البريد (SMTP / OAuth2)' : 'Email Server (SMTP / OAuth2)'}
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'telegram' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('telegram')}
        >
          📢 {isAr ? 'إشعارات تيليجرام' : 'Telegram Bot Notifications'}
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        {/* TAB 1: Profile & Password */}
        {activeTab === 'profile' && (
          <div className={styles.tabPanel}>
            <div className={styles.formGrid || adminStyles.formGrid}>
              {/* Profile Details Form */}
              <form onSubmit={handleUpdateProfile} className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>{isAr ? 'تفاصيل الحساب' : 'Account Details'}</h3>
                  <p className={styles.sectionDesc}>{isAr ? 'تحديث معلومات المسؤول الشخصية' : 'Update admin account profile details'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="input-group">
                    <label>{isAr ? 'الاسم (بالعربية)' : 'Name (Arabic)'} *</label>
                    <input
                      className="input"
                      type="text"
                      required
                      value={profileForm.nameAr}
                      onChange={(e) => setProfileForm({ ...profileForm, nameAr: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'الاسم (بالإنجليزية)' : 'Name (English)'} *</label>
                    <input
                      className="input"
                      type="text"
                      required
                      value={profileForm.nameEn}
                      onChange={(e) => setProfileForm({ ...profileForm, nameEn: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'البريد الإلكتروني' : 'Email Address'} *</label>
                    <input
                      className="input"
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                    <input
                      className="input"
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 8 }}>
                    {loading ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                  </button>
                </div>
              </form>

              {/* Password Change Form */}
              <form onSubmit={handleUpdatePassword} className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>{isAr ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
                  <p className={styles.sectionDesc}>{isAr ? 'تغيير كلمة المرور بشكل آمن (الحد الأدنى 12 حرفًا)' : 'Change account password securely (Min 12 characters)'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="input-group">
                    <label>{isAr ? 'كلمة المرور الحالية' : 'Current Password'} *</label>
                    <div className={styles.inputWithAction}>
                      <input
                        className="input"
                        type={showPassword.current ? 'text' : 'password'}
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        className={styles.inputActionBtn}
                        onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      >
                        {showPassword.current ? '👁️' : '🔒'}
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'كلمة المرور الجديدة' : 'New Password'} *</label>
                    <div className={styles.inputWithAction}>
                      <input
                        className="input"
                        type={showPassword.new ? 'text' : 'password'}
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        className={styles.inputActionBtn}
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      >
                        {showPassword.new ? '👁️' : '🔒'}
                      </button>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                      {isAr ? 'يجب أن تحتوي كلمة المرور على 12 حرفًا على الأقل' : 'Must be at least 12 characters long'}
                    </span>
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'} *</label>
                    <div className={styles.inputWithAction}>
                      <input
                        className="input"
                        type={showPassword.confirm ? 'text' : 'password'}
                        required
                        value={passwordForm.confirmNewPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        className={styles.inputActionBtn}
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      >
                        {showPassword.confirm ? '👁️' : '🔒'}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 8 }}>
                    {loading ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'تحديث كلمة المرور' : 'Update Password')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: Email Configuration */}
        {activeTab === 'email' && (
          <div className={styles.tabPanel}>
            <form onSubmit={handleSaveSettings} className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>{isAr ? 'إعدادات خادم البريد المرسل' : 'Outgoing Mail Server Settings'}</h3>
                <p className={styles.sectionDesc}>
                  {isAr ? 'اختر وتكوين خادم البريد لرسائل تأكيد الطلبات، التنبيهات وإعادة التعيين' : 'Configure email provider for orders validation, notifications, and password resets'}
                </p>
              </div>

              {/* Provider Selection Cards */}
              <div className={styles.providerCards}>
                <div
                  className={`${styles.providerCard} ${settingsForm.emailProvider === 'none' ? styles.providerCardActive : ''}`}
                  onClick={() => setSettingsForm({ ...settingsForm, emailProvider: 'none' })}
                >
                  <span className={styles.providerIcon}>🚫</span>
                  <span className={styles.providerTitle}>{isAr ? 'تعطيل البريد' : 'Disabled'}</span>
                  <span className={styles.providerDesc}>{isAr ? 'لن يتم إرسال أي رسائل بريد للنظام' : 'Do not send system emails'}</span>
                </div>

                <div
                  className={`${styles.providerCard} ${settingsForm.emailProvider === 'google' ? styles.providerCardActive : ''}`}
                  onClick={() => setSettingsForm({ ...settingsForm, emailProvider: 'google' })}
                >
                  <span className={styles.providerIcon}>📧</span>
                  <span className={styles.providerTitle}>Gmail API (OAuth2)</span>
                  <span className={styles.providerDesc}>{isAr ? 'ربط حساب Google Gmail بشكل آمن' : 'Secure integration via Google OAuth2 credentials'}</span>
                </div>

                <div
                  className={`${styles.providerCard} ${settingsForm.emailProvider === 'smtp' ? styles.providerCardActive : ''}`}
                  onClick={() => setSettingsForm({ ...settingsForm, emailProvider: 'smtp' })}
                >
                  <span className={styles.providerIcon}>⚙️</span>
                  <span className={styles.providerTitle}>Standard SMTP</span>
                  <span className={styles.providerDesc}>{isAr ? 'استخدام خادم SMTP تقليدي' : 'Use third-party custom SMTP email servers'}</span>
                </div>
              </div>

              {/* Dynamic Form Content */}
              {settingsForm.emailProvider === 'google' && (
                <div className={adminStyles.formGrid} style={{ marginBottom: 24 }}>
                  <div className="input-group">
                    <label>{isAr ? 'عنوان Gmail المستخدم' : 'Gmail User Email'} *</label>
                    <input
                      className="input"
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={settingsForm.gmailUser}
                      onChange={(e) => setSettingsForm({ ...settingsForm, gmailUser: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Google Client ID *</label>
                    <input
                      className="input"
                      type="text"
                      required
                      value={settingsForm.googleClientId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleClientId: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Google Client Secret *</label>
                    <input
                      className="input"
                      type="password"
                      required
                      placeholder={settingsForm.googleClientSecret ? '••••••••' : ''}
                      value={settingsForm.googleClientSecret}
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleClientSecret: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Google Refresh Token *</label>
                    <input
                      className="input"
                      type="password"
                      required
                      placeholder={settingsForm.googleRefreshToken ? '••••••••' : ''}
                      value={settingsForm.googleRefreshToken}
                      onChange={(e) => setSettingsForm({ ...settingsForm, googleRefreshToken: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'البريد الإلكتروني للمرسل' : 'From Email'}</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="NwamCheap <example@gmail.com>"
                      value={settingsForm.smtpFromEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smtpFromEmail: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'اسم المرسل' : 'From Name'}</label>
                    <input
                      className="input"
                      type="text"
                      value={settingsForm.smtpFromName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smtpFromName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {settingsForm.emailProvider === 'smtp' && (
                <div className={adminStyles.formGrid} style={{ marginBottom: 24 }}>
                  <div className="input-group">
                    <label>SMTP Host *</label>
                    <input
                      className="input"
                      type="text"
                      required
                      placeholder="smtp.mailgun.org"
                      value={settingsForm.smtpHost}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smtpHost: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>SMTP Port *</label>
                    <input
                      className="input"
                      type="number"
                      required
                      value={settingsForm.smtpPort}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smtpPort: parseInt(e.target.value) || 587 })}
                    />
                  </div>
                  <div className="input-group">
                    <label>SMTP Username *</label>
                    <input
                      className="input"
                      type="text"
                      required
                      value={settingsForm.smtpUsername}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smtpUsername: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>SMTP Password *</label>
                    <input
                      className="input"
                      type="password"
                      required
                      placeholder={settingsForm.smtpPassword ? '••••••••' : ''}
                      value={settingsForm.smtpPassword}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smtpPassword: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'البريد الإلكتروني للمرسل' : 'From Email'}</label>
                    <input
                      className="input"
                      type="email"
                      value={settingsForm.smtpFromEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smtpFromEmail: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>{isAr ? 'اسم المرسل' : 'From Name'}</label>
                    <input
                      className="input"
                      type="text"
                      value={settingsForm.smtpFromName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, smtpFromName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ إعدادات البريد' : 'Save Email Configuration')}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Telegram Bot */}
        {activeTab === 'telegram' && (
          <div className={styles.tabPanel}>
            <form onSubmit={handleSaveSettings} className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>{isAr ? 'تكامل بوت تيليجرام' : 'Telegram Bot Integration'}</h3>
                <p className={styles.sectionDesc}>
                  {isAr ? 'استقبل تنبيهات دفع المبيعات وطلبات المشترين مباشرة على مجموعة أو حساب تيليجرام' : 'Receive instant transaction notifications, uploads, and order logs on your Telegram group or channel'}
                </p>
              </div>

              <div className={adminStyles.formGrid} style={{ marginBottom: 24 }}>
                <div className="input-group">
                  <label>Telegram Bot Token *</label>
                  <input
                    className="input"
                    type="password"
                    placeholder={settingsForm.telegramBotToken ? '••••••••' : '1234567890:ABCDefGhIJK...'}
                    value={settingsForm.telegramBotToken}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telegramBotToken: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Telegram Chat ID *</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="-100123456789"
                    value={settingsForm.telegramChatId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telegramChatId: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ إعدادات تيليجرام' : 'Save Telegram Configuration')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
