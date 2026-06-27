let appState = {
    user: null, // Usuario autenticado
    agendas: [], // Array de objetos agenda
    currentAgendaId: null,
    isTimerRunning: false,
    timerInterval: null,
    currentView: 'clients', // 'clients' | 'meetings'
    selectedClient: null
};

// Pantallas
const authScreen = document.getElementById('auth-screen');
const agendasListScreen = document.getElementById('agendas-list-screen');
const setupScreen = document.getElementById('setup-screen');
const timerScreen = document.getElementById('timer-screen');
const summaryScreen = document.getElementById('summary-screen');

// Elementos - Auth
const authForm = document.getElementById('auth-form');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const logoutBtn = document.getElementById('logout-btn');

// Elementos - Listado
const clientsListContainer = document.getElementById('clients-list-container');
const clientsList = document.getElementById('clients-list');
const clientMeetingsContainer = document.getElementById('client-meetings-container');
const backToClientsBtn = document.getElementById('back-to-clients-btn');
const selectedClientTitle = document.getElementById('selected-client-title');
const agendasList = document.getElementById('agendas-list');
const createAgendaBtn = document.getElementById('create-agenda-btn');
const clientAgendasView = document.getElementById('client-agendas-view');
const clientTasksView = document.getElementById('client-tasks-view');
const clientTasksList = document.getElementById('client-tasks-list');
const clientTabBtns = document.querySelectorAll('.client-tab-btn');

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

const setupAgreementsBtn = document.getElementById('setup-agreements-btn');
const summaryAgreementsBtn = document.getElementById('summary-agreements-btn');
const agreementsScreen = document.getElementById('agreements-screen');
const agreementsTopicsContainer = document.getElementById('agreements-topics-container');
const finalizeAgreementsBtn = document.getElementById('finalize-agreements-btn');

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

function playBeepContinuous(durationMs = 3000) {
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
    
    const durationSeconds = durationMs / 1000;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Un tono más llamativo para la alerta (ej. onda cuadrada o triangular oscilante)
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // La
    oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.5);
    oscillator.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 1.0);
    oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 1.5);
    oscillator.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 2.0);
    oscillator.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 2.5);
    oscillator.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 3.0);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + durationSeconds - 0.2);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + durationSeconds);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + durationSeconds);
}

// -- ESTADO E INICIALIZACIÓN --

async function migrateLegacyData() {
    if (!appState.user) return;
    const migrado = localStorage.getItem('migrated_to_saas_' + appState.user.id);
    if (migrado) return;

    try {
        const { data: legacyData } = await supabaseClient
            .from('app_state')
            .select('data')
            .eq('id', 1)
            .single();
            
        if (legacyData && legacyData.data && legacyData.data.length > 0) {
            syncStatus.textContent = "🟡 Migrando...";
            const insertPromises = legacyData.data.map(agenda => {
                return supabaseClient.from('agendas').upsert({
                    id: agenda.id,
                    owner_id: appState.user.id,
                    name: agenda.name || 'Sin título',
                    client: agenda.client || '',
                    guest_email: null,
                    date: agenda.date || null,
                    total_time_minutes: agenda.totalTimeMinutes || 0,
                    data: agenda
                });
            });
            await Promise.all(insertPromises);
        }
        localStorage.setItem('migrated_to_saas_' + appState.user.id, 'true');
    } catch (e) {
        console.error("Error en migración:", e);
    }
}

async function saveState() {
    if (!appState.user) return;
    try {
        syncStatus.textContent = "🟡 Guardando...";
        
        // Determinar qué usuario es dueño para no sobrescribir permisos si somos guest
        // Por ahora, asumimos que si la editamos, se hace un upsert
        const upsertData = appState.agendas.map(agenda => ({
            id: agenda.id,
            owner_id: agenda.owner_id || appState.user.id, // Mantenemos el owner original si existe
            name: agenda.name || 'Sin título',
            client: agenda.client || '',
            guest_email: agenda.guest_email || null,
            date: agenda.date || null,
            total_time_minutes: agenda.totalTimeMinutes || 0,
            data: agenda
        }));

        const { error } = await supabaseClient
            .from('agendas')
            .upsert(upsertData);
            
        if (error) throw error;
        syncStatus.textContent = "🟢 Sincronizado";
    } catch (e) {
        console.error("Error guardando:", e);
        syncStatus.textContent = "🔴 Error de Sync";
    }
}

async function loadState() {
    if (!appState.user) return;
    try {
        syncStatus.textContent = "🟡 Cargando...";
        const { data, error } = await supabaseClient
            .from('agendas')
            .select('owner_id, guest_email, data');
            
        if (error) throw error;
        
        if (data) {
            appState.agendas = data.map(row => {
                let agenda = row.data;
                agenda.owner_id = row.owner_id;
                agenda.guest_email = row.guest_email;
                return agenda;
            });
        }
        syncStatus.textContent = "🟢 Sincronizado";
    } catch (e) {
        console.error("Error cargando", e);
        syncStatus.textContent = "🔴 Error de Red";
    }
}

async function init() {
    setupEventListeners();
    
    // Listener de Autenticación
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session) {
            appState.user = session.user;
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            agendasListScreen.classList.add('active');
            
            await migrateLegacyData();
            await loadState();
            renderAgendasList();
        } else {
            appState.user = null;
            appState.agendas = [];
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            if(authScreen) authScreen.classList.add('active');
        }
    });
}

function setupEventListeners() {
    // Autenticación
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = authEmail.value;
            const password = authPassword.value;
            authSubmitBtn.disabled = true;
            authSubmitBtn.textContent = "Iniciando...";
            
            const { error } = await supabaseClient.auth.signInWithPassword({
                email, password
            });
            
            if (error) {
                alert("Error al iniciar sesión: " + error.message);
                authSubmitBtn.disabled = false;
                authSubmitBtn.textContent = "Iniciar Sesión";
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
        });
    }

    // Pantalla Principal
    createAgendaBtn.addEventListener('click', createNewAgenda);
    backToListBtn.addEventListener('click', () => {
        saveState();
        switchScreen(setupScreen, agendasListScreen);
        renderAgendasList();
    });

    // Tabs de Cliente
    clientTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view');
            clientTabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            if (view === 'meetings') {
                clientAgendasView.style.display = 'block';
                clientTasksView.style.display = 'none';
            } else {
                clientAgendasView.style.display = 'none';
                clientTasksView.style.display = 'block';
                renderClientTasks();
            }
        });
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

    // Pantalla de Acuerdos
    const openAgreementsScreen = () => {
        const agenda = getCurrentAgenda();
        if (agenda) {
            // Si estamos en summaryScreen, la ocultamos
            if (summaryScreen.classList.contains('active')) {
                switchScreen(summaryScreen, agreementsScreen);
            }
            // Si estamos en setupScreen, la ocultamos
            else if (setupScreen.classList.contains('active')) {
                switchScreen(setupScreen, agreementsScreen);
            } else {
                agendasListScreen.classList.remove('active');
                agreementsScreen.classList.add('active');
            }
            renderAgreementsTopics();
        }
    };
    setupAgreementsBtn.addEventListener('click', openAgreementsScreen);
    summaryAgreementsBtn.addEventListener('click', openAgreementsScreen);
    
    finalizeAgreementsBtn.addEventListener('click', generatePDF);
    
    backToClientsBtn.addEventListener('click', () => {
        appState.currentView = 'clients';
        appState.selectedClient = null;
        renderAgendasList();
        updateTabsUI();
    });
    
    // Configurar Pestañas (Tabs)
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view');
            appState.currentView = view;
            renderAgendasList();
            updateTabsUI();
        });
    });

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

function updateTabsUI() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === appState.currentView || (btn.getAttribute('data-view') === 'clients' && appState.currentView === 'meetings')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// -- LÓGICA DE LISTADO --
function renderAgendasList() {
    if (appState.currentView === 'clients') {
        renderClientsList();
    } else if (appState.currentView === 'meetings') {
        renderClientMeetings(appState.selectedClient);
    } else {
        renderFilteredList(appState.currentView);
    }
}

function renderClientsList() {
    clientsListContainer.style.display = 'block';
    clientMeetingsContainer.style.display = 'none';
    
    if (appState.agendas.length === 0) {
        clientsList.innerHTML = '<li class="empty-state">No tienes agendas guardadas.</li>';
        return;
    }
    
    // Agrupar por cliente
    const clientsMap = {};
    appState.agendas.forEach(agenda => {
        const clientName = agenda.client && agenda.client.trim() !== '' ? agenda.client.trim() : 'Sin cliente';
        if (!clientsMap[clientName]) {
            clientsMap[clientName] = 0;
        }
        clientsMap[clientName]++;
    });
    
    clientsList.innerHTML = '';
    const sortedClients = Object.keys(clientsMap).sort((a, b) => a.localeCompare(b));
    
    sortedClients.forEach(clientName => {
        const li = document.createElement('li');
        li.className = 'agenda-card';
        li.style.cursor = 'pointer';
        
        li.innerHTML = `
            <div class="title" style="font-size: 1.2rem; color: var(--accent-color);">${clientName}</div>
            <div class="details" style="margin-top: 0.5rem;">
                <span>📂 ${clientsMap[clientName]} ${clientsMap[clientName] === 1 ? 'reunión' : 'reuniones'}</span>
            </div>
        `;
        
        li.addEventListener('click', () => {
            appState.currentView = 'meetings';
            appState.selectedClient = clientName;
            renderAgendasList();
        });
        
        clientsList.appendChild(li);
    });
}

function renderClientMeetings(clientName) {
    clientsListContainer.style.display = 'none';
    clientMeetingsContainer.style.display = 'block';
    backToClientsBtn.style.display = 'inline-block';
    
    selectedClientTitle.textContent = clientName;
    
    // Reseteamos tabs al entrar
    clientTabBtns.forEach(b => b.classList.remove('active'));
    clientTabBtns[0].classList.add('active'); // Selecciona 'Reuniones' por defecto
    clientAgendasView.style.display = 'block';
    clientTasksView.style.display = 'none';
    
    const clientAgendas = appState.agendas.filter(a => a.client === clientName);
    let filtered = appState.agendas.filter(a => {
        const cName = a.client && a.client.trim() !== '' ? a.client.trim() : 'Sin cliente';
        return cName === clientName;
    });
    
    filtered.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA; // Descendente
    });
    
    if (filtered.length === 0) {
        agendasList.innerHTML = '<li class="empty-state">No hay reuniones para este cliente.</li>';
        return;
    }
    
    agendasList.innerHTML = '';
    filtered.forEach(agenda => {
        const li = document.createElement('li');
        li.className = 'agenda-card';
        
        const dateStr = agenda.date ? new Date(agenda.date + 'T12:00:00').toLocaleDateString() : 'Sin fecha';
        
        li.innerHTML = `
            <div class="title">${agenda.name || 'Reunión sin nombre'}</div>
            <div class="details">
                <span>📅 ${dateStr}</span>
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

function toggleTaskStatus(agendaId, topicId, agreementId, isCompleted) {
    const agenda = appState.agendas.find(a => a.id === agendaId);
    if (!agenda) return;
    
    const agreement = agenda.agreements.find(a => a.id === agreementId);
    if (agreement) {
        agreement.completed = isCompleted;
        saveState();
        renderClientTasks(); // Re-renderizar la vista de tareas
    }
}

function renderClientTasks() {
    clientTasksList.innerHTML = '';
    const clientAgendas = appState.agendas.filter(a => a.client === appState.selectedClient);
    
    let allTasks = [];
    
    // Extraer todas las tareas de las reuniones del cliente
    clientAgendas.forEach(agenda => {
        if (agenda.agreements && agenda.agreements.length > 0) {
            agenda.agreements.forEach(agr => {
                // Buscamos a qué tema pertenece
                const topic = agenda.topics ? agenda.topics.find(t => t.id === agr.topicId) : null;
                allTasks.push({
                    ...agr,
                    agendaId: agenda.id,
                    agendaName: agenda.name,
                    agendaDate: agenda.date,
                    topicName: topic ? topic.name : 'Sin tema'
                });
            });
        }
    });
    
    if (allTasks.length === 0) {
        clientTasksList.innerHTML = '<li class="empty-state">No hay tareas pendientes.</li>';
        return;
    }
    
    // Ordenar por fecha límite (próximas primero), las que no tienen fecha van al final
    allTasks.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
    });
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    allTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'agenda-card';
        // Si está completada, bajamos la opacidad
        if (task.completed) {
            li.style.opacity = '0.6';
        }
        
        // Calcular color del semáforo si hay fecha límite y no está completada
        let statusBadge = '';
        if (task.deadline && !task.completed) {
            const taskDate = new Date(task.deadline + 'T12:00:00');
            taskDate.setHours(0,0,0,0);
            
            if (taskDate < today) {
                // Vencida
                statusBadge = '<span class="badge" style="background: var(--danger-color); color: white;">🔴 Atrasada</span>';
            } else if (taskDate.getTime() === today.getTime()) {
                // Vence hoy
                statusBadge = '<span class="badge" style="background: #eab308; color: black;">🟡 Vence Hoy</span>';
            } else {
                // A tiempo
                statusBadge = '<span class="badge" style="background: #22c55e; color: white;">🟢 A tiempo</span>';
            }
        } else if (task.completed) {
            statusBadge = '<span class="badge" style="background: rgba(255,255,255,0.1); color: var(--text-secondary);">✅ Lista</span>';
        }
        
        li.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <input type="checkbox" class="task-checkbox" style="margin-top: 5px; width: 20px; height: 20px; cursor: pointer;" ${task.completed ? 'checked' : ''}>
                <div style="flex: 1;">
                    <div class="title" style="font-size: 1.1rem; ${task.completed ? 'text-decoration: line-through; color: var(--text-secondary);' : ''}">${task.text || 'Sin descripción'}</div>
                    <div class="details" style="margin-top: 0.5rem;">
                        <span>👤 ${task.responsible || 'Sin responsable'}</span>
                        <span>📅 Vence: ${task.deadline ? new Date(task.deadline + 'T12:00:00').toLocaleDateString() : 'Sin fecha'}</span>
                        ${statusBadge}
                    </div>
                    <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary); border-top: 1px solid var(--glass-border); padding-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <span>De: <strong>${task.agendaName}</strong> (${task.topicName})</span>
                        <button class="btn text-btn goto-agenda-btn" data-id="${task.agendaId}" style="padding: 0; font-size: 0.8rem; color: var(--accent-color);">Ir a reunión ↗</button>
                    </div>
                </div>
            </div>
        `;
        
        // Checkbox Listener
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', (e) => {
            toggleTaskStatus(task.agendaId, task.topicId, task.id, e.target.checked);
        });
        
        // Ir a la agenda Listener
        const gotoBtn = li.querySelector('.goto-agenda-btn');
        gotoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openAgenda(task.agendaId);
        });
        
        clientTasksList.appendChild(li);
    });
}

function renderFilteredList(filterType) {
    clientsListContainer.style.display = 'none';
    clientMeetingsContainer.style.display = 'block';
    backToClientsBtn.style.display = 'none'; // Ocultar botón volver
    
    // Ajustar Título
    const titles = {
        'last7': 'Últimos 7 días',
        'todo': 'Por Realizar',
        'done': 'Realizadas'
    };
    selectedClientTitle.textContent = titles[filterType] || 'Reuniones';
    
    // Fechas base para filtros
    const today = new Date();
    today.setHours(0,0,0,0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    // Filtrar
    let filtered = appState.agendas.filter(a => {
        if (!a.date) return filterType === 'todo'; // Si no tiene fecha, es 'por realizar'
        
        const mDate = new Date(a.date + 'T12:00:00');
        mDate.setHours(0,0,0,0);
        
        if (filterType === 'todo') {
            return mDate >= today;
        } else if (filterType === 'done') {
            return mDate < today;
        } else if (filterType === 'last7') {
            return mDate >= sevenDaysAgo && mDate <= today;
        }
        return true;
    });
    
    // Ordenar (más reciente a antigua)
    filtered.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
    });
    
    if (filtered.length === 0) {
        agendasList.innerHTML = '<li class="empty-state">No se encontraron reuniones.</li>';
        return;
    }
    
    agendasList.innerHTML = '';
    filtered.forEach(agenda => {
        const li = document.createElement('li');
        li.className = 'agenda-card';
        
        const dateStr = agenda.date ? new Date(agenda.date + 'T12:00:00').toLocaleDateString() : 'Sin fecha';
        const clientStr = agenda.client || 'Sin cliente';
        
        li.innerHTML = `
            <div class="title">${agenda.name || 'Reunión sin nombre'} ${agenda.owner_id !== appState.user?.id && agenda.owner_id ? '<span class="badge" style="background:#8b5cf6;color:white;font-size:0.7rem;padding:0.15rem 0.4rem;border-radius:12px;margin-left:0.5rem;">Invitado</span>' : ''}</div>
            <div class="details">
                <span>📅 ${dateStr}</span>
                <span>👤 ${clientStr}</span>
                <span>⏱ ${agenda.totalTimeMinutes}m</span>
            </div>
            <div class="card-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn primary small start-agenda-btn" data-id="${agenda.id}">Comenzar</button>
                <button class="btn secondary small edit-agenda-btn" data-id="${agenda.id}">Ver / Editar</button>
            </div>
            ${agenda.owner_id === appState.user?.id || !agenda.owner_id ? `<button class="delete-agenda-btn" title="Eliminar agenda">🗑</button>` : ''}
        `;
        
        li.querySelector('.start-agenda-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            startMeeting(agenda.id);
        });
        
        li.querySelector('.edit-agenda-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openAgenda(agenda.id);
        });
        
        const deleteBtn = li.querySelector('.delete-agenda-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm('¿Eliminar esta agenda?')) {
                    appState.agendas = appState.agendas.filter(a => a.id !== agenda.id);
                    saveState();
                    renderAgendasList();
                }
            });
        }
        
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
    if (!agenda) return;
    
    meetingNameInput.value = agenda.name || '';
    meetingClientInput.value = agenda.client || '';
    if (document.getElementById('guest-email')) {
        document.getElementById('guest-email').value = agenda.guest_email || '';
    }
    meetingDateInput.value = agenda.date || '';
    totalTimeInput.value = agenda.totalTimeMinutes || 0;
    
    updateSummary();
    renderTopicsList();
    switchScreen(agendasListScreen, setupScreen);
}

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
    
    // Solo permitir edición completa si somos owners
    if (agenda.owner_id && agenda.owner_id !== appState.user?.id) {
        // Podríamos bloquear edición de datos base aquí, pero el RLS lo protegerá de todos modos
    }

    agenda.name = meetingNameInput.value;
    agenda.client = meetingClientInput.value;
    if (document.getElementById('guest-email')) {
        agenda.guest_email = document.getElementById('guest-email').value;
    }
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
        name: name,
        allocatedMinutes: time,
        allocatedSeconds: time * 60,
        originalAllocatedSeconds: time * 60,
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
            topic.originalAllocatedSeconds = finalTime * 60;
            
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

// -- LÓGICA DE ACUERDOS POR TEMA Y PDF --

function renderAgreementsTopics() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    agreementsTopicsContainer.innerHTML = '';
    
    if (!agenda.topics || agenda.topics.length === 0) {
        agreementsTopicsContainer.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">No hay temas en esta agenda.</p>';
        return;
    }
    
    // Migrar acuerdos antiguos al primer tema si existen y no tienen topicId
    if (agenda.agreements && agenda.agreements.length > 0) {
        agenda.agreements.forEach(agr => {
            if (!agr.topicId) {
                agr.topicId = agenda.topics[0].id;
            }
        });
        saveState();
    }
    if (!agenda.agreements) agenda.agreements = [];

    agenda.topics.forEach((topic, index) => {
        const topicAgreements = agenda.agreements.filter(a => a.topicId === topic.id);
        
        const card = document.createElement('div');
        card.className = 'agreement-topic-card';
        
        // Header
        const header = document.createElement('div');
        header.className = 'agreement-topic-header';
        header.innerHTML = `
            <h3>${index + 1}. ${topic.name}</h3>
            <span style="font-size: 0.8rem; color: var(--text-secondary); font-style: italic; white-space: nowrap; margin-left: 1rem;">(clic para colocar detalle)</span>
        `;
        
        // Body (Acordeón)
        const body = document.createElement('div');
        body.className = 'agreement-topic-body';
        
        // Formulario
        const formHtml = `
            <div class="input-group" style="text-align: left;">
                <label>Acuerdo / Tarea</label>
                <input type="text" id="agr-text-${topic.id}" placeholder="Ej. Enviar el reporte..." autocomplete="off">
            </div>
            <div class="input-row" style="text-align: left;">
                <div class="input-group">
                    <label>Responsable</label>
                    <input type="text" id="agr-resp-${topic.id}" placeholder="Ej. María" autocomplete="off">
                </div>
                <div class="input-group">
                    <label>Fecha Límite</label>
                    <input type="date" id="agr-date-${topic.id}">
                </div>
            </div>
            <button class="btn secondary full-width small add-agr-btn" data-topic="${topic.id}" style="margin-bottom: 1.5rem;">+ Agregar a este tema</button>
        `;
        
        // Lista de Acuerdos del Tema
        let listHtml = '<ul class="topics-list" style="margin-top: 1rem;">';
        if (topicAgreements.length === 0) {
            listHtml += '<li class="empty-state" style="font-size:0.85rem; padding:0.5rem;">Sin acuerdos.</li>';
        } else {
            topicAgreements.forEach(agr => {
                const dateFormatted = agr.date ? new Date(agr.date + 'T12:00:00').toLocaleDateString() : 'Sin fecha';
                listHtml += `
                    <li class="topic-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 0.75rem; background: rgba(15,23,42,0.4);">
                        <div style="display: flex; justify-content: space-between; width: 100%;">
                            <strong style="font-size: 0.95rem; color: var(--text-primary);">&#8226; ${agr.text}</strong>
                            <button class="delete-btn del-agr-btn" data-id="${agr.id}" style="position: static; font-size:1.2rem;">×</button>
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; gap: 1rem;">
                            <span>👤 ${agr.responsible || 'N/A'}</span>
                            <span>📅 ${dateFormatted}</span>
                        </div>
                    </li>
                `;
            });
        }
        listHtml += '</ul>';
        
        body.innerHTML = formHtml + listHtml;
        card.appendChild(header);
        card.appendChild(body);
        
        // Eventos
        header.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            // Cerrar todos los demás
            document.querySelectorAll('.agreement-topic-card').forEach(c => c.classList.remove('active'));
            if (!isActive) {
                card.classList.add('active');
                setTimeout(() => document.getElementById(`agr-text-${topic.id}`).focus(), 100);
            }
        });
        
        body.querySelector('.add-agr-btn').addEventListener('click', () => {
            const text = document.getElementById(`agr-text-${topic.id}`).value.trim();
            const resp = document.getElementById(`agr-resp-${topic.id}`).value.trim();
            const date = document.getElementById(`agr-date-${topic.id}`).value;
            
            if (!text) return alert("El acuerdo no puede estar vacío.");
            
            agenda.agreements.push({
                id: Date.now().toString(),
                topicId: topic.id,
                text,
                responsible: resp,
                date
            });
            saveState();
            renderAgreementsTopics();
            // Reabrir el card modificado
            setTimeout(() => {
                const cards = document.querySelectorAll('.agreement-topic-card');
                if (cards[index]) cards[index].classList.add('active');
            }, 50);
        });
        
        body.querySelectorAll('.del-agr-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                agenda.agreements = agenda.agreements.filter(a => a.id !== btn.getAttribute('data-id'));
                saveState();
                renderAgreementsTopics();
                // Reabrir el card modificado
                setTimeout(() => {
                    const cards = document.querySelectorAll('.agreement-topic-card');
                    if (cards[index]) cards[index].classList.add('active');
                }, 50);
            });
        });
        
        agreementsTopicsContainer.appendChild(card);
    });
}

async function generatePDF() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    // Validar librería html2pdf
    if (typeof html2pdf === 'undefined') {
        alert("La herramienta de PDF está cargando. Por favor, intenta de nuevo en unos segundos o recarga la página.");
        return;
    }
    
    finalizeAgreementsBtn.textContent = "Generando PDF...";
    finalizeAgreementsBtn.disabled = true;

    try {
        // Llenar datos de la cabecera
        document.getElementById('pdf-meeting-title').textContent = agenda.name || 'Reunión sin título';
        document.getElementById('pdf-meeting-client').textContent = agenda.client ? `Cliente/Proyecto: ${agenda.client}` : '';
        document.getElementById('pdf-meeting-date').textContent = agenda.date ? `Fecha: ${new Date(agenda.date + 'T12:00:00').toLocaleDateString()}` : '';
        
        // Llenar tiempos
        const totalAllocated = agenda.topics.reduce((s, t) => s + t.allocatedSeconds, 0);
        const totalElapsed = agenda.topics.reduce((s, t) => s + t.elapsedSeconds, 0);
        document.getElementById('pdf-planned-time').textContent = formatTime(totalAllocated);
        document.getElementById('pdf-actual-time').textContent = formatTime(totalElapsed);
        
        // Llenar Temas y Acuerdos
        const pdfTopicsList = document.getElementById('pdf-topics-list');
        pdfTopicsList.innerHTML = '';
        
        agenda.topics.forEach((topic, index) => {
            const topicDiv = document.createElement('div');
            topicDiv.style.marginBottom = '25px';
            
            const elapsedMins = Math.round(topic.elapsedSeconds / 60);
            topicDiv.innerHTML = `
                <h3 style="font-size: 16px; color: #1e293b; margin: 0 0 10px 0; background: #f1f5f9; padding: 8px; border-left: 4px solid #3b82f6;">
                    ${index + 1}. ${topic.name} <span style="font-size: 12px; font-weight: normal; color: #64748b; margin-left: 10px;">(Tiempo invertido: ${elapsedMins}m)</span>
                </h3>
            `;
            
            const topicAgreements = (agenda.agreements || []).filter(a => a.topicId === topic.id);
            if (topicAgreements.length > 0) {
                const ul = document.createElement('ul');
                ul.style.margin = '0 0 0 20px';
                ul.style.padding = '0';
                ul.style.color = '#334155';
                
                topicAgreements.forEach(agr => {
                    const li = document.createElement('li');
                    li.style.marginBottom = '8px';
                    li.style.lineHeight = '1.4';
                    
                    const dateStr = agr.date ? new Date(agr.date + 'T12:00:00').toLocaleDateString() : 'N/A';
                    li.innerHTML = `
                        <strong>${agr.text}</strong>
                        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                            Responsable: ${agr.responsible || 'No asignado'} | Límite: ${dateStr}
                        </div>
                    `;
                    ul.appendChild(li);
                });
                topicDiv.appendChild(ul);
            } else {
                const p = document.createElement('p');
                p.style.fontSize = '13px';
                p.style.color = '#94a3b8';
                p.style.margin = '0 0 0 20px';
                p.style.fontStyle = 'italic';
                p.textContent = 'Ningún acuerdo registrado para este tema.';
                topicDiv.appendChild(p);
            }
            
            pdfTopicsList.appendChild(topicDiv);
        });

        const element = document.getElementById('pdf-template-container');
        // Para forzar el inicio al tope, posicionamos el elemento de forma absoluta
        element.style.display = 'block';
        element.style.position = 'absolute';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '-1000'; // Ocultar visualmente

        // Guardar la posición del scroll y subir al tope
        const originalScroll = window.scrollY;
        window.scrollTo(0, 0);

        const opt = {
            margin:       10,
            filename:     `Acta_${agenda.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(element).save();
        
        // Restaurar estado
        element.style.display = 'none';
        element.style.position = 'static';
        window.scrollTo(0, originalScroll);
        alert("¡Acta PDF generada y descargada con éxito!");
        
    } catch (e) {
        console.error("Error generando PDF:", e);
        alert("Ocurrió un error al generar el PDF.");
    } finally {
        finalizeAgreementsBtn.textContent = "Finalizar Acuerdos y Generar Acta PDF";
        finalizeAgreementsBtn.disabled = false;
        document.getElementById('pdf-template-container').style.display = 'none';
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
    
    // Asignación original si no existe (retrocompatibilidad)
    if (typeof currentTopic.originalAllocatedSeconds === 'undefined') {
        currentTopic.originalAllocatedSeconds = currentTopic.allocatedSeconds;
    }
    
    currentTopicName.textContent = currentTopic.name;
    
    // Mostrar métricas de tiempo original vs modificado
    const originalMins = Math.round(currentTopic.originalAllocatedSeconds / 60);
    const currentMins = Math.round(currentTopic.allocatedSeconds / 60);
    const diffMins = currentMins - originalMins;
    
    let badgeText = `Planificado: ${originalMins}m | Disponible: ${currentMins}m`;
    if (diffMins > 0) {
        badgeText += ` (+${diffMins}m sobrantes)`;
    } else if (diffMins < 0) {
        badgeText += ` (${diffMins}m de deuda)`;
    }
    topicDurationBadge.textContent = badgeText;
    
    const remainingSeconds = currentTopic.allocatedSeconds - currentTopic.elapsedSeconds;
    
    mainTimer.textContent = formatTime(remainingSeconds);
    elapsedTimeEl.textContent = formatTime(currentTopic.elapsedSeconds);
    
    // Tiempo Total Restante
    const totalAllocated = agenda.topics.reduce((sum, t) => sum + t.allocatedSeconds, 0);
    const totalElapsed = agenda.topics.reduce((sum, t) => sum + t.elapsedSeconds, 0);
    const totalRemaining = totalAllocated - totalElapsed;
    const totalTimeLeftEl = document.getElementById('total-time-left');
    if (totalTimeLeftEl) {
        totalTimeLeftEl.textContent = `Total Restante: ${formatTime(totalRemaining)}`;
    }
    
    if (agenda.currentTopicIndex + 1 < agenda.topics.length) {
        nextTopicName.textContent = agenda.topics[agenda.currentTopicIndex + 1].name;
        skipBtn.textContent = "Siguiente Tema";
    } else {
        nextTopicName.textContent = "Último tema";
        skipBtn.textContent = "Finalizar";
    }
    
    const progressPercent = totalAllocated > 0 ? (totalElapsed / totalAllocated) * 100 : 0;
    overallProgress.style.width = `${Math.min(100, progressPercent)}%`;
    
    mainTimer.className = 'time-huge';
    if (remainingSeconds <= 60 && remainingSeconds > 0) {
        mainTimer.classList.add('warning');
        if (remainingSeconds === 60) {
            playBeepContinuous(3000); // Llamada a nueva función de alarma
        }
    } else if (remainingSeconds <= 0) {
        mainTimer.classList.add('danger');
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
    
    if (agenda.currentTopicIndex + 1 < agenda.topics.length) {
        // Acarreamos el sobrante (o deuda) al siguiente tema de forma incondicional
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
    const isNegative = totalSeconds < 0;
    const absSeconds = Math.abs(totalSeconds);
    const m = Math.floor(absSeconds / 60).toString().padStart(2, '0');
    const s = (absSeconds % 60).toString().padStart(2, '0');
    return `${isNegative ? '-' : ''}${m}:${s}`;
}

document.addEventListener('DOMContentLoaded', init);
