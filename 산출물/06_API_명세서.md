# 06. API 명세서

서버 기능 12개(Supabase Edge Function)와 저장소 안의 규칙 함수(RPC)를 정리했습니다.
공통: 로그인한 사용자의 토큰(Authorization)이 필요합니다. 인사부 계정은 AI 기능에서 403(권한 없음)을 받습니다. AI 키는 서버에 암호화 저장된 본인 키를 사용하며 화면·로그에 노출되지 않습니다.
소스: `supabase/functions/<이름>/index.ts`

## 1. Edge Function (12개)
| 이름 | 하는 일 | 요청 항목 | 비고 |
|---|---|---|---|
| ai-interview-draft | 질문형 초안 | action(start/answer/regenerate_section/revise_draft/finalize), topic, keywords, rawNotes, tone, sessionId, answerText, feedbackText, sectionType, sectionIndex, instructionText | 단계별 지시문, JSON 검증 |
| review-article-content | 기사 검수 | articleId | 기사 접근 권한 확인 후 호출 |
| analyze-media-image | 사진 설명 | mediaId, force | |
| extract-infographic-data | 숫자 뽑기 | title, text | 인포그래픽 재료 |
| organize-raw-data | 자료 정리 | text, topic | 원문에 없는 발언·수치 제외 |
| generate-image | AI 이미지 | prompt, style | 실존 인물 얼굴·로고 금지 지시 |
| transcribe-audio | 녹음 받아쓰기 | fileName, audioBase64, engine, language, mode, speakers | Gemini·OpenAI 10MB, 구글 클라우드 30분·60MB |
| fetch-web-source | 웹 글 가져오기 | url | 내부 주소 차단, robots.txt 준수, 2MB·3만 자 |
| manage-ai-key | AI 키 관리 | action(status/save_key/delete_key/test_key/save_prefs) | 키는 암호화 저장, 뒤 4자리만 표시 |
| request-signup | 가입 신청 | name, loginId, departmentId | 회사 메일 도메인만 허용 |
| approve-signup | 가입 승인 | signupRequestId | 인사 관리자만 |
| hr-reset-password | 비밀번호 분실 처리 | requestId | 인사 관리자만 |

## 2. 규칙 함수 (RPC, 저장소 안에서 실행)
| 분류 | 함수 |
|---|---|
| 기사 흐름 | request_article_review, resubmit_article_review, request_article_changes, approve_article, publish_article, assign_article, assign_article_and_deadline |
| 기사 생성·본문 | create_project_with_initial_article, import_article_blocks, reorder_article_blocks, insert_article_media_block, split_article_text_and_insert_media |
| 수정 이력 | create_article_version, get_article_versions, restore_article_version, delete_article_version |
| 미디어 | delete_media_asset, get_media_article_usages |
| 알림 | mark_notification_as_read, mark_all_notifications_as_read |
| 인사 | get_hr_employees, hr_update_employee, hr_set_employee_active, is_hr_admin |
| 접근 판단 | can_access_article, can_access_article_block, can_access_project |
| 자동 실행(트리거) | handle_new_user, handle_updated_at, guard_article_protected_fields, record_article_created_audit, notify_feedback_added, notify_signup_requested, log_org_master_changes, log_profile_hr_changes |

## 3. 오류 응답 규칙
| 상황 | 응답 | 화면 안내 |
|---|---|---|
| 로그인 없음 | 401 | 다시 로그인 |
| 인사부 계정이 AI 호출 | 403 | AI 기능 사용 불가 |
| AI 키 없음 | 안내 오류 | “AI 키가 등록되지 않았습니다” |
| AI 서비스 혼잡(503) | 자동 재시도 후 오류 | “이용자가 몰려 있습니다” |
