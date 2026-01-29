// Employee Dashboard JS
const API_BASE = 'http://localhost/silent1/backend';

// Check authentication
window.addEventListener('load', () => {
    if (!localStorage.getItem('role') || localStorage.getItem('role') !== 'employee') {
        window.location.href = 'index.html';
    }
    loadQuestions();
    loadMyFeedback();
});

// Load HR Questions
async function loadQuestions() {
    try {
        const response = await fetch(API_BASE + '/employee/get_questions.php');
        const data = await response.json();
        
        let html = '';
        if (data.success && data.data.length > 0) {
            data.data.forEach(question => {
                html += `
                    <div class="card" style="margin-bottom: 15px; background: #f9f9f9;">
                        <h3 style="color: #333; margin-bottom: 10px;">${escapeHtml(question.question_text)}</h3>
                        <form onsubmit="submitFeedback(event, ${question.id})">
                            <div class="form-group">
                                <textarea name="answer" placeholder="Your feedback..." required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-height: 80px;"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: auto; padding: 8px 20px;">
                                <i class="fas fa-send"></i> Submit Answer
                            </button>
                        </form>
                    </div>
                `;
            });
        } else {
            html = '<p style="text-align: center; color: #888;">No questions available from HR yet.</p>';
        }
        
        document.getElementById('questionsList').innerHTML = html;
    } catch (error) {
        console.error('Error loading questions:', error);
        showAlert('Failed to load questions', 'error');
    }
}

// Submit Feedback
async function submitFeedback(event, questionId) {
    event.preventDefault();
    
    const form = event.target;
    const answer = form.querySelector('textarea[name="answer"]').value;
    
    try {
        const response = await fetch(API_BASE + '/employee/submit_feedback.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `question_id=${questionId}&answer=${encodeURIComponent(answer)}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Feedback submitted successfully', 'success');
            form.reset();
            loadMyFeedback();
        } else {
            showAlert(data.message || 'Failed to submit feedback', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Connection error', 'error');
    }
}

// Load My Feedback
async function loadMyFeedback() {
    try {
        const response = await fetch(API_BASE + '/employee/submit_feedback.php?action=get_my_feedback');
        const data = await response.json();
        
        const tbody = document.getElementById('feedbackList');
        if (data.success && data.data.length > 0) {
            tbody.innerHTML = data.data.map(feedback => `
                <tr>
                    <td>${escapeHtml(feedback.question_text)}</td>
                    <td>${escapeHtml(feedback.answer)}</td>
                    <td><span class="badge badge-${feedback.status === 'reviewed' ? 'success' : 'info'}">${feedback.status}</span></td>
                    <td>${new Date(feedback.submitted_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px;">No feedback submitted yet.</td></tr>';
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
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
