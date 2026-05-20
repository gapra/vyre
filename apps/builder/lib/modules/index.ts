import { featureRequestsModule } from "./feature-requests";
import { bugTrackerModule } from "./bug-tracker";

export const PREBUILT_MODULES = [featureRequestsModule, bugTrackerModule] as const;

export type PrebuiltModuleKey = (typeof PREBUILT_MODULES)[number]["key"];

export function getPrebuiltModule(key: string) {
  return PREBUILT_MODULES.find((m) => m.key === key);
}

export { featureRequestsModule, bugTrackerModule };
