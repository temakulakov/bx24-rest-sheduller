export interface IUsers {
    ID: string;
    NAME: string;
    LAST_NAME: string;
    SECOND_NAME: string;
    EMAIL: string;
    PERSONAL_PHOTO: string;
    WORK_POSITION: string;
    WORK_DEPARTMENT: string;
    WORK_PHONE: string;
};

export interface IResponcePages {
    data: {
        next: number;
        result: IUsers[];
        time: object;
        total: number;
    }
};

export interface IResponceEvents {
    data: {
        result: IEvent[];
        time: object;
    }
};

export interface IResponceSections {
    data: {
        result: ISection[];
        time: object;
    }
};

export interface IEvent {
    ID: string
    PARENT_ID: string
    DELETED: string
    CAL_TYPE: string
    SYNC_STATUS: any
    OWNER_ID: string
    EVENT_TYPE: any
    CREATED_BY: string
    NAME: string
    DATE_FROM: string
    DATE_TO: string
    TZ_FROM: string
    TZ_TO: string
    ORIGINAL_DATE_FROM: any
    TZ_OFFSET_FROM: string
    TZ_OFFSET_TO: string
    DATE_FROM_TS_UTC: string
    DATE_TO_TS_UTC: string
    TIMESTAMP_X: string
    DATE_CREATE: string
    DESCRIPTION: string
    DT_SKIP_TIME: string
    DT_LENGTH: string
    PRIVATE_EVENT: string
    ACCESSIBILITY: string
    IMPORTANCE: string
    IS_MEETING: boolean
    MEETING_HOST: string
    MEETING_STATUS: string
    MEETING: Meeting
    LOCATION: string
    REMIND: Remind[]
    COLOR: string
    RRULE: string
    EXDATE: string
    ATTENDEES_CODES: string[]
    DAV_XML_ID: string
    DAV_EXCH_LABEL: any
    G_EVENT_ID: any
    CAL_DAV_LABEL: any
    VERSION: string
    RECURRENCE_ID: any
    RELATIONS: any
    SECTION_ID: string
    SECT_ID: string
    REL: any
    UF_CRM_CAL_EVENT: boolean
    UF_WEBDAV_CAL_EVENT: boolean
    ATTENDEE_LIST: AttendeeList[]
    attendeesEntityList: AttendeesEntityList[]
    "~DESCRIPTION": string
    "~USER_OFFSET_FROM": number
    "~USER_OFFSET_TO": number
    uploads: any[]
}

export interface Meeting {
    HOST_NAME: string
    NOTIFY: boolean
    REINVITE: boolean
    ALLOW_INVITE: boolean
    MEETING_CREATOR: number
    HIDE_GUESTS: boolean
    MAIL_FROM: string
}

export interface Remind {
    type: string
    before: number
    time: number
}

export interface AttendeeList {
    id: number
    entryId: string
    status: string
}

export interface AttendeesEntityList {
    entityId: string
    id: number
}

export interface ISection {
    ID: string
    NAME: string
    GAPI_CALENDAR_ID: any
    DESCRIPTION: any
    COLOR: string
    TEXT_COLOR: any
    EXPORT: Export
    CAL_TYPE: string
    OWNER_ID: string
    CREATED_BY: string
    DATE_CREATE: string
    TIMESTAMP_X: string
    CAL_DAV_CON: boolean
    SYNC_TOKEN: any
    PAGE_TOKEN: any
    EXTERNAL_TYPE: string
    PERM: Perm
    ACCESS: Access
}

export interface Export {
    ALLOW: boolean
    LINK: string
}

export interface Perm {
    view_time: boolean
    view_title: boolean
    view_full: boolean
    add: boolean
    edit: boolean
    edit_section: boolean
    access: boolean
}

export interface Access {
    G2: string
    U1552: string
}
