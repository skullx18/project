// Store user credentials in localStorage (for demo purposes)
const saveCredentials = (username, password) => {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
};

const getCredentials = () => {
    return {
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password')
    };
};

// Handle signup
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    if (newUsername && newPassword) {
        saveCredentials(newUsername, newPassword);
        alert("Sign-up successful! Please log in.");
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    } else {
        document.getElementById('signupError').textContent = 'Please fill in both fields';
    }
});

// Handle login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const credentials = getCredentials();

    if (username === credentials.username && password === credentials.password) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('study-container').style.display = 'block';
    } else {
        document.getElementById('loginError').textContent = 'Invalid username or password';
    }
});

// Handle study planner
document.getElementById('studyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const examDate = new Date(document.getElementById('examDate').value);
    const hoursOfStudy = parseInt(document.getElementById('hoursOfStudy').value);
    const timeOfDay = document.getElementById('timeOfDay').value;
    const subjects = document.getElementById('subjects').value.split(',').map(s => s.trim());
    const topics = document.getElementById('topics').value.split(',').map(t => t.trim());

    let startTime;
    switch (timeOfDay) {
        case 'day':
            startTime = 9;  // 9:00 AM
            break;
        case 'night':
            startTime = 18;  // 6:00 PM
            break;
        case 'evening':
            startTime = 17;  // 5:00 PM
            break;
    }

    const timePerSubject = hoursOfStudy / subjects.length;

    let studyPlan = `<h2>Study Plan for ${name}</h2>`;
    studyPlan += `<p>Exam Date: ${examDate.toDateString()}</p>`;
    studyPlan += '<ul>';

    subjects.forEach((subject, index) => {
        const startHour = startTime + index * timePerSubject;
        const endHour = startHour + timePerSubject;

        const startTimeFormatted = formatTime(startHour);
        const endTimeFormatted = formatTime(endHour);

        studyPlan += `<li>${subject}: ${startTimeFormatted} - ${endTimeFormatted}</li>`;
    });

    studyPlan += '</ul>';
    studyPlan += '<h3>Recommended YouTube Videos:</h3>';
    studyPlan += '<ul id="videos"></ul>';
    studyPlan += '<h3>Related Articles:</h3>';
    studyPlan += '<ul id="articles"></ul>';

    document.getElementById('output').innerHTML = studyPlan;

    // Fetch YouTube Videos
    topics.forEach(topic => {
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&type=video&key=AIzaSyCJ14Ax3S0fGyxwmkdyFdnvFBLCjA8Jk5E`)
            .then(response => response.json())
            .then(data => {
                const videosElement = document.getElementById('videos');
                data.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const thumbnail = item.snippet.thumbnails.default.url;
                    const title = item.snippet.title;
                    videosElement.innerHTML += `<li><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank"><img src="${thumbnail}" alt="${title}"> ${title}</a></li>`;
                });
            })
            .catch(error => console.error('Error fetching YouTube videos:', error));
    });

    // Fetch Google Search Results
    topics.forEach(topic => {
        fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(topic)}&key=AIzaSyCnT0Uhw5mxUAfDc0t4mlE`)
            .then(response => response.json())
            .then(data => {
                const articlesElement = document.getElementById('articles');
                data.items.forEach(item => {
                    const link = item.link;
                    const title = item.title;
                    articlesElement.innerHTML += `<li><a href="${link}" target="_blank">${title}</a></li>`;
                });
            })
            .catch(error => console.error('Error fetching Google search results:', error));
    });
});

// Helper function to format time in 12-hour format
const formatTime = (hour) => {
    const h = Math.floor(hour);
    const m = (hour % 1) * 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    const formattedMinute = m < 10 ? `0${m}` : m;
    return `${formattedHour}:${formattedMinute} ${ampm}`;
};
