export type MenuCallbacks = {
    onTransform: (mode: string) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onShowCoords?: () => void;
    onResetOrigin?: () => void;
    objectInfoTitle?: string;
    objectInfoItems?: { title?: string; text: string }[];
    objectActionsTitle?: string;
    objectActions?: { label: string; icon: string; action: () => void; active?: boolean; danger?: boolean }[];
};

export type ObjectToolPanelCallbacks = {
    title: string;
    activeMode?: string | null;
    onTransform: (mode: string) => void;
    rotationStepDeg: number;
    onSetRotationStep: (step: number) => void;
    onRotateStep: (axis: 'x' | 'y' | 'z', direction: 1 | -1) => void;
    onResetTransform: () => void;
    onExit: () => void;
};
