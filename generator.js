// State management
let currentProfession = 'electrician';
let currentTheme = 'classic';
let ageStyle = 'text'; // text, icon, badge, sidebar
let gradStyle = 'year'; // year, class-of, since, none
let skills = [];
let courses = [];
let experiences = [];
let zoomLevel = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCV();
    lucide.createIcons();
    setTheme('classic'); // Set default theme
    setAgeStyle('text');
    setGradStyle('year');
});

// Profession Templates
const templates = {
    electrician: {
        color: 'amber',
        icon: 'plug',
        title: 'Licensed Electrician',
        skills: ['Electrical Installation', 'Circuit Design', 'Safety Compliance', 'Troubleshooting']
    },
    electrical: {
        color: 'blue',
        icon: 'cpu',
        title: 'Electrical Engineer',
        skills: ['Control Systems', 'Power Electronics', 'AutoCAD', 'MATLAB', 'PLC Programming']
    },
    industrial: {
        color: 'cyan',
        icon: 'factory',
        title: 'Industrial Engineer',
        skills: ['Process Optimization', 'Lean Manufacturing', 'Six Sigma', 'Supply Chain', 'Ergonomics']
    },
    combined: {
        color: 'purple',
        icon: 'layers',
        title: 'Multi-Disciplinary Engineer',
        skills: ['Cross-functional Expertise', 'Systems Integration', 'Project Management', 'Technical Leadership']
    }
};

// Theme Definitions
const themes = {
    classic: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#60a5fa',
        headerGradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        sidebarBg: '#f8fafc',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        borderColor: '#2563eb',
        lightBg: '#eff6ff',
        quoteBorder: '#2563eb'
    },
    forest: {
        primary: '#059669',
        secondary: '#065f46',
        accent: '#34d399',
        headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        sidebarBg: '#f0fdf4',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        borderColor: '#059669',
        lightBg: '#ecfdf5',
        quoteBorder: '#059669'
    },
    burgundy: {
        primary: '#be123c',
        secondary: '#881337',
        accent: '#fb7185',
        headerGradient: 'linear-gradient(135deg, #be123c 0%, #9f1239 100%)',
        sidebarBg: '#fff1f2',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        borderColor: '#be123c',
        lightBg: '#ffe4e6',
        quoteBorder: '#be123c'
    },
    navy: {
        primary: '#475569',
        secondary: '#1e293b',
        accent: '#94a3b8',
        headerGradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
        sidebarBg: '#f8fafc',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        borderColor: '#475569',
        lightBg: '#f1f5f9',
        quoteBorder: '#475569'
    },
    sunset: {
        primary: '#ea580c',
        secondary: '#c2410c',
        accent: '#fb923c',
        headerGradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
        sidebarBg: '#fff7ed',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        borderColor: '#ea580c',
        lightBg: '#ffedd5',
        quoteBorder: '#ea580c'
    },
    ocean: {
        primary: '#0891b2',
        secondary: '#0e7490',
        accent: '#22d3ee',
        headerGradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
        sidebarBg: '#ecfeff',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        borderColor: '#0891b2',
        lightBg: '#cffafe',
        quoteBorder: '#0891b2'
    }
};

function setTheme(themeName) {
    currentTheme = themeName;
    
    // Update UI buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-purple-500', 'bg-purple-50');
        btn.classList.add('border-transparent');
    });
    
    const activeBtn = document.getElementById(`theme-${themeName}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent');
        activeBtn.classList.add('ring-2', 'ring-purple-500', 'bg-purple-50');
    }
    
    updateCV();
}

function setProfession(prof) {
    currentProfession = prof;
    
    // Update UI buttons
    document.querySelectorAll('.prof-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-purple-500', 'bg-purple-50');
        btn.classList.add('border-2', 'border-transparent');
    });
    
    const activeBtn = document.getElementById(`btn-${prof}`);
    activeBtn.classList.remove('border-transparent');
    activeBtn.classList.add('ring-2', 'ring-purple-500', 'bg-purple-50');
    
    // Update CV class
    const cv = document.getElementById('cvContent');
    cv.className = `cv-container template-${prof} bg-white text-gray-800`;
    
    updateCV();
    generateAISummary();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('photoPreview');
            img.src = e.target.result;
            img.classList.remove('hidden');
            document.getElementById('photoPlaceholder').classList.add('hidden');
            updateCV();
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    document.getElementById('photoPreview').src = '';
    document.getElementById('photoPreview').classList.add('hidden');
    document.getElementById('photoPlaceholder').classList.remove('hidden');
    document.getElementById('photoInput').value = '';
    updateCV();
}

function addCourse() {
    const id = Date.now();
    const course = { id, name: '', institution: '', year: '' };
    courses.push(course);
    
    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded-lg border border-gray-200 shadow-sm';
    div.id = `course-${id}`;
    div.innerHTML = `
        <div class="flex gap-2 mb-2">
            <input type="text" placeholder="Course/Degree Name" class="flex-1 px-3 py-1 rounded border border-gray-300 text-sm" oninput="updateCourse(${id}, 'name', this.value)">
            <button onclick="removeCourse(${id})" class="text-red-500 hover:text-red-700 p-1">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
        <div class="flex gap-2">
            <input type="text" placeholder="Institution" class="flex-1 px-3 py-1 rounded border border-gray-300 text-sm" oninput="updateCourse(${id}, 'institution', this.value)">
            <input type="text" placeholder="Year" class="w-24 px-3 py-1 rounded border border-gray-300 text-sm" oninput="updateCourse(${id}, 'year', this.value)">
        </div>
    `;
    
    document.getElementById('coursesList').appendChild(div);
    document.getElementById('emptyCourses').classList.add('hidden');
    lucide.createIcons();
}

function updateCourse(id, field, value) {
    const course = courses.find(c => c.id === id);
    if (course) {
        course[field] = value;
        updateCV();
    }
}

function removeCourse(id) {
    courses = courses.filter(c => c.id !== id);
    document.getElementById(`course-${id}`).remove();
    if (courses.length === 0) {
        document.getElementById('emptyCourses').classList.remove('hidden');
    }
    updateCV();
}

function addExperience() {
    const id = Date.now();
    const exp = { id, role: '', company: '', period: '', description: '' };
    experiences.push(exp);
    
    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded-lg border border-gray-200 shadow-sm';
    div.id = `exp-${id}`;
    div.innerHTML = `
        <div class="flex gap-2 mb-2">
            <input type="text" placeholder="Job Title" class="flex-1 px-3 py-1 rounded border border-gray-300 text-sm" oninput="updateExperience(${id}, 'role', this.value)">
            <button onclick="removeExperience(${id})" class="text-red-500 hover:text-red-700 p-1">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
        <div class="flex gap-2 mb-2">
            <input type="text" placeholder="Company" class="flex-1 px-3 py-1 rounded border border-gray-300 text-sm" oninput="updateExperience(${id}, 'company', this.value)">
            <input type="text" placeholder="Period (e.g. 2020-2023)" class="w-32 px-3 py-1 rounded border border-gray-300 text-sm" oninput="updateExperience(${id}, 'period', this.value)">
        </div>
        <textarea placeholder="Description (achievements, responsibilities...)" rows="2" class="w-full px-3 py-1 rounded border border-gray-300 text-sm resize-none" oninput="updateExperience(${id}, 'description', this.value)"></textarea>
    `;
    
    document.getElementById('experienceList').appendChild(div);
    document.getElementById('emptyExperience').classList.add('hidden');
    lucide.createIcons();
}

function updateExperience(id, field, value) {
    const exp = experiences.find(e => e.id === id);
    if (exp) {
        exp[field] = value;
        updateCV();
    }
}

function removeExperience(id) {
    experiences = experiences.filter(e => e.id !== id);
    document.getElementById(`exp-${id}`).remove();
    if (experiences.length === 0) {
        document.getElementById('emptyExperience').classList.remove('hidden');
    }
    updateCV();
}

function handleSkillKeypress(event) {
    if (event.key === 'Enter') {
        addSkill();
    }
}

function addSkill() {
    const input = document.getElementById('skillInput');
    const skill = input.value.trim();
    if (skill && !skills.includes(skill)) {
        skills.push(skill);
        renderSkills();
        input.value = '';
        updateCV();
    }
}

function quickAddSkill(skill) {
    if (!skills.includes(skill)) {
        skills.push(skill);
        renderSkills();
        updateCV();
    }
}

function removeSkill(skill) {
    skills = skills.filter(s => s !== skill);
    renderSkills();
    updateCV();
}

function renderSkills() {
    const container = document.getElementById('skillsList');
    container.innerHTML = skills.map(skill => `
        <span class="skill-tag bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            ${skill}
            <button onclick="removeSkill('${skill}')" class="hover:text-purple-900">
                <i data-lucide="x" class="w-3 h-3"></i>
            </button>
        </span>
    `).join('');
    lucide.createIcons();
}

function calculateAge(birthday) {
    if (!birthday) return '';
    const birthDate = new Date(birthday);
    const diff = Date.now() - birthDate.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age;
}

function setAgeStyle(style) {
    ageStyle = style;
    
    // Update UI buttons
    document.querySelectorAll('.age-style-btn').forEach(btn => {
        btn.classList.remove('border-purple-500', 'bg-purple-50');
        btn.classList.add('border-transparent', 'bg-gray-100');
    });
    
    const activeBtn = document.getElementById(`ageStyle-${style}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'bg-gray-100');
        activeBtn.classList.add('border-purple-500', 'bg-purple-50');
    }
    
    updateCV();
}

function setGradStyle(style) {
    gradStyle = style;
    
    // Update UI buttons
    document.querySelectorAll('.grad-style-btn').forEach(btn => {
        btn.classList.remove('border-purple-500', 'bg-purple-50');
        btn.classList.add('border-transparent', 'bg-gray-100');
    });
    
    const activeBtn = document.getElementById(`gradStyle-${style}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent', 'bg-gray-100');
        activeBtn.classList.add('border-purple-500', 'bg-purple-50');
    }
    
    updateCV();
}

function formatGraduationYear(year) {
    if (!year || gradStyle === 'none') return '';
    
    switch(gradStyle) {
        case 'class-of':
            return `Class of ${year}`;
        case 'since':
            return `Since ${year}`;
        case 'year':
        default:
            return year;
    }
}

function formatAgeDisplay(age, theme) {
    if (!age) return '';
    const showAge = document.getElementById('showAge')?.checked ?? true;
    if (!showAge) return '';
    
    switch(ageStyle) {
        case 'icon':
            return `<span class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4" style="color: ${theme.accent};"></i> ${age} years old</span>`;
        case 'badge':
            return `<span class="px-2 py-0.5 rounded-full text-xs font-medium" style="background: ${theme.accent}; color: white;">${age} yrs</span>`;
        case 'sidebar':
            return ''; // Handled separately in sidebar
        case 'text':
        default:
            return `${age} years old`;
    }
}

function generateAISummary() {
    const name = document.getElementById('fullName').value || 'The candidate';
    const prof = templates[currentProfession].title;
    const gradYear = document.getElementById('gradYear').value;
    const currentYear = new Date().getFullYear();
    const yearsExp = gradYear ? currentYear - parseInt(gradYear) : 0;
    
    const topSkills = skills.slice(0, 3).join(', ');
    const recentExp = experiences[experiences.length - 1];
    
    let summary = '';
    
    if (currentProfession === 'electrician') {
        summary = `${name} is a highly skilled ${prof} with ${yearsExp > 0 ? yearsExp + '+ years' : 'extensive hands-on experience'} in electrical installations, maintenance, and repair. ${yearsExp > 5 ? 'Known for troubleshooting complex electrical systems and ensuring safety compliance.' : 'Demonstrates strong technical aptitude and commitment to safety standards.'} ${topSkills ? 'Specialized in ' + topSkills + '.' : ''} ${recentExp ? 'Most recently focused on ' + recentExp.role + ' delivering reliable electrical solutions with precision and efficiency.' : 'Dedicated to delivering high-quality electrical solutions with precision and reliability.'}`;
    } else if (currentProfession === 'electrical') {
        summary = `Results-driven ${prof} with ${yearsExp > 0 ? yearsExp + '+ years' : 'a solid foundation'} of expertise in control systems, power electronics, and computer engineering. ${topSkills ? 'Proficient in ' + topSkills + ' with strong analytical capabilities.' : 'Possesses strong analytical and design capabilities.'} ${recentExp ? 'Currently serving as ' + recentExp.role + ', driving innovation in electrical system design and automation.' : 'Passionate about driving innovation in electrical system design and automation technologies.'} Committed to optimizing performance while maintaining the highest engineering standards.`;
    } else if (currentProfession === 'industrial') {
        summary = `Strategic ${prof} specializing in process optimization, lean manufacturing, and operational efficiency. ${yearsExp > 0 ? 'Brings ' + yearsExp + '+ years' : 'Offers a fresh perspective combined with solid academic foundations'} of experience in streamlining production workflows and reducing operational costs. ${topSkills ? 'Expertise includes ' + topSkills + '.' : ''} ${recentExp ? 'As ' + recentExp.role + ', successfully implemented data-driven improvements resulting in enhanced productivity and quality control.' : 'Data-driven professional dedicated to implementing sustainable improvements in manufacturing and production environments.'}`;
    } else {
        summary = `Versatile Multi-Disciplinary Engineer combining expertise in electrical systems, industrial processes, and computer controls. ${yearsExp > 0 ? 'With ' + yearsExp + '+ years' : 'With a comprehensive educational background and hands-on training'} of cross-functional experience, ${name.split(' ')[0] || 'the candidate'} bridges the gap between technical implementation and strategic optimization. ${topSkills ? 'Core competencies include ' + topSkills + '.' : ''} ${recentExp ? 'Currently leveraging diverse skill set as ' + recentExp.role + ', integrating electrical engineering principles with industrial efficiency methodologies.' : 'Adept at integrating electrical engineering principles with industrial efficiency methodologies to deliver comprehensive technical solutions.'}`;
    }
    
    document.getElementById('summary').value = summary;
    updateCV();
}

function getJobTitle(template) {
    const customTitle = document.getElementById('customTitle')?.value?.trim();
    return customTitle || template.title;
}

function updateCV() {
    const name = document.getElementById('fullName').value || 'Your Name';
    const birthday = document.getElementById('birthday').value;
    const age = calculateAge(birthday);
    const gradYear = document.getElementById('gradYear').value;
    const formattedGradYear = formatGraduationYear(gradYear);
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const summary = document.getElementById('summary').value;
    const photo = document.getElementById('photoPreview').src;
    const hasPhoto = !document.getElementById('photoPreview').classList.contains('hidden');
    const theme = themes[currentTheme];
    const template = templates[currentProfession];
    const jobTitle = getJobTitle(template);
    const ageDisplay = formatAgeDisplay(age, theme);
    
    // Generate HTML based on profession template
    let html = '';
    
    if (currentProfession === 'electrician') {
        html = generateElectricianTemplate({name, age, ageDisplay, formattedGradYear, gradYear, phone, email, summary, photo, hasPhoto, template, theme, jobTitle});
    } else if (currentProfession === 'electrical') {
        html = generateElectricalTemplate({name, age, ageDisplay, formattedGradYear, gradYear, phone, email, summary, photo, hasPhoto, template, theme, jobTitle});
    } else if (currentProfession === 'industrial') {
        html = generateIndustrialTemplate({name, age, ageDisplay, formattedGradYear, gradYear, phone, email, summary, photo, hasPhoto, template, theme, jobTitle});
    } else {
        html = generateCombinedTemplate({name, age, ageDisplay, formattedGradYear, gradYear, phone, email, summary, photo, hasPhoto, template, theme, jobTitle});
    }
    
    document.getElementById('cvContent').innerHTML = html;
    
    // Apply dynamic theme styles
    applyThemeStyles(theme);
}

function applyThemeStyles(theme) {
    const cv = document.getElementById('cvContent');
    cv.style.setProperty('--theme-primary', theme.primary);
    cv.style.setProperty('--theme-secondary', theme.secondary);
    cv.style.setProperty('--theme-accent', theme.accent);
}

function generateElectricianTemplate(data) {
    const t = data.theme;
    const showAge = document.getElementById('showAge')?.checked ?? true;
    const showSidebarAge = showAge && ageStyle === 'sidebar';
    const showHeaderAge = showAge && ageStyle !== 'sidebar' && data.age;
    const headerAgeDisplay = showHeaderAge ? data.ageDisplay : '';
    
    return `
        <div class="flex flex-col h-full" style="font-family: 'Inter', sans-serif;">
            <!-- Header -->
            <div class="p-8 flex items-center gap-6 text-white" style="background: ${t.headerGradient};">
                ${data.hasPhoto ? `<img src="${data.photo}" class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg">` : ''}
                <div class="flex-1">
                    <h1 class="text-4xl font-bold mb-2">${data.name}</h1>
                    <p class="text-xl mb-3" style="color: rgba(255,255,255,0.9);">${data.jobTitle}</p>
                    <div class="flex flex-wrap gap-4 text-sm" style="color: rgba(255,255,255,0.8);">
                        ${data.phone ? `<span class="flex items-center gap-1"><i data-lucide="phone" class="w-4 h-4"></i> ${data.phone}</span>` : ''}
                        ${data.email ? `<span class="flex items-center gap-1"><i data-lucide="mail" class="w-4 h-4"></i> ${data.email}</span>` : ''}
                        ${headerAgeDisplay}
                        ${data.formattedGradYear && gradStyle !== 'none' ? `<span class="flex items-center gap-1"><i data-lucide="graduation-cap" class="w-4 h-4"></i> ${data.formattedGradYear}</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="flex flex-1">
                <!-- Sidebar -->
                <div class="w-1/3 p-6 space-y-6 text-white" style="background: ${t.secondary};">
                    <div>
                        <h3 class="font-bold mb-3 uppercase tracking-wider text-sm" style="color: ${t.accent};">Contact</h3>
                        <div class="space-y-2 text-sm">
                            ${data.phone ? `<div class="flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4" style="color: ${t.accent};"></i> ${data.phone}</div>` : ''}
                            ${data.email ? `<div class="flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4" style="color: ${t.accent};"></i> ${data.email}</div>` : ''}
                            ${showSidebarAge ? `<div class="flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4" style="color: ${t.accent};"></i> ${data.age} years old</div>` : ''}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="font-bold mb-3 uppercase tracking-wider text-sm" style="color: ${t.accent};">Education</h3>
                        <div class="space-y-3">
                            ${courses.map(c => `
                                <div>
                                    <div class="font-semibold text-white">${c.name || 'Course Name'}</div>
                                    <div class="text-gray-400 text-sm">${c.institution || 'Institution'}</div>
                                    ${c.year ? `<div class="text-xs" style="color: ${t.accent};">${c.year}</div>` : ''}
                                </div>
                            `).join('') || '<div class="text-gray-400 text-sm">No education listed</div>'}
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="font-bold mb-3 uppercase tracking-wider text-sm" style="color: ${t.accent};">Skills</h3>
                        <div class="flex flex-wrap gap-2">
                            ${skills.map(s => `<span class="px-2 py-1 rounded text-xs" style="background: rgba(255,255,255,0.1); color: white;">${s}</span>`).join('') || '<span class="text-gray-400 text-sm">No skills listed</span>'}
                        </div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="w-2/3 p-8 bg-white">
                    <div class="mb-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-3 pb-1 border-b-2" style="border-color: ${t.primary};">Professional Profile</h2>
                        <p class="text-gray-600 leading-relaxed">${data.summary || 'Your professional summary will appear here...'}</p>
                    </div>
                    
                    <div>
                        <h2 class="text-xl font-bold text-gray-800 mb-4 pb-1 border-b-2" style="border-color: ${t.primary};">Work Experience</h2>
                        <div class="space-y-4">
                            ${experiences.map(e => `
                                <div class="border-l-2 pl-4" style="border-color: ${t.accent};">
                                    <div class="flex justify-between items-baseline mb-1">
                                        <h3 class="font-bold text-gray-800">${e.role || 'Job Title'}</h3>
                                        <span class="text-sm font-semibold" style="color: ${t.primary};">${e.period || 'Period'}</span>
                                    </div>
                                    <div class="text-gray-600 font-medium mb-2">${e.company || 'Company Name'}</div>
                                    <p class="text-gray-600 text-sm leading-relaxed">${e.description || 'Job description...'}</p>
                                </div>
                            `).join('') || '<div class="text-gray-400 italic">No work experience listed</div>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateElectricalTemplate(data) {
    const t = data.theme;
    const showAge = document.getElementById('showAge')?.checked ?? true;
    
    return `
        <div class="p-8 h-full bg-white" style="font-family: 'Inter', sans-serif;">
            <!-- Header -->
            <div class="-mx-8 -mt-8 px-8 pt-8 pb-6 mb-6 text-white" style="background: ${t.headerGradient}; border-bottom: 4px solid ${t.accent};">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h1 class="text-4xl font-bold mb-2">${data.name}</h1>
                        <p class="text-xl mb-4" style="color: rgba(255,255,255,0.9);">${data.jobTitle}</p>
                        <div class="flex flex-wrap gap-4 text-sm" style="color: rgba(255,255,255,0.8);">
                            ${data.email ? `<span class="flex items-center gap-1"><i data-lucide="mail" class="w-4 h-4"></i> ${data.email}</span>` : ''}
                            ${data.phone ? `<span class="flex items-center gap-1"><i data-lucide="phone" class="w-4 h-4"></i> ${data.phone}</span>` : ''}
                            ${showAge && data.age ? `<span class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4"></i> ${data.age} years old</span>` : ''}
                            ${data.formattedGradYear && gradStyle !== 'none' ? `<span class="flex items-center gap-1"><i data-lucide="award" class="w-4 h-4"></i> ${data.formattedGradYear}</span>` : ''}
                        </div>
                    </div>
                    ${data.hasPhoto ? `<img src="${data.photo}" class="w-28 h-28 rounded-lg object-cover border-4 border-white shadow-lg">` : ''}
                </div>
            </div>
            
            <!-- Summary Quote -->
            <div class="p-4 mb-6 italic text-gray-700 rounded-r border-l-4" style="background: ${t.lightBg}; border-color: ${t.primary};">
                "${data.summary || 'Your AI-generated professional summary will highlight your technical expertise and engineering capabilities...'}"
            </div>
            
            <div class="grid grid-cols-3 gap-6">
                <!-- Left Column -->
                <div class="col-span-2 space-y-6">
                    <section>
                        <h2 class="text-lg font-bold mb-3 flex items-center gap-2" style="color: ${t.secondary};">
                            <i data-lucide="briefcase" class="w-5 h-5" style="color: ${t.primary};"></i>
                            Professional Experience
                        </h2>
                        <div class="space-y-4">
                            ${experiences.map(e => `
                                <div class="p-4 rounded-lg" style="background: ${t.lightBg};">
                                    <div class="flex justify-between mb-1">
                                        <h3 class="font-bold text-gray-800">${e.role || 'Position'}</h3>
                                        <span class="text-sm" style="color: ${t.primary};">${e.period || 'Date'}</span>
                                    </div>
                                    <div class="font-medium text-sm mb-2" style="color: ${t.secondary};">${e.company || 'Company'}</div>
                                    <p class="text-gray-600 text-sm">${e.description || 'Description of responsibilities and achievements...'}</p>
                                </div>
                            `).join('') || '<div class="text-gray-400 italic p-4 rounded" style="background: ' + t.lightBg + ';">No experience listed</div>'}
                        </div>
                    </section>
                    
                    <section>
                        <h2 class="text-lg font-bold mb-3 flex items-center gap-2" style="color: ${t.secondary};">
                            <i data-lucide="book-open" class="w-5 h-5" style="color: ${t.primary};"></i>
                            Education & Certifications
                        </h2>
                        <div class="grid grid-cols-2 gap-3">
                            ${courses.map(c => `
                                <div class="border p-3 rounded-lg" style="border-color: #e5e7eb;">
                                    <div class="font-semibold text-gray-800">${c.name || 'Degree/Course'}</div>
                                    <div class="text-sm text-gray-600">${c.institution || 'Institution'}</div>
                                    ${c.year ? `<div class="text-xs mt-1" style="color: ${t.primary};">${c.year}</div>` : ''}
                                </div>
                            `).join('') || '<div class="text-gray-400 italic col-span-2">No education listed</div>'}
                        </div>
                    </section>
                </div>
                
                <!-- Right Column -->
                <div class="space-y-6">
                    <section>
                        <h2 class="text-lg font-bold mb-3" style="color: ${t.secondary};">Technical Skills</h2>
                        <div class="flex flex-wrap gap-2">
                            ${skills.map(s => `
                                <span class="px-3 py-1 rounded-full text-sm font-medium" style="background: ${t.lightBg}; color: ${t.secondary};">${s}</span>
                            `).join('') || '<span class="text-gray-400 text-sm">No skills listed</span>'}
                        </div>
                    </section>
                    
                    <section>
                        <h2 class="text-lg font-bold mb-3" style="color: ${t.secondary};">Contact Info</h2>
                        <div class="space-y-2 text-sm">
                            ${data.phone ? `<div class="flex items-center gap-2 text-gray-700"><i data-lucide="phone" class="w-4 h-4" style="color: ${t.primary};"></i> ${data.phone}</div>` : ''}
                            ${data.email ? `<div class="flex items-center gap-2 text-gray-700"><i data-lucide="mail" class="w-4 h-4" style="color: ${t.primary};"></i> ${data.email}</div>` : ''}
                            ${showAge && data.age ? `<div class="flex items-center gap-2 text-gray-700"><i data-lucide="user" class="w-4 h-4" style="color: ${t.primary};"></i> ${data.age} years old</div>` : ''}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `;
}

function generateIndustrialTemplate(data) {
    const t = data.theme;
    const showAge = document.getElementById('showAge')?.checked ?? true;
    const ageBadge = showAge && data.age && ageStyle === 'badge' ? 
        `<span class="px-2 py-1 rounded-full text-xs font-medium ml-2" style="background: ${t.accent}; color: white;">${data.age} yrs</span>` : '';
    const ageText = showAge && data.age && ageStyle !== 'badge' ? ` • ${data.age} years old` : '';
    
    return `
        <div class="h-full flex flex-col bg-white" style="font-family: 'Inter', sans-serif;">
            <!-- Header -->
            <div class="p-6 mb-6 text-white" style="background: ${t.headerGradient}; border-left: 8px solid ${t.accent};">
                <div class="flex items-center gap-6">
                    ${data.hasPhoto ? `<img src="${data.photo}" class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md">` : ''}
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold mb-1">${data.name}</h1>
                        <p class="text-lg" style="color: rgba(255,255,255,0.9);">${data.jobTitle}${ageBadge}</p>
                        <div class="flex gap-4 mt-2 text-sm" style="color: rgba(255,255,255,0.8);">
                            ${data.email ? `<span>${data.email}</span>` : ''}
                            ${data.phone ? `<span>• ${data.phone}</span>` : ''}
                            ${ageStyle !== 'badge' && showAge ? ageText : ''}
                            ${data.formattedGradYear && gradStyle !== 'none' ? `<span>• ${data.formattedGradYear}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="px-8 pb-8 flex-1">
                <!-- Summary -->
                <div class="mb-8 text-center">
                    <p class="text-gray-700 italic text-lg leading-relaxed max-w-3xl mx-auto border-t border-b py-4" style="border-color: #e5e7eb;">
                        ${data.summary || 'Strategic professional summary highlighting optimization expertise and operational excellence...'}
                    </p>
                </div>
                
                <div class="grid grid-cols-2 gap-8">
                    <!-- Experience -->
                    <div>
                        <h2 class="text-lg font-bold mb-4 pb-2 border-b-2" style="color: ${t.secondary}; border-color: ${t.primary};">Experience</h2>
                        <div class="space-y-4">
                            ${experiences.map(e => `
                                <div class="relative pl-4 border-l-2" style="border-color: ${t.accent};">
                                    <div class="absolute -left-2 top-0 w-4 h-4 rounded-full" style="background: ${t.primary};"></div>
                                    <h3 class="font-bold text-gray-800">${e.role || 'Position'}</h3>
                                    <div class="font-medium text-sm" style="color: ${t.primary};">${e.company || 'Company'}</div>
                                    <div class="text-gray-500 text-xs mb-1">${e.period || 'Period'}</div>
                                    <p class="text-gray-600 text-sm">${e.description || ''}</p>
                                </div>
                            `).join('') || '<div class="text-gray-400 italic">No experience listed</div>'}
                        </div>
                    </div>
                    
                    <!-- Education & Skills -->
                    <div class="space-y-6">
                        <div>
                            <h2 class="text-lg font-bold mb-4 pb-2 border-b-2" style="color: ${t.secondary}; border-color: ${t.primary};">Education</h2>
                            <div class="space-y-3">
                                ${courses.map(c => `
                                    <div class="p-3 rounded-lg" style="background: ${t.lightBg};">
                                        <div class="font-semibold text-gray-800">${c.name || 'Degree'}</div>
                                        <div class="text-sm text-gray-600">${c.institution || 'School'}</div>
                                        ${c.year ? `<div class="text-xs font-semibold" style="color: ${t.primary};">${c.year}</div>` : ''}
                                    </div>
                                `).join('') || '<div class="text-gray-400 italic">No education listed</div>'}
                            </div>
                        </div>
                        
                        <div>
                            <h2 class="text-lg font-bold mb-4 pb-2 border-b-2" style="color: ${t.secondary}; border-color: ${t.primary};">Core Competencies</h2>
                            <div class="grid grid-cols-2 gap-2">
                                ${skills.map(s => `
                                    <div class="flex items-center gap-2 text-sm text-gray-700">
                                        <i data-lucide="check-circle" class="w-4 h-4" style="color: ${t.primary};"></i>
                                        ${s}
                                    </div>
                                `).join('') || '<div class="text-gray-400 italic col-span-2">No skills listed</div>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateCombinedTemplate(data) {
    const t = data.theme;
    const showAge = document.getElementById('showAge')?.checked ?? true;
    
    return `
        <div class="h-full relative overflow-hidden bg-white" style="font-family: 'Inter', sans-serif;">
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-32 -mt-32" style="background: ${t.primary};"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 -ml-32 -mb-32" style="background: ${t.accent};"></div>
            
            <div class="relative z-10 p-8 h-full flex flex-col">
                <!-- Header -->
                <div class="rounded-2xl p-6 mb-6 shadow-xl text-white" style="background: ${t.headerGradient};">
                    <div class="flex items-center gap-6">
                        ${data.hasPhoto ? `<img src="${data.photo}" class="w-28 h-28 rounded-2xl object-cover border-4 border-white/30 shadow-lg">` : ''}
                        <div class="flex-1">
                            <h1 class="text-4xl font-bold mb-2">${data.name}</h1>
                            <p class="text-xl mb-3" style="color: rgba(255,255,255,0.9);">${data.jobTitle}</p>
                            <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm" style="color: rgba(255,255,255,0.8);">
                                ${data.email ? `<span class="flex items-center gap-1"><i data-lucide="mail" class="w-4 h-4"></i> ${data.email}</span>` : ''}
                                ${data.phone ? `<span class="flex items-center gap-1"><i data-lucide="phone" class="w-4 h-4"></i> ${data.phone}</span>` : ''}
                                ${showAge && data.age ? `<span class="flex items-center gap-1"><i data-lucide="calendar" class="w-4 h-4"></i> ${data.age} years old</span>` : ''}
                                ${data.formattedGradYear && gradStyle !== 'none' ? `<span class="flex items-center gap-1"><i data-lucide="award" class="w-4 h-4"></i> ${data.formattedGradYear}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quote -->
                <div class="rounded-xl p-4 mb-6 shadow-sm border-l-4" style="background: ${t.lightBg}; border-color: ${t.primary};">
                    <p class="text-gray-700 italic text-center">"${data.summary || 'Versatile engineer combining electrical, industrial, and computer engineering expertise...'}"</p>
                </div>
                
                <div class="grid grid-cols-12 gap-6 flex-1">
                    <!-- Left Sidebar -->
                    <div class="col-span-4 space-y-6">
                        <div class="rounded-xl p-4 shadow-sm border" style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-color: ${t.accent}40;">
                            <h3 class="font-bold mb-3 flex items-center gap-2" style="color: ${t.secondary};">
                                <i data-lucide="zap" class="w-4 h-4" style="color: ${t.primary};"></i>
                                Expertise Areas
                            </h3>
                            <div class="space-y-2">
                                <div class="text-sm text-gray-700 flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full" style="background: ${t.primary};"></span>
                                    Electrical Systems
                                </div>
                                <div class="text-sm text-gray-700 flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full" style="background: ${t.secondary};"></span>
                                    Industrial Process
                                </div>
                                <div class="text-sm text-gray-700 flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full" style="background: ${t.accent};"></span>
                                    Control & Computer
                                </div>
                            </div>
                        </div>
                        
                        <div class="rounded-xl p-4 shadow-sm border" style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-color: ${t.accent}40;">
                            <h3 class="font-bold mb-3" style="color: ${t.secondary};">Education</h3>
                            <div class="space-y-3">
                                ${courses.map(c => `
                                    <div class="text-sm">
                                        <div class="font-semibold text-gray-800">${c.name || 'Degree'}</div>
                                        <div class="text-gray-600">${c.institution || 'Institution'}</div>
                                        ${c.year ? `<div class="text-xs" style="color: ${t.primary};">${c.year}</div>` : ''}
                                    </div>
                                `).join('') || '<div class="text-gray-400 text-sm">No education listed</div>'}
                            </div>
                        </div>
                        
                        ${showAge && data.age && ageStyle === 'sidebar' ? `
                        <div class="rounded-xl p-4 shadow-sm border" style="background: ${t.lightBg}; border-color: ${t.primary};">
                            <h3 class="font-bold mb-2 flex items-center gap-2" style="color: ${t.secondary};">
                                <i data-lucide="user" class="w-4 h-4" style="color: ${t.primary};"></i>
                                Age
                            </h3>
                            <p class="text-2xl font-bold" style="color: ${t.primary};">${data.age} <span class="text-sm font-normal text-gray-600">years old</span></p>
                        </div>
                        ` : ''}
                    </div>
                    
                    <!-- Main Content -->
                    <div class="col-span-8 space-y-6">
                        <div class="rounded-xl p-5 shadow-sm border" style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-color: ${t.accent}40;">
                            <h3 class="font-bold mb-4 flex items-center gap-2" style="color: ${t.secondary};">
                                <i data-lucide="briefcase" class="w-5 h-5" style="color: ${t.primary};"></i>
                                Professional Experience
                            </h3>
                            <div class="space-y-4">
                                ${experiences.map(e => `
                                    <div class="flex gap-4">
                                        <div class="w-24 shrink-0 text-xs pt-1" style="color: ${t.secondary};">${e.period || 'Date'}</div>
                                        <div class="flex-1 pb-4 border-b border-gray-100 last:border-0">
                                            <h4 class="font-bold text-gray-800">${e.role || 'Position'}</h4>
                                            <div class="text-sm mb-2" style="color: ${t.primary};">${e.company || 'Company'}</div>
                                            <p class="text-gray-600 text-sm leading-relaxed">${e.description || ''}</p>
                                        </div>
                                    </div>
                                `).join('') || '<div class="text-gray-400 italic">No experience listed</div>'}
                            </div>
                        </div>
                        
                        <div class="rounded-xl p-5 shadow-sm border" style="background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); border-color: ${t.accent}40;">
                            <h3 class="font-bold mb-4" style="color: ${t.secondary};">Technical Skills</h3>
                            <div class="flex flex-wrap gap-2">
                                ${skills.map(s => `
                                    <span class="px-3 py-1 rounded-full text-sm font-medium border" style="background: ${t.lightBg}; color: ${t.secondary}; border-color: ${t.accent}40;">${s}</span>
                                `).join('') || '<span class="text-gray-400">No skills listed</span>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Zoom controls
function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.1, 1.5);
    applyZoom();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
    applyZoom();
}

function applyZoom() {
    const cv = document.getElementById('cvContent');
    cv.style.transform = `scale(${zoomLevel})`;
    cv.style.transformOrigin = 'top center';
}

function toggleFullScreen() {
    const container = document.getElementById('cvPreviewContainer');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

// PDF Generation
async function generatePDF() {
    const btn = document.querySelector('button[onclick="generatePDF()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading-pulse">Generating...</span>';
    btn.disabled = true;
    
    try {
        const { jsPDF } = window.jspdf;
        const cvElement = document.getElementById('cvContent');
        
        // Create canvas from CV element
        const canvas = await html2canvas(cvElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // Save with professional name
        const name = document.getElementById('fullName').value || 'CV';
        const prof = currentProfession.charAt(0).toUpperCase() + currentProfession.slice(1);
        pdf.save(`${name}_${prof}_Engineer_CV.pdf`);
        
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again or use the print function (Ctrl+P).');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
        lucide.createIcons();
    }
}

// Initial setup
setProfession('electrician');
