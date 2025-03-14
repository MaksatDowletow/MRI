document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        submitForm();
    });
});

function submitForm() {
    try {
        const fname = document.getElementById('fname').value.trim();
        const nname = document.getElementById('nname').value.trim();
        const birthDate = document.getElementById('birthDate').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        
        const impulses = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                              .map(checkbox => checkbox.nextSibling.textContent.trim());

        if (!fname || !nname || !birthDate || !gender) {
            throw new Error('Все поля должны быть заполнены.');
        }

        const result = `
            <strong>Ady:</strong> ${fname} ${nname} <br>
            <strong>Doglan senesi:</strong> ${birthDate} <br>
            <strong>Jynsy:</strong> ${gender} <br>
            <strong>MR impulslary:</strong> ${impulses.join(', ')}
        `;
        document.getElementById('result').innerHTML = result;
    } catch (error) {
        alert(error.message);
    }
}
