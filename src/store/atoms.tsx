import dayjs from "dayjs";
import {atom} from "recoil";
import {IEvent, ISection, IUsers} from "../types/Api";
import {IModal, ISectionsGroup} from "../types/App";

export const dateAtom = atom<dayjs.Dayjs>({
    key: 'date',
    default: dayjs()
});

export const usersAtom = atom<IUsers[]>({
    key: 'users',
    default: []
});

export const eventsAtom = atom<IEvent[]>({
    key: 'events',
    default: []
});

export const sectionsAtom = atom<ISection[]>({
    key: 'sections',
    default: []
});

export const sectionsGroupsAtom = atom<ISectionsGroup[]>({
    key: 'sectionsGroups',
    default: [
        {id: 0, title: 'Section 1', sections: [], color: "#9E0502"},
        {id: 1, title: 'Section 2', sections: [], color: "#BB85AB"},
        {id: 2, title: 'Section 3', sections: [], color: "#F11617"},
    ]
});

export const selectedEventAtom = atom<IEvent | null>({
    key: 'selectedEvent',
    default: null
});

export const modaAtom = atom<IModal>({
    key: 'modal',
    default: {
        status: false,
        from: dayjs(),
        to: dayjs()
    }
});