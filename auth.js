// Authentication JS
const API_BASE = 'http://localhost/silent1/backend';

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        // Show selected form
        document.getElementById(tabName + 'Form').classList.add('active');
        this.classList.add('active');
    });
});

// Login Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    
    if (!email || !password || !role) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store user info
            localStorage.setItem('role', data.data.role);
            localStorage.setItem('email', email);
            
            // Redirect to dashboard
            if (data.data.role === 'employee') {
                window.location.href = 'employee.html';
            } else if (data.data.role === 'hr') {
                window.location.href = 'hr.html';
            }
        } else {
            showAlert(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Connection error. Please try again.', 'error');
    }
});

// Signup Handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('signupRole').value;
    const terms = document.getElementById('terms').checked;
    
    if (!name || !email || !password || !confirmPassword || !role) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (!terms) {
        showAlert('Please accept the terms', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/auth/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Account created successfully! Please login.', 'success');
            document.getElementById('signupForm').reset();
            
            // Switch to login tab
            document.querySelector('.tab-btn[data-tab="login"]').click();
        } else {
            showAlert(data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showAlert('Connection error. Please try again.', 'error');
    }
});

// Alert Function
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.auth-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
}
