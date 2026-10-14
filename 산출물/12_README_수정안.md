# README 수정안 (저장소 README.md에 직접 반영하지 않았습니다)

현재 README의 6~8장은 초기 계획(MySQL, FastAPI)으로, 지금 구조(Supabase)와 다릅니다. 이미 “참고용” 안내는 있으나 제출용으로는 아래처럼 정리하면 좋습니다.

## 제안
1. 맨 위에 **한 줄 소개와 시연 주소**: https://a-team-press-cms.onrender.com/#/dashboard
2. “시스템 구조” 그림을 현재 구조로 교체
```text
[브라우저(React)] ── 로그인·저장·파일 ──> [Supabase: 로그인 · 데이터 · 파일 보관]
        └── 서버 함수(Edge Function 12개) ──> [AI 서비스: Gemini / OpenAI / Claude]
```
3. 1.3 “FastAPI 백엔드” 문구를 “서버 함수(Edge Function)”로 수정
4. 6~8장(MySQL·REST 전환 맵·로드맵)은 “초기 설계안(보관용)”으로 접거나 `docs/archive/`로 이동
5. 실행 방법: `npm install` → `.env`에 Supabase 주소·공개 키 → `npm run dev`
6. 산출물 폴더 링크와 시험 방법 링크 추가
7. 1.1 “AI 자동 생성 금지” 문구를 현재 기능(질문형 초안, 기자가 확인 후 반영)에 맞게 다듬기
