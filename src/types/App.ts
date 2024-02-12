import {ISection} from "./Api";
import {Dayjs} from "dayjs";

export interface Position {
    x: number;
    y: number;
};

export interface ISectionsGroup {
  id: number;
  title: string;
  color: string;
  sections: ISection[];
};

export interface IModal {
    status: boolean;
    from: Dayjs;
    to: Dayjs;
}