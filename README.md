# FindU - 캠퍼스 분실물 관리 웹 애플리케이션

본 프로젝트는 Next.js 15(App Router), Supabase, Tailwind CSS, OpenAI API를 활용하여 캠퍼스 내 분실물 등록 및 검색 기능을 제공하는 웹 기반 애플리케이션입니다.

## 프로젝트 실행 과정

프로젝트를 로컬에서 실행하기 위해서는 Node.js가 필요합니다. Node.js는 https://nodejs.org/ko/download 에서 설치할 수 있으며, 본 프로젝트는 Node.js v20.16.0 환경에서 개발 및 테스트되었습니다.

Node.js 설치가 완료되면, 아래의 순서에 따라 프로젝트를 실행합니다.

1. 저장소를 클론하거나 GitHub에서 ZIP 파일을 다운로드하여 압축을 해제합니다.

````git clone https://github.com/bread-Cat13/swai_CAS4151.git
cd swai_CAS4151```

2. 터미널에서 프로젝트 루트 디렉토리로 이동한 후 다음 명령어로 필요한 패키지를 설치합니다.

`npm install`

3. 환경 변수 파일을 설정합니다. 루트 디렉토리(swai_CAS4151 폴더 아래)에 `.env.local` 파일을 생성하고, 이메일로 전달된 값을 그대로 붙여넣습니다.

`.env.local` 파일 예시는 다음과 같습니다. (※ 실제 값은 이메일로 전달되었습니다.)

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
PPLX_API_KEY=your_openai_api_key

4. 환경 변수를 설정한 후, 아래 명령어로 개발 서버를 실행합니다.

`npm run dev`

5. 서버가 실행되면 브라우저에서 다음 주소로 접속하여 확인합니다.

http://localhost:3000

## 실행 확인 기준

- 브라우저에서 홈페이지가 정상적으로 로딩되어야 하며
- Supabase 연동 데이터가 출력되어야 하고
- 이미지 출력, 등록 폼, 검색 탭 전환 등이 정상적으로 동작해야 합니다.

본 실행 과정만으로 동일한 환경에서 문제없이 작동하도록 구성되어 있으며, 별도의 추가 설정 없이 정상 실행됩니다.
````
