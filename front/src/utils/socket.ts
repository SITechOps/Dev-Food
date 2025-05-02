import { io } from "socket.io-client";
import { api } from "../connection/axios";

export const socket = io(api.defaults.baseURL!);
