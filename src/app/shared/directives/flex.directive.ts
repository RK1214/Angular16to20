import { Directive, ElementRef, Input, OnInit, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { convertFlexValue, convertGapValue } from '../utils/flex.utils';

/**
 * Drop-in replacement directive for fxFlex
 * Converts flex layout values to CSS flex property
 *
 * Usage:
 * <div [appFlex]="'50'">50% width</div>
 * <div [appFlex]="itemWidth">Dynamic width</div>
 * <div [appFlex]="'200px'">200px width</div>
 */
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

/**
 * Drop-in replacement directive for fxLayoutGap
 * Converts gap values to CSS gap property
 *
 * Usage:
 * <div [appGap]="'16'">16px gap</div>
 * <div [appGap]="gapSize">Dynamic gap</div>
 */
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
