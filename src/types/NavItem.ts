import type { FC, SVGProps } from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
}