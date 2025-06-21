export interface ResultsType {
  cor_original: string;
  cores: {
    analogas: string[];
    complementar: string;
  };
  images: {
    original: string;
    analoga_1: string;
    analoga_2: string;
    complementar: string;
  };
}

export interface ProcessImageResponse {
  success: boolean;
  data?: ResultsType;
  error?: string;
}

class IaService {
  private readonly gatewayUrl = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:5000';

  async processHairColor(file: File): Promise<ProcessImageResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.gatewayUrl}/ia-cololhama/processamento`, {
        method: 'POST',
        body: formData,
        headers: {
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gateway API data:', data);

      return {
        success: true,
        data: data as ResultsType,
      };
    } catch (error: any) {
      console.error('Erro no processamento:', error);
      return {
        success: false,
        error: `Erro ao processar imagem: ${error.message}`,
      };
    }
  }

  downloadImage(imageData: string, filename: string): void {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  createPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; 
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.',
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Arquivo muito grande. Máximo 10MB.',
      };
    }

    return { isValid: true };
  }
}

export const IAService = new IaService();