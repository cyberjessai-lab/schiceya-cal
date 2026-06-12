import { getFeatureRepository } from "@calcom/features/di/containers/FeatureRepository";

export class OnboardingPathService {
  static async getGettingStartedPath(): Promise<string> {
    const featureRepository = getFeatureRepository();
    const onboardingV3Enabled = await featureRepository.checkIfFeatureIsEnabledGlobally("onboarding-v3");
    if (onboardingV3Enabled) {
      return "/onboarding/personal/settings";
    }

    return "/getting-started";
  }

  static async getGettingStartedPathWhenInvited(): Promise<string> {
    return OnboardingPathService.getGettingStartedPath();
  }

  static async getGettingStartedPathWithParams(queryParams?: Record<string, string>): Promise<string> {
    const basePath = await OnboardingPathService.getGettingStartedPath();

    if (!queryParams || Object.keys(queryParams).length === 0) {
      return basePath;
    }

    const params = new URLSearchParams(queryParams);
    return `${basePath}?${params.toString()}`;
  }
}
