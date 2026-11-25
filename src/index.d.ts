// TraceLoop — ambient type hints (hand-written; the library is plain JS).
// Every style shares the same controller shape; style-specific members
// are noted in docs/STYLES.md.

export interface LoaderOptions {
  d?: string | { shape: string; args?: unknown[]; viewBox?: string };
  viewBox?: string;
  durationMs?: number;
  direction?: 'forward' | 'reverse';
  segmentFraction?: number;
  offset?: number;
  color?: string | null;
  strokeWidth?: number | null;
  guideOpacity?: number;
  guideD?: string;
  steps?: number;
  headRadius?: number;
  variant?: string;
  items?: string[];
  trigger?: string;
  placement?: 'auto' | 'top' | 'bottom';
  axis?: 'x' | 'y';
  exitMs?: number;
  distance?: number;
  delayMs?: number;
  triggers?: Array<{ sel: string; to: number }>;
  label?: string;
  value?: string;
  closedHeight?: number;
  thickness?: number;
  enter?: string;
  size?: number;
  breathe?: number;
  breatheMs?: number;
  autoStart?: boolean;
  activeClass?: string;
  [key: string]: unknown;
}

export interface LoaderController {
  el: HTMLElement;
  svg: SVGSVGElement;
  start(): void;
  stop(): void;
  destroy(): void;
  isRunning(): boolean;
  [key: string]: unknown;
}

export interface ShapeResult {
  d: string;
  viewBox?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  fontWeight?: number;
}

export const OrbitLoader: {
  wrap(container: HTMLElement | string, options: LoaderOptions): LoaderController;
  create(pathEl: SVGPathElement, options: LoaderOptions): LoaderController;
};
export const DotLoader: {
  wrap(container: HTMLElement | string, options: LoaderOptions): LoaderController;
  create(pathEl: SVGPathElement, options: LoaderOptions): LoaderController;
};
export const RippleLoader: {
  create(container: HTMLElement | string, options?: LoaderOptions): LoaderController;
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController;
};
export const TypingLoader: {
  create(container: HTMLElement | string, options?: LoaderOptions): LoaderController;
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController;
};
export const HandshakeLoader: {
  wrap(container: HTMLElement | string, options: LoaderOptions): LoaderController;
  create(pathEl: SVGPathElement, options: LoaderOptions): LoaderController;
};
export const TabLoader: {
  create(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    play(from: number, to: number): Animation | null;
    set(fraction: number): void;
  };
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    play(from: number, to: number): Animation | null;
    set(fraction: number): void;
  };
};
export const PageLoader: {
  create(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    done(): void;
  };
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    done(): void;
  };
};
export const ButtonLoader: {
  create(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    begin(): void;
    success(): void;
    fail(): void;
    reset(): void;
  };
  wrap(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    begin(): void;
    success(): void;
    fail(): void;
    reset(): void;
  };
};
export const ToastLoader: {
  create(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    begin(ms?: number): void;
    dismiss(): void;
  };
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    begin(ms?: number): void;
    dismiss(): void;
  };
};
export const SwapLoader: {
  create(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    swapTo(i: number): void;
    next(): void;
    index(): number;
  };
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    swapTo(i: number): void;
    next(): void;
    index(): number;
  };
};
export const ProgressLoader: {
  create(target: HTMLElement | string | SVGPathElement, options?: LoaderOptions): LoaderController & {
    setProgress(p: number): void;
    done(): void;
  };
  wrap(target: HTMLElement | string | SVGPathElement, options?: LoaderOptions): LoaderController & {
    setProgress(p: number): void;
    done(): void;
  };
};

export const SearchLoader: {
  create(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void; toggle(): void;
  };
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void; toggle(): void;
  };
};
export const ModalLoader: {
  create(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void;
  };
  wrap(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void;
  };
};
export const AccordionLoader: {
  create(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void; toggle(): void;
  };
  wrap(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void; toggle(): void;
  };
};

export const DrawerLoader: {
  create(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void; toggle(): void;
  };
  wrap(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void; toggle(): void;
  };
};

export const DropdownLoader: {
  create(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void; toggle(): void; select(i: number): void; value(): number;
  };
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    open(): void; close(): void; toggle(): void; select(i: number): void; value(): number;
  };
};
export const InputLoader: {
  create(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    focus(): void; blur(): void; success(): void; error(): void;
  };
  wrap(el: HTMLElement | string, options?: LoaderOptions): LoaderController & {
    focus(): void; blur(): void; success(): void; error(): void;
  };
};

export interface SequenceStep {
  at?: number;
  after?: number;
  do(): void;
}

export const SequenceLoader: {
  create(steps: SequenceStep[], options?: {
    loop?: boolean;
    loopRestMs?: number;
    onDone?: () => void;
    autoPlay?: boolean;
  }): {
    play(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
    duration(): number;
    firedSteps(): number[];
  };
  wrap(steps: SequenceStep[], options?: {
    loop?: boolean;
    loopRestMs?: number;
    onDone?: () => void;
    autoPlay?: boolean;
  }): {
    play(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
    duration(): number;
    firedSteps(): number[];
  };
};

export const PulseLoader: {
  create(el: HTMLElement | string, options?: LoaderOptions): LoaderController;
  wrap(el: HTMLElement | string, options?: LoaderOptions): LoaderController;
};
export const ChaseLoader: {
  create(pathEl: SVGPathElement, options?: LoaderOptions): LoaderController;
  wrap(container: HTMLElement | string, options?: LoaderOptions): LoaderController;
};

export const shapes: {
  circle(size: number): string;
  roundedSquare(size: number, radius: number): string;
  roundRect(width: number, height: number, radius: number): string;
  polygon(sides: number, size: number, radius?: number): string;
  underline(width: number, height: number): string;
  infinity(width: number, height?: number): string;
  letter(ch: string, size?: number): string;
  letterOutline(ch: string, size?: number): string;
  text(str: string, opts?: Record<string, unknown>): ShapeResult;
  textBoxForElement(el: HTMLElement, opts?: Record<string, unknown>): ShapeResult;
  [key: string]: (...args: never[]) => unknown;
};

// React adapter (traceloop/react)
export interface ComponentProps extends LoaderOptions {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare const Orbit: React.FC<ComponentProps>;
export declare const Dot: React.FC<ComponentProps>;
export declare const Ripple: React.FC<ComponentProps>;
export declare const Pulse: React.FC<ComponentProps>;
export declare const Chase: React.FC<ComponentProps>;
export declare const Typing: React.FC<ComponentProps>;
export declare const Handshake: React.FC<ComponentProps>;
export declare const Tab: React.FC<ComponentProps>;
export declare const Page: React.FC<ComponentProps>;
export declare const Button: React.FC<ComponentProps>;
export declare const Toast: React.FC<ComponentProps>;
export declare const Swap: React.FC<ComponentProps>;
export declare const Route: React.FC<ComponentProps>;
export declare const PathWipe: React.FC<ComponentProps>;
export declare const CountUp: React.FC<ComponentProps>;
export declare const Shake: React.FC<ComponentProps>;
export declare const Shuffle: React.FC<ComponentProps>;
export declare const Progress: React.FC<ComponentProps>;
export declare const Search: React.FC<ComponentProps>;
export declare const Modal: React.FC<ComponentProps>;
export declare const Accordion: React.FC<ComponentProps>;
export declare const Drawer: React.FC<ComponentProps>;
export declare const Dropdown: React.FC<ComponentProps>;
export declare const Input: React.FC<ComponentProps>;
export declare const Progress: React.FC<ComponentProps>;
export declare const Search: React.FC<ComponentProps>;
export declare const Modal: React.FC<ComponentProps>;
export declare const Accordion: React.FC<ComponentProps>;
export declare const Drawer: React.FC<ComponentProps>;
export declare const Dropdown: React.FC<ComponentProps>;

export interface TabsProps {
  items: string[];
  initial?: number;
  onChange?: (index: number) => void;
  color?: string;
  segFraction?: number;
  durationMs?: number;
  className?: string;
  children?: React.ReactNode;
}
export declare function Tabs(props: TabsProps): React.ReactElement;
export declare const Input: React.FC<ComponentProps>;

export interface CountUpOptions {
  from?: number;
  value?: number;
  durationMs?: number;
  easing?: 'linear' | 'easeOutCubic' | 'easeOutExpo' | 'easeOutBack';
  decimals?: number;
  separator?: string | null;
  prefix?: string;
  suffix?: string;
  restMs?: number;
  autoStart?: boolean;
}
export const CountUpLoader: {
  create(el: HTMLElement | string, options?: CountUpOptions): {
    el: HTMLElement;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
  };
  wrap(el: HTMLElement | string, options?: CountUpOptions): {
    el: HTMLElement;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
  };
};
export interface ShakeOptions {
  variant?: 'little' | 'default' | 'hard';
  durationMs?: number;
  decay?: number;
  restMs?: number;
  autoStart?: boolean;
}
export const ShakeLoader: {
  create(el: HTMLElement | string, options?: ShakeOptions): {
    el: HTMLElement;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
  };
  wrap(el: HTMLElement | string, options?: ShakeOptions): {
    el: HTMLElement;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
  };
};

export interface ShuffleOptions {
  intervalMs?: number;
  durationMs?: number;
  moveFrom?: 'last' | 'first' | number;
  easing?: string;
  autoStart?: boolean;
}
export const ShuffleLoader: {
  create(container: HTMLElement | string, options?: ShuffleOptions): {
    container: HTMLElement;
    shuffle(): void;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
  };
  wrap(container: HTMLElement | string, options?: ShuffleOptions): {
    container: HTMLElement;
    shuffle(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
  };
};

export interface RouteOptions {
  variant?: 'fade' | 'slide' | 'wipe';
  direction?: 'left' | 'right' | 'up' | 'down';
  exitMs?: number;
  durationMs?: number;
  distance?: number;
  wipeColor?: string | null;
  items?: string[];
  restMs?: number;
  onDone?: (page?: HTMLElement) => void;
  autoStart?: boolean;
}
export interface RouteCallOptions {
  direction?: 'left' | 'right' | 'up' | 'down';
  variant?: 'fade' | 'slide' | 'wipe';
  onDone?: (page?: HTMLElement) => void;
}
export const RouteLoader: {
  create(container: HTMLElement | string, options?: RouteOptions): {
    el: HTMLElement;
    to(content: string | HTMLElement | number, opts?: RouteCallOptions): void;
    next(): void;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
    index(): number;
  };
  wrap(container: HTMLElement | string, options?: RouteOptions): {
    el: HTMLElement;
    to(content: string | HTMLElement | number, opts?: RouteCallOptions): void;
    next(): void;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
    index(): number;
  };
};

export interface PathWipeOptions {
  shape?: 'diagonal' | 'wave' | 'zigzag' | 'arc' | 'custom';
  d?: string | null;
  direction?: 'left' | 'right' | 'up' | 'down';
  durationMs?: number;
  amplitude?: number;
  detail?: number;
  edgeColor?: string | null;
  restMs?: number;
  onDone?: (mode?: 'reveal' | 'conceal') => void;
  autoStart?: boolean;
}
export interface PathWipeCallOptions {
  direction?: 'left' | 'right' | 'up' | 'down';
  durationMs?: number;
  onDone?: (mode?: 'reveal' | 'conceal') => void;
}
export const PathWipeLoader: {
  create(container: HTMLElement | string, options?: PathWipeOptions): {
    el: HTMLElement;
    reveal(opts?: PathWipeCallOptions): void;
    conceal(opts?: PathWipeCallOptions): void;
    show(): void;
    hide(): void;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
  };
  wrap(container: HTMLElement | string, options?: PathWipeOptions): {
    el: HTMLElement;
    reveal(opts?: PathWipeCallOptions): void;
    conceal(opts?: PathWipeCallOptions): void;
    show(): void;
    hide(): void;
    start(): void;
    stop(): void;
    destroy(): void;
    isRunning(): boolean;
  };
};
