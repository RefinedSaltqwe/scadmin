import { HomeOutlined } from '@mui/icons-material';
import { atom } from "recoil";

export type Item = {
    id?:string;
    text: string;
    icon: any;
    expanded: boolean;
    children: [];
}

export const defaultItem: Item = {
    text: "Overview",
    icon: HomeOutlined,
    expanded: false,
    children: [],
}

export interface MenuState {
    menuItems: Item[];
    pageName: string,
    currentMenuItemPage?: Item;
  }

export const defaultMenuState = {
  menuItems: [],
  pageName: "",
  currentMenuItemPage:defaultItem,
};

export const myMenuState = atom<MenuState>({
  key: "myMenuState",
  default: defaultMenuState,
});