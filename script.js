document.addEventListener('DOMContentLoaded', () => {
    const manualTitleInput = document.getElementById('manual-title');
    const addManualBtn = document.getElementById('add-manual-btn');
    const manualsTable = document.getElementById('manuals-table').querySelector('tbody');

    let manuals = JSON.parse(localStorage.getItem('manuals')) || [];

    const renderManuals = () => {
        manualsTable.innerHTML = '';
        manuals.forEach((manual, index) => {
            const row = createManualRow(manual, index);
            manualsTable.appendChild(row);
        });
    };

    const createManualRow = (manual, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${manual.title}</td>
            <td>
                <button class="edit-btn" data-index="${index}">Editar</button>
                <button class="delete-btn" data-index="${index}">Excluir</button>
                <button class="attach-btn" data-index="${index}">Anexar PDF</button>
                <button class="view-btn" data-index="${index}">Visualizar</button>
            </td>
        `;
        return row;
    };

    const addManual = () => {
        const title = manualTitleInput.value.trim();
        if (title) {
            manuals.push({ title, pdf: null });
            localStorage.setItem('manuals', JSON.stringify(manuals));
            manualTitleInput.value = '';
            renderManuals();
        }
    };

    const editManual = (index) => {
        const newTitle = prompt('Editar título do manual:', manuals[index].title);
        if (newTitle) {
            manuals[index].title = newTitle;
            localStorage.setItem('manuals', JSON.stringify(manuals));
            renderManuals();
        }
    };

    const deleteManual = (index) => {
        if (confirm('Tem certeza que deseja excluir este manual?')) {
            manuals.splice(index, 1);
            localStorage.setItem('manuals', JSON.stringify(manuals));
            renderManuals();
        }
    };

    const attachPDF = (index) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    manuals[index].pdf = reader.result;
                    localStorage.setItem('manuals', JSON.stringify(manuals));
                    renderManuals();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const viewPDF = (index) => {
        if (manuals[index].pdf) {
            const modal = document.getElementById('pdf-modal');
            const pdfViewer = document.getElementById('pdf-viewer');
            pdfViewer.src = manuals[index].pdf;
            modal.style.display = 'block';
        } else {
            alert('Nenhum PDF anexado a este manual.');
        }
    };

    const closeModal = () => {
        const modal = document.getElementById('pdf-modal');
        modal.style.display = 'none';
        const pdfViewer = document.getElementById('pdf-viewer');
        pdfViewer.src = '';
    };

    addManualBtn.addEventListener('click', addManual);

    manualsTable.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        if (event.target.classList.contains('edit-btn')) {
            editManual(index);
        } else if (event.target.classList.contains('delete-btn')) {
            deleteManual(index);
        } else if (event.target.classList.contains('attach-btn')) {
            attachPDF(index);
        } else if (event.target.classList.contains('view-btn')) {
            viewPDF(index);
        }
    });

    document.querySelector('.close-btn').addEventListener('click', closeModal);

    window.onclick = (event) => {
        const modal = document.getElementById('pdf-modal');
        if (event.target === modal) {
            closeModal();
        }
    };

    renderManuals();
});

