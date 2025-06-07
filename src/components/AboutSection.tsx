export default function AboutSection() {
  return (
    <section id="about" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            FindU가 특별한 이유
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto whitespace-pre-line">
            {"연세대학교 학생들을 위한 \n스마트한 분실물 관리 시스템"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-sky-50 rounded-2xl hover:shadow-lg transition-shadow border border-slate-200">
            <div className="text-5xl mb-6">📝</div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              등록하기 편함
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                "간단한 폼으로 몇 번의 클릭만으로\n 분실물을 등록할 수 있습니다. \n복잡한 절차 없이 빠르고 쉽게!"
              }
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-sky-50 rounded-2xl hover:shadow-lg transition-shadow border border-slate-200">
            <div className="text-5xl mb-6">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              AI 기반 검색
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                "자연어로 대화하듯 검색하면 \nAI가 관련 분실물을 찾아드립니다. \n'검은색 아이폰'라고 말하면 바로 찾아줘요!"
              }
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-sky-50 rounded-2xl hover:shadow-lg transition-shadow border border-slate-200">
            <div className="text-5xl mb-6">🏫</div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              연세대 전용
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {
                "도서관, 학생식당, 강의실 등 \n캠퍼스 내 모든 장소를 세분화하여 \n더 정확하고 빠른 찾기가 가능합니다."
              }
            </p>
          </div>
        </div>

        {/* 통계 섹션 - 추후에 추가 예정 */}
        {/* <div className="bg-gradient-to-r from-slate-800 via-sky-700 to-indigo-800 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sky-100">등록된 분실물</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">200+</div>
              <div className="text-sky-100">찾은 물건</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">80%</div>
              <div className="text-sky-100">성공률</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24시간</div>
              <div className="text-sky-100">평균 찾는 시간</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
