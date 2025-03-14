document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        submitForm();
    });
});

function submitForm() {
    const date = document.getElementById('date').value;
    const fname = document.getElementById('fname').value.trim();
    const department = document.getElementById('department').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const birthYear = document.getElementById('birthYear').value;
    const code = document.getElementById('code').value.trim();
    const methods = Array.from(document.querySelectorAll('input[name="method"]:checked'))
                          .map(checkbox => checkbox.value).join(', ');
    const artifacts = document.querySelector('input[name="artifacts"]:checked') ? 'Ýok' : '';
    const exam = document.querySelector('input[name="exam"]:checked').value;
    const brainImage = document.getElementById('brainImage').value.trim();
    const differentiation = document.getElementById('differentiation').value.trim();
    const changes = document.getElementById('changes').value.trim();
    const liquorSpaces = document.getElementById('liquorSpaces').value.trim();
    const conclusion = document.getElementById('conclusion').value.trim();
    const advice = document.getElementById('advice').value.trim();
    const doctor = document.getElementById('doctor').value.trim();

    if (!date || !fname || !department || !gender || !birthYear || !brainImage || !differentiation || !changes || !liquorSpaces || !conclusion || !advice || !doctor) {
        alert('Все поля должны быть заполнены.');
        return;
    }

    const result = `
        <strong>Senesi:</strong> ${date} <br>
        <strong>Familiýasy, ady:</strong> ${fname} <br>
        <strong>Bölüm:</strong> ${department} <br>
        <strong>Jynsy:</strong> ${gender} <br>
        <strong>Doglan ýyly:</strong> ${birthYear} <br>
        <strong>Näsagyň kody:</strong> ${code} <br>
        <strong>Barlag usuly:</strong> ${methods} <br>
        <strong>Artefaktlar:</strong> ${artifacts} <br>
        <strong>Barlag:</strong> ${exam} <br>
        <strong>Kelleçanagyň şekili:</strong> ${brainImage} <br>
        <strong>Ak we çal maddanyň differensasiýasy:</strong> ${differentiation} <br>
        <strong>Beýni parenhimasynyň ojaklaýyn üýtgemeleri:</strong> ${changes} <br>
        <strong>Likwor saklaýan giňişlikler:</strong> ${liquorSpaces} <br>
        <strong>Netije:</strong> ${conclusion} <br>
        <strong>Maslahat:</strong> ${advice} <br>
        <strong>Lukman:</strong> ${doctor}
    `;
    document.getElementById('result').innerHTML = result;
}
