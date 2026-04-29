import { getDatabase } from "firebase/database";
import { firebaseApp } from "./admin";

export const db = getDatabase(firebaseApp);