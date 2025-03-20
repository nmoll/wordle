import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';

interface Confetti {
  radius: number;
  x: number;
  y: number;
  stroke: string;
  duration: string;
  delay: string;
  direction: string;
  style: string;
}

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrl: './confetti.component.css',
})
export class ConfettiComponent implements AfterViewInit {
  svgRef = viewChild<ElementRef<SVGElement>>('svg');

  confetti: Confetti[] = [];

  ngAfterViewInit(): void {
    const svgEl = this.svgRef()?.nativeElement;
    if (!svgEl) {
      return;
    }

    for (let i = 0; i < (svgEl.clientWidth + svgEl.clientHeight) / 10; i++) {
      const radius = this.randRange(20, 60);
      const x = Math.round(Math.random() * svgEl.clientWidth);
      const y = Math.round(Math.random() * svgEl.clientHeight);
      const stroke = `hsl(${this.randRange(0, 360)}deg 40% 80%)`;
      const duration = `${this.randRange(3, 5)}s`;
      const delay = `${this.randRange(-1, 1)}s`;
      const direction = i % 2 === 0 ? 'reverse' : 'normal';

      const style = `stroke-dasharray: ${radius * 0.5}, ${
        radius * Math.PI * 2 - radius * 0.5
      };
                      stroke-dashoffset: ${radius * Math.PI * 2};
                      --radius: ${radius};
                      --duration: ${duration};
                      --delay: ${delay};
                      --direction: ${direction}
        `;

      this.confetti.push({
        radius,
        x,
        y,
        stroke,
        duration,
        delay,
        direction,
        style,
      });
    }
  }

  private randRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
