// AI Voice Agent - Admin Dashboard JavaScript

const API_URL = 'http://localhost:3000/api';
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupAuthListeners();
});

// Setup Auth Listeners (called on page load)
function setupAuthListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm && !loginForm.dataset.listenerAdded) {
        loginForm.addEventListener('submit', handleLogin);
        loginForm.dataset.listenerAdded = 'true';
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm && !registerForm.dataset.listenerAdded) {
        registerForm.addEventListener('submit', handleRegister);
        registerForm.dataset.listenerAdded = 'true';
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm && !forgotForm.dataset.listenerAdded) {
        forgotForm.addEventListener('submit', handleForgotPassword);
        forgotForm.dataset.listenerAdded = 'true';
    }
}

// Authentication
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showDashboard();
        } else {
            showLoginPage();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('dashboard-page').style.display = 'none';
    showLogin();
}

function showDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'flex';
    document.getElementById('user-email').textContent = currentUser.email;

    loadOverviewStats();
    setupEventListeners();
}

// Auth card switching
function showLogin(event) {
    if (event) event.preventDefault();
    document.getElementById('login-card').style.display = 'block';
    document.getElementById('register-card').style.display = 'none';
    document.getElementById('forgot-card').style.display = 'none';
}

function showRegister(event) {
    if (event) event.preventDefault();
    document.getElementById('login-card').style.display = 'none';
    document.getElementById('register-card').style.display = 'block';
    document.getElementById('forgot-card').style.display = 'none';
}

function showForgotPassword(event) {
    if (event) event.preventDefault();
    document.getElementById('login-card').style.display = 'none';
    document.getElementById('register-card').style.display = 'none';
    document.getElementById('forgot-card').style.display = 'block';
}

// Setup Event Listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            showPage(page);
        });
    });

    // Agent form
    const agentForm = document.getElementById('agent-form');
    if (agentForm) {
        agentForm.addEventListener('submit', handleCreateAgent);
    }

    // Upload form
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadKB);
    }

    // Upload zone
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('kb-file');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelection);

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--primary)';
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--gray-300)';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--gray-300)';
            fileInput.files = e.dataTransfer.files;
            handleFileSelection();
        });
    }

    // Change password form
    const passwordForm = document.getElementById('change-password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handleChangePassword);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    errorDiv.textContent = '';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            showDashboard();
        } else {
            errorDiv.textContent = data.error || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Network error. Please check your connection.';
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const errorDiv = document.getElementById('register-error');

    errorDiv.textContent = '';

    // Validate passwords match
    if (password !== confirm) {
        errorDiv.textContent = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Account created successfully! Please sign in.', 'success');
            showLogin();
            document.getElementById('login-email').value = email;
        } else {
            errorDiv.textContent = data.error || 'Registration failed. Please try again.';
        }
    } catch (error) {
        console.error('Register error:', error);
        errorDiv.textContent = 'Network error. Please check your connection.';
    }
}

// Handle Forgot Password
async function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById('forgot-email').value;
    const errorDiv = document.getElementById('forgot-error');
    const successDiv = document.getElementById('forgot-success');

    errorDiv.textContent = '';
    successDiv.textContent = '';
    successDiv.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/auth/request-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            successDiv.textContent = 'Password reset link sent! Check your email.';
            successDiv.style.display = 'block';
            document.getElementById('forgot-form').reset();
        } else {
            errorDiv.textContent = data.error || 'Failed to send reset link. Please try again.';
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        errorDiv.textContent = 'Network error. Please check your connection.';
    }
}

// Handle Logout
async function handleLogout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        currentUser = null;
        showLoginPage();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Load Overview Stats
async function loadOverviewStats() {
    try {
        const response = await fetch(`${API_URL}/analytics/overview`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('stat-total-agents').textContent = data.totalAgents || 0;
            document.getElementById('stat-total-conversations').textContent = data.totalConversations || 0;
            document.getElementById('stat-total-interactions').textContent = data.totalInteractions || 0;
            document.getElementById('stat-avg-response-time').textContent = `${data.avgResponseTime || 0}ms`;
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Show Page
function showPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });

    // Hide all pages
    document.querySelectorAll('.content-section').forEach(page => {
        page.style.display = 'none';
    });

    // Show selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.style.display = 'block';

        // Load page data
        switch(pageName) {
            case 'overview':
                loadOverviewStats();
                break;
            case 'agents':
                loadAgents();
                break;
            case 'knowledge':
                loadKnowledgeBases();
                break;
        }
    }
}

// Load Agents
async function loadAgents() {
    const agentsList = document.getElementById('agents-list');
    agentsList.innerHTML = '<div class="empty-state"><p>Loading agents...</p></div>';

    try {
        const response = await fetch(`${API_URL}/agents`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            const agents = data.agents || [];

            if (agents.length === 0) {
                agentsList.innerHTML = `
                    <div class="empty-state">
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                            <circle cx="60" cy="60" r="50" stroke="#e5e7eb" stroke-width="4"/>
                            <circle cx="60" cy="45" r="15" fill="#6366f1" opacity="0.2"/>
                            <path d="M30 90C30 75 40 70 60 70C80 70 90 75 90 90" stroke="#6366f1" stroke-width="4" opacity="0.2"/>
                        </svg>
                        <h3>No Agents Yet</h3>
                        <p>Create your first AI voice agent to get started</p>
                        <button class="btn btn-primary" onclick="showCreateAgentModal()" style="margin-top: 1rem;">Create Agent</button>
                    </div>
                `;
            } else {
                agentsList.innerHTML = agents.map(agent => `
                    <div class="agent-card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">${escapeHtml(agent.name)}</div>
                                <div class="card-description">${escapeHtml(agent.description || 'No description')}</div>
                            </div>
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-sm btn-secondary" onclick="deleteAgent('${agent.id}')">Delete</button>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Failed to load agents:', error);
        agentsList.innerHTML = '<div class="error-message">Failed to load agents</div>';
    }
}

// Show Create Agent Modal
function showCreateAgentModal() {
    const modal = document.getElementById('agent-modal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// Close Agent Modal
function closeAgentModal() {
    const modal = document.getElementById('agent-modal');
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.getElementById('agent-form').reset();
}

// Update Stability Value Display
function updateStability(value) {
    document.getElementById('stability-value').textContent = value;
}

// Handle Create Agent
async function handleCreateAgent(e) {
    e.preventDefault();

    const agentData = {
        name: document.getElementById('agent-name').value,
        description: document.getElementById('agent-description').value,
        targetUrls: [],
        voiceSettings: {
            voiceId: document.getElementById('voice-id').value,
            stability: parseFloat(document.getElementById('stability').value)
        },
        contextSettings: {
            personality: document.getElementById('personality').value,
            language: document.getElementById('language').value
        }
    };

    try {
        const response = await fetch(`${API_URL}/agents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(agentData)
        });

        if (response.ok) {
            showToast('Agent created successfully!', 'success');
            closeAgentModal();
            loadAgents();
        } else {
            const error = await response.json();
            showToast(error.error || 'Failed to create agent', 'error');
        }
    } catch (error) {
        console.error('Create agent error:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// Delete Agent
async function deleteAgent(agentId) {
    if (!confirm('Are you sure you want to delete this agent?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/agents/${agentId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            showToast('Agent deleted successfully', 'success');
            loadAgents();
        } else {
            showToast('Failed to delete agent', 'error');
        }
    } catch (error) {
        console.error('Delete agent error:', error);
        showToast('Network error', 'error');
    }
}

// Load Knowledge Bases
async function loadKnowledgeBases() {
    const kbList = document.getElementById('knowledge-list');
    kbList.innerHTML = '<div class="empty-state"><p>Loading knowledge bases...</p></div>';

    try {
        const response = await fetch(`${API_URL}/knowledge-bases`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            const kbs = data.knowledgeBases || [];

            if (kbs.length === 0) {
                kbList.innerHTML = `
                    <div class="empty-state">
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                            <rect x="30" y="20" width="60" height="80" rx="4" stroke="#e5e7eb" stroke-width="4"/>
                            <path d="M45 40H75M45 55H75M45 70H60" stroke="#6366f1" stroke-width="3" opacity="0.3"/>
                        </svg>
                        <h3>No Knowledge Bases</h3>
                        <p>Upload documents to train your AI agents</p>
                        <button class="btn btn-primary" onclick="showUploadModal()" style="margin-top: 1rem;">Upload Files</button>
                    </div>
                `;
            } else {
                kbList.innerHTML = kbs.map(kb => `
                    <div class="kb-card">
                        <div class="card-header">
                            <div>
                                <div class="card-title">${escapeHtml(kb.name)}</div>
                                <div class="card-description">${escapeHtml(kb.description || 'No description')}</div>
                            </div>
                        </div>
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-100); font-size: 0.875rem; color: var(--gray-600);">
                            ${kb.total_chunks || 0} chunks • ${kb.processing_status || 'unknown'}
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Failed to load knowledge bases:', error);
        kbList.innerHTML = '<div class="error-message">Failed to load knowledge bases</div>';
    }
}

// Show Upload Modal
function showUploadModal() {
    const modal = document.getElementById('upload-modal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// Close Upload Modal
function closeUploadModal() {
    const modal = document.getElementById('upload-modal');
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.getElementById('upload-form').reset();
    document.getElementById('file-list').innerHTML = '';
}

// Handle File Selection
function handleFileSelection() {
    const fileInput = document.getElementById('kb-file');
    const fileList = document.getElementById('file-list');

    if (fileInput.files.length > 0) {
        fileList.innerHTML = Array.from(fileInput.files).map((file, index) => `
            <div class="file-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4H12L16 8V16H4V4Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 4V8H16" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span class="file-name">${escapeHtml(file.name)}</span>
                <span style="color: var(--gray-500); font-size: 0.8125rem;">${formatFileSize(file.size)}</span>
            </div>
        `).join('');
    }
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Handle Upload KB
async function handleUploadKB(e) {
    e.preventDefault();

    const name = document.getElementById('kb-name').value;
    const description = document.getElementById('kb-description').value;
    const fileInput = document.getElementById('kb-file');

    if (fileInput.files.length === 0) {
        showToast('Please select at least one file', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    for (let file of fileInput.files) {
        formData.append('files', file);
    }

    try {
        const response = await fetch(`${API_URL}/knowledge-bases`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            showToast('Knowledge base uploaded successfully!', 'success');
            closeUploadModal();
            loadKnowledgeBases();
        } else {
            const error = await response.json();
            showToast(error.error || 'Failed to upload', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// Handle Change Password
async function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ currentPassword, newPassword })
        });

        if (response.ok) {
            showToast('Password changed successfully!', 'success');
            document.getElementById('change-password-form').reset();
        } else {
            const error = await response.json();
            showToast(error.error || 'Failed to change password', 'error');
        }
    } catch (error) {
        console.error('Change password error:', error);
        showToast('Network error', 'error');
    }
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = message;

    toast.appendChild(messageSpan);
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
