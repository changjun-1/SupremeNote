-- ================================================
-- UVKL Database Test Queries
-- ================================================
-- Supabase SQL Editor에서 실행하여 데이터베이스를 테스트할 수 있습니다

-- ================================================
-- 1. 테이블 확인
-- ================================================

-- 모든 public 테이블 목록
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 테이블별 컬럼 정보
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ================================================
-- 2. Extension 확인
-- ================================================

-- 설치된 Extension 확인
SELECT * FROM pg_extension
WHERE extname IN ('uuid-ossp', 'vector');

-- ================================================
-- 3. RLS (Row Level Security) 정책 확인
-- ================================================

-- 모든 RLS 정책 목록
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 테이블별 RLS 활성화 상태
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- ================================================
-- 4. Index 확인
-- ================================================

-- 생성된 인덱스 목록
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ================================================
-- 5. Trigger 확인
-- ================================================

-- 모든 트리거 목록
SELECT 
  trigger_schema,
  trigger_name,
  event_object_table,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ================================================
-- 6. Function 확인
-- ================================================

-- 사용자 정의 함수 목록
SELECT 
  routine_schema,
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ================================================
-- 7. 샘플 데이터 삽입 (테스트용)
-- ================================================

-- ⚠️ 주의: 실제 사용자로 로그인한 상태에서만 작동합니다
-- auth.uid()가 있어야 합니다

/*
-- 프로필 확인
SELECT * FROM public.profiles WHERE id = auth.uid();

-- 테스트 노트 삽입
INSERT INTO public.notes (
  user_id,
  title,
  source_type,
  source_url,
  instruction,
  content_md,
  mermaid_code
) VALUES (
  auth.uid(),
  '테스트 유튜브 영상',
  'youtube',
  'https://www.youtube.com/watch?v=example',
  '이 영상의 핵심 내용을 3가지로 요약해주세요',
  '# 영상 요약\n\n## 핵심 내용\n\n1. 첫 번째 포인트\n2. 두 번째 포인트\n3. 세 번째 포인트',
  'graph TD\n    A[시작] --> B[핵심 개념]\n    B --> C[적용]\n    C --> D[결과]'
);

-- 내 노트 조회
SELECT 
  id,
  title,
  source_type,
  source_url,
  instruction,
  created_at
FROM public.notes
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- 노트 상세 조회
SELECT * FROM public.notes
WHERE user_id = auth.uid()
LIMIT 1;

-- 노트 업데이트
UPDATE public.notes
SET 
  content_md = '# 수정된 요약\n\n업데이트된 내용입니다.',
  updated_at = NOW()
WHERE user_id = auth.uid()
AND title = '테스트 유튜브 영상';

-- 노트 삭제
DELETE FROM public.notes
WHERE user_id = auth.uid()
AND title = '테스트 유튜브 영상';
*/

-- ================================================
-- 8. 통계 쿼리
-- ================================================

-- 테이블별 레코드 수
SELECT 
  'profiles' as table_name,
  COUNT(*) as record_count
FROM public.profiles
UNION ALL
SELECT 
  'notes' as table_name,
  COUNT(*) as record_count
FROM public.notes
UNION ALL
SELECT 
  'embeddings' as table_name,
  COUNT(*) as record_count
FROM public.embeddings;

-- ================================================
-- 9. 검색 테스트 (Full-text Search)
-- ================================================

/*
-- 제목으로 검색
SELECT 
  title,
  source_type,
  ts_rank(search_vector, query) as rank
FROM public.notes,
     to_tsquery('english', 'youtube') query
WHERE search_vector @@ query
AND user_id = auth.uid()
ORDER BY rank DESC;

-- 내용으로 검색
SELECT 
  title,
  content_md,
  ts_rank(search_vector, query) as rank
FROM public.notes,
     to_tsquery('english', 'summary') query
WHERE search_vector @@ query
AND user_id = auth.uid()
ORDER BY rank DESC;
*/

-- ================================================
-- 10. 성능 확인
-- ================================================

-- 테이블 크기 확인
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 인덱스 사용률 확인
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- ================================================
-- End of Test Queries
-- ================================================
