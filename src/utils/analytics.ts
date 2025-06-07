import axios from "axios";

// 쿠키 관련 함수들
function getCookieValue(name: string): string | null {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

function setCookieValue(name: string, value: string, days: number): void {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function generateUserHash(): string {
  return getUVfromCookie();
}

function getUVfromCookie(): string {
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  const existingHash = getCookieValue("user");
  if (!existingHash) {
    setCookieValue("user", hash, 180);
    return hash;
  } else {
    return existingHash;
  }
}

function padValue(value: number): string {
  return value < 10 ? "0" + value : value.toString();
}

function getTimeStamp(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${padValue(year)}-${padValue(month)}-${padValue(day)} ${padValue(
    hours
  )}:${padValue(minutes)}:${padValue(seconds)}`;
}

function getUTMParams(): string {
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  const utm = urlParams.get("utm");
  return utm || "null";
}

function getDeviceInfo(): string {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

async function getIP(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("IP 조회 실패:", error);
    return "unknown";
  }
}

// 원래 JavaScript 방식으로 방문자 추적
export async function trackVisitor(): Promise<void> {
  try {
    // 1. 세션 스토리지에서 이미 추적했는지 확인
    const sessionKey = "visitor_tracked";
    const alreadyTracked = sessionStorage.getItem(sessionKey);

    if (alreadyTracked) {
      console.log("already tracked. skip");
      return;
    }

    const ip = await getIP();

    const data = JSON.stringify({
      id: getUVfromCookie(),
      landingUrl: window.location.href,
      ip: ip,
      referer: document.referrer || "direct",
      time_stamp: getTimeStamp(),
      utm: getUTMParams(),
      device: getDeviceInfo(),
    });

    const addrScript =
      "https://script.google.com/macros/s/AKfycby7I_ErfkPAI38ZYTbzmOJ21xcZU3YpwqJ_ZjjXiJKx4ZGVo7cdv5efDKiZuxxb4PYapA/exec";

    // console.log("전송할 데이터:", data);
    // console.log(
    //   "요청 URL:",
    //   addrScript +
    //     "?action=insert&table=visitors&data=" +
    //     encodeURIComponent(data)
    // );

    // axios GET 요청
    const response = await axios.get(
      addrScript +
        "?action=insert&table=visitors&data=" +
        encodeURIComponent(data)
    );
    // 2. 추적 완료 후 세션 스토리지에 표시
    sessionStorage.setItem(sessionKey, "true");
    console.log("tracked success", response.data);
  } catch (error) {
    console.error("tracked failed", error);
  }
}

export async function submitOpinion(
  email: string,
  type: string,
  details: string
): Promise<boolean> {
  try {
    const data = JSON.stringify({
      id: getUVfromCookie(),
      email: email,
      type: type,
      details: details,
    });

    const addrScript =
      "https://script.google.com/macros/s/AKfycby7I_ErfkPAI38ZYTbzmOJ21xcZU3YpwqJ_ZjjXiJKx4ZGVo7cdv5efDKiZuxxb4PYapA/exec";

    await axios.get(
      addrScript +
        "?action=insert&table=opinions&data=" +
        encodeURIComponent(data)
    );
    console.log("의견 전송 완료");
    return true;
  } catch (error) {
    console.error("의견 전송 실패:", error);
    return false;
  }
}
