import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subscription,of } from 'rxjs';
 
@Component({
  selector: 'app-rpm-gauge',
  standalone: true,
  templateUrl: './rpm.html',
  styleUrls: ['./rpm.scss']
})
export class RpmGaugeComponent implements OnInit, OnDestroy {
    rpmValue$: Observable<number> = of(3); // هنا عرفنا الـ Observable

  @Input() rpm$!: Observable<number>; // Observable للبيانات الديناميكية
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private subscription!: Subscription;
  rpm: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ctx = this.canvas.nativeElement.getContext('2d')!;
    }
    this.subscription = this.rpm$.subscribe(rpm => {
      this.rpm = rpm;
      if (isPlatformBrowser(this.platformId)) {
        this.drawGauge();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private drawGauge() {
    const canvas = this.canvas.nativeElement;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    // مسح اللوحة
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم الخلفية الدائرية مع تدرج
    const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#ccc');
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 15;
    this.ctx.stroke();

    // رسم المناطق الملونة
    this.drawArc(centerX, centerY, radius - 10, 0, 135, '#00ff00'); // أخضر
    this.drawArc(centerX, centerY, radius - 10, 135, 270, '#ffff00'); // أصفر
    this.drawArc(centerX, centerY, radius - 10, 270, 360, '#ff0000'); // أحمر

    // رسم العلامات والأرقام العربية
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨'];
    for (let i = 0; i < arabicNumbers.length; i++) {
      const angle = (i * 45 * Math.PI) / 180 - Math.PI / 2;
      const x1 = centerX + (radius - 30) * Math.cos(angle);
      const y1 = centerY + (radius - 30) * Math.sin(angle);
      const x2 = centerX + radius * Math.cos(angle);  
      const y2 = centerY + radius * Math.sin(angle);

      // خط العلامة
      this.ctx.shadowColor = '#000';
      this.ctx.shadowBlur = 5;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // الرقم العربي
      const textX = centerX + (radius - 50) * Math.cos(angle);
      const textY = centerY + (radius - 50) * Math.sin(angle);
      this.ctx.font = 'bold 18px Arial';
      this.ctx.fillStyle = '#000';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(arabicNumbers[i], textX, textY);
    }

    // رسم الإبرة
    const rpmAngle = (this.rpm / 8000) * 360 * (Math.PI / 180) - Math.PI / 2;
    const needleX = centerX + (radius - 40) * Math.cos(rpmAngle);
    const needleY = centerY + (radius - 40) * Math.sin(rpmAngle);

    this.ctx.shadowColor = '#ff0000';
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(needleX, needleY);
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 6;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // مركز الإبرة مع تدرج
    const centerGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 10);
    centerGradient.addColorStop(0, '#fff');
    centerGradient.addColorStop(1, '#000');
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    this.ctx.fillStyle = centerGradient;
    this.ctx.fill();
  }

  private drawArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 20;
    this.ctx.stroke();
  }
}
