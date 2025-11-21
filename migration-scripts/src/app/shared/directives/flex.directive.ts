import { Directive, ElementRef, Input, OnInit, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { convertFlexValue, convertGapValue, convertLayoutValue, convertWrapValue } from '../utils/flex.utils';

@Directive({
  selector: '[appFlex]',
  standalone: false
})
export class FlexDirective implements OnInit, OnChanges {
  @Input() appFlex: string | number = '1 1 auto';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateFlex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFlex']) {
      this.updateFlex();
    }
  }

  private updateFlex(): void {
    const flexValue = convertFlexValue(this.appFlex);
    this.renderer.setStyle(this.el.nativeElement, 'flex', flexValue);
  }
}

@Directive({
  selector: '[appGap]',
  standalone: false
})
export class GapDirective implements OnInit, OnChanges {
  @Input() appGap: string | number = '0';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateGap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appGap']) {
      this.updateGap();
    }
  }

  private updateGap(): void {
    const gapValue = convertGapValue(this.appGap);
    this.renderer.setStyle(this.el.nativeElement, 'gap', gapValue);
  }
}

@Directive({
  selector: '[appLayout]',
  standalone: false
})
export class LayoutDirective implements OnInit, OnChanges {
  @Input() appLayout: string = 'row';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appLayout']) {
      this.updateLayout();
    }
  }

  private updateLayout(): void {
    const direction = convertLayoutValue(this.appLayout);
    const wrap = convertWrapValue(this.appLayout);

    this.renderer.setStyle(this.el.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.el.nativeElement, 'flex-direction', direction);
    this.renderer.setStyle(this.el.nativeElement, 'flex-wrap', wrap);
  }
}

@Directive({
  selector: '[appLayoutAlign]',
  standalone: false
})
export class LayoutAlignDirective implements OnInit, OnChanges {
  @Input() appLayoutAlign: string = 'start start';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateAlign();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appLayoutAlign']) {
      this.updateAlign();
    }
  }

  private updateAlign(): void {
    const [mainAxis, crossAxis] = this.appLayoutAlign.split(' ');

    const justifyMap: { [key: string]: string } = {
      'start': 'flex-start',
      'center': 'center',
      'end': 'flex-end',
      'space-between': 'space-between',
      'space-around': 'space-around',
      'space-evenly': 'space-evenly',
    };

    const alignMap: { [key: string]: string } = {
      'start': 'flex-start',
      'center': 'center',
      'end': 'flex-end',
      'stretch': 'stretch',
      'baseline': 'baseline',
    };

    this.renderer.setStyle(this.el.nativeElement, 'justify-content', justifyMap[mainAxis] || 'flex-start');
    this.renderer.setStyle(this.el.nativeElement, 'align-items', alignMap[crossAxis || 'stretch'] || 'stretch');
  }
}

@Directive({
  selector: '[appFlexOrder]',
  standalone: false
})
export class FlexOrderDirective implements OnInit, OnChanges {
  @Input() appFlexOrder: number | string = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.updateOrder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFlexOrder']) {
      this.updateOrder();
    }
  }

  private updateOrder(): void {
    this.renderer.setStyle(this.el.nativeElement, 'order', String(this.appFlexOrder));
  }
}
