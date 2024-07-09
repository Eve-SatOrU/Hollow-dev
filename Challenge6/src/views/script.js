function showSignIn() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('sign-in-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function showAuthSection() {
    document.getElementById('sign-in-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
}

document.getElementById('sign-in').addEventListener('submit', function(event) {
    event.preventDefault();
    // Add your sign-in logic here
    const email = document.getElementById('sign-in-email').value;
    const username = document.getElementById('sign-in-username').value;
    const password = document.getElementById('sign-in-password').value;
    
    console.log('Sign In:', { email, username, password });
    // Add your sign-in request to the server here
});

document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();
    // Add your login logic here
    const emailUsername = document.getElementById('login-email-username').value;
    const password = document.getElementById('login-password').value;
    
    console.log('Login:', { emailUsername, password });
    // Add your login request to the server here
});
