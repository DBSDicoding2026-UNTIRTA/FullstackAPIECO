'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type AnimationTargets = HTMLElement | HTMLElement[];

const hasTargets = (elements: AnimationTargets) =>
  Array.isArray(elements) ? elements.length > 0 : Boolean(elements);

/**
 * Utility function untuk fade-in animation dengan ScrollTrigger
 * @param elements - HTMLElement atau HTMLElement array
 * @param trigger - Trigger element
 * @param stagger - Stagger delay antara elements
 */
export const fadeInOnScroll = (
  elements: AnimationTargets,
  trigger: HTMLElement | null,
  stagger = 0.1
) => {
  if (!trigger || !hasTargets(elements)) return;

  gsap.from(elements, {
    scrollTrigger: {
      trigger,
      start: 'top 60%',
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    y: 30,
    stagger,
    duration: 0.6,
  });
};

/**
 * Utility function untuk slide-in animation dengan ScrollTrigger
 * @param elements - HTMLElement atau HTMLElement array
 * @param trigger - Trigger element
 * @param direction - 'left' | 'right'
 * @param stagger - Stagger delay antara elements
 */
export const slideInOnScroll = (
  elements: AnimationTargets,
  trigger: HTMLElement | null,
  direction: 'left' | 'right' = 'left',
  stagger = 0.1
) => {
  if (!trigger || !hasTargets(elements)) return;

  const xValue = direction === 'left' ? -40 : 40;

  gsap.from(elements, {
    scrollTrigger: {
      trigger,
      start: 'top 60%',
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    x: xValue,
    stagger,
    duration: 0.8,
  });
};

/**
 * Utility function untuk parallax effect pada scroll
 * @param element - Target element
 * @param trigger - Trigger element
 * @param yValue - Y movement amount (default -20)
 */
export const parallaxOnScroll = (
  element: HTMLElement | null,
  trigger: HTMLElement | null,
  yValue = -20
) => {
  if (!element || !trigger) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
    },
    y: yValue,
  });
};

/**
 * Utility function untuk hover animation pada elements
 * @param element - Target element
 * @param yOffset - Y offset on hover (default -8)
 */
export const hoverLiftAnimation = (element: HTMLElement, yOffset = -8) => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      y: yOffset,
      duration: 0.3,
      overwrite: 'auto',
    });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      y: 0,
      duration: 0.3,
      overwrite: 'auto',
    });
  });
};

/**
 * Utility function untuk count-up animation
 * @param target - Target number to count to
 * @param onUpdate - Callback function to update DOM
 * @param trigger - Trigger element untuk ScrollTrigger
 * @param duration - Animation duration (default 2)
 */
export const countUpAnimation = (
  target: number,
  onUpdate: (value: number) => void,
  trigger: HTMLElement | null,
  duration = 2
) => {
  if (!trigger) return;

  const obj = { value: 0 };

  gsap.to(obj, {
    scrollTrigger: {
      trigger,
      start: 'top center',
      once: true,
    },
    value: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      onUpdate(Math.floor(obj.value));
    },
  });
};

/**
 * Utility function untuk floating animation (loop)
 * @param element - Target element
 * @param config - Animation config
 */
export const floatingAnimation = (
  element: HTMLElement,
  config: {
    x: number;
    y: number;
    duration: number;
    delay?: number;
  }
) => {
  const tl = gsap.timeline({ repeat: -1 });

  tl.to(element, {
    x: config.x,
    y: config.y,
    duration: config.duration,
    ease: 'sine.inOut',
  }, config.delay || 0)
    .to(element, {
      opacity: 0.3,
      duration: config.duration / 2,
    }, config.delay || 0)
    .to(element, {
      opacity: 1,
      duration: config.duration / 2,
    }, (config.delay || 0) + (config.duration / 2));

  return tl;
};

/**
 * Utility function untuk button hover effect
 * @param button - Button element
 * @param options - Customizable options
 */
export const buttonHoverEffect = (
  button: HTMLElement,
  options = {
    scaleIn: 1.05,
    scaleOut: 1,
    shadowIntensity: 1,
  }
) => {
  button.addEventListener('mouseenter', () => {
    gsap.to(button, {
      scale: options.scaleIn,
      duration: 0.3,
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      scale: options.scaleOut,
      duration: 0.3,
    });
  });

  button.addEventListener('click', () => {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  });
};

/**
 * Utility function untuk stagger animation
 * @param elements - Array of elements
 * @param config - Animation config
 */
export const staggerAnimation = (
  elements: HTMLElement[],
  config: {
    from?: { opacity?: number; y?: number; x?: number };
    to?: { opacity?: number; y?: number; x?: number };
    stagger: number;
    duration: number;
    delay?: number;
    ease?: string;
  }
) => {
  if (elements.length === 0) return;

  gsap.from(elements, {
    opacity: config.from?.opacity ?? 0,
    y: config.from?.y ?? 0,
    x: config.from?.x ?? 0,
    stagger: config.stagger,
    duration: config.duration,
    delay: config.delay || 0,
    ease: config.ease || 'power2.out',
  });
};

/**
 * Cleanup function untuk kill semua animations related to element
 * @param element - Target element
 */
export const killAnimations = (element: HTMLElement) => {
  gsap.killTweensOf(element);
};

/**
 * Cleanup function untuk kill semua ScrollTriggers
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((triggerInstance) => triggerInstance.kill());
};

/**
 * Safe animation cleanup untuk use dalam useEffect cleanup
 * @param targets - Elements atau selectors to kill
 */
export const cleanupAnimations = (targets: HTMLElement[] | HTMLElement) => {
  if (Array.isArray(targets)) {
    targets.forEach((target) => killAnimations(target));
  } else {
    killAnimations(targets);
  }
};
