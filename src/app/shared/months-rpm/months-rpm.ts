import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

export interface State {
  car_price: number;
  down_payment: number;
  months: number | null;
}

@Component({
  selector: 'app-months-rpm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './months-rpm.html',
  styleUrls: ['./months-rpm.scss'],
})
export class MonthsRpmComponent implements OnInit, OnDestroy, OnChanges {
  @Input() state: State = { car_price: 1, down_payment: 0, months: 7 * 12 };

  @Input() set newState(value: State) {
    if (value) {
      this.state = { ...value };
      this.inputMonths = this.normalize(this.state.months || 0);
    }
  }

  ngOnChanges() {
    if (this.state) {
      this.inputMonths = this.normalize(this.state.months || 0);
    }
  }

  readonly MAX_MONTHS = 7 * 12; // 84
  inputMonths = 1;
  isRunning = false;

  // svg / arc configuration
  readonly startAngle = -135; // start of arc (left-ish)
  readonly totalArc = 270; // degrees
  readonly svgCenter = 100;
  readonly svgRadius = 80;

  private tickerSub: Subscription | null = null;

  ngOnInit(): void {
    this.inputMonths = this.normalize(this.state.months || 0);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  normalize(v: number): number {
    if (!Number.isFinite(v)) return 0;
    const n = Math.floor(v);
    return Math.max(0, Math.min(this.MAX_MONTHS, n));
  }

  apply(): void {
    this.state.months = this.normalize(Number(this.inputMonths));
  }

  start(): void {
    if (this.isRunning || !this.state.months) return;
    this.isRunning = true;
    this.tickerSub = interval(60).subscribe(() => {
      if ((this.state.months || 0) >= this.MAX_MONTHS) {
        this.stop();
        return;
      }
      this.state.months = (this.state.months || 0) + 1;
      this.inputMonths = this.state.months;
    });
  }

  stop(): void {
    this.tickerSub?.unsubscribe();
    this.tickerSub = null;
    this.isRunning = false;
  }

  // rotation angle for the needle (used in template)
  monthsToAngle(months: number): number {
    const ratio = Math.max(0, Math.min(1, (months ?? 0) / this.MAX_MONTHS));
    return this.startAngle + ratio * this.totalArc;
  }

  monthsToYears(months: number): string {
    return (months / 12).toFixed(2);
  }

  // --- helpers for SVG arc -----------------------------------------------
  private polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  }

  // NOTE: return path that goes from startAngle -> endAngle (so dash starts at arc start)
  private describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = this.polarToCartesian(cx, cy, r, startAngle);
    const end = this.polarToCartesian(cx, cy, r, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const sweepFlag = '1'; // draw in the positive direction from start -> end
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, sweepFlag, end.x, end.y].join(' ');
  }

  // background arc path (full 3/4)
  get bgArcPath(): string {
    return this.describeArc(
      this.svgCenter,
      this.svgCenter,
      this.svgRadius,
      this.startAngle,
      this.startAngle + this.totalArc
    );
  }

  // current ratio 0..1
  get ratio(): number {
    return Math.max(0, Math.min(1, (this.state?.months ?? 0) / this.MAX_MONTHS));
  }

  // approximate arc length (circular arc length = r * theta (rad))
  get arcLength(): number {
    const theta = (this.totalArc * Math.PI) / 180;
    return this.svgRadius * theta;
  }

  // --- progress length and dash array to show only the colored portion ---
  get progressLength(): number {
    return this.arcLength * this.ratio;
  }

  // show only the colored portion from the arc start up to progressLength,
  // then a gap for the rest of the arc
  get progressDashArray(): string {
    const prog = Math.max(0, this.progressLength);
    const gap = Math.max(0, this.arcLength - prog);
    return `${prog} ${gap}`;
  }

  // gradient coords: start at arc start (left) and end at current needle position
  get gradCoords() {
    const start = this.polarToCartesian(this.svgCenter, this.svgCenter, this.svgRadius, this.startAngle);
    const progressAngle = this.startAngle + this.totalArc * this.ratio;
    const progressPoint = this.polarToCartesian(this.svgCenter, this.svgCenter, this.svgRadius, progressAngle);
    return { x1: start.x, y1: start.y, x2: progressPoint.x, y2: progressPoint.y };
  }

  // properties for template binding (attribute names)
  get gradX1() {
    return this.gradCoords.x1;
  }
  get gradY1() {
    return this.gradCoords.y1;
  }
  get gradX2() {
    return this.gradCoords.x2;
  }
  get gradY2() {
    return this.gradCoords.y2;
  }

  // ticks generation along arc
  get ticks() {
    const ticks: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      tx?: number;
      ty?: number;
      major?: boolean;
      label?: string | null;
    }> = [];

    const tickCount = 25; // total ticks
    const majorEvery = 6;
    for (let i = 0; i < tickCount; i++) {
      const frac = i / (tickCount - 1);
      const angle = this.startAngle + frac * this.totalArc;
      const outer = this.polarToCartesian(this.svgCenter, this.svgCenter, this.svgRadius + 8, angle);
      const inner = this.polarToCartesian(
        this.svgCenter,
        this.svgCenter,
        this.svgRadius - (i % majorEvery === 0 ? 16 : 9),
        angle
      );
      const labelPos = this.polarToCartesian(this.svgCenter, this.svgCenter, this.svgRadius - 36, angle);
      const isMajor = i % majorEvery === 0;
      let label: string | null = null;
      if (isMajor) {
        const months = Math.round(frac * this.MAX_MONTHS);
        label = String(months);
      }
      ticks.push({
        x1: inner.x,
        y1: inner.y,
        x2: outer.x,
        y2: outer.y,
        tx: labelPos.x,
        ty: labelPos.y,
        major: isMajor,
        label,
      });
    }
    return ticks;
  }

  // value color interpolated between green -> yellow -> red for UI text (hex)
  get valueColor(): string {
    const r = this.ratio;
    if (r <= 0.5) {
      const t = r / 0.5;
      return this.mixColor('#33d17a', '#ffd54f', t);
    } else {
      const t = (r - 0.5) / 0.5;
      return this.mixColor('#ffd54f', '#ff5b5b', t);
    }
  }

  // simple hex color mix
  private mixColor(c1: string, c2: string, t: number): string {
    const c1rgb = this.hexToRgb(c1);
    const c2rgb = this.hexToRgb(c2);
    const r = Math.round(c1rgb.r + (c2rgb.r - c1rgb.r) * t);
    const g = Math.round(c1rgb.g + (c2rgb.g - c1rgb.g) * t);
    const b = Math.round(c1rgb.b + (c2rgb.b - c1rgb.b) * t);
    return this.rgbToHex(r, g, b);
  }

  private hexToRgb(hex: string) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  }

  private rgbToHex(r: number, g: number, b: number) {
    const toHex = (n: number) => ('0' + n.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}