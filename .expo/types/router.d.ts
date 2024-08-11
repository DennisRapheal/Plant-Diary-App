/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/sign-in` | `/(auth)/sign-up` | `/(tabs)` | `/(tabs)/create` | `/(tabs)/home` | `/(tabs)/identify` | `/_sitemap` | `/create` | `/home` | `/identify` | `/sign-in` | `/sign-up`;
      DynamicRoutes: `/${Router.SingleRoutePart<T>}` | `/(diary)/${Router.SingleRoutePart<T>}` | `/(diarySetting)/${Router.SingleRoutePart<T>}` | `/(test)/${Router.SingleRoutePart<T>}` | `/(waterCard)/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(diary)/[diaryId]` | `/(diarySetting)/[diarySettingId]` | `/(test)/[result]` | `/(waterCard)/[wateringId]` | `/[diaryId]` | `/[diarySettingId]` | `/[result]` | `/[wateringId]`;
    }
  }
}
