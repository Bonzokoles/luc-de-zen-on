/**
 * Advanced Mouse Cursor Light Effect
 * Implements a visual cursor effect with light trail and idle glow
 */

interface CursorPosition {
  x: number;
  y: number;
}

class CursorLightEffect {
  private container: HTMLElement | null = null;
  private lightElement: HTMLElement | null = null;
  private background: HTMLElement | null = null;
  private currentPosition: CursorPosition = { x: 0, y: 0 };
  private idleTimer: number | null = null;
  private isIdle: boolean = false;
  private isVisible: boolean = true;

  // Configuration
  private readonly IDLE_DELAY = 800; // ms

  constructor() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  /**
   * Initialize the cursor light effect
   */
  public init(): void {
    // Check if touch device - don't initialize on touch devices
    if (this.isTouchDevice()) {
      console.log('Touch device detected - cursor light effect disabled');
      return;
    }

    this.createBackground();
    this.createLightElements();
    this.attachEventListeners();
    console.log('Cursor light effect initialized');
  }

  /**
   * Check if device is touch-enabled
   */
  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }

  /**
   * Create the background with gradients and topographic lines
   */
  private createBackground(): void {
    this.background = document.createElement('div');
    this.background.className = 'cursor-light-background';
    document.body.appendChild(this.background);
  }

  /**
   * Create the light trail elements
   */
  private createLightElements(): void {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'cursor-light-container';

    // Create main light element (has ::before and ::after pseudo-elements in CSS)
    this.lightElement = document.createElement('div');
    this.lightElement.className = 'cursor-light';

    this.container.appendChild(this.lightElement);
    document.body.appendChild(this.container);
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);
    document.addEventListener('mouseenter', this.handleMouseEnter);
  }

  /**
   * Handle mouse move event
   */
  private handleMouseMove(event: MouseEvent): void {
    this.currentPosition = {
      x: event.clientX,
      y: event.clientY,
    };

    this.updatePosition();
    this.resetIdleState();
    this.startIdleTimer();

    // Ensure visibility
    if (!this.isVisible && this.container) {
      this.container.style.opacity = '1';
      this.isVisible = true;
    }
  }

  /**
   * Update the position of the light element
   */
  private updatePosition(): void {
    if (this.container) {
      this.container.style.transform = `translate(${this.currentPosition.x}px, ${this.currentPosition.y}px)`;
    }
  }

  /**
   * Start the idle timer
   */
  private startIdleTimer(): void {
    if (this.idleTimer !== null) {
      window.clearTimeout(this.idleTimer);
    }

    this.idleTimer = window.setTimeout(() => {
      this.activateIdleState();
    }, this.IDLE_DELAY);
  }

  /**
   * Activate idle state (glow effect)
   */
  private activateIdleState(): void {
    if (this.lightElement && !this.isIdle) {
      this.lightElement.classList.add('idle');
      this.isIdle = true;
      console.log('Idle state activated');
    }
  }

  /**
   * Reset idle state
   */
  private resetIdleState(): void {
    if (this.idleTimer !== null) {
      window.clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    if (this.lightElement && this.isIdle) {
      this.lightElement.classList.remove('idle');
      this.isIdle = false;
    }
  }

  /**
   * Handle mouse leave event
   */
  private handleMouseLeave(): void {
    if (this.container) {
      this.container.style.opacity = '0';
      this.isVisible = false;
    }
    this.resetIdleState();
  }

  /**
   * Handle mouse enter event
   */
  private handleMouseEnter(event: MouseEvent): void {
    this.currentPosition = {
      x: event.clientX,
      y: event.clientY,
    };

    if (this.container) {
      this.container.style.opacity = '1';
      this.isVisible = true;
      this.updatePosition();
    }

    this.startIdleTimer();
  }

  /**
   * Destroy the effect and cleanup
   */
  public destroy(): void {
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
    document.removeEventListener('mouseenter', this.handleMouseEnter);

    // Clear timer
    if (this.idleTimer !== null) {
      window.clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    // Remove DOM elements
    if (this.container) {
      this.container.remove();
      this.container = null;
    }

    if (this.background) {
      this.background.remove();
      this.background = null;
    }

    this.lightElement = null;
    console.log('Cursor light effect destroyed');
  }
}

// Auto-initialize after DOM is ready
let cursorLightInstance: CursorLightEffect | null = null;

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      cursorLightInstance = new CursorLightEffect();
      cursorLightInstance.init();
    });
  } else {
    // DOM already loaded
    cursorLightInstance = new CursorLightEffect();
    cursorLightInstance.init();
  }
}

// Export for manual control
export { CursorLightEffect, cursorLightInstance };
