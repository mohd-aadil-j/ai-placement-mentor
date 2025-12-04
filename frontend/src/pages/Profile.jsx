import React, { useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';
import { useAuth } from '../context/AuthContext';
import { getUserAvatar, getInitialAvatar, getColorFromString } from '../utils/identicon';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', targetRole: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await profileApi.getProfile();
        setForm({
          name: data.name || '',
          email: data.email || '',
          targetRole: data.targetRole || '',
          avatarUrl: data.avatarUrl || '',
          leetcodeUsername: data.leetcodeUsername || '',
          githubUsername: data.githubUsername || '',
          leetcodeData: data.leetcodeData || {},
          githubData: data.githubData || {},
        });
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onPwdChange = (e) => setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(''); setMessage('');
    try {
      const res = await profileApi.uploadAvatar(file);
      setForm((prev) => ({ ...prev, avatarUrl: res.avatarUrl || res.user?.avatarUrl || '' }));
      updateUser(res.user);
      setMessage('Profile image updated');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const syncLeetCode = async () => {
    if (!form.leetcodeUsername) return setError('Set a LeetCode username first');
    setLoading(true); setError(''); setMessage('');
    try {
      const res = await profileApi.syncLeetCode();
      setMessage('LeetCode stats synced and saved');
      setForm((prev) => ({ ...prev, leetcodeData: res.leetcodeData || {} }));
      if (res.user) updateUser(res.user);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to sync LeetCode data');
    } finally { setLoading(false); }
  };

  const syncGitHub = async () => {
    if (!form.githubUsername) return setError('Set a GitHub username first');
    setLoading(true); setError(''); setMessage('');
    try {
      const res = await profileApi.syncGitHub();
      setMessage('GitHub stats synced and saved');
      setForm((prev) => ({ ...prev, githubData: res.githubData || {} }));
      if (res.user) updateUser(res.user);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to sync GitHub data');
    } finally { setLoading(false); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setMessage('');
    try {
      const res = await profileApi.updateProfile({
        name: form.name,
        targetRole: form.targetRole,
        leetcodeUsername: form.leetcodeUsername || '',
        githubUsername: form.githubUsername || '',
      });
      updateUser(res.user);
      setMessage('Profile updated successfully');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdSaving(true); setError(''); setMessage('');
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setError('New password and confirm do not match');
      setPwdSaving(false);
      return;
    }
    try {
      await profileApi.changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      setMessage('Password updated successfully');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={getUserAvatar({ email: form.email, avatarUrl: form.avatarUrl, id: user?.id })} 
            alt="Avatar" 
            className="w-16 h-16 rounded-full object-cover border-2" 
          />
          <label className="px-3 py-2 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-800">
            {uploading ? 'Uploading...' : 'Change Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </label>
        </div>
        {message && <div className="bg-green-100 text-green-800 px-3 py-2 rounded mb-3">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input name="name" value={form.name} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input name="email" value={form.email} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Target Role</label>
            <input name="targetRole" value={form.targetRole} onChange={onChange} className="w-full border rounded px-3 py-2" placeholder="e.g., Full Stack Developer" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">LeetCode Username</label>
            <div className="flex gap-2">
              <input name="leetcodeUsername" value={form.leetcodeUsername || ''} onChange={onChange} className="flex-1 border rounded px-3 py-2" placeholder="e.g., leetcode_user" />
              <button type="button" onClick={syncLeetCode} className="px-3 py-2 bg-indigo-600 text-white rounded">Sync</button>
            </div>
            {form.leetcodeData && (
              <div className="text-sm text-gray-700 mt-2">Easy: {form.leetcodeData.easyCount || 0} · Medium: {form.leetcodeData.mediumCount || 0} · Hard: {form.leetcodeData.hardCount || 0}</div>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">GitHub Username</label>
            <div className="flex gap-2">
              <input name="githubUsername" value={form.githubUsername || ''} onChange={onChange} className="flex-1 border rounded px-3 py-2" placeholder="e.g., github_user" />
              <button type="button" onClick={syncGitHub} className="px-3 py-2 bg-gray-700 text-white rounded">Sync</button>
            </div>
            {form.githubData && (
              <div className="text-sm text-gray-700 mt-2">Repos: {form.githubData.repos || 0} · Stars: {form.githubData.stars || 0} · Followers: {form.githubData.followers || 0}</div>
            )}
          </div>
          <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400">{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Current Password</label>
            <input type="password" name="currentPassword" value={pwdForm.currentPassword} onChange={onPwdChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">New Password</label>
              <input type="password" name="newPassword" value={pwdForm.newPassword} onChange={onPwdChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={pwdForm.confirmPassword} onChange={onPwdChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
          <button type="submit" disabled={pwdSaving} className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:bg-gray-400">{pwdSaving ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
