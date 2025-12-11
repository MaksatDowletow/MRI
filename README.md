# MRI

## Overview
The site is a single-page Turkmen-language MRI reporting helper built from `index.html`, `styles.css`, `script.js`, and `saveWord.js`, with FileSaver loaded from a CDN for downloads. The export workflow now feeds collected values into the bundled `Beýni_kada_.docx` template through PizZip + Docxtemplater for true `.docx` output.

The layout follows an RSNA-branded hero, a sidebar with sample report snippets and workflow tips, and a main form-driven protocol area organized into numbered sections for patient info, scan parameters, structural findings, and conclusions.

## Обзор (перевод)
- Сайт представляет собой одностраничный Turkmen-язычный помощник для составления отчётов МРТ, собранный из файлов `index.html`, `styles.css`, `script.js` и `saveWord.js`, при этом FileSaver подключён из CDN для выгрузки документов.
- Макет включает фирменный баннер RSNA, боковую панель с примерами фрагментов протоколов и советами по рабочему процессу, а также основную форму-протокол, разбитую на пронумерованные разделы с данными пациента, параметрами исследования, описанием структурных изменений и выводами.
- Боковая панель содержит «карточку ссылок» и «карточку шагов» с примерами текста и последовательностью действий для заполнения полей.
- Основная форма (`#research-form`) собирает демографию, методы сканирования, артефакты, оценку структур головного мозга, опциональные свободные заметки, обязательные заключение/рекомендации и данные врача, завершаясь кнопками для создания или экспорта отчёта.
- Таб-листы (`.tab-panel`), расположенные рядом, содержат чек-листы по радиологическим находкам (очаговые изменения, динамика/контрастирование, ликворные пространства/сосуды, прочие области) для справки во время заполнения.
- При загрузке страницы `script.js` подставляет сегодняшнюю дату, переключает вкладки, проверяет обязательные поля, формирует HTML-резюме в блоке `#result` при отправке формы и включает кнопку копирования текста отчёта в буфер с сообщениями об успехе или ошибке.
- Вспомогательные функции создают зоны для сообщений и отображают подсказки по валидации или статус копирования; если ключевые элементы формы отсутствуют, вывод резюме блокируется с понятными ошибками.
- `saveWord.js` собирает те же значения формы, подменяет в `Beýni_kada_.docx` заранее goýlan tekst RUN-larynda taglaryňy ýerleşdirýär, догоняя Docxtemplater arkaly `.docx` файлын döredýär we FileSaver (`saveAs`) arkaly görnüşi boýunça ýükleýär.
