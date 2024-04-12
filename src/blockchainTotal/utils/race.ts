import { Race } from "../types";

export function ExtractRace ( str : string) : Race {
    switch (str) {
        case "Waters" :
            return "Waters";
        case "Humans" :
            return "Waters";
        case "Insects" :
            return "Insects";
        case "Lizards":
            return "Lizards";
    default:
        throw new Error("wrong race")
    }
}