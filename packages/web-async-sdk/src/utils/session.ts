import { uuidv4 } from "./uuid";

export const getGameSessionId = () => {
  let sessionId = sessionStorage.getItem("gameSessionId");
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem("gameSessionId", sessionId);
  }
  return sessionId;
};
