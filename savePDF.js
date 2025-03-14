document.getElementById('savePDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const content = document.getElementById('result').innerHTML;
    const doc = new jsPDF();

    doc.fromHTML(content, 15, 15, {
        'width': 170,
    });

    doc.save('document.pdf');
});
