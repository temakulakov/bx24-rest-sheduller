import {ISection} from "./Api";

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