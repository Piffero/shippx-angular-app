import { Component, input, computed, OnInit, signal, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ChartComponent, 
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  fill: ApexFill;
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: 'rd-status-summary',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './status-summary.html',
  styleUrl: './status-summary.css',
})
export class StatusSummary {
  role = input.required<'CLIENT' | 'BROKER' | 'CARRIER' | undefined>();
  chart = viewChild<ChartComponent>("chart");

  public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    // Reage automaticamente quando o role muda
    effect(() => {
      this.initChart(this.role());
    });
  }

  private initChart(role: string | undefined) {
    // Configurações comuns de design
    const commonOptions: Partial<ApexChart> = {
      type: "area",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false }
    };

    // Dados específicos por Perfil
    let seriesData: any[] = [];
    let categories: string[] = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    let color = "#0d6efd"; // Azul padrão

    if (role === 'CLIENT') {
      seriesData = [{ name: "Pacotes Enviados", data: [31, 40, 28, 51, 42, 109, 100] }];
      color = "#0d6efd"; // Azul
    } else if (role === 'BROKER') {
      seriesData = [{ name: "Bipagens Hub", data: [80, 150, 200, 180, 250, 310, 280] }];
      color = "#fd7e14"; // Laranja
    } else if (role === 'CARRIER') {
      seriesData = [{ name: "Ganhos (R$)", data: [45, 110, 95, 180, 160, 210, 190] }];
      color = "#198754"; // Verde (Dinheiro)
    }

    this.chartOptions = {
      series: seriesData,
      chart: commonOptions,
      colors: [color],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100]
        }
      },
      xaxis: { categories: categories },
      yaxis: { labels: { show: false } },
      grid: { borderColor: "#f1f1f1" }
    };
  }

  // Dados simulados que viriam de um FananceService
  stats = computed(() => {
    const currentRole = this.role();

    if (currentRole === 'CLIENT') {
      return {
        title: 'Meus Envios',
        primaryMetric: '124',
        primaryLabel: 'Pacotes Enviados',
        chartLabel: 'Volume de Vendas (Semana)',
        chartData: [12, 19, 3, 5, 22, 10, 15]
      };
    } else if (currentRole === 'BROKER') {
      return {
        title: 'Movimentação do Ponto',
        primaryMetric: '850',
        primaryLabel: 'Bipagens Realizadas',
        chartLabel: 'Entrada de Pacotes no Hub',
        chartData: [100, 120, 90, 150, 130, 180, 210]
      };
    } else { // CARRIER
      return {
        title: 'Desempenho de Rotas',
        primaryMetric: 'R$ 1.250',
        primaryLabel: 'Ganhos no Mês',
        chartLabel: 'Ganhos Diários (R$)',
        chartData: [45, 110, 0, 85, 120, 150, 90]
      };
    }
  });

}
