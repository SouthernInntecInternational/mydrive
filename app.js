const token = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';
const repo = 'SouthernInntecInternational/mydrive';

async function uploadFile(file) {
    const url = `https://api.github.com/repos/${repo}/contents/${file.name}`;
    const content = await file.text();
    const base64Content = btoa(content);

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add ${file.name}`,
            content: base64Content
        })
    });

    if (response.ok) {
        console.log('File uploaded successfully');
        listFiles();  // Refresh the file list after upload
    } else {
        console.error('Error uploading file', await response.json());
    }
}

async function listFiles() {
    const url = `https://api.github.com/repos/${repo}/contents/`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`
        }
    });

    if (response.ok) {
        const files = await response.json();
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';  // Clear the list

        files.forEach(file => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = file.download_url;
            link.textContent = file.name;
            link.target = '_blank';
            listItem.appendChild(link);
            fileList.appendChild(listItem);
        });
    } else {
        console.error('Error fetching file list', await response.json());
    }
}

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        uploadFile(file);
    }
});