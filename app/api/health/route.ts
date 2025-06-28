import {NextRequest, NextResponse} from 'next/server';

interface HealthInfo {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  backend?: {
    status: 'connected' | 'error' | 'disconnected';
    url: string;
    error?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // 기본 헬스체크 정보
    const healthInfo: HealthInfo = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };

    // 백엔드 연결 상태 확인 (선택사항)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl) {
      try {
        const backendResponse = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000), // 5초 타임아웃
        });

        healthInfo.backend = {
          status: backendResponse.ok ? 'connected' : 'error',
          url: backendUrl,
        };
      } catch (error) {
        healthInfo.backend = {
          status: 'disconnected',
          url: backendUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return NextResponse.json(healthInfo, {status: 200});
  } catch (error) {
    return NextResponse.json(
        {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
        {status: 500}
    );
  }
} 