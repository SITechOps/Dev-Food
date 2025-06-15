import { io } from "socket.io-client";
import { api } from "../../lib/axios";

export const socket = io(api.defaults.baseURL!);
