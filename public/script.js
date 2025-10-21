let currentSlide = 0;
let slides = [];

async function fetchSlides() {
    try {
        const response = await fetch('/api/slides');
        const data = await response.json();
        slides = data.data;
        renderSlide(currentSlide);
        createIndicators();
        updateNavigation();
    } catch (error) {
        console.error('Error fetching slides:', error);
        document.getElementById('slide-content').innerHTML = `
            <div class="section red">
                <h2>Error Loading Presentation</h2>
                <p>Unable to load presentation data. Please refresh the page.</p>
            </div>
        `;
    }
}

function renderSlide(index) {
    const slide = slides[index];
    const container = document.getElementById('slide-content');
    
    if (!slide) return;

    let html = '';

    switch (slide.type) {
        case 'title':
            html = renderTitleSlide(slide);
            break;
        case 'content':
            html = renderContentSlide(slide);
            break;
        case 'formulas':
            html = renderFormulasSlide(slide);
            break;
        case 'comparison':
            html = renderComparisonSlide(slide);
            break;
        case 'summary':
            html = renderSummarySlide(slide);
            break;
        default:
            html = `<h1>${slide.title}</h1>`;
    }

    container.innerHTML = html;
}

function renderTitleSlide(slide) {
    return `
        <div class="title-slide">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <h1>${slide.title}</h1>
            <h2>${slide.subtitle}</h2>
            <p>Communication Systems Analysis</p>
        </div>
    `;
}

function renderContentSlide(slide) {
    let html = `<h1>${slide.title}</h1>`;
    
    slide.sections.forEach(section => {
        html += `<div class="section ${section.color}">`;
        html += `<h2>${section.heading}</h2>`;
        
        if (section.content) {
            html += `<p>${section.content}</p>`;
        }
        
        if (section.points) {
            html += '<ul>';
            section.points.forEach(point => {
                html += `<li>${point}</li>`;
            });
            html += '</ul>';
        }
        
        html += '</div>';
    });

    if (slide.note) {
        html += `<div class="note-box"><p>${slide.note}</p></div>`;
    }

    return html;
}

function renderFormulasSlide(slide) {
    let html = `<h1>${slide.title}</h1>`;
    
    slide.formulas.forEach(formula => {
        html += `<div class="section ${formula.color}">`;
        html += `<h3>${formula.name}</h3>`;
        if (formula.description) {
            html += `<p>${formula.description}</p>`;
        }
        html += `<div class="formula-box ${formula.color}">`;
        html += `<p class="formula">${formula.formula}</p>`;
        if (formula.detail) {
            html += `<p class="formula-description">${formula.detail}</p>`;
        }
        html += '</div>';
        html += '</div>';
    });

    if (slide.note) {
        html += `<div class="note-box"><p>${slide.note}</p></div>`;
    }

    if (slide.reasons) {
        html += '<div class="section yellow">';
        html += '<h3>Why Decibels?</h3><ul>';
        slide.reasons.forEach(reason => {
            html += `<li>${reason}</li>`;
        });
        html += '</ul></div>';
    }

    return html;
}

function renderComparisonSlide(slide) {
    let html = `<h1>${slide.title}</h1>`;
    html += '<div class="comparison-grid">';
    
    html += `<div class="comparison-item section ${slide.left.color}">`;
    html += `<h2>${slide.left.title}</h2><ul>`;
    slide.left.points.forEach(point => {
        html += `<li>${point}</li>`;
    });
    html += '</ul></div>';

    html += `<div class="comparison-item section ${slide.right.color}">`;
    html += `<h2>${slide.right.title}</h2><ul>`;
    slide.right.points.forEach(point => {
        html += `<li>${point}</li>`;
    });
    html += '</ul></div>';

    html += '</div>';

    if (slide.conclusion) {
        html += `<div class="conclusion"><p><strong>Key Difference:</strong> ${slide.conclusion.replace('Key Difference: ', '')}</p></div>`;
    }

    return html;
}

function renderSummarySlide(slide) {
    let html = `<h1 style="text-align: center;">${slide.title}</h1>`;
    html += '<div class="summary-grid">';
    
    slide.items.forEach(item => {
        html += `<div class="summary-item section ${item.color}">`;
        html += `<h3>${item.title}</h3>`;
        html += `<p>${item.content}</p>`;
        html += '</div>';
    });
    
    html += '</div>';
    
    if (slide.conclusion) {
        html += `<div class="summary-conclusion"><p>${slide.conclusion}</p></div>`;
    }

    return html;
}

function createIndicators() {
    const container = document.getElementById('slide-indicators');
    container.innerHTML = '';
    
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `indicator-dot ${index === currentSlide ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        container.appendChild(dot);
    });
}

function updateNavigation() {
    document.getElementById('prevBtn').disabled = currentSlide === 0;
    document.getElementById('nextBtn').disabled = currentSlide === slides.length - 1;
    document.getElementById('slide-counter').textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
    document.getElementById('slide-title').textContent = slides[currentSlide].title;
    
    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    renderSlide(currentSlide);
    updateNavigation();
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        renderSlide(currentSlide);
        updateNavigation();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        renderSlide(currentSlide);
        updateNavigation();
    }
}

document.getElementById('prevBtn').addEventListener('click', prevSlide);
document.getElementById('nextBtn').addEventListener('click', nextSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

fetchSlides();
