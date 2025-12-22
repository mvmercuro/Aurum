const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  const url = new URL(req.url);
  if (url.protocol === "https:") return true;

  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (!forwardedProto) return false;

  const protoList = forwardedProto.split(",");
  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export interface CookieOptions {
  domain?: string;
  httpOnly?: boolean;
  path?: string;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
  maxAge?: number;
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req),
  };
}
