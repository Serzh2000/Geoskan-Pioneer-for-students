/**
 * Модуль рендеринга справочника API.
 * Формирует структурированный каталог методов, поддерживает поиск по API
 * и подключает раскрывающиеся 3D-визуализации для методов автопилота.
 */
import { apiDocs, pythonApiDocs } from '../docs/api-docs.js';
import type { ApiDoc } from '../docs/api-docs-types.js';
import { ApiMethodPreview, type ApiPreviewScenario } from './api-docs-preview.js';

type ScriptLanguage = 'lua' | 'python';
type ApiCategoryId =
    | 'autopilot'
    | 'timers'
    | 'sensors'
    | 'camera'
    | 'leds'
    | 'control'
    | 'peripherals'
    | 'globals'
    | 'events'
    | 'misc';

type ApiEntryView = {
    name: string;
    doc: ApiDoc;
    categoryId: ApiCategoryId;
    scopeLabel: string;
    previewScenario: ApiPreviewScenario | null;
};

type ApiSection = {
    id: ApiCategoryId;
    title: string;
    description: string;
    entries: ApiEntryView[];
};

const categoryMeta: Record<ApiCategoryId, { title: string; description: string }> = {
    autopilot: {
        title: 'Автопилот',
        description: 'Команды взлета, посадки, полета к точке и переходов состояний автопилота.'
    },
    timers: {
        title: 'Таймеры и планирование',
        description: 'Отложенный запуск действий и периодические колбэки для сценариев миссии.'
    },
    sensors: {
        title: 'Сенсоры и телеметрия',
        description: 'Позиция, скорость, дальномер, батарея и другие данные состояния дрона.'
    },
    camera: {
        title: 'Камера',
        description: 'Съемка, видеопоток и доступ к кадрам симулятора.'
    },
    leds: {
        title: 'LED и индикация',
        description: 'Управление светодиодами и цветовой индикацией дрона.'
    },
    control: {
        title: 'Управление и RC',
        description: 'Ручное управление и отправка команд по каналам пульта.'
    },
    peripherals: {
        title: 'Периферия и интерфейсы',
        description: 'GPIO, UART, SPI и обмен сообщениями с внешними устройствами.'
    },
    globals: {
        title: 'Глобальные функции',
        description: 'Вспомогательные глобальные вызовы времени и системного состояния.'
    },
    events: {
        title: 'События FSM',
        description: 'Константы событий автопилота, которые приходят в `callback(event)`.'
    },
    misc: {
        title: 'Прочее',
        description: 'Служебные методы, которые не попали в основные категории.'
    }
};

const previewScenarios: Record<string, ApiPreviewScenario> = {
    'ap.push': 'fsm',
    'ap.goToLocalPoint': 'goto',
    'ap.goToPoint': 'goto',
    'ap.updateYaw': 'yaw',
    'Pioneer.arm': 'arm',
    'Pioneer.disarm': 'disarm',
    'Pioneer.takeoff': 'takeoff',
    'Pioneer.land': 'land',
    'Pioneer.go_to_local_point': 'goto',
    'Pioneer.go_to_local_point_body_fixed': 'goto-body',
    'Pioneer.point_reached': 'point-reached',
    'Pioneer.set_manual_speed': 'manual',
    'Pioneer.get_autopilot_state': 'state'
};

const uiState: {
    language: ScriptLanguage;
    query: string;
    openPreviewKey: string | null;
    previews: Map<string, ApiMethodPreview>;
} = {
    language: 'lua',
    query: '',
    openPreviewKey: null,
    previews: new Map()
};

function renderLuaMissionGuide() {
    return `
        <div class="api-guide">
            <div class="api-guide__title">Как правильно строить миссию</div>
            <div class="api-guide__text">Не отправляйте <code>ap.push(Ev.MCE_PREFLIGHT)</code>, <code>ap.push(Ev.MCE_TAKEOFF)</code>, <code>ap.goToLocalPoint(...)</code> и <code>ap.push(Ev.MCE_LANDING)</code> подряд в одном тике. Между этапами должны быть либо задержки по времени, либо ожидание фактических событий автопилота.</div>
            <div class="api-guide__text"><strong>Что такое FSM:</strong> <code>FSM</code> = <code>Finite State Machine</code>, конечный автомат состояний дрона. Он определяет, из какого состояния в какое состояние разрешен переход.</div>
            <div class="api-guide__text"><strong>Правильная цепочка:</strong> IDLE -> PREFLIGHT -> TAKEOFF_PROCESS -> FLYING_HOVER -> FLYING_MOVING -> LANDING_PROCESS.</div>
            <div class="api-guide__text"><strong>Подход 1, через таймеры:</strong> используйте <code>Timer.callLater(...)</code>, когда нужно развести команды по времени. Это удобно для простых сценариев, но таймер сам по себе не проверяет, успел ли дрон реально завершить предыдущий этап.</div>
            <div class="api-guide__text"><strong>Подход 2, через события FSM:</strong> используйте <code>callback(event)</code> и реагируйте на <code>Ev.TAKEOFF_COMPLETE</code>, <code>Ev.POINT_REACHED</code> и другие события. Такой вариант надежнее, потому что следующий шаг запускается после фактического перехода автомата.</div>
            <div class="api-guide__text"><strong>Практика:</strong> таймеры подходят для пауз и отложенного старта этапа, а события <code>FSM</code> для шагов, зависящих от успешного завершения предыдущего состояния. Эти подходы можно комбинировать.</div>
            <div class="api-guide__code">ap.push(Ev.MCE_PREFLIGHT)
Timer.callLater(1, function()
    ap.push(Ev.MCE_TAKEOFF)
end)

function callback(event)
    if event == Ev.TAKEOFF_COMPLETE then
        ap.goToLocalPoint(1, 1, 1)
    end
    if event == Ev.POINT_REACHED then
        ap.push(Ev.MCE_LANDING)
    end
end</div>
        </div>
    `;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function destroyPreviews(): void {
    for (const preview of uiState.previews.values()) {
        preview.destroy();
    }
    uiState.previews.clear();
}

function getScopeLabel(name: string, language: ScriptLanguage): string {
    if (name.includes(':')) {
        return name.split(':')[0];
    }
    if (name.includes('.')) {
        return name.split('.')[0];
    }
    if (name.startsWith('Ev.')) {
        return 'Ev';
    }
    return language === 'python' ? 'Global' : 'Lua';
}

function classifyEntry(name: string, language: ScriptLanguage): ApiCategoryId {
    const lowerName = name.toLowerCase();

    if (name.startsWith('Ev.')) return 'events';
    if (name.startsWith('ap.')) return 'autopilot';
    if (name.startsWith('Timer.')) return 'timers';
    if (name.startsWith('Sensors.')) return 'sensors';
    if (name.startsWith('camera.') || name.startsWith('Camera.')) return 'camera';
    if (name.startsWith('Ledbar') || lowerName.includes('led_control')) return 'leds';
    if (name.startsWith('Gpio.') || name.startsWith('Uart.') || name.startsWith('Spi.') || name.startsWith('mailbox.')) {
        return 'peripherals';
    }
    if (['time', 'launchtime', 'deltatime', 'sleep', 'boardnumber'].includes(lowerName)) return 'globals';

    if (language === 'python' && name.startsWith('Pioneer.')) {
        if (/(arm|disarm|takeoff|land|go_to_|point_reached|set_manual_speed|get_autopilot_state)/.test(lowerName)) {
            return 'autopilot';
        }
        if (/(get_local_position_lps|get_dist_sensor_data|get_battery_status)/.test(lowerName)) {
            return 'sensors';
        }
        if (/send_rc_channels/.test(lowerName)) {
            return 'control';
        }
        return 'misc';
    }

    return 'misc';
}

function buildSearchText(name: string, doc: ApiDoc, scopeLabel: string): string {
    return [
        name,
        scopeLabel,
        doc.desc,
        doc.syntax,
        doc.params,
        doc.returns,
        doc.example,
        doc.kind
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

function buildSections(docs: Record<string, ApiDoc>, language: ScriptLanguage, query: string): ApiSection[] {
    const normalizedQuery = query.trim().toLowerCase();
    const entries = Object.entries(docs)
        .map(([name, doc]) => {
            const scopeLabel = getScopeLabel(name, language);
            const entry: ApiEntryView = {
                name,
                doc,
                categoryId: classifyEntry(name, language),
                scopeLabel,
                previewScenario: previewScenarios[name] || null
            };
            return { entry, searchText: buildSearchText(name, doc, scopeLabel) };
        })
        .filter(({ searchText }) => !normalizedQuery || searchText.includes(normalizedQuery))
        .map(({ entry }) => entry);

    const grouped = new Map<ApiCategoryId, ApiEntryView[]>();
    for (const entry of entries) {
        if (!grouped.has(entry.categoryId)) {
            grouped.set(entry.categoryId, []);
        }
        grouped.get(entry.categoryId)?.push(entry);
    }

    const order: ApiCategoryId[] = [
        'autopilot',
        'timers',
        'sensors',
        'camera',
        'leds',
        'control',
        'peripherals',
        'globals',
        'events',
        'misc'
    ];

    return order
        .map((id) => ({
            id,
            title: categoryMeta[id].title,
            description: categoryMeta[id].description,
            entries: (grouped.get(id) || []).sort((left, right) => left.name.localeCompare(right.name))
        }))
        .filter((section) => section.entries.length > 0);
}

function renderToolbar(language: ScriptLanguage, totalCount: number): string {
    const label = language === 'lua' ? 'Lua API' : 'Python API';
    const escapedQuery = escapeHtml(uiState.query);
    const summary = totalCount === 0 ? 'Совпадений нет' : `Найдено: ${totalCount}`;

    return `
        <div class="api-toolbar">
            <label class="api-search">
                <span class="api-search__label">Поиск по API</span>
                <input
                    id="api-docs-search"
                    class="api-search__input"
                    type="search"
                    placeholder="Метод, событие, аргумент, пример..."
                    value="${escapedQuery}"
                    autocomplete="off"
                    spellcheck="false"
                />
            </label>
            <div class="api-toolbar__meta">
                <span class="api-toolbar__badge">${label}</span>
                <span class="api-toolbar__summary">${summary}</span>
            </div>
        </div>
    `;
}

function renderEntry(entry: ApiEntryView): string {
    const isInteractive = !!entry.previewScenario;
    const isOpen = uiState.openPreviewKey === entry.name && isInteractive;
    const headerTag = isInteractive ? 'button' : 'div';
    const headerAttrs = isInteractive
        ? `type="button" class="api-header api-header--button" data-preview-toggle="${escapeHtml(entry.name)}" aria-expanded="${isOpen}"`
        : 'class="api-header"';
    const scopeTag = escapeHtml(entry.scopeLabel);
    const kind = escapeHtml(entry.doc.kind || 'Method');

    return `
        <div class="api-entry ${isInteractive ? 'api-entry--interactive' : ''}">
            <${headerTag} ${headerAttrs}>
                <span class="api-header__main">
                    <span class="api-name">${escapeHtml(entry.name)}</span>
                    <span class="api-tags">
                        <span class="api-tag">${scopeTag}</span>
                        ${isInteractive ? '<span class="api-tag api-tag--accent">3D</span>' : ''}
                    </span>
                </span>
                <span class="api-header__side">
                    <span class="api-kind">${kind}</span>
                    ${isInteractive ? `<span class="api-toggle-indicator">${isOpen ? 'Скрыть' : 'Показать'} анимацию</span>` : ''}
                </span>
            </${headerTag}>
            <div class="api-desc">${entry.doc.desc || 'Описание пока не добавлено.'}</div>
            <div class="api-details">
                ${entry.doc.syntax ? `<div class="api-details-row"><span class="api-details-label">Синтаксис:</span><span class="api-details-value">${entry.doc.syntax}</span></div>` : ''}
                ${entry.doc.params ? `<div class="api-details-row"><span class="api-details-label">Аргументы:</span><span class="api-details-value">${entry.doc.params}</span></div>` : ''}
                ${entry.doc.returns ? `<div class="api-details-row"><span class="api-details-label">Возвращает:</span><span class="api-details-value">${entry.doc.returns}</span></div>` : ''}
            </div>
            ${entry.doc.example ? `<div class="api-example">${entry.doc.example}</div>` : ''}
            ${isOpen ? renderPreviewShell(entry) : ''}
        </div>
    `;
}

function renderPreviewShell(entry: ApiEntryView): string {
    return `
        <div class="api-preview" data-api-preview-root="${escapeHtml(entry.name)}">
            <div class="api-preview__stage" data-api-preview-stage>
                <div class="api-preview__legend">
                    <span class="api-preview__legend-item"><span class="api-preview__swatch api-preview__swatch--start"></span>Старт</span>
                    <span class="api-preview__legend-item"><span class="api-preview__swatch api-preview__swatch--route"></span>Траектория</span>
                    <span class="api-preview__legend-item"><span class="api-preview__swatch api-preview__swatch--target"></span>Цель</span>
                </div>
                <div class="api-preview__phase" data-api-preview-phase>Подготовка...</div>
            </div>
            <div class="api-preview__meta">
                <div class="api-preview__title">Визуализация метода</div>
                <div class="api-preview__status" data-api-preview-status>Подготовка сцены...</div>
                <div class="api-preview__hint" data-api-preview-hint>Используется существующая модель дрона из симулятора.</div>
            </div>
        </div>
    `;
}

function renderSections(sections: ApiSection[]): string {
    if (sections.length === 0) {
        return `
            <div class="api-empty-state">
                <div class="api-empty-state__title">Ничего не найдено</div>
                <div class="api-empty-state__text">Попробуйте изменить строку поиска или очистить фильтр.</div>
            </div>
        `;
    }

    return sections
        .map((section) => `
            <section class="api-category">
                <div class="api-category-title">
                    <span>${section.title}</span>
                    <span class="api-category-count">${section.entries.length}</span>
                </div>
                <div class="api-category-description">${section.description}</div>
                <div class="api-category-list">
                    ${section.entries.map(renderEntry).join('')}
                </div>
            </section>
        `)
        .join('');
}

function attachInteractions(container: HTMLElement): void {
    const searchInput = container.querySelector('#api-docs-search') as HTMLInputElement | null;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            uiState.query = searchInput.value;
            renderApiDocs(uiState.language);
        });
    }

    container.querySelectorAll<HTMLElement>('[data-preview-toggle]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const key = trigger.dataset.previewToggle || null;
            uiState.openPreviewKey = uiState.openPreviewKey === key ? null : key;
            renderApiDocs(uiState.language);
        });
    });
}

function mountOpenPreview(container: HTMLElement): void {
    const previewRoot = container.querySelector<HTMLElement>('[data-api-preview-root]');
    if (!previewRoot) return;

    const key = previewRoot.dataset.apiPreviewRoot || '';
    const scenario = previewScenarios[key];
    if (!scenario) return;

    const preview = new ApiMethodPreview(previewRoot, scenario);
    uiState.previews.set(key, preview);
}

export function renderApiDocs(language: ScriptLanguage = 'lua') {
    const container = document.getElementById('api-docs');
    if (!container) return;

    if (uiState.language !== language) {
        uiState.openPreviewKey = null;
    }
    uiState.language = language;

    const docs = language === 'python' ? pythonApiDocs : apiDocs;
    const sections = buildSections(docs, language, uiState.query);
    const totalEntries = sections.reduce((count, section) => count + section.entries.length, 0);

    destroyPreviews();
    container.innerHTML = `
        ${renderToolbar(language, totalEntries)}
        ${language === 'lua' ? renderLuaMissionGuide() : ''}
        ${renderSections(sections)}
    `;

    attachInteractions(container);
    mountOpenPreview(container);
}
