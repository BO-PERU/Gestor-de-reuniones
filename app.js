// Estado Global
let appState = {
    agendas: [], // Array de objetos agenda
    currentAgendaId: null,
    isTimerRunning: false,
    timerInterval: null
};

// Pantallas
const agendasListScreen = document.getElementById('agendas-list-screen');
const setupScreen = document.getElementById('setup-screen');
const timerScreen = document.getElementById('timer-screen');
const summaryScreen = document.getElementById('summary-screen');

// Elementos - Listado
const agendasList = document.getElementById('agendas-list');
const createAgendaBtn = document.getElementById('create-agenda-btn');

// Elementos - Setup
const backToListBtn = document.getElementById('back-to-list-btn');
const meetingNameInput = document.getElementById('meeting-name');
const meetingClientInput = document.getElementById('meeting-client');
const meetingDateInput = document.getElementById('meeting-date');
const totalTimeInput = document.getElementById('total-time');

const topicNameInput = document.getElementById('topic-name');
const topicTimeInput = document.getElementById('topic-time');
const addTopicBtn = document.getElementById('add-topic-btn');
const topicsList = document.getElementById('topics-list');
const saveAgendaBtn = document.getElementById('save-agenda-btn');

const summaryTotal = document.getElementById('summary-total');
const summaryAssigned = document.getElementById('summary-assigned');
const summaryAvailable = document.getElementById('summary-available');

// Elementos - Timer
const activeMeetingName = document.getElementById('active-meeting-name');
const overallProgress = document.getElementById('overall-progress');
const currentTopicName = document.getElementById('current-topic-name');
const mainTimer = document.getElementById('main-timer');
const elapsedTimeEl = document.getElementById('elapsed-time');
const topicDurationBadge = document.getElementById('topic-duration-badge');
const pauseResumeBtn = document.getElementById('pause-resume-btn');
const skipBtn = document.getElementById('skip-btn');
const nextTopicName = document.getElementById('next-topic-name');
const endMeetingBtn = document.getElementById('end-meeting-btn');

// Elementos - Summary
const summaryListDOM = document.getElementById('summary-list');
const newMeetingBtn = document.getElementById('new-meeting-btn'); // Volver al listado
const syncStatus = document.getElementById('sync-status');

// Cliente Supabase
const supabaseUrl = 'https://yyqdysmfncahtumvoxnh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cWR5c21mbmNhaHR1bXZveG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTQzMzYsImV4cCI6MjA5NzgzMDMzNn0.E6ujyKDPm5uVUUE6U4A7h6k44AGsl26ljfrYBmjOWNg';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Elementos - Acuerdos
const setupAgreementsBtn = document.getElementById('setup-agreements-btn');
const summaryAgreementsBtn = document.getElementById('summary-agreements-btn');
const agreementsModal = document.getElementById('agreements-modal');
const agreementTextInput = document.getElementById('agreement-text');
const agreementRespInput = document.getElementById('agreement-responsible');
const agreementDateInput = document.getElementById('agreement-date');
const addAgreementBtn = document.getElementById('add-agreement-btn');
const agreementsList = document.getElementById('agreements-list');
const copyAgreementsBtn = document.getElementById('copy-agreements-btn');
const closeAgreementsBtn = document.getElementById('close-agreements-btn');

// Elementos - Backup
const backupDownloadBtn = document.getElementById('backup-download-btn');
const backupUploadBtn = document.getElementById('backup-upload-btn');
const backupFileInput = document.getElementById('backup-file-input');

// Motor de audio diferido
let audioCtx = null;
function playBeep() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        try {
            audioCtx = new AudioContext();
        } catch (e) {
            console.warn("AudioContext bloqueado");
            return;
        }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
}

// -- ESTADO E INICIALIZACIÓN --

async function saveState() {
    try {
        syncStatus.textContent = "🟡 Guardando...";
        const { error } = await supabaseClient
            .from('app_state')
            .upsert({ id: 1, data: appState.agendas });
            
        if (error) throw error;
        syncStatus.textContent = "🟢 Sincronizado";
    } catch (e) {
        console.error("Error guardando:", e);
        syncStatus.textContent = "🔴 Error de Sync";
    }
}

async function loadState() {
    try {
        syncStatus.textContent = "🟡 Cargando...";
        const { data, error } = await supabaseClient
            .from('app_state')
            .select('data')
            .eq('id', 1)
            .single();
            
        if (data && data.data) {
            appState.agendas = data.data;
        }
        syncStatus.textContent = "🟢 Sincronizado";
    } catch (e) {
        console.error("Error cargando desde Supabase", e);
        syncStatus.textContent = "🔴 Error de Red";
    }
}

async function init() {
    await loadState();
    setupEventListeners();
    renderAgendasList();
}

function setupEventListeners() {
    // Pantalla Principal
    createAgendaBtn.addEventListener('click', createNewAgenda);
    backToListBtn.addEventListener('click', () => {
        saveState();
        switchScreen(setupScreen, agendasListScreen);
        renderAgendasList();
    });

    // Inputs de Agenda Activa
    meetingNameInput.addEventListener('input', updateCurrentAgenda);
    meetingClientInput.addEventListener('input', updateCurrentAgenda);
    meetingDateInput.addEventListener('change', updateCurrentAgenda);
    totalTimeInput.addEventListener('input', () => {
        updateCurrentAgenda();
        updateSummary();
    });

    addTopicBtn.addEventListener('click', addTopic);
    saveAgendaBtn.addEventListener('click', () => {
        saveState();
        switchScreen(setupScreen, agendasListScreen);
        renderAgendasList();
    });
    
    // Timer
    pauseResumeBtn.addEventListener('click', togglePause);
    skipBtn.addEventListener('click', skipToNextTopic);
    endMeetingBtn.addEventListener('click', finishMeeting);
    
    // Resumen
    newMeetingBtn.addEventListener('click', () => {
        switchScreen(summaryScreen, agendasListScreen);
        renderAgendasList();
    });

    // Backup Local
    backupDownloadBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(appState.agendas, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_reuniones_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    backupUploadBtn.addEventListener('click', () => {
        backupFileInput.click();
    });

    backupFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (Array.isArray(parsed)) {
                    if (confirm('Esto sobrescribirá tus agendas actuales. ¿Estás seguro?')) {
                        appState.agendas = parsed;
                        saveState();
                        renderAgendasList();
                        alert('¡Backup restaurado con éxito!');
                    }
                } else {
                    alert('El archivo no tiene el formato correcto.');
                }
            } catch(err) {
                alert('Error al leer el archivo de backup.');
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    });

    // Modal de Acuerdos
    const openAgreementsModal = () => {
        const agenda = getCurrentAgenda();
        if (agenda) {
            renderAgreementsList();
            agreementsModal.classList.add('active');
        }
    };
    setupAgreementsBtn.addEventListener('click', openAgreementsModal);
    summaryAgreementsBtn.addEventListener('click', openAgreementsModal);
    closeAgreementsBtn.addEventListener('click', () => agreementsModal.classList.remove('active'));
    addAgreementBtn.addEventListener('click', addAgreement);
    copyAgreementsBtn.addEventListener('click', copyAgreements);

    window.addEventListener('beforeunload', (e) => {
        if (appState.isTimerRunning) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function getCurrentAgenda() {
    return appState.agendas.find(a => a.id === appState.currentAgendaId);
}

function switchScreen(from, to) {
    from.classList.remove('active');
    to.classList.add('active');
}

// -- LÓGICA DE LISTADO --
function renderAgendasList() {
    if (appState.agendas.length === 0) {
        agendasList.innerHTML = '<li class="empty-state">No tienes agendas guardadas.</li>';
        return;
    }
    agendasList.innerHTML = '';
    appState.agendas.forEach(agenda => {
        const li = document.createElement('li');
        li.className = 'agenda-card';
        
        const dateStr = agenda.date ? new Date(agenda.date + 'T12:00:00').toLocaleDateString() : 'Sin fecha';
        const clientStr = agenda.client || 'Sin cliente';
        
        li.innerHTML = `
            <div class="title">${agenda.name || 'Reunión sin nombre'}</div>
            <div class="details">
                <span>📅 ${dateStr}</span>
                <span>👤 ${clientStr}</span>
                <span>⏱ ${agenda.totalTimeMinutes}m</span>
            </div>
            <div class="card-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn primary small start-agenda-btn" data-id="${agenda.id}">Comenzar</button>
                <button class="btn secondary small edit-agenda-btn" data-id="${agenda.id}">Editar</button>
            </div>
            <button class="delete-agenda-btn" title="Eliminar agenda">🗑</button>
        `;
        
        li.querySelector('.start-agenda-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            startMeeting(agenda.id);
        });
        
        li.querySelector('.edit-agenda-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openAgenda(agenda.id);
        });
        
        li.querySelector('.delete-agenda-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if(confirm('¿Eliminar esta agenda?')) {
                appState.agendas = appState.agendas.filter(a => a.id !== agenda.id);
                saveState();
                renderAgendasList();
            }
        });
        
        agendasList.appendChild(li);
    });
}

function createNewAgenda() {
    const newAgenda = {
        id: Date.now().toString(),
        name: '',
        client: '',
        date: '',
        totalTimeMinutes: 0,
        topics: [],
        agreements: [],
        currentTopicIndex: 0
    };
    appState.agendas.push(newAgenda);
    appState.currentAgendaId = newAgenda.id;
    saveState();
    loadAgendaIntoSetup(newAgenda);
    switchScreen(agendasListScreen, setupScreen);
}

function openAgenda(id) {
    appState.currentAgendaId = id;
    const agenda = getCurrentAgenda();
    if (agenda) {
        loadAgendaIntoSetup(agenda);
        switchScreen(agendasListScreen, setupScreen);
    }
}

// -- LÓGICA DE SETUP DE AGENDA --
function loadAgendaIntoSetup(agenda) {
    meetingNameInput.value = agenda.name;
    meetingClientInput.value = agenda.client;
    meetingDateInput.value = agenda.date;
    totalTimeInput.value = agenda.totalTimeMinutes || '';
    
    updateSummary();
    renderTopicsList();
}

function updateCurrentAgenda() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    agenda.name = meetingNameInput.value;
    agenda.client = meetingClientInput.value;
    agenda.date = meetingDateInput.value;
    agenda.totalTimeMinutes = parseInt(totalTimeInput.value) || 0;
    
    saveState();
}

function updateSummary() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    const assigned = agenda.topics.reduce((acc, t) => acc + t.allocatedMinutes, 0);
    const available = Math.max(0, agenda.totalTimeMinutes - assigned);
    
    summaryTotal.textContent = `${agenda.totalTimeMinutes}m`;
    summaryAssigned.textContent = `${assigned}m`;
    summaryAvailable.textContent = `${available}m`;
    
    addTopicBtn.disabled = available <= 0;
}

function addTopic() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    const name = topicNameInput.value.trim();
    let time = parseInt(topicTimeInput.value);
    
    if (!name || isNaN(time) || time <= 0) return;
    
    const assigned = agenda.topics.reduce((acc, t) => acc + t.allocatedMinutes, 0);
    const available = agenda.totalTimeMinutes - assigned;
    
    if (time > available) {
        time = available;
        topicTimeInput.value = time;
        alert(`El tiempo máximo disponible es ${available} minutos.`);
    }
    
    agenda.topics.push({
        id: Date.now().toString(),
        name,
        allocatedMinutes: time,
        allocatedSeconds: time * 60,
        elapsedSeconds: 0,
        completed: false
    });
    
    topicNameInput.value = '';
    topicTimeInput.value = '';
    topicNameInput.focus();
    
    updateSummary();
    renderTopicsList();
    saveState();
}

function renderTopicsList() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    if (agenda.topics.length === 0) {
        topicsList.innerHTML = '<li class="empty-state">No hay temas agregados.</li>';
        return;
    }
    
    topicsList.innerHTML = '';
    agenda.topics.forEach((topic, index) => {
        const li = document.createElement('li');
        li.className = 'topic-item';
        li.innerHTML = `
            <div class="info">
                <span class="name">${index + 1}. ${topic.name}</span>
                <span class="time">
                    <input type="number" class="inline-time-input" value="${topic.allocatedMinutes}" min="1" data-id="${topic.id}"> min
                </span>
            </div>
            <button class="delete-btn" data-id="${topic.id}">×</button>
        `;
        
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTopic(topic.id);
        });
        
        const timeInput = li.querySelector('.inline-time-input');
        timeInput.addEventListener('change', (e) => {
            const newTime = parseInt(e.target.value);
            if (isNaN(newTime) || newTime <= 0) {
                e.target.value = topic.allocatedMinutes;
                return;
            }
            
            const otherTopicsTime = agenda.topics.reduce((acc, t) => t.id === topic.id ? acc : acc + t.allocatedMinutes, 0);
            const available = agenda.totalTimeMinutes - otherTopicsTime;
            
            let finalTime = newTime;
            if (newTime > available) {
                finalTime = Math.max(1, available);
                alert(`Se ha ajustado a ${finalTime} minutos (límite disponible).`);
            }
            
            topic.allocatedMinutes = finalTime;
            topic.allocatedSeconds = finalTime * 60;
            
            saveState();
            updateSummary();
            renderTopicsList();
        });
        
        topicsList.appendChild(li);
    });
}

function deleteTopic(id) {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    agenda.topics = agenda.topics.filter(t => t.id !== id);
    updateSummary();
    renderTopicsList();
    saveState();
}

// -- LÓGICA DE ACUERDOS --
function renderAgreementsList() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    if (!agenda.agreements || agenda.agreements.length === 0) {
        agreementsList.innerHTML = '<li class="empty-state">No hay acuerdos registrados.</li>';
        return;
    }
    
    agreementsList.innerHTML = '';
    agenda.agreements.forEach((agr) => {
        const li = document.createElement('li');
        li.className = 'topic-item'; // Reusando estilo de la lista de temas
        li.style.flexDirection = 'column';
        li.style.alignItems = 'flex-start';
        li.style.gap = '0.5rem';
        
        const dateFormatted = agr.date ? new Date(agr.date + 'T12:00:00').toLocaleDateString() : 'Sin fecha';
        
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <strong style="font-size: 1rem; color: var(--text-primary);">&#8226; ${agr.text}</strong>
                <button class="delete-btn" data-id="${agr.id}" style="position: static;">×</button>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 1rem;">
                <span>👤 Resp: ${agr.responsible || 'N/A'}</span>
                <span>📅 Límite: ${dateFormatted}</span>
            </div>
        `;
        
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteAgreement(agr.id);
        });
        
        agreementsList.appendChild(li);
    });
}

function addAgreement() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    if (!agenda.agreements) agenda.agreements = []; // Retrocompatibilidad
    
    const text = agreementTextInput.value.trim();
    const responsible = agreementRespInput.value.trim();
    const date = agreementDateInput.value;
    
    if (!text) {
        alert("El acuerdo o tarea no puede estar vacío.");
        return;
    }
    
    agenda.agreements.push({
        id: Date.now().toString(),
        text,
        responsible,
        date
    });
    
    agreementTextInput.value = '';
    agreementRespInput.value = '';
    agreementDateInput.value = '';
    
    saveState();
    renderAgreementsList();
}

function deleteAgreement(id) {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    agenda.agreements = agenda.agreements.filter(a => a.id !== id);
    saveState();
    renderAgreementsList();
}

async function copyAgreements() {
    const agenda = getCurrentAgenda();
    if (!agenda || !agenda.agreements || agenda.agreements.length === 0) {
        alert("No hay acuerdos para copiar.");
        return;
    }
    
    let report = `📝 MINUTA DE ACUERDOS\nReunión: ${agenda.name || 'Sin nombre'}\nFecha: ${agenda.date || 'N/A'}\n\n`;
    
    agenda.agreements.forEach((agr, i) => {
        const dateStr = agr.date ? new Date(agr.date + 'T12:00:00').toLocaleDateString() : 'N/A';
        report += `${i + 1}. ${agr.text}\n   - Responsable: ${agr.responsible || 'N/A'}\n   - Límite: ${dateStr}\n\n`;
    });
    
    try {
        await navigator.clipboard.writeText(report);
        alert("¡Acuerdos copiados al portapapeles! Puedes pegarlos en WhatsApp o en un correo.");
    } catch (e) {
        alert("No se pudo copiar. Verifica los permisos del portapapeles.");
    }
}


// -- LÓGICA DEL TEMPORIZADOR --
function startMeeting(id) {
    appState.currentAgendaId = id;
    const agenda = getCurrentAgenda();
    if (!agenda || agenda.topics.length === 0) {
        alert("La agenda no tiene temas.");
        return;
    }
    
    agenda.currentTopicIndex = 0;
    agenda.topics.forEach(t => t.elapsedSeconds = 0); // Reset
    
    activeMeetingName.textContent = agenda.name || 'Reunión sin nombre';
    
    switchScreen(agendasListScreen, timerScreen);
    resumeTimer();
    updateTimerUI();
}

function updateTimerUI() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    const currentTopic = agenda.topics[agenda.currentTopicIndex];
    if (!currentTopic) return;
    
    currentTopicName.textContent = currentTopic.name;
    topicDurationBadge.textContent = `${Math.round(currentTopic.allocatedSeconds / 60)}m asignados`;
    
    const remainingSeconds = currentTopic.allocatedSeconds - currentTopic.elapsedSeconds;
    
    mainTimer.textContent = formatTime(Math.max(0, remainingSeconds));
    elapsedTimeEl.textContent = formatTime(currentTopic.elapsedSeconds);
    
    if (agenda.currentTopicIndex + 1 < agenda.topics.length) {
        nextTopicName.textContent = agenda.topics[agenda.currentTopicIndex + 1].name;
        skipBtn.textContent = "Siguiente Tema";
    } else {
        nextTopicName.textContent = "Último tema";
        skipBtn.textContent = "Finalizar";
    }
    
    const totalAllocated = agenda.topics.reduce((sum, t) => sum + t.allocatedSeconds, 0);
    const totalElapsed = agenda.topics.reduce((sum, t) => sum + t.elapsedSeconds, 0);
    const progressPercent = totalAllocated > 0 ? (totalElapsed / totalAllocated) * 100 : 0;
    overallProgress.style.width = `${Math.min(100, progressPercent)}%`;
    
    mainTimer.className = 'time-huge';
    if (remainingSeconds <= 60 && remainingSeconds > 0) {
        mainTimer.classList.add('warning');
    } else if (remainingSeconds <= 0) {
        mainTimer.classList.add('danger');
        mainTimer.textContent = "00:00";
        if (remainingSeconds === 0) playBeep();
    }
}

function togglePause() {
    if (appState.isTimerRunning) {
        pauseTimer();
        pauseResumeBtn.textContent = 'Reanudar';
        pauseResumeBtn.classList.remove('secondary');
        pauseResumeBtn.classList.add('primary');
    } else {
        resumeTimer();
        pauseResumeBtn.textContent = 'Pausar';
        pauseResumeBtn.classList.remove('primary');
        pauseResumeBtn.classList.add('secondary');
    }
}

function pauseTimer() {
    appState.isTimerRunning = false;
    clearInterval(appState.timerInterval);
}

function resumeTimer() {
    appState.isTimerRunning = true;
    appState.timerInterval = setInterval(() => {
        const agenda = getCurrentAgenda();
        if (agenda && agenda.topics[agenda.currentTopicIndex]) {
            agenda.topics[agenda.currentTopicIndex].elapsedSeconds++;
            updateTimerUI();
            saveState();
        }
    }, 1000);
}

function skipToNextTopic() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    const currentTopic = agenda.topics[agenda.currentTopicIndex];
    const remainingSeconds = currentTopic.allocatedSeconds - currentTopic.elapsedSeconds;
    
    if (remainingSeconds > 0 && agenda.currentTopicIndex + 1 < agenda.topics.length) {
        agenda.topics[agenda.currentTopicIndex + 1].allocatedSeconds += remainingSeconds;
        agenda.topics[agenda.currentTopicIndex + 1].allocatedMinutes = Math.round(agenda.topics[agenda.currentTopicIndex + 1].allocatedSeconds / 60);
    }
    
    currentTopic.completed = true;
    
    if (agenda.currentTopicIndex + 1 < agenda.topics.length) {
        agenda.currentTopicIndex++;
        updateTimerUI();
    } else {
        finishMeeting();
    }
}

function finishMeeting() {
    pauseTimer();
    renderSummary();
    switchScreen(timerScreen, summaryScreen);
}

function renderSummary() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    summaryListDOM.innerHTML = '';
    agenda.topics.forEach((topic, index) => {
        const plannedMin = topic.allocatedMinutes;
        const actualMin = Math.round(topic.elapsedSeconds / 60);
        
        const li = document.createElement('li');
        li.className = 'summary-item-row';
        li.innerHTML = `
            <span class="name">${index + 1}. ${topic.name}</span>
            <span class="times">Planificado: ${plannedMin}m | Real: ${actualMin}m</span>
        `;
        summaryListDOM.appendChild(li);
    });
}

function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

document.addEventListener('DOMContentLoaded', init);
