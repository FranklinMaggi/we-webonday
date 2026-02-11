import type { CopyMap } from "../../core/types";
import marketingHomeIt from "./marketing/home";
import commonIt from "./marketing/common";
import marketingMissionIt from "./marketing/mission";
import marketingSolutionsIt from "../../../../marketing/pages/solution/fallback/solutions";
import marketingSolutionDetailIt from "../../../../marketing/pages/solution/fallback/solution";
import marketingVisionIt from "./marketing/vision";
import sidebarCopyIt from "./user/sidebar";
import youCopyIt from "./user/you";
import marketingFounderIt from "./marketing/founder";
import accountCopy from "./user/account";
import profileCopy from "./user/profile";

const it: CopyMap = {
  ...commonIt,
  ...marketingHomeIt,
  ...marketingMissionIt,
  ...marketingSolutionsIt,
  ...marketingFounderIt,
  ...marketingSolutionDetailIt,
  ...marketingVisionIt,
  ...sidebarCopyIt,
  ...youCopyIt,
  ...accountCopy,
  ...profileCopy,
};

export default it;
