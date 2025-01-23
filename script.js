document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const uploadCode = this.querySelector('input[type="text"]').value;

        // بررسی کد اعتبارسنجی
        if (uploadCode !== '1289') {
            alert('کد اعتبارسنجی نادرست است.');
            return;
        }

        const formData = new FormData(this);

        fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadFiles(this.id);
            })
            .catch(error => console.error('Error:', error));
    });
});

function loadFiles(formId) {
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById(`fileList${formId}`);
            fileList.innerHTML = '';
            files.forEach(file => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = file.filepath;
                link.textContent = file.filename;
                link.download = file.filename;
                listItem.appendChild(link);
                fileList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

// بارگذاری فایل‌ها برای هر دسته‌بندی در ابتدای بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    loadFiles('Timss');
    loadFiles('Rational');
    loadFiles('Algebraic');
    loadFiles('Pythagorean');
    loadFiles('Powers');
    loadFiles('Circle');
    loadFiles('Triangle');
    loadFiles('Probability');
    loadFiles('Vectors');
});