function submitForm() {
    const fname = document.getElementById('fname').value;
    const nname = document.getElementById('nname').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.getElementById('male').checked ? 'Erkek' : 'Aýal';
    
    const impulses = [];
    if (document.getElementById('t1').checked) impulses.push('T1');
    if (document.getElementById('t2').checked) impulses.push('T2');
    if (document.getElementById('t2tirm').checked) impulses.push('T2 Tirm');
    if (document.getElementById('diffuz').checked) impulses.push('Diffuz');
    if (document.getElementById('angioimp').checked) impulses.push('Angio Imp');
    
    const result = `
        <strong>Ady:</strong> ${fname} ${nname} <br>
        <strong>Doglan senesi:</strong> ${birthDate} <br>
        <strong>Jynsy:</strong> ${gender} <br>
        <strong>MR impulslary:</strong> ${impulses.join(', ')}
    `;
    document.getElementById('result').innerHTML = result;
}
