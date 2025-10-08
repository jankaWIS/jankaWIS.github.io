// citation functionality - to allow copying bibtex format of articles
document.addEventListener('DOMContentLoaded', () => {
    function generateBibTeX(publication) {
        // Extract year using regex and get the first match
        const yearMatch = publication.querySelector('.pub-date')?.textContent.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : '';
        
        // Get other fields with proper null checks
        const title = publication.querySelector('.pub-title a')?.textContent || '';
        const authors = publication.querySelector('.pub-authors')?.textContent || '';
        const journal = publication.querySelector('.pub-journal')?.textContent || '';
        const volume = publication.querySelector('.pub-volume')?.textContent || '';
        const doi = publication.querySelector('[href^="https://doi.org/"]')?.href?.replace('https://doi.org/', '') || '';

        // Create citation key (first author's lastname + year + first word of title)
        const citationKey = `${authors.split(',')[0].split(' ').pop()}${year}${title.split(' ')[0].toLowerCase()}`;
        
        // Clean up the values
        const cleanTitle = title.trim();
        const cleanAuthors = authors.trim();
        const cleanJournal = journal.trim().replace(/,$/, ''); // remove trailing comma
        const cleanVolume = volume.trim().replace(/\.$/, ''); // remove trailing period
        const cleanYear = year; // year is already clean from regex
        const cleanDoi = doi.trim();

        // Format BibTeX entry with consistent spacing, remove the space and newline in the cicationKey
        return `@article{${citationKey.trim()},
    title = {${cleanTitle}},
    author = {${cleanAuthors}},
    journal = {${cleanJournal}},
    year = {${cleanYear}},
    volume = {${cleanVolume}},
    doi = {${cleanDoi}}
}`;
    }

    // add citation buttons to each publication
    document.querySelectorAll('.views-row').forEach(pub => {
        const citeBtn = document.createElement('button');
        citeBtn.textContent = 'Cite';
        citeBtn.className = 'cite-button';
        citeBtn.addEventListener('click', () => {
            const bibtex = generateBibTeX(pub);
            
            // create modal with citation using a template
            const modal = document.createElement('div');
            modal.className = 'citation-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>BibTeX Citation</h3>
                    <pre>${bibtex}</pre>
                    <div class="modal-buttons">
                        <button class="copy-btn">Copy to Clipboard</button>
                        <button class="close-btn">Close</button>
                    </div>
                    <div class="copy-success hidden">Citation copied!</div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add event listeners, copy button functionality
            modal.querySelector('.copy-btn').addEventListener('click', () => {
                navigator.clipboard.writeText(bibtex).then(() => {
                    // Trigger fancy confetti effect - the confetti library must be included in the HTML and we have it
                    // separately because the code is well-tested and optimised and it'll be easier to maintain
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
                        startVelocity: 30,
                        scalar: 0.7,
                        ticks: 200,
                        shapes: ['circle', 'square'],
                        zIndex: 1000
                    });
                    const successMsg = modal.querySelector('.copy-success');
                    successMsg.classList.remove('hidden');
                    setTimeout(() => successMsg.classList.add('hidden'), 2000);
                });
            });

            // Close button functionality
            modal.querySelector('.close-btn').addEventListener('click', () => {
                modal.remove();
            });

            // Close on click outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
        pub.querySelector('.extra_link').appendChild(citeBtn);
    });
});