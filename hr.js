// HR Dashboard JS
const API_BASE = 'http://localhost/silent1/backend';

// Check authentication
window.addEventListener('load', () => {
    if (!localStorage.getItem('role') || localStorage.getItem('role') !== 'hr') {
        window.location.href = 'index.html';
    }
    loadQuestions();
    loadFeedback();
    loadAnalytics();
    setupQuestionForm();
});

// Setup Question Form
function setupQuestionForm() {
    document.getElementById('questionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const questionText = document.getElementById('questionText').value;
        const questionType = document.getElementById('questionType').value;
        
        try {
            const response = await fetch(API_BASE + '/hr/add_question.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `question_text=${encodeURIComponent(questionText)}&question_type=${encodeURIComponent(questionType)}`
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert('Question created successfully', 'success');
                document.getElementById('questionForm').reset();
                loadQuestions();
            } else {
                showAlert(data.message || 'Failed to create question', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Connection error', 'error');
        }
    });
}

// Load Questions
async function loadQuestions() {
    try {
        const response = await fetch(API_BASE + '/hr/view_questions.php');
        const data = await response.json();
        
        let html = '';
        if (data.success && data.data.length > 0) {
            data.data.forEach(question => {
                html += `
                    <div class="card" style="margin-bottom: 15px; background: #f9f9f9;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h3 style="color: #333; margin-bottom: 5px;">${escapeHtml(question.question_text)}</h3>
                                <p style="color: #888; margin: 0;">Type: ${escapeHtml(question.question_type)}</p>
                            </div>
                            <button onclick="deleteQuestion(${question.id})" class="btn btn-secondary" style="width: auto;">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
            html = '<p style="text-align: center; color: #888;">No questions created yet.</p>';
        }
        
        document.getElementById('questionsList').innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Load Feedback
async function loadFeedback() {
    try {
        const response = await fetch(API_BASE + '/hr/view_feedback.php');
        const data = await response.json();
        
        const tbody = document.getElementById('feedbackList');
        if (data.success && data.data.length > 0) {
            tbody.innerHTML = data.data.map(feedback => `
                <tr>
                    <td>${escapeHtml(feedback.employee_name || 'Anonymous')}</td>
                    <td>${escapeHtml(feedback.question_text)}</td>
                    <td>${escapeHtml(feedback.answer)}</td>
                    <td><span class="badge badge-${feedback.status === 'reviewed' ? 'success' : 'warning'}">${feedback.status}</span></td>
                    <td>${new Date(feedback.submitted_at).toLocaleDateString()}</td>
                    <td>
                        <button onclick="markAsReviewed(${feedback.id})" class="btn btn-primary" style="width: auto; padding: 5px 10px; font-size: 12px;">
                            <i class="fas fa-check"></i> Mark Reviewed
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">No feedback received yet.</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Mark Feedback as Reviewed
async function markAsReviewed(feedbackId) {
    try {
        const response = await fetch(API_BASE + '/hr/update_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `feedback_id=${feedbackId}&status=reviewed`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Feedback marked as reviewed', 'success');
            loadFeedback();
        } else {
            showAlert(data.message || 'Failed to update status', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Connection error', 'error');
    }
}

// Load Analytics
async function loadAnalytics() {
    try {
        const response = await fetch(API_BASE + '/hr/analytics.php');
        const data = await response.json();
        
        let html = '';
        if (data.success) {
            const stats = data.data;
            html = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div class="card" style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <h3 style="margin: 0; font-size: 32px;">${stats.total_questions || 0}</h3>
                        <p style="margin: 0; color: rgba(255,255,255,0.8);">Total Questions</p>
                    </div>
                    <div class="card" style="text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
                        <h3 style="margin: 0; font-size: 32px;">${stats.total_feedback || 0}</h3>
                        <p style="margin: 0; color: rgba(255,255,255,0.8);">Total Feedback</p>
                    </div>
                    <div class="card" style="text-align: center; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
                        <h3 style="margin: 0; font-size: 32px;">${stats.reviewed_feedback || 0}</h3>
                        <p style="margin: 0; color: rgba(255,255,255,0.8);">Reviewed</p>
                    </div>
                    <div class="card" style="text-align: center; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white;">
                        <h3 style="margin: 0; font-size: 32px;">${stats.pending_feedback || 0}</h3>
                        <p style="margin: 0; color: rgba(255,255,255,0.8);">Pending Review</p>
                    </div>
                </div>
            `;
        }
        
        document.getElementById('analyticsList').innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Delete Question
async function deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this question?')) {
        try {
            const response = await fetch(API_BASE + '/hr/view_questions.php?action=delete&id=' + questionId);
            const data = await response.json();
            
            if (data.success) {
                showAlert('Question deleted', 'success');
                loadQuestions();
            } else {
                showAlert(data.message || 'Failed to delete', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Connection error', 'error');
        }
    }
}

// Logout
function logout() {
    fetch(API_BASE + '/auth/logout.php').then(() => {
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        window.location.href = 'index.html';
    });
}

// Alert Function
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.getElementById('alertContainer');
    container.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

// XSS Prevention
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
