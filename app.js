let appState = {
    user: null, // Usuario autenticado
    agendas: [], // Array de objetos agenda
    currentAgendaId: null,
    isTimerRunning: false,
    timerInterval: null,
    cloudSyncInterval: null,
    lastTickTime: null,
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
const globalAnalyticsContainer = document.getElementById('global-analytics-container');
const masterTasksContainer = document.getElementById('master-tasks-container');
const masterTasksList = document.getElementById('master-tasks-list');
const mtFilterClient = document.getElementById('mt-filter-client');
const mtFilterResp = document.getElementById('mt-filter-resp');
const clientsList = document.getElementById('clients-list');
const clientMeetingsContainer = document.getElementById('client-meetings-container');
const backToClientsBtn = document.getElementById('back-to-clients-btn');
const selectedClientTitle = document.getElementById('selected-client-title');
const agendasList = document.getElementById('agendas-list');
const createAgendaBtn = document.getElementById('create-agenda-btn');
const clientAgendasView = document.getElementById('client-agendas-view');
const clientTasksView = document.getElementById('client-tasks-view');
const clientTasksList = document.getElementById('client-tasks-list');
const clientAnalyticsView = document.getElementById('client-analytics-view');
const clientTabBtns = document.querySelectorAll('.client-tab-btn');

// Elementos - Setup
const backToListBtn = document.getElementById('back-to-list-btn');
const meetingNameInput = document.getElementById('meeting-name');
const meetingClientInput = document.getElementById('meeting-client');
const meetingDateInput = document.getElementById('meeting-date');
const meetingTimeInput = document.getElementById('meeting-time');
const meetingEndTimeInput = document.getElementById('meeting-end-time');
const meetingLocationInput = document.getElementById('meeting-location');
const attendeesContainer = document.getElementById('attendees-container');
const addAttendeeBtn = document.getElementById('add-attendee-btn');
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
const inlineAgreementsBtn = document.getElementById('inline-agreements-btn');
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
const startBtn = document.getElementById('start-btn');

const agendaStatusBadge = document.getElementById('agenda-status-badge');
const markCompletedBtn = document.getElementById('mark-completed-btn');
const markNotHeldBtn = document.getElementById('mark-not-held-btn');
const rescheduleBtn = document.getElementById('reschedule-btn');
const prePdfBtn = document.getElementById('pre-pdf-btn');
const agreementsScreen = document.getElementById('agreements-screen');
const agreementsTopicsContainer = document.getElementById('agreements-topics-container');
const finalizeAgreementsBtn = document.getElementById('finalize-agreements-btn');

// Elementos - Preview Screen
const previewScreen = document.getElementById('preview-screen');
const previewBackBtn = document.getElementById('preview-back-btn');
const previewPdfBtn = document.getElementById('preview-pdf-btn');
const previewWordBtn = document.getElementById('preview-word-btn');
const prePdfTemplateContainer = document.getElementById('pre-pdf-template-container');
const pdfTemplateContainer = document.getElementById('pdf-template-container');
let currentPreviewType = ''; // 'convocatoria' o 'acta'

// Elementos - Soporte General de Reunión
const meetingLinkInput = document.getElementById('meeting-link');
const meetingSummaryInput = document.getElementById('meeting-summary');

// Elementos - Calendario
const calendarContainer = document.getElementById('calendar-container');
const calendarHeader = document.getElementById('cal-month-year');
const calendarGrid = document.getElementById('calendar-grid');
const calPrevBtn = document.getElementById('cal-prev-btn');
const calNextBtn = document.getElementById('cal-next-btn');

let currentCalendarDate = new Date(); // Para el mes mostrado en el calendario

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

function saveEphemeralState() {
    if (!appState.user) return;
    localStorage.setItem('fm_ephemeral_' + appState.user.id, JSON.stringify({
        currentAgendaId: appState.currentAgendaId,
        isTimerRunning: appState.isTimerRunning,
        lastTickTime: appState.lastTickTime,
        currentView: appState.currentView,
        selectedClient: appState.selectedClient
    }));
    // También guardamos una copia de seguridad local de agendas para reanudar el reloj al instante sin esperar a Supabase
    localStorage.setItem('fm_agendas_' + appState.user.id, JSON.stringify(appState.agendas));
}

function loadEphemeralState() {
    if (!appState.user) return;
    try {
        const localAgendas = localStorage.getItem('fm_agendas_' + appState.user.id);
        if (localAgendas) {
            appState.agendas = JSON.parse(localAgendas);
        }
        
        const eph = localStorage.getItem('fm_ephemeral_' + appState.user.id);
        if (eph) {
            const parsed = JSON.parse(eph);
            appState.currentAgendaId = parsed.currentAgendaId;
            appState.isTimerRunning = parsed.isTimerRunning;
            appState.lastTickTime = parsed.lastTickTime;
            appState.currentView = parsed.currentView || 'clients';
            appState.selectedClient = parsed.selectedClient || null;
        }
    } catch(e) {
        console.error("Error recuperando estado efímero:", e);
    }
}

async function saveState() {
    if (!appState.user) return;
    try {
        syncStatus.textContent = "🟡 Guardando...";
        
        // Determinar qué usuario es dueño para no sobrescribir permisos si somos guest
        // Por ahora, asumimos que si la editamos, se hace un upsert
        const upsertData = appState.agendas.map(agenda => {
            let emails = [];
            if (agenda.attendees) {
                emails = agenda.attendees
                    .map(a => (a.email || '').trim().toLowerCase())
                    .filter(e => e !== '');
            }
            return {
                id: agenda.id,
                owner_id: agenda.owner_id || appState.user.id, // Mantenemos el owner original si existe
                name: agenda.name || 'Sin título',
                client: agenda.client || '',
                guest_email: agenda.guest_email || null,
                shared_with_emails: emails,
                date: agenda.date || null,
                total_time_minutes: agenda.totalTimeMinutes || 0,
                data: agenda
            };
        });

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
                
                // Migración: asignar estado si no existe
                if (!agenda.status) {
                    const hasAgreements = agenda.agreements && agenda.agreements.length > 0;
                    agenda.status = hasAgreements ? 'realizada' : 'agendada';
                }
                
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
    
    try {
        // Forzar lectura inicial para evitar que se quede "cargando" en móviles
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        await handleSessionState(session);
    } catch (e) {
        console.error("Error al obtener sesión inicial:", e);
        await handleSessionState(null);
    }

    // Listener de Autenticación para cambios de estado (login/logout)
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event !== 'INITIAL_SESSION') {
            await handleSessionState(session);
        }
    });
}

async function handleSessionState(session) {
    if (session) {
        appState.user = session.user;
        loadEphemeralState(); // Recuperar sesión local primero
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        if (appState.currentAgendaId && appState.isTimerRunning) {
            timerScreen.classList.add('active');
        } else {
            agendasListScreen.classList.add('active');
        }
        
        await migrateLegacyData();
        await loadState(); // Sobrescribe con nube, excepto la agenda activa
        
        if (appState.currentAgendaId && appState.isTimerRunning) {
            const currentAgenda = getCurrentAgenda();
            if (currentAgenda) {
                updateTimerUI();
                resumeTimer();
            } else {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                agendasListScreen.classList.add('active');
                renderAgendasList();
            }
        } else {
            renderAgendasList();
        }
    } else {
        appState.user = null;
        appState.agendas = [];
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        if(authScreen) authScreen.classList.add('active');
    }
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
                clientAnalyticsView.style.display = 'none';
            } else if (view === 'tasks') {
                clientAgendasView.style.display = 'none';
                clientTasksView.style.display = 'block';
                clientAnalyticsView.style.display = 'none';
                renderClientTasks();
            } else {
                clientAgendasView.style.display = 'none';
                clientTasksView.style.display = 'none';
                clientAnalyticsView.style.display = 'block';
                renderClientAnalytics();
            }
        });
    });

    // Inputs de Agenda Activa
    meetingNameInput.addEventListener('input', updateCurrentAgenda);
    meetingClientInput.addEventListener('input', updateCurrentAgenda);
    if (document.getElementById('guest-email')) {
        document.getElementById('guest-email').addEventListener('input', updateCurrentAgenda);
    }
    meetingDateInput.addEventListener('input', updateCurrentAgenda);
    const triggerTimeCalc = () => {
        calculateTotalTime();
        updateCurrentAgenda();
    };
    meetingTimeInput.addEventListener('input', triggerTimeCalc);
    meetingTimeInput.addEventListener('change', triggerTimeCalc);
    meetingEndTimeInput.addEventListener('input', triggerTimeCalc);
    meetingEndTimeInput.addEventListener('change', triggerTimeCalc);
    meetingLocationInput.addEventListener('input', updateCurrentAgenda);
    totalTimeInput.addEventListener('change', updateCurrentAgenda);
    totalTimeInput.addEventListener('input', () => {
        updateCurrentAgenda();
        updateSummary();
    });

    addAttendeeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const agenda = getCurrentAgenda();
        if (agenda) {
            agenda.attendees = agenda.attendees || [];
            agenda.attendees.push({ id: Date.now().toString(), name: '', email: '' });
            renderAttendees();
            updateCurrentAgenda();
        }
    });

    addTopicBtn.addEventListener('click', addTopic);
    saveAgendaBtn.addEventListener('click', () => {
        saveState();
        switchScreen(setupScreen, agendasListScreen);
        renderAgendasList();
    });
    
    if (document.getElementById('delete-agenda-btn-main')) {
        document.getElementById('delete-agenda-btn-main').addEventListener('click', () => {
            if(confirm('¿Estás seguro de que deseas eliminar esta reunión por completo? Esta acción no se puede deshacer.')) {
                const agenda = getCurrentAgenda();
                if (agenda) {
                    appState.agendas = appState.agendas.filter(a => a.id !== agenda.id);
                    saveState();
                    switchScreen(setupScreen, agendasListScreen);
                    renderAgendasList();
                }
            }
        });
    }

    if (document.getElementById('clone-agenda-btn-main')) {
        document.getElementById('clone-agenda-btn-main').addEventListener('click', () => {
            if(confirm('¿Deseas crear una copia de esta reunión? Se conservarán los temas y tiempos, pero podrás editar el cliente, la fecha y los integrantes.')) {
                const agenda = getCurrentAgenda();
                if (agenda) {
                    const clonedAgenda = {
                        id: Date.now().toString(),
                        name: agenda.name + ' (Copia)',
                        client: agenda.client || '',
                        date: '', // Reiniciar fecha para la nueva
                        time: '',
                        location: agenda.location || '',
                        attendees: [],
                        status: 'agendada',
                        wasRescheduled: false,
                        totalTimeMinutes: agenda.totalTimeMinutes,
                        topics: agenda.topics.map(t => ({
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                            name: t.name,
                            allocatedMinutes: t.allocatedMinutes,
                            allocatedSeconds: t.allocatedSeconds,
                            elapsedSeconds: 0,
                            summary: ''
                        })),
                        agreements: [],
                        owner_id: appState.user?.id || null
                    };
                    appState.agendas.push(clonedAgenda);
                    saveState();
                    openAgenda(clonedAgenda.id);
                }
            }
        });
    }
    
    // Timer
    pauseResumeBtn.addEventListener('click', togglePause);
    skipBtn.addEventListener('click', skipToNextTopic);
    endMeetingBtn.addEventListener('click', finishMeeting);
    inlineAgreementsBtn.addEventListener('click', () => {
        if (!appState.timerInterval) {
            // Already paused
        } else {
            pauseTimer();
        }
        openInlineAgreementsModal();
    });
    
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
            // Cargar datos extra si existen
            meetingLinkInput.value = agenda.meetingLink || '';
            meetingSummaryInput.value = agenda.meetingSummary || '';

            // NUNCA bloquear la pantalla de acuerdos para permitir registro Ex-Post
            setReadOnlyMode(agreementsScreen, false);
            
            // Ajustar texto del botón PDF según estado
            const isDone = agenda.status !== 'agendada';
            if (isDone) {
                finalizeAgreementsBtn.textContent = "Generar y Descargar Acta PDF";
            } else {
                finalizeAgreementsBtn.textContent = "Finalizar Acuerdos y Generar Acta PDF";
            }

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

    meetingLinkInput.addEventListener('input', (e) => {
        const agenda = getCurrentAgenda();
        if (agenda) {
            agenda.meetingLink = e.target.value;
            saveState(); // Guardar a medida que se escribe
        }
    });

    meetingSummaryInput.addEventListener('input', (e) => {
        const agenda = getCurrentAgenda();
        if (agenda) {
            agenda.meetingSummary = e.target.value;
            saveState(); // Guardar a medida que se escribe
        }
    });
    
    // Botón para volver de Acuerdos a la Lista
    const backFromAgreementsBtn = document.getElementById('back-from-agreements-btn');
    if (backFromAgreementsBtn) {
        backFromAgreementsBtn.addEventListener('click', () => {
            switchScreen(agreementsScreen, agendasListScreen);
            renderAgendasList();
        });
    }

    const topGeneratePdfBtn = document.getElementById('top-generate-pdf-btn');
    if (topGeneratePdfBtn) {
        topGeneratePdfBtn.addEventListener('click', generatePDF);
    }
    
    const autoSummaryBtn = document.getElementById('auto-summary-btn');
    if (autoSummaryBtn) {
        autoSummaryBtn.addEventListener('click', () => {
            const agenda = getCurrentAgenda();
            if (!agenda || !agenda.topics) return;
            
            let consolidated = "";
            agenda.topics.forEach((topic, idx) => {
                const topicSummary = topic.summary ? topic.summary.trim() : "";
                const topicAgreements = (agenda.agreements || []).filter(a => a.topicId === topic.id);
                
                if (topicSummary || topicAgreements.length > 0) {
                    consolidated += `Tema ${idx + 1}: ${topic.name}\n`;
                    if (topicSummary) {
                        consolidated += `- Resumen: ${topicSummary}\n`;
                    }
                    if (topicAgreements.length > 0) {
                        consolidated += `- Acuerdos:\n`;
                        topicAgreements.forEach(agr => {
                            consolidated += `  * ${agr.text} (Resp: ${agr.responsible || 'N/A'})\n`;
                        });
                    }
                    consolidated += `\n`;
                }
            });
            
            if (consolidated) {
                // Agregar al contenido existente o reemplazar si está vacío
                const currentVal = meetingSummaryInput.value.trim();
                meetingSummaryInput.value = currentVal ? currentVal + "\n\n" + consolidated.trim() : consolidated.trim();
                agenda.meetingSummary = meetingSummaryInput.value;
                saveState();
            } else {
                alert("No hay resúmenes ni acuerdos en los temas para consolidar.");
            }
        });
    }

    setupAgreementsBtn.addEventListener('click', openAgreementsScreen);
    
    markCompletedBtn.addEventListener('click', () => {
        const agenda = getCurrentAgenda();
        if (agenda) {
            agenda.status = 'realizada';
            saveState();
            updateStatusUI(agenda);
        }
    });

    markNotHeldBtn.addEventListener('click', () => {
        const agenda = getCurrentAgenda();
        if (agenda) {
            agenda.status = 'no_realizada';
            saveState();
            updateStatusUI(agenda);
        }
    });

    rescheduleBtn.addEventListener('click', () => {
        const newDate = prompt("Ingrese la nueva fecha (YYYY-MM-DD):", meetingDateInput.value);
        if (newDate !== null) {
            const newTime = prompt("Ingrese la nueva hora (HH:MM):", meetingTimeInput.value || '');
            const agenda = getCurrentAgenda();
            agenda.date = newDate;
            agenda.time = newTime || '';
            agenda.status = 'reagendada';
            agenda.wasRescheduled = true;
            saveState();
            meetingDateInput.value = agenda.date;
            meetingTimeInput.value = agenda.time;
            updateStatusUI(agenda);
            alert("Reunión reagendada con éxito.");
        }
    });

    prePdfBtn.addEventListener('click', generatePrePDF);
    summaryAgreementsBtn.addEventListener('click', openAgreementsScreen);
    
    finalizeAgreementsBtn.addEventListener('click', generatePDF);
    
    previewBackBtn.addEventListener('click', () => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        if (currentPreviewType === 'convocatoria') {
            setupScreen.classList.add('active');
        } else {
            agreementsScreen.classList.add('active');
        }
    });

    previewPdfBtn.addEventListener('click', exportPreviewToPDF);
    previewWordBtn.addEventListener('click', exportPreviewToWord);
    
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

    calPrevBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendarView();
    });

    calNextBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendarView();
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
    // Esconder Analytics global por defecto
    globalAnalyticsContainer.style.display = 'none';
    if (calendarContainer) calendarContainer.style.display = 'none';
    if (masterTasksContainer) masterTasksContainer.style.display = 'none';
    
    if (appState.currentView === 'meetings') {
        createAgendaBtn.textContent = '➕ Crear Nueva Agenda';
    } else {
        createAgendaBtn.textContent = '➕ Crear Agenda / Proyecto';
    }
    
    if (appState.currentView === 'clients') {
        renderClientsList();
    } else if (appState.currentView === 'meetings') {
        renderClientMeetings(appState.selectedClient);
    } else if (appState.currentView === 'global-analytics') {
        clientsListContainer.style.display = 'none';
        clientMeetingsContainer.style.display = 'none';
        globalAnalyticsContainer.style.display = 'block';
        renderGlobalAnalytics();
    } else if (appState.currentView === 'master-tasks') {
        clientsListContainer.style.display = 'none';
        clientMeetingsContainer.style.display = 'none';
        masterTasksContainer.style.display = 'block';
        renderMasterTasks();
    } else if (appState.currentView === 'calendar') {
        clientsListContainer.style.display = 'none';
        clientMeetingsContainer.style.display = 'none';
        calendarContainer.style.display = 'block';
        renderCalendarView();
    } else {
        renderFilteredList(appState.currentView);
    }
}

function renderMasterTasks() {
    masterTasksList.innerHTML = '';
    
    let allAgreements = [];
    appState.agendas.forEach(agenda => {
        if (agenda.agreements) {
            agenda.agreements.forEach(agr => {
                allAgreements.push({
                    ...agr,
                    agendaName: agenda.name || 'Sin nombre',
                    clientName: agenda.client || 'Sin cliente',
                    agendaDate: agenda.date
                });
            });
        }
    });
    
    // Sort by date or criticality? Let's just sort by created (uncompleted first)
    allAgreements.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    
    const clientFilter = mtFilterClient.value.toLowerCase().trim();
    const respFilter = mtFilterResp.value.toLowerCase().trim();
    
    const filtered = allAgreements.filter(agr => {
        const matchClient = clientFilter === '' || agr.clientName.toLowerCase().includes(clientFilter);
        const matchResp = respFilter === '' || (agr.responsible || '').toLowerCase().includes(respFilter);
        return matchClient && matchResp;
    });
    
    if (filtered.length === 0) {
        masterTasksList.innerHTML = '<div class="empty-state" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No se encontraron tareas.</div>';
        return;
    }
    
    filtered.forEach(agr => {
        const card = document.createElement('div');
        card.className = `mt-card ${agr.completed ? 'completed' : ''}`;
        
        const dateStr = agr.deadline ? new Date(agr.deadline + 'T12:00:00').toLocaleDateString() : 'Sin límite';
        let critIcon = '⚡️';
        if (agr.criticality === 'Alta') critIcon = '🔥';
        if (agr.criticality === 'Baja') critIcon = '❄️';
        
        card.innerHTML = `
            <input type="checkbox" class="mt-checkbox" ${agr.completed ? 'checked' : ''} data-id="${agr.id}">
            <div class="mt-content">
                <div class="mt-header">
                    <span class="mt-text">${agr.text}</span>
                    <span class="mt-tag" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">${critIcon} ${agr.criticality || 'Media'}</span>
                </div>
                <div class="mt-tags">
                    <span class="mt-tag">🏢 ${agr.clientName}</span>
                    <span class="mt-tag edit-date-btn" data-id="${agr.id}" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" title="Editar Fecha Límite">📅 Límite: ${dateStr} ✏️</span>
                    <span class="mt-tag edit-resp-btn" data-id="${agr.id}" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" title="Editar Responsable">👤 Resp: ${agr.responsible || 'No asignado'} ✏️</span>
                </div>
            </div>
        `;
        
        card.querySelector('.mt-checkbox').addEventListener('change', (e) => {
            const checked = e.target.checked;
            // Update in the original agenda
            appState.agendas.forEach(agenda => {
                if (agenda.agreements) {
                    const found = agenda.agreements.find(a => a.id === agr.id);
                    if (found) {
                        found.completed = checked;
                    }
                }
            });
            saveState();
            renderMasterTasks();
        });
        
        card.querySelector('.edit-date-btn').addEventListener('click', (e) => {
            const newDate = prompt('Ingrese nueva fecha límite (YYYY-MM-DD) o deje vacío:', agr.deadline || '');
            if (newDate !== null) {
                appState.agendas.forEach(agenda => {
                    if (agenda.agreements) {
                        const found = agenda.agreements.find(a => a.id === agr.id);
                        if (found) {
                            found.deadline = newDate;
                            found.date = newDate;
                        }
                    }
                });
                saveState();
                renderMasterTasks();
            }
        });
        
        card.querySelector('.edit-resp-btn').addEventListener('click', (e) => {
            const newResp = prompt('Ingrese nuevo(s) responsable(s) separados por coma:', agr.responsible || '');
            if (newResp !== null) {
                appState.agendas.forEach(agenda => {
                    if (agenda.agreements) {
                        const found = agenda.agreements.find(a => a.id === agr.id);
                        if (found) {
                            found.responsible = newResp.trim();
                        }
                    }
                });
                saveState();
                renderMasterTasks();
            }
        });

        masterTasksList.appendChild(card);
    });
}

// Add event listeners for the master tasks filters
if (mtFilterClient) {
    mtFilterClient.addEventListener('input', renderMasterTasks);
}
if (mtFilterResp) {
    mtFilterResp.addEventListener('input', renderMasterTasks);
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
            clientsMap[clientName] = { totalMeetings: 0, totalAgreements: 0, actualTime: 0 };
        }
        clientsMap[clientName].totalMeetings++;
        if (agenda.agreements) clientsMap[clientName].totalAgreements += agenda.agreements.length;
        agenda.topics.forEach(t => clientsMap[clientName].actualTime += (t.elapsedSeconds || 0));
    });
    
    clientsList.innerHTML = '';
    const sortedClients = Object.keys(clientsMap).sort((a, b) => a.localeCompare(b));
    
    sortedClients.forEach(clientName => {
        const metrics = clientsMap[clientName];
        metrics.efficiency = metrics.totalMeetings > 0 ? Math.round((metrics.totalAgreements / metrics.totalMeetings) * 10) / 10 : 0;
        
        const card = document.createElement('div');
        card.className = 'agenda-card client-card drill-down-card';
        
        card.innerHTML = `
            <h3>${clientName}</h3>
            <div class="meta">
                <span>📁 ${metrics.totalMeetings} ${metrics.totalMeetings === 1 ? 'Reunión' : 'Reuniones'}</span>
                <span>✅ ${metrics.totalAgreements} Acuerdos</span>
            </div>
            <div class="meta" style="margin-top:0.5rem; justify-content: space-between;">
                <span>Eficiencia: ${metrics.efficiency}%</span>
                <span>⏳ ${formatTime(metrics.actualTime)}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            appState.currentView = 'meetings';
            appState.selectedClient = clientName;
            renderAgendasList();
        });
        
        clientsList.appendChild(card);
    });
}

function getStatusBadgeHTML(agenda) {
    const status = agenda.status || 'agendada';
    let bgColor, color, borderColor, text;
    
    switch(status) {
        case 'realizada':
            bgColor = 'rgba(16, 185, 129, 0.2)'; color = '#6ee7b7'; borderColor = 'rgba(16, 185, 129, 0.3)'; text = '✓ Realizada';
            break;
        case 'por_reagendar':
            bgColor = 'rgba(139, 92, 246, 0.2)'; color = '#c4b5fd'; borderColor = 'rgba(139, 92, 246, 0.3)'; text = 'Por reagendar';
            break;
        case 'no_realizada':
            bgColor = 'rgba(239, 68, 68, 0.2)'; color = '#fca5a5'; borderColor = 'rgba(239, 68, 68, 0.3)'; text = 'No realizada';
            break;
        case 'agendada':
        case 'pendiente':
        default:
            bgColor = 'rgba(245, 158, 11, 0.2)'; color = '#fcd34d'; borderColor = 'rgba(245, 158, 11, 0.3)'; text = 'Pendiente';
            break;
    }

    return `
        <span class="status-cycle-badge" data-id="${agenda.id}" style="
            background: ${bgColor}; 
            color: ${color}; 
            border: 1px solid ${borderColor}; 
            font-size: 0.7rem; 
            padding: 0.3rem 0.6rem; 
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            user-select: none;
            transition: all 0.2s ease;
        " title="Clic para cambiar estado">${text}</span>
    `;
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
    clientAnalyticsView.style.display = 'none';
    
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
        const isDone = agenda.status === 'realizada';
        const statusBadge = getStatusBadgeHTML(agenda);
        
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div class="title">${agenda.name || 'Reunión sin nombre'}</div>
                ${statusBadge}
            </div>
            <div class="details" style="display: flex; align-items: center; gap: 1rem;">
                <span style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem;"><span style="font-size: 1rem;">📅</span> ${dateStr}</span>
                <span style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem;"><span style="font-size: 1rem;">⏱</span> ${agenda.totalTimeMinutes}m</span>
            </div>
            <div class="card-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                ${isDone || agenda.status !== 'agendada' ? '' : `<button class="btn primary small start-agenda-btn" data-id="${agenda.id}">Comenzar</button>`}
                ${isDone || agenda.status !== 'agendada' ? '' : `<button class="btn secondary small expost-agenda-btn" data-id="${agenda.id}">Registro Ex-Post</button>`}
                <button class="btn secondary small edit-agenda-btn" data-id="${agenda.id}">${isDone ? 'Ver Acta/Agenda' : 'Editar'}</button>
            </div>
            ${agenda.owner_id === appState.user?.id || !agenda.owner_id ? `<button class="delete-agenda-btn" title="Eliminar agenda">🗑</button>` : ''}
        `;
        
        const statusCycle = li.querySelector('.status-cycle-badge');
        if (statusCycle) {
            statusCycle.addEventListener('click', (e) => {
                e.stopPropagation();
                const cycle = ['agendada', 'realizada', 'por_reagendar', 'no_realizada'];
                const currentIndex = cycle.indexOf(agenda.status || 'agendada');
                agenda.status = cycle[(currentIndex + 1) % cycle.length];
                
                if (agenda.status === 'por_reagendar') {
                    agenda.date = '';
                    agenda.time = '';
                    agenda.endTime = '';
                }
                
                saveState();
                renderClientMeetings(clientName);
            });
        }

        const startBtn = li.querySelector('.start-agenda-btn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                startMeeting(agenda.id);
            });
        }

        const exPostBtn = li.querySelector('.expost-agenda-btn');
        if (exPostBtn) {
            exPostBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                appState.currentAgendaId = agenda.id;
                openAgreementsScreen();
            });
        }
        
        li.querySelector('.edit-agenda-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const isGuest = agenda.owner_id && appState.user && agenda.owner_id !== appState.user.id;
            if (isDone || isGuest) {
                appState.currentAgendaId = agenda.id;
                openAgreementsScreen();
            } else {
                openAgenda(agenda.id);
            }
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

    // Render Responsibles Table
    const responsibles = {};
    filtered.forEach(a => {
        (a.agreements || []).forEach(agr => {
            const r = agr.responsible || 'Sin Asignar';
            if(!responsibles[r]) responsibles[r] = { total: 0, completed: 0 };
            responsibles[r].total++;
            if(agr.completed) responsibles[r].completed++;
        });
    });

    const responsibleTable = document.getElementById('client-responsible-table');
    if (Object.keys(responsibles).length > 0) {
        let tableHtml = `
            <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.9rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--glass-border);">
                        <th style="padding: 0.5rem; color: var(--text-secondary);">Responsable</th>
                        <th style="padding: 0.5rem; color: var(--text-secondary);">Acuerdos Totales</th>
                        <th style="padding: 0.5rem; color: var(--text-secondary);">Completados</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        Object.keys(responsibles).sort((a,b) => responsibles[b].total - responsibles[a].total).forEach(resp => {
            const data = responsibles[resp];
            tableHtml += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; cursor: pointer;" class="ca-resp-row drill-down-card" data-resp="${resp}">
                    <td style="padding: 0.5rem; color: var(--text-primary); font-weight: 500;">${resp}</td>
                    <td style="padding: 0.5rem;">${data.total}</td>
                    <td style="padding: 0.5rem;">
                        <span style="color: #34d399;">${data.completed}</span>
                    </td>
                </tr>
            `;
        });
        tableHtml += `</tbody></table>`;
        responsibleTable.innerHTML = tableHtml;

        document.querySelectorAll('.ca-resp-row').forEach(row => {
            row.addEventListener('dblclick', (e) => {
                const resp = e.currentTarget.getAttribute('data-resp');
                appState.currentView = 'master-tasks';
                mtFilterClient.value = appState.selectedClient === 'Sin cliente' ? '' : appState.selectedClient;
                mtFilterResp.value = resp;
                renderAgendasList();
                updateTabsUI();
            });
        });
    } else {
        responsibleTable.innerHTML = '<p style="color:var(--text-secondary); text-align:center;">No hay acuerdos asignados.</p>';
    }
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
        const isGuest = agenda.owner_id && appState.user && agenda.owner_id !== appState.user.id;
        const myEmail = appState.user ? appState.user.email : '';
        
        if (agenda.agreements && agenda.agreements.length > 0) {
            agenda.agreements.forEach(agr => {
                if (isGuest) {
                    const isResp = agr.responsible && (agr.responsible.toLowerCase() === myEmail || agenda.attendees?.find(att => att.email === myEmail)?.name === agr.responsible);
                    if (!isResp) return;
                }

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
        
        // Badge criticidad
        let critBadge = '';
        if (task.criticality === 'Alta') critBadge = '🔥 Alta';
        else if (task.criticality === 'Media') critBadge = '⚡️ Media';
        else if (task.criticality === 'Baja') critBadge = '❄️ Baja';

        li.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <input type="checkbox" class="task-checkbox" style="margin-top: 5px; width: 20px; height: 20px; cursor: pointer;" ${task.completed ? 'checked' : ''}>
                <div style="flex: 1;">
                    <div class="title" style="font-size: 1.1rem; ${task.completed ? 'text-decoration: line-through; color: var(--text-secondary);' : ''}">${task.text || 'Sin descripción'}</div>
                    <div class="details" style="margin-top: 0.5rem; gap: 0.8rem;">
                        <span>👤 ${task.responsible || 'Sin responsable'}</span>
                        <span>📅 Vence: ${task.deadline ? new Date(task.deadline + 'T12:00:00').toLocaleDateString() : 'Sin fecha'}</span>
                        ${critBadge ? `<span style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;">${critBadge}</span>` : ''}
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
        
        const isDone = agenda.status === 'realizada';
        const statusBadge = getStatusBadgeHTML(agenda);
        
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div class="title">${agenda.name || 'Reunión sin nombre'} ${agenda.owner_id !== appState.user?.id && agenda.owner_id ? '<span class="badge" style="background:#8b5cf6;color:white;font-size:0.7rem;padding:0.15rem 0.4rem;border-radius:12px;margin-left:0.5rem;">Invitado</span>' : ''}</div>
                ${statusBadge}
            </div>
            <div class="details">
                <span>📅 ${dateStr}</span>
                <span>👤 ${clientStr}</span>
                <span>⏱ ${agenda.totalTimeMinutes}m</span>
            </div>
            <div class="card-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                ${isDone || agenda.status !== 'agendada' ? '' : `<button class="btn primary small start-agenda-btn" data-id="${agenda.id}">Comenzar</button>`}
                ${isDone || agenda.status !== 'agendada' ? '' : `<button class="btn secondary small expost-agenda-btn" data-id="${agenda.id}">Registro Ex-Post</button>`}
                <button class="btn secondary small edit-agenda-btn" data-id="${agenda.id}">${isDone ? 'Ver Acta/Agenda' : 'Editar'}</button>
            </div>
            ${agenda.owner_id === appState.user?.id || !agenda.owner_id ? `<button class="delete-agenda-btn" title="Eliminar agenda">🗑</button>` : ''}
        `;
        
        const statusCycle = li.querySelector('.status-cycle-badge');
        if (statusCycle) {
            statusCycle.addEventListener('click', (e) => {
                e.stopPropagation();
                const cycle = ['agendada', 'realizada', 'por_reagendar', 'no_realizada'];
                const currentIndex = cycle.indexOf(agenda.status || 'agendada');
                agenda.status = cycle[(currentIndex + 1) % cycle.length];
                
                if (agenda.status === 'por_reagendar') {
                    agenda.date = '';
                    agenda.time = '';
                    agenda.endTime = '';
                }
                
                saveState();
                renderAgendasList();
            });
        }
        
        const startBtn = li.querySelector('.start-agenda-btn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                startMeeting(agenda.id);
            });
        }

        const exPostBtn = li.querySelector('.expost-agenda-btn');
        if (exPostBtn) {
            exPostBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                appState.currentAgendaId = agenda.id;
                openAgreementsScreen();
            });
        }
        
        li.querySelector('.edit-agenda-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const isGuest = agenda.owner_id && appState.user && agenda.owner_id !== appState.user.id;
            if (isDone || isGuest) {
                appState.currentAgendaId = agenda.id;
                openAgreementsScreen();
            } else {
                openAgenda(agenda.id);
            }
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
    const defaultClient = (appState.currentView === 'meetings' && appState.selectedClient) ? appState.selectedClient : '';
    const newAgenda = {
        id: Date.now().toString(),
        name: '',
        client: defaultClient,
        date: '',
        time: '',
        location: '',
        attendees: [],
        status: 'agendada', // Estado inicial
        wasRescheduled: false,
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
    setReadOnlyMode(setupScreen, false); // Nueva agenda no es read-only

    // Si NO estamos en un cliente específico, abrir el panel de datos
    const clientDetails = document.querySelector('details');
    if (!defaultClient && clientDetails) {
        clientDetails.open = true;
        setTimeout(() => meetingClientInput.focus(), 100);
    }
}

function setReadOnlyMode(container, isReadOnly) {
    if (isReadOnly) {
        container.classList.add('read-only-mode');
    } else {
        container.classList.remove('read-only-mode');
    }
}

function updateStatusUI(agenda) {
    if (!agenda) return;
    agendaStatusBadge.textContent = agenda.status.replace('_', ' ');
    if (agenda.status === 'agendada') {
        agendaStatusBadge.parentElement.parentElement.style.borderLeftColor = '#3b82f6';
        markCompletedBtn.style.display = 'inline-block';
        markNotHeldBtn.style.display = 'inline-block';
        rescheduleBtn.style.display = 'inline-block';
        setupAgreementsBtn.style.display = 'none'; // ocultar módulo de acuerdos
    } else if (agenda.status === 'realizada') {
        agendaStatusBadge.parentElement.parentElement.style.borderLeftColor = '#10b981';
        markCompletedBtn.style.display = 'none';
        markNotHeldBtn.style.display = 'none';
        rescheduleBtn.style.display = 'inline-block';
        setupAgreementsBtn.style.display = 'block'; // mostrar módulo de acuerdos
    } else if (agenda.status === 'reagendada') {
        agendaStatusBadge.parentElement.parentElement.style.borderLeftColor = '#f59e0b';
        markCompletedBtn.style.display = 'inline-block';
        markNotHeldBtn.style.display = 'inline-block';
        rescheduleBtn.style.display = 'inline-block';
        setupAgreementsBtn.style.display = 'none'; // ocultar módulo de acuerdos
    } else if (agenda.status === 'no_realizada') {
        agendaStatusBadge.parentElement.parentElement.style.borderLeftColor = '#ef4444';
        markCompletedBtn.style.display = 'none';
        markNotHeldBtn.style.display = 'none';
        rescheduleBtn.style.display = 'inline-block';
        setupAgreementsBtn.style.display = 'none'; // ocultar módulo de acuerdos
    }
}

async function generatePrePDF() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    if (typeof html2pdf === 'undefined') {
        alert("La herramienta de PDF está cargando. Por favor, intenta de nuevo en unos segundos.");
        return;
    }
    
    prePdfBtn.textContent = "Generando...";
    prePdfBtn.disabled = true;

    try {
        document.getElementById('pre-pdf-meeting-title').textContent = agenda.name || 'Reunión sin título';
        document.getElementById('pre-pdf-meeting-client').textContent = agenda.client ? `Cliente/Proyecto: ${agenda.client}` : '';
        const dateStr = agenda.date ? new Date(agenda.date + 'T12:00:00').toLocaleDateString() : 'Sin fecha';
        const timeStr = agenda.time ? ` de ${agenda.time} a ${agenda.endTime || '?'}` : '';
        document.getElementById('pre-pdf-meeting-date-time').textContent = `Fecha y Hora: ${dateStr}${timeStr}`;
        document.getElementById('pre-pdf-meeting-location').textContent = agenda.location ? `Lugar/Enlace: ${agenda.location}` : '';
        
        let attendeesText = '';
        if (Array.isArray(agenda.attendees) && agenda.attendees.length > 0) {
            attendeesText = agenda.attendees.filter(a => a.name.trim() !== '').map(a => a.name).join(', ');
        } else if (typeof agenda.attendees === 'string' && agenda.attendees.trim() !== '') {
            attendeesText = agenda.attendees;
        }
        document.getElementById('pre-pdf-meeting-attendees').textContent = attendeesText ? `Asistentes: ${attendeesText}` : '';

        const topicsList = document.getElementById('pre-pdf-topics-list');
        topicsList.innerHTML = '';
        
        agenda.topics.forEach((topic, index) => {
            const div = document.createElement('div');
            div.style.marginBottom = '15px';
            div.style.padding = '10px';
            div.style.background = '#f8fafc';
            div.style.borderLeft = '3px solid #2563eb';
            div.innerHTML = `<h3 style="font-size: 14px; margin: 0; color: #1e293b;">${index + 1}. ${topic.name} <span style="font-weight:normal; color:#64748b; font-size: 12px; margin-left: 5px;">(${topic.allocatedMinutes} min)</span></h3>`;
            topicsList.appendChild(div);
        });

        // Mostrar pantalla de vista previa
        currentPreviewType = 'convocatoria';
        prePdfTemplateContainer.style.display = 'block';
        pdfTemplateContainer.style.display = 'none';
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        previewScreen.classList.add('active');
        
        prePdfBtn.textContent = "📄 PDF Convocatoria";
        prePdfBtn.disabled = false;

    } catch(e) {
        console.error(e);
        alert("Error al preparar la vista previa de convocatoria.");
        prePdfBtn.textContent = "📄 PDF Convocatoria";
        prePdfBtn.disabled = false;
    }
}

function openAgenda(id) {
    appState.currentAgendaId = id;
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    meetingNameInput.value = agenda.name || '';
    meetingClientInput.value = agenda.client || '';
    if (document.getElementById('guest-email')) {
        document.getElementById('guest-email').value = agenda.guest_email || '';
    }
    meetingDateInput.value = agenda.date || '';
    meetingTimeInput.value = agenda.time || '';
    meetingEndTimeInput.value = agenda.endTime || '';
    meetingLocationInput.value = agenda.location || '';
    renderAttendees();
    totalTimeInput.value = agenda.totalTimeMinutes || 0;
    
    // Forzar recálculo por si quedó en 0 por algún error anterior
    if (agenda.time && agenda.endTime) {
        calculateTotalTime();
    }
    
    // Si la agenda ya no está agendada (está realizada), ponemos la pantalla Setup en read-only
    const isDone = agenda.status !== 'agendada';
    setReadOnlyMode(setupScreen, isDone);
    
    
    updateSummary();
    renderTopicsList();
    switchScreen(agendasListScreen, setupScreen);
    updateStatusUI(agenda);
}

function loadAgendaIntoSetup(agenda) {
    meetingNameInput.value = agenda.name;
    meetingClientInput.value = agenda.client;
    meetingDateInput.value = agenda.date;
    meetingTimeInput.value = agenda.time || '';
    meetingEndTimeInput.value = agenda.endTime || '';
    meetingLocationInput.value = agenda.location || '';
    renderAttendees();
    totalTimeInput.value = agenda.totalTimeMinutes || '';
    
    updateSummary();
    renderTopicsList();
    updateStatusUI(agenda);
}

function updateCurrentAgenda() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;

    agenda.name = meetingNameInput.value;
    agenda.client = meetingClientInput.value;
    agenda.date = meetingDateInput.value;
    agenda.time = meetingTimeInput.value;
    agenda.endTime = meetingEndTimeInput.value;
    agenda.location = meetingLocationInput.value;
    
    // Leer integrantes
    const attendeeDivs = attendeesContainer.querySelectorAll('.attendee-row');
    const newAttendees = [];
    attendeeDivs.forEach(div => {
        const id = div.getAttribute('data-id');
        const name = div.querySelector('.attendee-name').value;
        const email = div.querySelector('.attendee-email').value;
        newAttendees.push({ id, name, email });
    });
    agenda.attendees = newAttendees;

    agenda.totalTimeMinutes = parseInt(totalTimeInput.value) || 0;
    
    saveState();
    updateStatusUI(agenda);
}

function calculateTotalTime() {
    let startTime = meetingTimeInput.value;
    let endTime = meetingEndTimeInput.value;
    
    // Limpieza por si hay formatos extraños en navegadores
    startTime = startTime.replace(/[^0-9:]/g, '');
    endTime = endTime.replace(/[^0-9:]/g, '');
    
    if (startTime && endTime) {
        const [sh, sm] = startTime.split(':').map(Number);
        const [eh, em] = endTime.split(':').map(Number);
        
        if (!isNaN(sh) && !isNaN(sm) && !isNaN(eh) && !isNaN(em)) {
            let startMins = sh * 60 + sm;
            let endMins = eh * 60 + em;
            if (endMins < startMins) endMins += 24 * 60; // Pasa al día siguiente
            const diff = endMins - startMins;
            totalTimeInput.value = diff;
        }
    }
}

function renderAttendees() {
    attendeesContainer.innerHTML = '';
    const agenda = getCurrentAgenda();
    if (!agenda) return;

    // Migración retroactiva si asistentes era un string
    if (typeof agenda.attendees === 'string') {
        const text = agenda.attendees.trim();
        agenda.attendees = text ? text.split(',').map(n => ({ id: Date.now().toString(), name: n.trim(), email: '' })) : [];
    }
    if (!Array.isArray(agenda.attendees)) {
        agenda.attendees = [];
    }

    agenda.attendees.forEach(attendee => {
        const div = document.createElement('div');
        div.className = 'attendee-row';
        div.setAttribute('data-id', attendee.id);
        div.style.display = 'flex';
        div.style.gap = '0.5rem';
        div.style.alignItems = 'center';
        div.style.marginBottom = '0.5rem';

        div.innerHTML = `
            <input type="text" class="attendee-name" placeholder="Nombre" value="${attendee.name}" style="flex: 1;" autocomplete="off">
            <input type="email" class="attendee-email" placeholder="Correo (opcional)" value="${attendee.email}" style="flex: 1;" autocomplete="off">
            <button class="btn delete-attendee-btn" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 0.2rem;" title="Eliminar">🗑</button>
        `;

        div.querySelector('.attendee-name').addEventListener('input', updateCurrentAgenda);
        div.querySelector('.attendee-email').addEventListener('input', updateCurrentAgenda);
        
        div.querySelector('.delete-attendee-btn').addEventListener('click', (e) => {
            e.preventDefault();
            agenda.attendees = agenda.attendees.filter(a => a.id !== attendee.id);
            renderAttendees();
            updateCurrentAgenda();
        });

        attendeesContainer.appendChild(div);
    });
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
    
    let draggedTopicIndex = null;

    agenda.topics.forEach((topic, index) => {
        const li = document.createElement('li');
        li.className = 'topic-item';
        li.draggable = true; // Enable drag and drop
        
        // Handle drag events for reordering
        li.addEventListener('dragstart', (e) => {
            draggedTopicIndex = index;
            e.dataTransfer.effectAllowed = 'move';
            // Use setTimeout to allow the visual drag image to be captured before changing styles
            setTimeout(() => li.classList.add('dragging'), 0);
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow dropping
            e.dataTransfer.dropEffect = 'move';
            li.classList.add('drag-over');
        });

        li.addEventListener('dragenter', (e) => {
            e.preventDefault();
            li.classList.add('drag-over');
        });

        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over');
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            document.querySelectorAll('.topic-item').forEach(el => el.classList.remove('drag-over'));
        });

        li.addEventListener('drop', (e) => {
            e.stopPropagation();
            li.classList.remove('drag-over');
            
            if (draggedTopicIndex !== null && draggedTopicIndex !== index) {
                // Reorder topics in the agenda
                const draggedTopic = agenda.topics[draggedTopicIndex];
                agenda.topics.splice(draggedTopicIndex, 1);
                agenda.topics.splice(index, 0, draggedTopic);
                
                saveState();
                renderTopicsList();
            }
        });

        li.innerHTML = `
            <div class="info">
                <span class="drag-handle" style="cursor: grab; margin-right: 10px; color: #64748b; font-size: 1.2rem;">≡</span>
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

    const isGuest = agenda.owner_id && appState.user && agenda.owner_id !== appState.user.id;
    const myEmail = appState.user ? appState.user.email : '';

    agenda.topics.forEach((topic, index) => {
        let topicAgreements = agenda.agreements.filter(a => a.topicId === topic.id);
        
        if (isGuest) {
            topicAgreements = topicAgreements.filter(a => {
                const isResp = a.responsible && (a.responsible.toLowerCase() === myEmail || agenda.attendees?.find(att => att.email === myEmail)?.name === a.responsible);
                return isResp;
            });
            // Si el invitado no tiene acuerdos en este tema, no renderizar el tema
            if (topicAgreements.length === 0) return;
        }
        
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
                <label>Resumen Específico del Tema</label>
                <textarea id="topic-summary-${topic.id}" rows="2" placeholder="Ej. Se concluyó que..." style="width: 100%; resize: vertical; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); color: white; border-radius: 8px; padding: 0.8rem; font-family: inherit; font-size: 0.95rem; box-sizing: border-box; margin-bottom: 1rem;">${topic.summary || ''}</textarea>
            </div>
            <div class="input-group" style="text-align: left;">
                <label>Acuerdo / Tarea</label>
                <input type="text" id="agr-text-${topic.id}" placeholder="Ej. Enviar el reporte..." autocomplete="off">
            </div>
            <div class="input-row" style="text-align: left;">
                <div class="input-group">
                    <label>Responsable(s)</label>
                    <input type="text" id="agr-resp-${topic.id}" placeholder="Ej. María, Juan" autocomplete="off">
                </div>
                <div class="input-group">
                    <label>Criticidad</label>
                    <select id="agr-crit-${topic.id}" style="padding: 0.8rem; border-radius: 8px; background: rgba(15, 23, 42, 0.6); color: var(--text-primary); border: 1px solid var(--glass-border);">
                        <option value="Alta">🔥 Alta</option>
                        <option value="Media" selected>⚡️ Media</option>
                        <option value="Baja">❄️ Baja</option>
                    </select>
                </div>
            </div>
            <div class="input-group" style="text-align: left; margin-bottom: 1rem;">
                <label>Fecha Límite</label>
                <input type="date" id="agr-date-${topic.id}">
            </div>
            <button class="btn secondary full-width small add-agr-btn" data-topic="${topic.id}" style="margin-bottom: 1.5rem;">+ Agregar a este tema</button>
        `;
        
        // Contenedor de Lista de Acuerdos del Tema (Fuera del acordeón)
        const listDiv = document.createElement('div');
        listDiv.style.padding = '0 1rem 1rem 1rem';
        let listHtml = '<ul class="topics-list" style="margin-top: 0;">';
        if (topicAgreements.length === 0) {
            listHtml += '<li class="empty-state" style="font-size:0.85rem; padding:0.5rem; background: transparent; border: none; min-height: auto;">Sin acuerdos.</li>';
        } else {
            topicAgreements.forEach(agr => {
                const dateFormatted = agr.date ? new Date(agr.date + 'T12:00:00').toLocaleDateString() : 'Sin fecha';
                let badgeCrit = '';
                if(agr.criticality === 'Alta') badgeCrit = '🔥';
                else if(agr.criticality === 'Media') badgeCrit = '⚡️';
                else if(agr.criticality === 'Baja') badgeCrit = '❄️';
                
                listHtml += `
                    <li class="topic-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 0.75rem; background: rgba(15,23,42,0.4); margin-bottom: 0.5rem;">
                        <div style="display: flex; justify-content: space-between; width: 100%;">
                            <strong style="font-size: 0.95rem; color: var(--text-primary);">&#8226; ${agr.text}</strong>
                            <button class="delete-btn del-agr-btn" data-id="${agr.id}" style="position: static; font-size:1.2rem;">×</button>
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; gap: 1rem;">
                            <span>👤 ${agr.responsible || 'N/A'}</span>
                            <span>📅 ${dateFormatted}</span>
                            ${badgeCrit ? `<span>${badgeCrit}</span>` : ''}
                        </div>
                    </li>
                `;
            });
        }
        listHtml += '</ul>';
        listDiv.innerHTML = listHtml;
        
        body.innerHTML = formHtml;
        card.appendChild(header);
        card.appendChild(listDiv); // Lista siempre visible
        card.appendChild(body);    // Formulario oculto
        
        // Eventos
        header.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            // Cerrar todos los demás
            document.querySelectorAll('.agreement-topic-card').forEach(c => c.classList.remove('active'));
            if (!isActive) {
                card.classList.add('active');
                setTimeout(() => document.getElementById(`topic-summary-${topic.id}`).focus(), 100);
            }
        });

        const topicSummaryInput = document.getElementById(`topic-summary-${topic.id}`);
        // Nota: document.getElementById puede fallar porque la tarjeta aún no está en el DOM,
        // así que es mejor usar body.querySelector o añadir el evento una vez agregado al DOM.
        const summaryTextarea = body.querySelector(`#topic-summary-${topic.id}`);
        if (summaryTextarea) {
            summaryTextarea.addEventListener('input', (e) => {
                topic.summary = e.target.value;
                saveState();
            });
        }
        
        body.querySelector('.add-agr-btn').addEventListener('click', () => {
            const text = document.getElementById(`agr-text-${topic.id}`).value.trim();
            const resp = document.getElementById(`agr-resp-${topic.id}`).value.trim();
            const date = document.getElementById(`agr-date-${topic.id}`).value;
            const crit = document.getElementById(`agr-crit-${topic.id}`).value;
            
            if (!text) return alert("El acuerdo no puede estar vacío.");
            
            agenda.agreements.push({
                id: Date.now().toString(),
                topicId: topic.id,
                text,
                responsible: resp,
                date,
                deadline: date,
                criticality: crit,
                completed: false
            });
            saveState();
            renderAgreementsTopics();
            // Reabrir el card modificado
            setTimeout(() => {
                const cards = document.querySelectorAll('.agreement-topic-card');
                if (cards[index]) cards[index].classList.add('active');
            }, 50);
        });
        
        card.querySelectorAll('.del-agr-btn').forEach(btn => {
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
    
    // Auto-guardar cualquier acuerdo que el usuario haya escrito pero olvidó clickear "+ Agregar a este tema"
    let hasUnsavedAgreements = false;
    agenda.topics.forEach(topic => {
        const textInput = document.getElementById(`agr-text-${topic.id}`);
        if (textInput && textInput.value.trim() !== '') {
            const respInput = document.getElementById(`agr-resp-${topic.id}`);
            const dateInput = document.getElementById(`agr-date-${topic.id}`);
            const critInput = document.getElementById(`agr-crit-${topic.id}`);
            
            agenda.agreements.push({
                id: Date.now().toString() + Math.random().toString(36).substring(7),
                topicId: topic.id,
                text: textInput.value.trim(),
                responsible: respInput ? respInput.value.trim() : '',
                date: dateInput ? dateInput.value : '',
                deadline: dateInput ? dateInput.value : '',
                criticality: critInput ? critInput.value : 'Media',
                completed: false
            });
            hasUnsavedAgreements = true;
        }
    });
    
    if (hasUnsavedAgreements) {
        saveState();
    }
    // Validar librería html2pdf
    if (typeof html2pdf === 'undefined') {
        alert("La herramienta de PDF está cargando. Por favor, intenta de nuevo en unos segundos o recarga la página.");
        return;
    }
    

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
        
        if (totalElapsed === 0) {
            document.getElementById('pdf-actual-time-container').style.display = 'none';
        } else {
            document.getElementById('pdf-actual-time-container').style.display = 'block';
        }
        
        // Llenar Temas y Acuerdos
        const pdfTopicsList = document.getElementById('pdf-topics-list');
        pdfTopicsList.innerHTML = '';
        
        const isGuest = agenda.owner_id && appState.user && agenda.owner_id !== appState.user.id;
        const myEmail = appState.user ? appState.user.email : '';

        agenda.topics.forEach((topic, index) => {
            let topicAgreements = (agenda.agreements || []).filter(a => a.topicId === topic.id);
            
            if (isGuest) {
                topicAgreements = topicAgreements.filter(a => {
                    const isResp = a.responsible && (a.responsible.toLowerCase() === myEmail || agenda.attendees?.find(att => att.email === myEmail)?.name === a.responsible);
                    return isResp;
                });
                if (topicAgreements.length === 0) return; // Hide topics with no participation for guests
            }

            const topicDiv = document.createElement('div');
            topicDiv.style.marginBottom = '25px';
            
            const elapsedMins = Math.round(topic.elapsedSeconds / 60);
            const timeLabel = totalElapsed > 0 ? `<span style="font-size: 12px; font-weight: normal; color: #64748b; margin-left: 10px;">(Tiempo invertido: ${elapsedMins}m)</span>` : '';
            
            let topicSummaryHtml = '';
            if (topic.summary && topic.summary.trim() !== '') {
                topicSummaryHtml = `<p style="font-size: 13px; color: #334155; margin: 0 0 10px 20px; font-style: italic;"><strong>Resumen:</strong> ${topic.summary}</p>`;
            }

            topicDiv.innerHTML = `
                <h3 style="font-size: 16px; color: #1e293b; margin: 0 0 10px 0; background: #f1f5f9; padding: 8px; border-left: 4px solid #2563eb;">
                    ${index + 1}. ${topic.name} ${timeLabel}
                </h3>
                ${topicSummaryHtml}
            `;
            
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

        const generalSupportSection = document.getElementById('pdf-general-support-section');
        if (agenda.meetingLink || agenda.meetingSummary) {
            generalSupportSection.style.display = 'block';
            
            const linkEl = document.getElementById('pdf-meeting-link');
            const linkContainer = document.getElementById('pdf-meeting-link-container');
            if (agenda.meetingLink) {
                linkContainer.style.display = 'block';
                linkEl.href = agenda.meetingLink;
                linkEl.textContent = agenda.meetingLink;
            } else {
                linkContainer.style.display = 'none';
            }
            
            const summaryEl = document.getElementById('pdf-meeting-summary');
            if (agenda.meetingSummary) {
                summaryEl.style.display = 'block';
                summaryEl.textContent = agenda.meetingSummary;
            } else {
                summaryEl.style.display = 'none';
            }
        } else {
            generalSupportSection.style.display = 'none';
        }

        const element = document.getElementById('pdf-template-container');

        // Mostrar pantalla de vista previa
        currentPreviewType = 'acta';
        pdfTemplateContainer.style.display = 'block';
        prePdfTemplateContainer.style.display = 'none';
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        previewScreen.classList.add('active');
        
        finalizeAgreementsBtn.textContent = "Generar PDF de Acta";
        finalizeAgreementsBtn.disabled = false;
        
    } catch (e) {
        console.error("Error generando PDF:", e);
        alert("Ocurrió un error al generar el PDF.");
    } finally {
        const isDone = agenda.status !== 'agendada';
        finalizeAgreementsBtn.textContent = isDone ? "Generar y Descargar Acta PDF" : "Finalizar Acuerdos y Generar Acta PDF";
        finalizeAgreementsBtn.disabled = false;
    }
}

function exportPreviewToPDF() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;

    previewPdfBtn.textContent = "Generando...";
    previewPdfBtn.disabled = true;

    const elementId = currentPreviewType === 'convocatoria' ? 'pre-pdf-template-container' : 'pdf-template-container';
    const element = document.getElementById(elementId);
    const prefix = currentPreviewType === 'convocatoria' ? 'Convocatoria' : 'Acta';
    
    // Al usar el elemento directamente que está renderizado en pantalla sin max-width, html2canvas lo capta perfectamente
    const opt = {
        margin:       10,
        filename:     `${prefix}_${agenda.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        previewPdfBtn.textContent = "📄 Descargar PDF";
        previewPdfBtn.disabled = false;
    }).catch(err => {
        console.error("Error exportando PDF:", err);
        alert("Ocurrió un error al exportar el PDF.");
        previewPdfBtn.textContent = "📄 Descargar PDF";
        previewPdfBtn.disabled = false;
    });
}

function exportPreviewToWord() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;

    previewWordBtn.textContent = "Generando...";
    previewWordBtn.disabled = true;

    const elementId = currentPreviewType === 'convocatoria' ? 'pre-pdf-template-container' : 'pdf-template-container';
    const element = document.getElementById(elementId);
    const prefix = currentPreviewType === 'convocatoria' ? 'Convocatoria' : 'Acta';
    const filename = `${prefix}_${agenda.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.doc`;

    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${prefix} de Reunión</title>
            <style>
                body { font-family: Arial, sans-serif; }
                h1, h2, h3 { color: #1e293b; }
            </style>
        </head>
        <body>
            ${element.innerHTML}
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    previewWordBtn.textContent = "📝 Descargar Word";
    previewWordBtn.disabled = false;
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
    agenda.topics.forEach(t => {
        t.elapsedSeconds = 0; // Reset
        if (typeof t.originalAllocatedSeconds !== 'undefined') {
            t.allocatedSeconds = t.originalAllocatedSeconds;
            t.allocatedMinutes = Math.round(t.allocatedSeconds / 60);
        } else {
            t.originalAllocatedSeconds = t.allocatedSeconds;
        }
    });
    
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
    clearInterval(appState.cloudSyncInterval);
    saveEphemeralState();
    saveState();
}

function resumeTimer() {
    appState.isTimerRunning = true;
    appState.lastTickTime = Date.now();
    
    appState.timerInterval = setInterval(() => {
        const agenda = getCurrentAgenda();
        if (agenda && agenda.topics[agenda.currentTopicIndex]) {
            const now = Date.now();
            const diffSeconds = Math.floor((now - appState.lastTickTime) / 1000);
            if (diffSeconds >= 1) {
                agenda.topics[agenda.currentTopicIndex].elapsedSeconds += diffSeconds;
                appState.lastTickTime += diffSeconds * 1000;
                updateTimerUI();
                saveEphemeralState();
            }
        }
    }, 200);
    
    appState.cloudSyncInterval = setInterval(() => {
        saveState();
    }, 30000);
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
    const agenda = getCurrentAgenda();
    if (agenda) {
        agenda.status = 'realizada';
        saveState();
    }
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

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

// -- ANALÍTICAS --
function renderGlobalAnalytics() {
    let allTasks = [];
    appState.agendas.forEach(agenda => {
        if (agenda.agreements) {
            agenda.agreements.forEach(agr => {
                allTasks.push(agr);
            });
        }
    });
    generateAnalyticsHTML(allTasks, appState.agendas, 'global');
}

function renderClientAnalytics() {
    const clientAgendas = appState.agendas.filter(a => a.client === appState.selectedClient);
    let allTasks = [];
    clientAgendas.forEach(agenda => {
        if (agenda.agreements) {
            agenda.agreements.forEach(agr => {
                allTasks.push(agr);
            });
        }
    });
    generateAnalyticsHTML(allTasks, clientAgendas, 'client');
}

function generateAnalyticsHTML(tasks, agendas, prefix) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Métrica de Eficiencia de Agenda
    const finishedAgendas = agendas.filter(a => a.status === 'realizada' || a.status === 'no_realizada');
    const totalFinished = finishedAgendas.length;
    const directHits = finishedAgendas.filter(a => a.status === 'realizada' && a.wasRescheduled === false).length;
    const agendaEfficiency = totalFinished === 0 ? 0 : Math.round((directHits / totalFinished) * 100);

    const kpiCards = document.getElementById(`${prefix}-kpi-cards`);
    kpiCards.innerHTML = `
        <div class="glass-card drill-down-card" id="${prefix}-card-pending" style="text-align:center; padding: 1.5rem; cursor: pointer;">
            <div style="font-size: 2.5rem; color: var(--accent-color); font-weight: bold;">${pendingTasks}</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Tareas Pendientes</div>
        </div>
        <div class="glass-card" style="text-align:center; padding: 1.5rem;">
            <div style="font-size: 2.5rem; color: ${completionRate >= 80 ? 'var(--success-color)' : (completionRate >= 50 ? 'var(--warning-color)' : 'var(--danger-color)')}; font-weight: bold;">${completionRate}%</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Cumplimiento</div>
        </div>
        <div class="glass-card" style="text-align:center; padding: 1.5rem;">
            <div style="font-size: 2.5rem; color: ${agendaEfficiency >= 80 ? 'var(--success-color)' : (agendaEfficiency >= 50 ? 'var(--warning-color)' : 'var(--danger-color)')}; font-weight: bold;">${agendaEfficiency}%</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Reuniones a la 1ra</div>
        </div>
    `;

    document.getElementById(`${prefix}-card-pending`).addEventListener('dblclick', () => {
        appState.currentView = 'master-tasks';
        mtFilterClient.value = prefix === 'client' ? (appState.selectedClient === 'Sin cliente' ? '' : appState.selectedClient) : '';
        mtFilterResp.value = '';
        renderAgendasList();
        updateTabsUI();
    });

    // Criticality
    const critCounts = { Alta: 0, Media: 0, Baja: 0 };
    tasks.filter(t => !t.completed).forEach(t => {
        if (t.criticality === 'Alta') critCounts.Alta++;
        else if (t.criticality === 'Media') critCounts.Media++;
        else critCounts.Baja++; // Asumimos Baja por defecto o vacio
    });

    const chartContainer = document.getElementById(`${prefix}-chart-container`);
    chartContainer.innerHTML = `
        <h4 style="margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 1rem;">Pendientes por Criticidad</h4>
        <div style="display: flex; justify-content: space-around; align-items: center;">
            <div><span style="font-size: 2rem; color: var(--danger-color); font-weight: bold;">${critCounts.Alta}</span><br><span style="font-size: 0.85rem; color: var(--text-secondary);">🔥 Alta</span></div>
            <div><span style="font-size: 2rem; color: var(--warning-color); font-weight: bold;">${critCounts.Media}</span><br><span style="font-size: 0.85rem; color: var(--text-secondary);">⚡️ Media</span></div>
            <div><span style="font-size: 2rem; color: #60a5fa; font-weight: bold;">${critCounts.Baja}</span><br><span style="font-size: 0.85rem; color: var(--text-secondary);">❄️ Baja</span></div>
        </div>
    `;

    // Responsible Table
    const responsibleStats = {};
    tasks.forEach(t => {
        const responsibles = t.responsible 
            ? t.responsible.split(',').map(r => r.trim()).filter(r => r !== '') 
            : ['Sin Asignar'];
            
        if (responsibles.length === 0) responsibles.push('Sin Asignar');

        responsibles.forEach(resp => {
            if (!responsibleStats[resp]) responsibleStats[resp] = { total: 0, completed: 0 };
            responsibleStats[resp].total++;
            if (t.completed) responsibleStats[resp].completed++;
        });
    });

    let tableHtml = '<div style="display: flex; flex-direction: column; gap: 0.8rem;">';
    for (const [resp, stats] of Object.entries(responsibleStats)) {
        const rate = Math.round((stats.completed / stats.total) * 100);
        tableHtml += `
            <div class="glass-card drill-down-card ca-resp-card" data-resp="${resp}" style="padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; background: rgba(30, 41, 59, 0.4); cursor: pointer;">
                <div>
                    <strong style="font-size: 1.1rem; color: var(--text-primary);">${resp}</strong>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">Completadas: ${stats.completed} de ${stats.total}</div>
                </div>
                <div style="font-size: 1.4rem; font-weight: bold; color: ${rate >= 80 ? 'var(--success-color)' : (rate >= 50 ? 'var(--warning-color)' : 'var(--danger-color)')};">
                    ${rate}%
                </div>
            </div>
        `;
    }
    tableHtml += '</div>';
    if (Object.keys(responsibleStats).length === 0) tableHtml = '<p class="empty-state">No hay responsables asignados.</p>';

    document.getElementById(`${prefix}-responsible-table`).innerHTML = tableHtml;

    document.getElementById(`${prefix}-responsible-table`).querySelectorAll('.ca-resp-card').forEach(card => {
        card.addEventListener('dblclick', (e) => {
            const resp = e.currentTarget.getAttribute('data-resp');
            appState.currentView = 'master-tasks';
            mtFilterClient.value = prefix === 'client' ? (appState.selectedClient === 'Sin cliente' ? '' : appState.selectedClient) : '';
            mtFilterResp.value = resp;
            renderAgendasList();
            updateTabsUI();
        });
    });
}

// -- CALENDARIO --
function renderCalendarView() {
    if (!calendarGrid) return;
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    calendarHeader.textContent = `${monthNames[month]} ${year}`;
    
    // Calcular días
    const firstDay = new Date(year, month, 1).getDay(); // 0 (Dom) a 6 (Sab)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Lunes primero (ajuste)
    const startDay = firstDay === 0 ? 6 : firstDay - 1; 
    
    let html = '';
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    dayNames.forEach(d => {
        html += `<div class="calendar-day-header">${d}</div>`;
    });
    
    // Celdas vacías iniciales
    for (let i = 0; i < startDay; i++) {
        html += `<div class="calendar-day empty"></div>`;
    }
    
    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        
        let dayHtml = `<div class="calendar-day ${isToday ? 'today' : ''}">
            <div class="day-number">${day}</div>`;
            
        // Buscar agendas para este día
        const dayAgendas = appState.agendas.filter(a => a.date === dateStr);
        dayAgendas.forEach(a => {
            const isDone = a.agreements && a.agreements.length > 0;
            const clientText = a.client ? `${a.client} - ` : '';
            const meetingText = a.name || 'Reunión';
            const displayText = `${clientText}${meetingText}`;
            
            dayHtml += `<div class="calendar-event ${isDone ? 'done' : ''}" data-id="${a.id}" title="${displayText}">
                ${isDone ? '✓ ' : ''}${displayText}
            </div>`;
        });
        
        dayHtml += `</div>`;
        html += dayHtml;
    }
    
    calendarGrid.innerHTML = html;
    
    // Agregar listeners a los eventos del calendario
    calendarGrid.querySelectorAll('.calendar-event').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que burbujee
            const agendaId = e.target.getAttribute('data-id');
            openAgenda(agendaId); // Abrirá en modo read-only si ya finalizó
        });
    });
}

// --- LÓGICA DEL MODAL INLINE DE ACUERDOS ---
const inlineAgreementsModal = document.getElementById('inline-agreements-modal');
const inlineModalTopicName = document.getElementById('inline-modal-topic-name');
const inlineModalBody = document.getElementById('inline-modal-body');
const closeInlineModalBtn = document.getElementById('close-inline-modal-btn');
const inlineModalDoneBtn = document.getElementById('inline-modal-done-btn');

if (closeInlineModalBtn) closeInlineModalBtn.addEventListener('click', closeInlineModal);
if (inlineModalDoneBtn) inlineModalDoneBtn.addEventListener('click', closeInlineModal);

function openInlineAgreementsModal() {
    const agenda = getCurrentAgenda();
    if (!agenda) return;
    
    if (!agenda.agreements) agenda.agreements = [];
    const topic = agenda.topics[agenda.currentTopicIndex];
    if (!topic) return;

    inlineModalTopicName.textContent = topic.name;
    
    renderInlineAgreementsBody(agenda, topic);
    
    inlineAgreementsModal.style.display = 'flex';
}

function renderInlineAgreementsBody(agenda, topic) {
    const topicAgreements = agenda.agreements.filter(a => a.topicId === topic.id);
    const canEdit = !agenda.owner_id || agenda.owner_id === appState.user?.id;
    
    let attendeesOptions = '<option value="">-- Seleccionar Asistente --</option>';
    if (agenda.attendees && agenda.attendees.length > 0) {
        attendeesOptions += agenda.attendees.map(a => `<option value="${a.id}">${a.name || a.email || 'Sin nombre'}</option>`).join('');
    } else {
        attendeesOptions = '<option value="">(Agrega integrantes a la reunión)</option>';
    }

    let html = `
        <div class="input-group" style="text-align: left; margin-bottom: 1rem;">
            <label>Resumen Específico del Tema</label>
            <textarea id="inline-topic-summary" rows="2" placeholder="Ej. Se concluyó que..." style="width: 100%; resize: vertical; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); color: white; border-radius: 8px; padding: 0.8rem; font-family: inherit; font-size: 0.95rem; box-sizing: border-box;">${topic.summary || ''}</textarea>
        </div>
        
        <h4 style="margin: 1.5rem 0 0.5rem 0; font-size: 1rem; color: #fff;">Agregar / Editar Tarea</h4>
        <div class="input-group" style="text-align: left;">
            <label>Acuerdo / Tarea</label>
            <input type="text" id="inline-agr-text" placeholder="Ej. Enviar el reporte..." autocomplete="off">
        </div>
        <div class="input-row" style="text-align: left;">
            <div class="input-group">
                <label>Responsable</label>
                <select id="inline-agr-resp" style="padding: 0.8rem; border-radius: 8px; background: rgba(15, 23, 42, 0.6); color: var(--text-primary); border: 1px solid var(--glass-border); width: 100%;">
                    ${attendeesOptions}
                </select>
            </div>
            <div class="input-group">
                <label>Criticidad</label>
                <select id="inline-agr-crit" style="padding: 0.8rem; border-radius: 8px; background: rgba(15, 23, 42, 0.6); color: var(--text-primary); border: 1px solid var(--glass-border);">
                    <option value="Alta">🔥 Alta</option>
                    <option value="Media" selected>⚡️ Media</option>
                    <option value="Baja">❄️ Baja</option>
                </select>
            </div>
        </div>
        <div class="input-group" style="text-align: left; margin-bottom: 1rem;">
            <label>Fecha Límite</label>
            <input type="date" id="inline-agr-date">
        </div>
        <button id="inline-add-agr-btn" class="btn secondary full-width small" style="margin-bottom: 1.5rem;">+ Agregar a este tema</button>
        
        <h4 style="margin: 1.5rem 0 0.5rem 0; font-size: 1rem; color: #fff;">Acuerdos Registrados</h4>
        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; max-height: 200px; overflow-y: auto;">
    `;
    
    if (topicAgreements.length === 0) {
        html += '<p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">No hay acuerdos para este tema.</p>';
    } else {
        html += '<ul style="list-style: none; padding: 0; margin: 0;">';
        topicAgreements.forEach(agr => {
            const dateFormatted = agr.date ? new Date(agr.date + 'T12:00:00').toLocaleDateString() : 'Sin fecha';
            let badgeCrit = '';
            if(agr.criticality === 'Alta') badgeCrit = '🔥';
            else if(agr.criticality === 'Media') badgeCrit = '⚡️';
            else if(agr.criticality === 'Baja') badgeCrit = '❄️';
            
            html += `
                <li style="margin-bottom: 0.8rem; padding-bottom: 0.8rem; border-bottom: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
                        <strong style="font-size: 0.95rem; color: var(--text-primary);">&#8226; ${agr.text}</strong>
                        <div>
                            ${canEdit ? `<button class="inline-edit-agr-btn" data-id="${agr.id}" style="background: transparent; border: none; color: #3b82f6; font-size: 1.2rem; cursor: pointer; padding: 0 0.5rem;" title="Editar">✏️</button>` : ''}
                            ${canEdit ? `<button class="inline-del-agr-btn" data-id="${agr.id}" style="background: transparent; border: none; color: var(--danger-color); font-size: 1.2rem; cursor: pointer; padding: 0 0.5rem;" title="Eliminar">&times;</button>` : ''}
                        </div>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; gap: 1rem; flex-wrap: wrap;">
                        <span>👤 ${agr.responsible || 'N/A'}</span>
                        <span>📅 ${dateFormatted}</span>
                        ${badgeCrit ? `<span>${badgeCrit}</span>` : ''}
                    </div>
                </li>
            `;
        });
        html += '</ul>';
    }
    
    html += '</div>';
    inlineModalBody.innerHTML = html;
    
    // Listeners
    const summaryTextarea = document.getElementById('inline-topic-summary');
    if (summaryTextarea) {
        summaryTextarea.addEventListener('input', (e) => {
            topic.summary = e.target.value;
            saveEphemeralState(); // Guardado rápido
        });
        summaryTextarea.addEventListener('change', (e) => {
            topic.summary = e.target.value;
            saveState(); // Guardado a la nube
        });
    }
    
    document.getElementById('inline-add-agr-btn').addEventListener('click', (e) => {
        const btn = e.target;
        const text = document.getElementById('inline-agr-text').value.trim();
        const respSelect = document.getElementById('inline-agr-resp');
        const respId = respSelect.value;
        const respName = respSelect.options[respSelect.selectedIndex]?.text || '';
        const date = document.getElementById('inline-agr-date').value;
        const crit = document.getElementById('inline-agr-crit').value;
        
        if (!text) return alert("El acuerdo no puede estar vacío.");
        
        const editId = btn.getAttribute('data-edit-id');
        if (editId) {
            const existing = agenda.agreements.find(a => a.id === editId);
            if (existing) {
                existing.text = text;
                existing.responsibleId = respId;
                existing.responsible = respId ? respName : '';
                existing.date = date;
                existing.deadline = date;
                existing.criticality = crit;
            }
        } else {
            agenda.agreements.push({
                id: Date.now().toString(),
                topicId: topic.id,
                text,
                responsibleId: respId,
                responsible: respId ? respName : '',
                date,
                deadline: date,
                criticality: crit,
                completed: false
            });
        }
        saveState();
        renderInlineAgreementsBody(agenda, topic);
    });
    
    document.querySelectorAll('.inline-del-agr-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm("¿Eliminar este acuerdo?")) {
                const agrId = e.currentTarget.getAttribute('data-id');
                agenda.agreements = agenda.agreements.filter(a => a.id !== agrId);
                saveState();
                renderInlineAgreementsBody(agenda, topic);
            }
        });
    });

    document.querySelectorAll('.inline-edit-agr-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const agrId = e.currentTarget.getAttribute('data-id');
            const agr = agenda.agreements.find(a => a.id === agrId);
            if (agr) {
                document.getElementById('inline-agr-text').value = agr.text || '';
                
                if (agr.responsibleId) {
                    document.getElementById('inline-agr-resp').value = agr.responsibleId;
                } else if (agr.responsible) {
                    const optionMatch = Array.from(document.getElementById('inline-agr-resp').options).find(opt => opt.text.includes(agr.responsible));
                    if(optionMatch) document.getElementById('inline-agr-resp').value = optionMatch.value;
                }
                
                document.getElementById('inline-agr-crit').value = agr.criticality || 'Media';
                document.getElementById('inline-agr-date').value = agr.date || '';
                
                const addBtn = document.getElementById('inline-add-agr-btn');
                addBtn.textContent = '💾 Guardar Cambios';
                addBtn.setAttribute('data-edit-id', agr.id);
            }
        });
    });
}

function closeInlineModal() {
    inlineAgreementsModal.style.display = 'none';
}

// Inicializar la app
init();
