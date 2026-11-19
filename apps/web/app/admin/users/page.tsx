'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  X,
  Check,
  Key,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Shield,
  Sparkles,
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isSystem: boolean;
}

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  roleId: string;
  role: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  // Active / Logged in user info
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Add Form state
  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit Form state
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    roleId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    password: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes, meRes] = await Promise.all([
        fetch('/api/v1/users', { credentials: 'include' }).then((r) => r.json()),
        fetch('/api/v1/users/roles', { credentials: 'include' }).then((r) => r.json()),
        fetch('/api/v1/auth/me', { credentials: 'include' }).then((r) => r.json()).catch(() => ({})),
      ]);

      if (usersRes.success && usersRes.data) {
        setUsers(usersRes.data);
      }
      if (rolesRes.success && rolesRes.data) {
        setRoles(rolesRes.data);
        if (!addForm.roleId && rolesRes.data.length > 0) {
          // Default to Editor or Author
          const defaultRole = rolesRes.data.find((r: Role) => r.slug === 'editor') || rolesRes.data[0];
          setAddForm((prev) => ({ ...prev, roleId: defaultRole.id }));
        }
      }
      if (meRes.success && meRes.user) {
        setCurrentUser(meRes.user);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pwd = '';
    for (let i = 0; i < 14; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAddForm((prev) => ({ ...prev, password: pwd }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.firstName || !addForm.lastName || !addForm.email || !addForm.password || !addForm.roleId) {
      setAddError('Please fill in all required fields.');
      return;
    }

    try {
      setAddLoading(true);
      setAddError('');

      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAddModalOpen(false);
        setAddForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          roleId: roles.find((r) => r.slug === 'editor')?.id || roles[0]?.id || '',
        });
        setActionSuccess(`User ${data.data.email} created successfully.`);
        setTimeout(() => setActionSuccess(''), 4000);
        fetchUsersAndRoles();
      } else {
        setAddError(data.message || 'Failed to create user.');
      }
    } catch (err: any) {
      setAddError(err.message || 'Error creating user.');
    } finally {
      setAddLoading(false);
    }
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId || user.role?.id,
      status: user.status || 'ACTIVE',
      password: '',
    });
    setEditError('');
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setEditLoading(true);
      setEditError('');

      const payload: any = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        roleId: editForm.roleId,
        status: editForm.status,
      };
      if (editForm.password && editForm.password.length >= 6) {
        payload.password = editForm.password;
      }

      const res = await fetch(`/api/v1/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsEditModalOpen(false);
        setEditingUser(null);
        setActionSuccess('User role and details updated successfully.');
        setTimeout(() => setActionSuccess(''), 4000);
        fetchUsersAndRoles();
      } else {
        setEditError(data.message || 'Failed to update user.');
      }
    } catch (err: any) {
      setEditError(err.message || 'Error updating user.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (user.id === currentUser?.id) {
      alert('You cannot delete your own logged-in administrator account.');
      return;
    }

    const isConfirmed = confirm(
      `Are you sure you want to permanently delete user "${user.firstName} ${user.lastName}" (${user.email})? This action cannot be undone.`
    );
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/v1/users/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setActionSuccess(`User ${user.email} removed.`);
        setTimeout(() => setActionSuccess(''), 4000);
      } else {
        alert(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user.');
    }
  };

  const toggleSuperAdmin = async (user: UserItem) => {
    const superAdminRole = roles.find((r) => r.slug === 'super_administrator');
    const editorRole = roles.find((r) => r.slug === 'editor');
    if (!superAdminRole || !editorRole) return;

    const isCurrentlySuperAdmin = user.role?.slug === 'super_administrator';
    const targetRole = isCurrentlySuperAdmin ? editorRole : superAdminRole;

    const promptMessage = isCurrentlySuperAdmin
      ? `Revoke Super Administrator privileges for ${user.firstName} ${user.lastName} and set their role to Editor?`
      : `Promote ${user.firstName} ${user.lastName} to Super Administrator with full system privileges?`;

    if (!confirm(promptMessage)) return;

    try {
      const res = await fetch(`/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: targetRole.id,
          status: user.status,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(
          isCurrentlySuperAdmin
            ? `Super Admin role removed for ${user.firstName}.`
            : `${user.firstName} promoted to Super Administrator.`
        );
        setTimeout(() => setActionSuccess(''), 4000);
        fetchUsersAndRoles();
      } else {
        alert(data.message || 'Failed to change role.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.firstName?.toLowerCase().includes(term) ||
      u.lastName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (selectedRoleFilter !== 'ALL') {
      return u.role?.slug === selectedRoleFilter;
    }
    return true;
  });

  const getRoleBadge = (roleSlug: string, roleName: string) => {
    switch (roleSlug) {
      case 'super_administrator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-900 border border-amber-300 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Super Administrator</span>
          </span>
        );
      case 'editor_in_chief':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
            <Shield className="w-3 h-3 text-emerald-700" />
            <span>Editor-in-Chief</span>
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
            <span>Editor</span>
          </span>
        );
      case 'author':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
            <span>Author</span>
          </span>
        );
      case 'media_editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-900 border border-teal-200">
            <span>Media Editor</span>
          </span>
        );
      case 'seo_editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
            <span>SEO Editor</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <span>{roleName || 'Contributor'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-black text-charcoal">Users &amp; Roles</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {users.length} Registered
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage administrative access, invite team members, assign editorial roles, and configure Super Administrator permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              generatePassword();
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider shadow transition-colors"
          >
            <UserPlus className="w-4 h-4 text-gold" />
            <span>Add New User</span>
          </button>
          <button
            type="button"
            onClick={fetchUsersAndRoles}
            className="p-2 text-gray-500 hover:text-charcoal bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh user list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Total Team</span>
          <span className="text-2xl font-serif font-bold text-charcoal mt-1 block">{users.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm bg-gradient-to-br from-amber-50/40 to-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">Super Admins</span>
          <span className="text-2xl font-serif font-bold text-amber-900 mt-1 block">
            {users.filter((u) => u.role?.slug === 'super_administrator').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm bg-gradient-to-br from-emerald-50/30 to-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">Editors &amp; Authors</span>
          <span className="text-2xl font-serif font-bold text-emerald-900 mt-1 block">
            {users.filter((u) => ['editor_in_chief', 'editor', 'author'].includes(u.role?.slug)).length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Active Status</span>
          <span className="text-2xl font-serif font-bold text-green-700 mt-1 block">
            {users.filter((u) => u.status === 'ACTIVE').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Role Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100 rounded-lg max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              selectedRoleFilter === 'ALL'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            All Roles ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoleFilter('super_administrator')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              selectedRoleFilter === 'super_administrator'
                ? 'bg-amber-100 text-amber-900 shadow-sm font-black'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            Super Admins
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoleFilter('editor')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              selectedRoleFilter === 'editor'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            Editors
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoleFilter('author')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              selectedRoleFilter === 'author'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            Authors
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary text-charcoal"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
            Loading team roster...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-bold text-charcoal">No users matched your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role &amp; Permissions</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredUsers.map((u) => {
                  const isSuperAdmin = u.role?.slug === 'super_administrator';
                  const isSelf = u.id === currentUser?.id;

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                              isSuperAdmin
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-primary/10 text-primary border border-primary/20'
                            }`}
                          >
                            {u.firstName?.[0] || 'U'}
                            {u.lastName?.[0] || ''}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-charcoal">
                                {u.firstName} {u.lastName}
                              </span>
                              {isSelf && (
                                <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-500 block">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3 px-4">
                        {getRoleBadge(u.role?.slug, u.role?.name)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'ACTIVE' ? 'bg-green-600' : 'bg-gray-400'
                            }`}
                          />
                          <span>{u.status}</span>
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="py-3 px-4 text-gray-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Super Admin Quick Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleSuperAdmin(u)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                              isSuperAdmin
                                ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:text-amber-800'
                            }`}
                            title={
                              isSuperAdmin
                                ? 'Remove Super Admin role'
                                : 'Promote to Super Administrator'
                            }
                          >
                            {isSuperAdmin ? 'Demote' : 'Make Super Admin'}
                          </button>

                          {/* Edit User */}
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-charcoal transition-colors"
                            title="Edit user details & role"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isSelf ? 'Cannot delete self' : 'Delete user'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD NEW USER MODAL (WordPress Style) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-primary-dark text-white">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-gold" />
                <h3 className="font-serif font-bold text-base">Add New Team Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {addError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.firstName}
                    onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                    placeholder="e.g. Ahmad"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.lastName}
                    onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                    placeholder="e.g. Bello"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="editor@jalsasalana.ng"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                  System Role &amp; Permissions *
                </label>
                <select
                  value={addForm.roleId}
                  onChange={(e) => setAddForm({ ...addForm, roleId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal bg-white font-semibold"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.slug === 'super_administrator' ? '★ (Full System Access)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  {roles.find((r) => r.id === addForm.roleId)?.description ||
                    'Select the role and operational permissions for this user.'}
                </p>
              </div>

              {/* Password Field with Auto-Generate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal">
                    Account Password *
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1"
                  >
                    <Key className="w-3 h-3 text-gold" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="At least 8 characters..."
                  className="w-full px-3 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal bg-gray-50/50"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Copy and securely share this temporary password with the user.
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-charcoal rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary-dark text-white rounded-lg shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                  {addLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating User...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-gold" />
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER & ROLE MODAL */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-primary-dark text-white">
              <div>
                <h3 className="font-serif font-bold text-base">Edit User &amp; Assign Role</h3>
                <span className="text-[11px] text-gray-300 block">{editingUser.email}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal"
                  />
                </div>
              </div>

              {/* Role Assignment (WordPress style) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                  Assigned Role (Permissions)
                </label>
                <select
                  value={editForm.roleId}
                  onChange={(e) => setEditForm({ ...editForm, roleId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal bg-white font-bold"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.slug === 'super_administrator' ? '★ (Super Administrator Access)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  {roles.find((r) => r.id === editForm.roleId)?.description}
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                  Account Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal bg-white font-semibold"
                >
                  <option value="ACTIVE">ACTIVE (Access Granted)</option>
                  <option value="INACTIVE">INACTIVE (Access Suspended)</option>
                </select>
              </div>

              {/* Reset Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal mb-1">
                  Reset Password (leave empty to keep current password)
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="New password (min 6 characters)..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-charcoal"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-charcoal rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary-dark text-white rounded-lg shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                  {editLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-gold" />
                      <span>Update User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
