// Complete Admin Dashboard with Missing Implementations
// This extends the original admin-dashboard-core.js with all missing methods

class AIVoiceAdminDashboardComplete extends AIVoiceAdminDashboard {

  // Initialize storage adapter
  initializeStorage() {
    return new StorageAdapter(this.config);
  }

  // Load agents from storage
  async loadAgents() {
    try {
      const agentKeys = await this.storage.list('agent_');

      for (const key of agentKeys) {
        if (key.startsWith('agent_config_')) {
          const agent = await this.storage.get(key);
          if (agent && agent.id) {
            this.agents.set(agent.id, agent);
          }
        }
      }

      console.log(`Loaded ${this.agents.size} agents`);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  }

  // Save agent to storage
  async saveAgent(agent) {
    try {
      await this.storage.set(`agent_config_${agent.id}`, agent);
      return true;
    } catch (error) {
      console.error('Error saving agent:', error);
      return false;
    }
  }

  // Save knowledge base to storage
  async saveKnowledgeBase(knowledgeBase) {
    try {
      await this.storage.set(`kb_${knowledgeBase.id}`, knowledgeBase);
      return true;
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      return false;
    }
  }

  // Process knowledge base for agent
  async processKnowledgeBase(agentId, knowledgeBaseId) {
    const kb = this.knowledgeBases.get(knowledgeBaseId);
    if (!kb) {
      console.error('Knowledge base not found:', knowledgeBaseId);
      return;
    }

    // Link agent to knowledge base
    await this.storage.set(`agent_kb_${agentId}`, {
      agentId,
      knowledgeBaseId,
      linkedAt: new Date().toISOString()
    });
  }

  // Get files from folder
  async getFilesFromFolder(folderPath) {
    // This would integrate with file system or cloud storage
    // For now, return empty array
    console.log('Getting files from folder:', folderPath);
    return [];
  }

  // Get files from Google Drive
  async getGoogleDriveFiles(folderId) {
    // This would integrate with Google Drive API
    console.log('Getting files from Google Drive:', folderId);
    return [];
  }

  // Check if URL is same domain
  isSameDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === window.location.hostname;
    } catch (error) {
      return false;
    }
  }

  // Inject agent script into page
  injectAgentScript(url, script) {
    const scriptEl = document.createElement('script');
    scriptEl.textContent = script;
    scriptEl.setAttribute('data-agent-url', url);
    document.head.appendChild(scriptEl);
  }

  // Setup admin routes
  setupAdminRoutes() {
    // This would setup routing for admin panel
    // Could use hash-based routing for SPA
    window.addEventListener('hashchange', () => {
      this.handleRouteChange();
    });
  }

  handleRouteChange() {
    const hash = window.location.hash;

    switch (hash) {
      case '#/agents':
        this.showAgentsList();
        break;
      case '#/agents/create':
        this.showCreateAgent();
        break;
      case '#/knowledge-bases':
        this.showKnowledgeBases();
        break;
      case '#/analytics':
        this.showAnalytics();
        break;
      default:
        this.showDashboard();
    }
  }

  // UI Methods
  showCreateKnowledgeBase() {
    const container = document.getElementById('admin-content');
    if (!container) return;

    container.innerHTML = this.getKnowledgeBaseForm();
  }

  getKnowledgeBaseForm() {
    return `
      <div class="kb-creator">
        <h2>Create Knowledge Base</h2>

        <div class="form-section">
          <h3>Basic Information</h3>
          <input type="text" id="kb-name" placeholder="Knowledge Base Name" required>
          <textarea id="kb-description" placeholder="Description"></textarea>
        </div>

        <div class="form-section">
          <h3>File Upload</h3>
          <input type="file" id="kb-files" multiple accept=".pdf,.docx,.txt,.md,.csv,.json">
          <div id="file-list"></div>
        </div>

        <div class="form-section">
          <h3>Cloud Integrations</h3>
          <label>Google Drive Folder ID:</label>
          <input type="text" id="google-drive-folder" placeholder="Optional">

          <label>Dropbox Folder Path:</label>
          <input type="text" id="dropbox-folder" placeholder="Optional">

          <label>Notion Workspace:</label>
          <input type="text" id="notion-workspace" placeholder="Optional">
        </div>

        <button onclick="adminDashboard.createKnowledgeBaseFromForm()">
          Create Knowledge Base
        </button>
      </div>
    `;
  }

  async createKnowledgeBaseFromForm() {
    const formData = {
      name: document.getElementById('kb-name').value,
      description: document.getElementById('kb-description').value,
      googleDriveFolder: document.getElementById('google-drive-folder').value,
      dropboxFolder: document.getElementById('dropbox-folder').value,
      notionWorkspace: document.getElementById('notion-workspace').value
    };

    const kb = await this.createKnowledgeBase(formData);
    alert(`Knowledge Base "${kb.name}" created successfully!`);
    window.location.hash = '#/knowledge-bases';
  }

  addUrlField() {
    const urlList = document.getElementById('url-list');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'target-url';
    input.placeholder = 'https://yourapp.com/another-page';
    urlList.appendChild(input);
  }

  getAgentList() {
    const agentArray = Array.from(this.agents.values());

    return `
      <div class="agent-list">
        <div class="list-header">
          <h2>AI Voice Agents</h2>
          <button onclick="window.location.hash='#/agents/create'">+ Create New Agent</button>
        </div>

        <table class="agent-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Target URLs</th>
              <th>Interactions</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${agentArray.map(agent => `
              <tr>
                <td>${agent.name}</td>
                <td><span class="status-badge ${agent.status}">${agent.status}</span></td>
                <td>${agent.targetUrls.length} URLs</td>
                <td>${agent.analytics.totalInteractions}</td>
                <td>${new Date(agent.analytics.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onclick="adminDashboard.editAgent('${agent.id}')">Edit</button>
                  <button onclick="adminDashboard.deleteAgent('${agent.id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  getKnowledgeBaseManager() {
    const kbArray = Array.from(this.knowledgeBases.values());

    return `
      <div class="kb-list">
        <div class="list-header">
          <h2>Knowledge Bases</h2>
          <button onclick="adminDashboard.showCreateKnowledgeBase()">+ Create New KB</button>
        </div>

        <div class="kb-grid">
          ${kbArray.map(kb => `
            <div class="kb-card">
              <h3>${kb.name}</h3>
              <p>${kb.description}</p>
              <div class="kb-stats">
                <span>${kb.totalChunks} chunks</span>
                <span>${kb.files.length} files</span>
                <span class="status ${kb.processingStatus}">${kb.processingStatus}</span>
              </div>
              <div class="kb-actions">
                <button onclick="adminDashboard.editKB('${kb.id}')">Edit</button>
                <button onclick="adminDashboard.deleteKB('${kb.id}')">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getAnalyticsDashboard() {
    return `
      <div class="analytics-dashboard">
        <h2>Analytics Dashboard</h2>

        <div class="analytics-grid">
          <div class="metric-card">
            <h3>Total Agents</h3>
            <div class="metric-value">${this.agents.size}</div>
          </div>

          <div class="metric-card">
            <h3>Total Interactions</h3>
            <div class="metric-value">${this.getTotalInteractions()}</div>
          </div>

          <div class="metric-card">
            <h3>Avg Response Time</h3>
            <div class="metric-value">${this.getAvgResponseTime()}ms</div>
          </div>

          <div class="metric-card">
            <h3>Knowledge Bases</h3>
            <div class="metric-value">${this.knowledgeBases.size}</div>
          </div>
        </div>

        <div class="analytics-charts">
          <div class="chart-container">
            <h3>Interactions Over Time</h3>
            <canvas id="interactions-chart"></canvas>
          </div>

          <div class="chart-container">
            <h3>Agent Performance</h3>
            <canvas id="performance-chart"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  getTotalInteractions() {
    return Array.from(this.agents.values())
      .reduce((sum, agent) => sum + agent.analytics.totalInteractions, 0);
  }

  getAvgResponseTime() {
    const agents = Array.from(this.agents.values());
    if (agents.length === 0) return 0;

    const total = agents.reduce((sum, agent) => sum + agent.analytics.avgResponseTime, 0);
    return Math.round(total / agents.length);
  }

  async editAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    // Show edit form with pre-filled data
    window.location.hash = `#/agents/edit/${agentId}`;
  }

  async deleteAgent(agentId) {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    this.agents.delete(agentId);
    await this.storage.delete(`agent_config_${agentId}`);
    this.refreshAgentList();
  }

  refreshAgentList() {
    const container = document.getElementById('admin-content');
    if (container) {
      container.innerHTML = this.getAgentList();
    }
  }

  showDashboard() {
    const container = document.getElementById('admin-content');
    if (!container) return;

    container.innerHTML = this.getAnalyticsDashboard();
  }

  showAgentsList() {
    const container = document.getElementById('admin-content');
    if (!container) return;

    container.innerHTML = this.getAgentList();
  }

  showCreateAgent() {
    const container = document.getElementById('admin-content');
    if (!container) return;

    container.innerHTML = this.getCreateAgentForm();
  }

  showKnowledgeBases() {
    const container = document.getElementById('admin-content');
    if (!container) return;

    container.innerHTML = this.getKnowledgeBaseManager();
  }

  showAnalytics() {
    const container = document.getElementById('admin-content');
    if (!container) return;

    container.innerHTML = this.getAnalyticsDashboard();
  }
}
