import type {IsoDateString} from "@shared/types/pocketbase";

export const formatDateLocalized = (isoString: IsoDateString) => {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
        .format(new Date(isoString))
        .replace(',', ' ');
}