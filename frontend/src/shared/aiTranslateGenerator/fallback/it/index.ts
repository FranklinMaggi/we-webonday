import type { CopyMap } from "../../core/types";
import marketingHomeIt from "./marketing/home";
import commonIt from "./marketing/common";
import marketingMissionIt from "./marketing/mission";
import marketingSolutionsIt from "./marketing/solutions";
import marketingSolutionDetailIt from "./marketing/solution";
import marketingVisionIt from "./marketing/vision";
import sidebarCopyIt from "./user/sidebar";
const it: CopyMap = {
  ...commonIt,
  ...marketingHomeIt,
  ...marketingMissionIt,
  ...marketingSolutionsIt,
  ...marketingSolutionDetailIt,
  ...marketingVisionIt,
  ...sidebarCopyIt,
};

export default it;
