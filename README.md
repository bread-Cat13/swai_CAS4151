# FindU - 캠퍼스 분실물 관리 웹 애플리케이션

본 프로젝트는 Next.js 15(App Router), Supabase, Tailwind CSS, OpenAI API를 활용하여 캠퍼스 내 분실물 등록 및 검색 기능을 제공하는 웹 기반 애플리케이션입니다.

## 프로젝트 실행 과정

프로젝트를 로컬에서 실행하기 위해서는 Node.js가 필요합니다. Node.js는 https://nodejs.org/ko/download 에서 설치할 수 있으며, 본 프로젝트는 Node.js v20.16.0 환경에서 개발 및 테스트되었습니다.

개발 및 실행 환경으로는 [Visual Studio Code](https://code.visualstudio.com/) 또는 [Cursor IDE](https://www.cursor.so/) 사용을 권장합니다. 해당 폴더를 열고 터미널을 통해 아래 순서대로 실행하면 됩니다.

1. 저장소를 클론하거나 GitHub에서 ZIP 파일을 다운로드하여 압축을 해제합니다.

```bash
git clone https://github.com/bread-Cat13/swai_CAS4151.git
cd swai_CAS4151
```

2. 패키지를 설치합니다.

```bash
npm install
```

3. 환경 변수 파일을 설정합니다. 루트 디렉토리에 `.env.local` 파일을 생성하고, 이메일로 전달된 내용을 그대로 붙여넣습니다.

`.env.local` 예시 (실제 값은 이메일로 전달됨):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
PPLX_API_KEY=your_openai_api_key
```

4. 개발 서버를 실행합니다.

```bash
npm run dev
```

5. 브라우저에서 아래 주소로 접속합니다.

```
http://localhost:3000
```

## 실행 확인 기준

- 브라우저에서 홈페이지가 정상적으로 로딩되어야 하며
- Supabase 연동 데이터가 출력되어야 하고
- 이미지 출력, 등록 폼, 검색 탭 전환 등이 정상적으로 동작해야 합니다.

## ⚠️ 브라우저 실행 시 유의사항

일부 브라우저 확장 프로그램(예: Grammarly, Scholarcy, ChatGPT Sidebar 등)이 HTML에 예기치 않은 속성을 삽입하여  
서버/클라이언트 렌더링 불일치(Hydration Error)를 발생시킬 수 있습니다.

다음과 같은 오류가 발생하는 경우:

```
Hydration failed because the server rendered HTML didn't match the client.
data-scholarly-content-script-executed="1"
```

다음 방법으로 해결 가능합니다:

- 브라우저 확장 프로그램을 비활성화하거나
- 시크릿/익명 모드에서 실행하거나
- 다른 브라우저(Chrome, Firefox, Safari 등)로 접속

## 사용된 Open Source 목록

```
Next.js / React / Tailwind CSS / Supabase / OpenAI API / Axios / Lucide React / Heroicons / TypeScript / ESLint / eslint-config-next
```
