# ADR-003: Estratégia de Streaming de Vídeo

## Status
✅ **APROVADO** - 09/11/2025

## Contexto

O Projeto Cirurgião é uma plataforma educacional centrada em vídeos. O sistema de streaming é o componente mais crítico do projeto, pois:
- Vídeos são o principal conteúdo educacional
- Qualidade de streaming impacta diretamente a experiência do usuário
- Custos de bandwidth e storage são significativos
- Performance é essencial (buffering = abandono)

### Requisitos Principais

1. **Performance**
   - Adaptive bitrate streaming (ABR)
   - Baixa latência de início (< 3s)
   - Mínimo buffering
   - Suporte a múltiplas resoluções (360p, 720p, 1080p)

2. **Escalabilidade**
   - Suporte a milhares de visualizações simultâneas
   - CDN global para baixa latência
   - Auto-scaling

3. **Funcionalidades**
   - Upload de vídeos (admin)
   - Transcodificação automática
   - Thumbnails automáticos
   - Legendas/subtítulos
   - Download offline (mobile)
   - DRM (proteção de conteúdo)

4. **Custo**
   - Otimizado para startup
   - Previsível e escalável
   - Sem surpresas

5. **Analytics**
   - Views, watch time, completion rate
   - Quality metrics
   - Geographic distribution

## Decisão

**Escolhemos Cloudflare Stream como solução principal de streaming de vídeo.**

### Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│              VIDEO STREAMING ARCHITECTURE                │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Admin Dashboard │
│   (Upload UI)    │
└────────┬─────────┘
         │
         │ 1. Upload Video
         ▼
┌──────────────────────────────────────┐
│         Backend API                  │
│  ┌────────────────────────────────┐  │
│  │   Video Upload Service         │  │
│  │   - Validation                 │  │
│  │   - Metadata extraction        │  │
│  │   - Database record            │  │
│  └────────────────────────────────┘  │
└──────┬───────────────────────────────┘
       │
       │ 2. Upload to Cloudflare
       ▼
┌─────────────────────────────────────────┐
│        Cloudflare Stream                │
│  ┌───────────────────────────────────┐  │
│  │   Ingestion                       │  │
│  │   - Receive video                 │  │
│  │   - Queue for processing          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   Transcoding                     │  │
│  │   - Multiple resolutions          │  │
│  │   - Adaptive bitrate (HLS)        │  │
│  │   - Generate thumbnails           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   Storage (R2)                    │  │
│  │   - Original video                │  │
│  │   - Transcoded versions           │  │
│  │   - Thumbnails                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   CDN (Global)                    │  │
│  │   - 300+ locations                │  │
│  │   - Edge caching                  │  │
│  │   - Low latency                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
       │
       │ 3. Webhook: Processing complete
       ▼
┌──────────────────────────────────────┐
│         Backend API                  │
│  ┌────────────────────────────────┐  │
│  │   Webhook Handler              │  │
│  │   - Update video status        │  │
│  │   - Extract metadata           │  │
│  │   - Notify admin               │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
       │
       │ 4. Video ready
       ▼
┌──────────────────┐
│   Frontend/Apps  │
│  (Video Player)  │
└──────────────────┘
```

## Por que Cloudflare Stream?

### ✅ Vantagens

1. **Simplicidade**
   - API simples e bem documentada
   - Upload direto via API
   - Transcodificação automática
   - Sem gerenciamento de infraestrutura

2. **Performance**
   - CDN global (300+ localizações)
   - Adaptive bitrate streaming (HLS)
   - Baixa latência de início
   - Edge caching

3. **Custo Previsível**
   - $1 por 1.000 minutos armazenados/mês
   - $1 por 1.000 minutos entregues
   - Sem custos de bandwidth separados
   - Sem surpresas

4. **Funcionalidades Incluídas**
   - Transcodificação automática
   - Thumbnails automáticos
   - Analytics nativo
   - Watermarks
   - Signed URLs (segurança)
   - Webhooks

5. **Integração com R2**
   - Storage otimizado
   - Sem custos de egress
   - Backup automático

6. **Escalabilidade**
   - Auto-scaling automático
   - Sem limites de concurrent viewers
   - Global por padrão

### ❌ Alternativas Consideradas

**AWS MediaConvert + CloudFront**
- ❌ Complexidade muito alta
- ❌ Múltiplos serviços para gerenciar
- ❌ Custos imprevisíveis
- ❌ Setup complexo
- ✅ Mais controle (não precisamos)

**Mux**
- ❌ Mais caro ($0.015/min delivered vs $0.001/min)
- ❌ Vendor lock-in
- ✅ Excelente API
- ✅ Analytics avançado

**YouTube/Vimeo**
- ❌ Sem controle total
- ❌ Branding de terceiros
- ❌ Limitações de customização
- ✅ Gratuito/barato

**Self-hosted (FFmpeg + NGINX)**
- ❌ Complexidade extrema
- ❌ Custos de infraestrutura
- ❌ Manutenção constante
- ❌ Sem CDN global
- ✅ Controle total (não precisamos)

## Implementação

### 1. Upload de Vídeos

```typescript
// services/cloudflare-stream.service.ts
export class CloudflareStreamService {
  private readonly apiUrl = 'https://api.cloudflare.com/client/v4';
  private readonly accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  private readonly apiToken = process.env.CLOUDFLARE_API_TOKEN;

  async uploadVideo(
    file: Express.Multer.File,
    metadata: VideoMetadata
  ): Promise<CloudflareVideo> {
    // 1. Upload para Cloudflare Stream
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('meta', JSON.stringify({
      name: metadata.title,
      requireSignedURLs: true, // Segurança
      allowedOrigins: [process.env.FRONTEND_URL],
      thumbnailTimestampPct: 0.1, // Thumbnail aos 10%
    }));

    const response = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/stream`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Upload failed: ${data.errors[0].message}`);
    }

    return {
      uid: data.result.uid,
      status: data.result.status, // 'queued', 'inprogress', 'ready'
      thumbnail: data.result.thumbnail,
      preview: data.result.preview,
      duration: data.result.duration,
      created: data.result.created,
    };
  }

  async getVideoDetails(videoId: string): Promise<CloudflareVideo> {
    const response = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/stream/${videoId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      }
    );

    const data = await response.json();
    return data.result;
  }

  async getSignedStreamUrl(
    videoId: string,
    expiresIn: number = 3600 // 1 hora
  ): Promise<string> {
    // Gerar signed URL para segurança
    const response = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/stream/${videoId}/token`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exp: Math.floor(Date.now() / 1000) + expiresIn,
        }),
      }
    );

    const data = await response.json();
    return data.result.token;
  }

  async deleteVideo(videoId: string): Promise<void> {
    await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/stream/${videoId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      }
    );
  }
}
```

### 2. Webhook Handler

```typescript
// controllers/cloudflare-webhook.controller.ts
@Controller('/webhooks/cloudflare')
export class CloudflareWebhookController {
  constructor(
    private videoService: VideoService,
    private notificationService: NotificationService
  ) {}

  @Post('/stream')
  async handleStreamWebhook(@Body() payload: CloudflareWebhookPayload): Promise<void> {
    // Validar webhook signature
    this.validateWebhookSignature(payload);

    const { uid, status, meta } = payload;

    switch (status) {
      case 'ready':
        // Vídeo processado e pronto
        await this.videoService.updateStatus(uid, 'ready');
        await this.notificationService.notifyAdmin(
          `Vídeo "${meta.name}" processado com sucesso`
        );
        break;

      case 'error':
        // Erro no processamento
        await this.videoService.updateStatus(uid, 'error');
        await this.notificationService.notifyAdmin(
          `Erro ao processar vídeo "${meta.name}"`
        );
        break;

      case 'inprogress':
        // Processamento em andamento
        await this.videoService.updateStatus(uid, 'processing');
        break;
    }
  }

  private validateWebhookSignature(payload: any): void {
    // Implementar validação de signature
    // https://developers.cloudflare.com/stream/webhooks/
  }
}
```

### 3. Video Player (Frontend)

```typescript
// components/video-player.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Stream } from '@cloudflare/stream-react';

interface VideoPlayerProps {
  videoId: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ videoId, onProgress, onComplete }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const [signedUrl, setSignedUrl] = useState<string>('');

  useEffect(() => {
    // Buscar signed URL do backend
    fetch(`/api/v1/videos/${videoId}/stream-url`)
      .then(res => res.json())
      .then(data => setSignedUrl(data.url));
  }, [videoId]);

  const handleTimeUpdate = (event: any) => {
    const player = event.target;
    const progress = (player.currentTime / player.duration) * 100;
    onProgress?.(progress);

    // Salvar progresso a cada 10 segundos
    if (Math.floor(player.currentTime) % 10 === 0) {
      saveProgress(videoId, player.currentTime, player.duration);
    }
  };

  const handleEnded = () => {
    onComplete?.();
    saveProgress(videoId, player.duration, player.duration);
  };

  if (!signedUrl) {
    return <div>Carregando vídeo...</div>;
  }

  return (
    <Stream
      src={signedUrl}
      controls
      responsive
      autoplay={false}
      preload="metadata"
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      ref={playerRef}
    />
  );
}

async function saveProgress(
  videoId: string,
  currentTime: number,
  duration: number
): Promise<void> {
  await fetch('/api/v1/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      videoId,
      watchedDuration: Math.floor(currentTime),
      totalDuration: Math.floor(duration),
      percentage: (currentTime / duration) * 100,
    }),
  });
}
```

### 4. Video Player (iOS)

```swift
// VideoPlayerView.swift
import SwiftUI
import AVKit

struct VideoPlayerView: View {
    let videoId: String
    @State private var player: AVPlayer?
    @State private var streamUrl: URL?
    
    var body: some View {
        VStack {
            if let player = player {
                VideoPlayer(player: player)
                    .onAppear {
                        setupPlayer()
                    }
                    .onDisappear {
                        player.pause()
                    }
            } else {
                ProgressView("Carregando vídeo...")
            }
        }
        .task {
            await loadStreamUrl()
        }
    }
    
    private func loadStreamUrl() async {
        do {
            let url = URL(string: "\(APIConfig.baseURL)/videos/\(videoId)/stream-url")!
            let (data, _) = try await URLSession.shared.data(from: url)
            let response = try JSONDecoder().decode(StreamUrlResponse.self, from: data)
            
            streamUrl = URL(string: response.url)
            player = AVPlayer(url: streamUrl!)
        } catch {
            print("Error loading stream URL: \(error)")
        }
    }
    
    private func setupPlayer() {
        guard let player = player else { return }
        
        // Observar progresso
        let interval = CMTime(seconds: 10, preferredTimescale: 1)
        player.addPeriodicTimeObserver(forInterval: interval, queue: .main) { time in
            let currentTime = CMTimeGetSeconds(time)
            let duration = CMTimeGetSeconds(player.currentItem?.duration ?? .zero)
            
            Task {
                await saveProgress(
                    currentTime: currentTime,
                    duration: duration
                )
            }
        }
        
        // Observar fim do vídeo
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: player.currentItem,
            queue: .main
        ) { _ in
            Task {
                await markAsCompleted()
            }
        }
    }
    
    private func saveProgress(currentTime: Double, duration: Double) async {
        // Implementar chamada à API
    }
    
    private func markAsCompleted() async {
        // Implementar chamada à API
    }
}
```

### 5. Video Player (Android)

```kotlin
// VideoPlayerScreen.kt
@Composable
fun VideoPlayerScreen(
    videoId: String,
    viewModel: VideoPlayerViewModel = hiltViewModel()
) {
    val streamUrl by viewModel.streamUrl.collectAsState()
    val context = LocalContext.current
    
    LaunchedEffect(videoId) {
        viewModel.loadStreamUrl(videoId)
    }
    
    Box(modifier = Modifier.fillMaxSize()) {
        streamUrl?.let { url ->
            AndroidView(
                factory = { context ->
                    PlayerView(context).apply {
                        player = ExoPlayer.Builder(context).build().also { exoPlayer ->
                            val mediaItem = MediaItem.fromUri(url)
                            exoPlayer.setMediaItem(mediaItem)
                            exoPlayer.prepare()
                            
                            // Observar progresso
                            exoPlayer.addListener(object : Player.Listener {
                                override fun onPlaybackStateChanged(state: Int) {
                                    if (state == Player.STATE_ENDED) {
                                        viewModel.markAsCompleted(videoId)
                                    }
                                }
                            })
                            
                            // Salvar progresso a cada 10 segundos
                            val handler = Handler(Looper.getMainLooper())
                            val runnable = object : Runnable {
                                override fun run() {
                                    val currentTime = exoPlayer.currentPosition / 1000
                                    val duration = exoPlayer.duration / 1000
                                    viewModel.saveProgress(videoId, currentTime, duration)
                                    handler.postDelayed(this, 10000)
                                }
                            }
                            handler.post(runnable)
                        }
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
        } ?: run {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}
```

## Funcionalidades Avançadas

### 1. Download Offline (Mobile)

```typescript
// Backend: Gerar URL de download
async getDownloadUrl(videoId: string, userId: string): Promise<string> {
  // Verificar se usuário tem permissão (premium)
  const user = await this.userService.findById(userId);
  if (!user.isPremium) {
    throw new ForbiddenException('Download offline apenas para usuários premium');
  }

  // Gerar signed URL com longa duração
  const signedUrl = await this.cloudflareService.getSignedStreamUrl(
    videoId,
    86400 * 7 // 7 dias
  );

  return signedUrl;
}
```

### 2. Legendas/Subtítulos

```typescript
// Upload de legendas
async uploadSubtitles(
  videoId: string,
  file: Express.Multer.File,
  language: string
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);

  await fetch(
    `${this.apiUrl}/accounts/${this.accountId}/stream/${videoId}/captions/${language}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
      },
      body: formData,
    }
  );
}
```

### 3. Watermarks

```typescript
// Adicionar watermark
async addWatermark(videoId: string): Promise<void> {
  await fetch(
    `${this.apiUrl}/accounts/${this.accountId}/stream/${videoId}/watermark`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: process.env.CLOUDFLARE_WATERMARK_UID,
      }),
    }
  );
}
```

## Segurança

### 1. Signed URLs

- Todos os vídeos requerem signed URLs
- URLs expiram após 1 hora
- Renovação automática no player

### 2. Domain Restrictions

```typescript
// Configurar domínios permitidos
allowedOrigins: [
  'https://cirurgiao.com',
  'https://www.cirurgiao.com',
  'https://app.cirurgiao.com',
]
```

### 3. DRM (Futuro)

- Cloudflare Stream suporta DRM
- Implementar quando necessário
- Custo adicional

## Custos Estimados

### Cálculo de Custos

```
Armazenamento: $1 / 1.000 minutos / mês
Entrega: $1 / 1.000 minutos entregues

Exemplo:
- 100 vídeos de 30 minutos = 3.000 minutos
- Armazenamento: $3/mês
- 10.000 visualizações/mês (média 20 min) = 200.000 minutos
- Entrega: $200/mês
- Total: $203/mês
```

### Projeção por Fase

| Fase | Vídeos | Min Armazenados | Views/mês | Min Entregues | Custo/mês |
|------|--------|-----------------|-----------|---------------|-----------|
| MVP | 50 | 1.500 | 1K | 30K | $31 |
| Beta | 200 | 6.000 | 10K | 200K | $206 |
| Launch | 500 | 15.000 | 50K | 1M | $1,015 |
| Scale | 1.000 | 30.000 | 200K | 4M | $4,030 |

## Monitoramento

### Métricas

- **Upload Success Rate**: > 99%
- **Transcoding Time**: < 2x video duration
- **Start Time**: < 3s
- **Buffering Rate**: < 1%
- **Completion Rate**: > 70%

### Alertas

```yaml
Critical:
  - Upload failures > 5%
  - Transcoding failures > 1%
  - Start time > 5s
  - Buffering rate > 5%

Warning:
  - Upload time > 5 minutes
  - Transcoding time > 3x duration
  - Start time > 4s
```

## Consequências

### ✅ Positivas

1. **Simplicidade**: API simples, sem infraestrutura
2. **Performance**: CDN global, baixa latência
3. **Custo Previsível**: Pay-per-use, sem surpresas
4. **Escalabilidade**: Auto-scaling automático
5. **Funcionalidades**: Tudo incluído

### ⚠️ Negativas

1. **Vendor Lock-in**: Dependência da Cloudflare
2. **Custo de Escala**: Pode ficar caro em alta escala
3. **Controle Limitado**: Menos controle que self-hosted
4. **Customização**: Limitada ao que a API oferece

### 🔄 Mitigações

1. **Vendor Lock-in**: Abstrair em serviço, facilitar migração
2. **Custo**: Monitorar uso, otimizar entrega
3. **Controle**: Suficiente para nossas necessidades
4. **Customização**: API cobre 99% dos casos

## Implementação

### Fase 1: Setup (Semana 3)

```bash
# Configurar Cloudflare Stream via dashboard
# Obter API token
# Configurar webhooks
```

### Fase 2: Upload (Semana 3-4)

- Implementar upload service
- Criar webhook handler
- Testar transcodificação

### Fase 3: Players (Semana 3-4)

- Implementar player web
- Implementar player iOS
- Implementar player Android

### Fase 4: Features Avançadas (Semana 15+)

- Download offline
- Legendas
- Watermarks

## Revisão e Aprovação

- **Autor**: TECH-LEAD-01 (Ricardo)
- **Revisores**: BACKEND-SENIOR-01 (Rafael), DEVOPS-01 (Carolina)
- **Aprovador**: PO-01 (Ana Paula)
- **Data de Aprovação**: 09/11/2025

## Referências

- [Cloudflare Stream Documentation](https://developers.cloudflare.com/stream/)
- [Cloudflare Stream API](https://developers.cloudflare.com/api/operations/stream-videos-list-videos)
- [HLS Streaming](https://developer.apple.com/streaming/)
- [Video Streaming Best Practices](https://web.dev/fast/#optimize-your-videos)

---

**Próxima Revisão**: Semana 12 (após 10K usuários)
