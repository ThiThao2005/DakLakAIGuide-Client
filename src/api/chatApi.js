import axiosClient from "./axiosClient";

const chatApi = {
  // messages: [{ role: "user" | "assistant", content: string }]
  ask: (messages) => axiosClient.post("/chat", { messages }, { timeout: 120000 }),
};

export default chatApi;
