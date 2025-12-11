document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveWord');
    if (!saveButton) return;

    saveButton.addEventListener('click', async function() {
        try {
            const genderInput = document.querySelector('input[name="gender"]:checked');
            const methods = Array.from(document.querySelectorAll('input[name="method"]:checked')).map(el => el.value).join(', ');
            const slicePlanes = document.getElementById('slice-planes')?.value || '';
            const methodText = [methods, slicePlanes].filter(Boolean).join('; ');

            const formData = {
                date: document.getElementById('research-date')?.value || '',
                patientName: document.getElementById('patient-name')?.value || '',
                department: document.getElementById('department')?.value || '',
                gender: genderInput?.value || '',
                birthYear: document.getElementById('birth-year')?.value || '',
                patientCode: document.getElementById('patient-code')?.value || '',
                methods: methodText || '—',
                researchFrequency: document.getElementById('research-frequency')?.value || '',
                artifactNotes: document.getElementById('artifact-notes')?.value || '',
                skullShape: document.getElementById('skull-shape')?.value || '',
                skullSymmetry: document.getElementById('skull-symmetry')?.value || '',
                differentiation: document.getElementById('differentiation')?.value || '',
                parenchymaChanges: document.getElementById('parenchyma-changes')?.value || '',
                liquorSpaces: document.getElementById('liquor-spaces')?.value || '',
                conclusion: document.getElementById('conclusion')?.value || '',
                advice: document.getElementById('advice')?.value || '',
                doctor: document.getElementById('doctor')?.value || ''
            };

            const templateResponse = await fetch('Beýni_kada_.docx');

            if (!templateResponse.ok) {
                throw new Error('Şablony ýüklemek başartmady.');
            }

            const arrayBuffer = await templateResponse.arrayBuffer();
            const preparedZip = injectPlaceholders(new PizZip(arrayBuffer));
            const doc = new window.docxtemplater(preparedZip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            doc.setData(formData);
            doc.render();

            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            saveAs(out, `mrt_beyni_${new Date().toISOString().slice(0, 10)}.docx`);
        } catch(error) {
            console.error("Ýalňyşlyk:", error);
            alert("Resminama döretmekde ýalňyşlyk: " + error.message);
        }
    });
});

function injectPlaceholders(zip) {
    const documentFile = zip.file('word/document.xml');

    if (!documentFile) {
        throw new Error('Şablon dokumentiniň gurluşy üýtgeşik: word/document.xml tapylmady.');
    }

    const rawXml = documentFile.asText();
    const parser = new DOMParser();
    const dom = parser.parseFromString(rawXml, 'application/xml');
    const textNodes = Array.from(dom.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 't'));

    const replacements = new Map([
        ['09.12.2025 ý.', '{{date}}'],
        ['Amanow Aman', '{{patientName}}'],
        ['Ambulator', '{{department}}'],
        ['Erkek', '{{gender}}'],
        ['01.01.2001 ý.', '{{birthYear}}'],
        [' __', '{{patientCode}}'],
        ['Umumy, T1, T2, T2_tirm, diffuz we MRT angiografiýa  usulda tra, sag, cor kesimlerde.', '{{methods}}'],
        ['Ýok.', '{{artifactNotes}}'],
        ['Ilkinji gezek.', '{{researchFrequency}}'],
        ['Mezosefal tipli.', '{{skullShape}}'],
        ['Simmetrik.', '{{skullSymmetry}}'],
        ['aýdyň. ', '{{differentiation}}'],
        [
            'Beýni parenhimasynyň ojaklaýyn üýtgemeleri anyklanmaýar. Geterotopik ojaklar ýüze çykarylmady. Gippokampyň töweregi simmetrik ojaklaýyn üýtgemeleri bellenmeýär.',
            '{{parenchymaChanges}}'
        ],
        [' giňelmedik (öz ýaşyna gabat gelýär); simmetrik, adaty şekilde. ', '{{liquorSpaces}}'],
        ['Kelle beýnide organiki üýtgeşme anyklanmady', '{{conclusion}}'],
        ['Newropatolog', '{{advice}}'],
        ['Lukman:___________________________ ', 'Lukman:___________________________ {{doctor}}'],
    ]);

    const clearTexts = new Set([
        '____',
        'Garynjyk ara germewi:',
        ' adaty. ',
        'Bazal sisternalar:',
        ' giňelmedik.',
        'Konveksital subarahnoidal keşleri:',
        ' adaty şekilde; kadaly ýerleşen; simmetrik; giňel',
        'medik',
        'Beýni',
        ' (',
        'Silwiew',
        ')',
        ' suw akary:',
        ' üýtgemedik',
        'Döwletow M.M.',
    ]);

    textNodes.forEach(node => {
        if (replacements.has(node.textContent)) {
            node.textContent = replacements.get(node.textContent);
        } else if (clearTexts.has(node.textContent)) {
            node.textContent = '';
        }
    });

    const serializer = new XMLSerializer();
    const updatedXml = serializer.serializeToString(dom);
    zip.file('word/document.xml', updatedXml);
    return zip;
}
