/**
 * Written by Elliott Mangham at Code Resolution.
 * Maintained by Code Resolution.
 * made@coderesolution.com
 */
export default class InviewDetection {
    constructor(options?: {}, gsap?: any, ScrollTrigger?: any, SplitText?: any);
    _gsap: any;
    _ScrollTrigger: any;
    _SplitText: any;
    defaultOptions: {
        elements: string;
        duration: number;
        delay: number;
        start: string;
        ease: string;
        stagger: number;
        animationFrom: {
            opacity: number;
            'will-change': string;
            y: number;
        };
        animationTo: {
            opacity: number;
            y: number;
        };
        screen: string;
        autoStart: boolean;
        inviewClass: string;
        viewedClass: string;
    };
    options: {
        elements: string;
        duration: number;
        delay: number;
        start: string;
        ease: string;
        stagger: number;
        animationFrom: {
            opacity: number;
            'will-change': string;
            y: number;
        };
        animationTo: {
            opacity: number;
            y: number;
        };
        screen: string;
        autoStart: boolean;
        inviewClass: string;
        viewedClass: string;
    };
    triggers: any[];
    animatedElementsList: any[];
    eventListeners: {};
    register(gsap: any, ScrollTrigger: any, SplitText: any): void;
    getOption(optionName: any): any;
    init(): void;
    on(eventName: any, listener: any): void;
    emit(eventName: any, element: any): void;
    start(): void;
    addScopedElements(parent: any, animatedElementsList: any): void;
    addChildElements(parent: any, animatedElementsList: any): void;
    findClosestParentOrderAttr(element: any): number | false;
    addSplitElements(parent: any, animatedElementsList: any): void;
    getSplitChildren(splitElementsParent: any): any[];
    addSplitElement(splitElement: any, animatedElementsList: any): void;
    sortAnimatedElements(animatedElementsList: any): void;
    animateElements(parent: any, animatedElementsList: any, index: any): void;
    debugMode(parent: any, animatedElementsList: any, animationFromProperties: any, animationToProperties: any, index: any): void;
    refresh(): void;
    stop(): void;
    restart(): void;
}
